import { Action } from '../models/Action.js';
import { HistoryEntry } from '../models/HistoryEntry.js';

/**
 * CSVExporter
 * Utility for exporting and importing CSV files
 */
export class CSVExporter {
    /**
     * Export history to CSV
     */
    static exportHistory(history) {
        const headers = HistoryEntry.getCSVHeaders();
        const rows = history.map(entry => entry.toCSVRow());

        return this.arrayToCSV([headers, ...rows]);
    }

    /**
     * Export actions to CSV (V1.3 format)
     */
    static exportActions(actions) {
        const headers = ['id', 'nom', 'description', 'impactActeur', 'impactPartenaire', 'type', 'tags', 'usageTotal', 'dernierUsage', 'active'];
        const rows = actions.map(action => [
            action.id,
            action.name,
            action.description,
            action.impactActeur,
            action.impactPartenaire,
            action.type,
            action.tags.join('; '),
            action.usageTotal,
            action.lastUsed || '',
            action.active ? 'true' : 'false'
        ]);

        return this.arrayToCSV([headers, ...rows]);
    }

    /**
     * Convert 2D array to CSV string
     */
    static arrayToCSV(data) {
        return data.map(row =>
            row.map(cell => {
                // Convert to string and handle quotes
                const cellStr = String(cell);
                // If cell contains comma, newline, or quote, wrap in quotes
                if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
                    return '"' + cellStr.replace(/"/g, '""') + '"';
                }
                return cellStr;
            }).join(',')
        ).join('\n');
    }

    /**
     * Parse CSV string to 2D array
     */
    static parseCSV(csvString) {
        const lines = [];
        let currentLine = [];
        let currentCell = '';
        let insideQuotes = false;

        for (let i = 0; i < csvString.length; i++) {
            const char = csvString[i];
            const nextChar = csvString[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    // Escaped quote
                    currentCell += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quotes
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                // End of cell
                currentLine.push(currentCell);
                currentCell = '';
            } else if ((char === '\n' || char === '\r') && !insideQuotes) {
                // End of line
                if (currentCell || currentLine.length > 0) {
                    currentLine.push(currentCell);
                    lines.push(currentLine);
                    currentLine = [];
                    currentCell = '';
                }
                // Skip \r\n
                if (char === '\r' && nextChar === '\n') {
                    i++;
                }
            } else {
                currentCell += char;
            }
        }

        // Add last cell and line
        if (currentCell || currentLine.length > 0) {
            currentLine.push(currentCell);
            lines.push(currentLine);
        }

        return lines;
    }

    /**
     * Import history from CSV (V1.3 format only)
     * Returns empty array if CSV is empty or corrupted
     * @returns {Array} Array of HistoryEntry objects
     */
    static importHistory(csvString, partners) {
        try {
            const lines = this.parseCSV(csvString);

            // If empty CSV, return empty history
            if (lines.length < 2) {
                console.warn('CSV vide, historique vide retourné');
                return [];
            }

            const headers = lines[0];
            const dataRows = lines.slice(1);
            const history = [];

            // V1.3 format: timestamp, actionId, actorId, targetId, deltaActor, deltaPartner, totalActorAfter, totalPartnerAfter, note
            for (const row of dataRows) {
                if (row.length < 8) continue; // Skip invalid rows

                try {
                    const [timestamp, actionId, actorId, targetId, deltaActorStr, deltaPartnerStr, totalActorStr, totalPartnerStr, note] = row;

                    const entry = new HistoryEntry(
                        null,
                        timestamp, // Format aaaa-mm-jj hh:mm:ss
                        actionId || '',
                        '', // actionName will be empty for CSV imports
                        actorId || 'partner1',
                        targetId || 'partner2',
                        parseInt(deltaActorStr) || 0,
                        parseInt(deltaPartnerStr) || 0,
                        parseInt(totalActorStr) || 0,
                        parseInt(totalPartnerStr) || 0,
                        note || ''
                    );

                    history.push(entry);
                } catch (rowError) {
                    console.warn('Ligne d\'historique ignorée:', rowError);
                    continue;
                }
            }

            // Recalculate current flowers from last entry
            if (history.length > 0 && partners) {
                const lastEntry = history[history.length - 1];
                const actor = partners.find(p => p.id === lastEntry.actorId) || partners[0];
                const target = partners.find(p => p.id === lastEntry.targetId) || partners[1];
                actor.currentFlowers = lastEntry.totalActorAfter;
                target.currentFlowers = lastEntry.totalPartnerAfter;
            }

            return history;
        } catch (error) {
            console.error('Error importing history CSV, returning empty history:', error);
            return [];
        }
    }

    /**
     * Import actions from CSV (V1.3 format only)
     * Returns default actions if CSV is empty or corrupted
     * @returns {Array} Array of Action objects
     */
    static importActions(csvString) {
        try {
            const lines = this.parseCSV(csvString);

            // If empty CSV, return default actions
            if (lines.length < 2) {
                console.warn('CSV vide, actions par défaut retournées');
                return Action.getDefaultActions();
            }

            const headers = lines[0];
            const dataRows = lines.slice(1);
            const actions = [];

            // V1.3 format: id, nom, description, impactActeur, impactPartenaire, type, tags, usageTotal, dernierUsage, active
            for (const row of dataRows) {
                if (row.length < 10) continue; // Skip invalid rows

                try {
                    const [id, name, description, impactActeurStr, impactPartenaireStr, type, tagsStr, usageTotalStr, lastUsedStr, activeStr] = row;

                    // Parse tags
                    const tags = tagsStr ? tagsStr.split(';').map(t => t.trim()).filter(t => t) : [];

                    const action = new Action(
                        id || null,
                        name,
                        description || '',
                        type || '',
                        tags,
                        parseInt(impactActeurStr) || 0,
                        parseInt(impactPartenaireStr) || 0,
                        parseInt(usageTotalStr) || 0,
                        lastUsedStr || null,
                        activeStr === 'true'
                    );

                    actions.push(action);
                } catch (rowError) {
                    console.warn('Ligne d\'action ignorée:', rowError);
                    continue;
                }
            }

            // If no valid actions imported, return default actions
            return actions.length > 0 ? actions : Action.getDefaultActions();
        } catch (error) {
            console.error('Error importing actions CSV, returning default actions:', error);
            return Action.getDefaultActions();
        }
    }

    /**
     * Download CSV file
     */
    static download(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    /**
     * Read file content
     */
    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }
}
