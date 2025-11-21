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
     * Export actions to CSV
     */
    static exportActions(actions) {
        const headers = ['Nom', 'Description', 'Type', 'Tags', 'Δ P1', 'Δ P2', 'Usage Total', 'Dernier Usage', 'Actif'];
        const rows = actions.map(action => [
            action.name,
            action.description,
            action.type,
            action.tags.join('; '),
            action.delta1,
            action.delta2,
            action.usageTotal,
            action.lastUsed ? new Date(action.lastUsed).toLocaleString('fr-FR') : '',
            action.active ? 'Oui' : 'Non'
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
     * Import history from CSV
     * @returns {Array} Array of HistoryEntry objects
     */
    static importHistory(csvString, partners) {
        try {
            const lines = this.parseCSV(csvString);

            if (lines.length < 2) {
                throw new Error('CSV file is empty or invalid');
            }

            // Skip header row
            const dataRows = lines.slice(1);
            const history = [];

            for (const row of dataRows) {
                if (row.length < 6) continue; // Skip invalid rows

                // Parse the row
                const [dateStr, actionName, delta1Str, delta2Str, total1Str, total2Str, note] = row;

                // Parse date (try to parse French format)
                let timestamp = Date.now();
                try {
                    const dateParts = dateStr.match(/(\d+)\/(\d+)\/(\d+)[,\s]+(\d+):(\d+)/);
                    if (dateParts) {
                        const [, day, month, year, hours, minutes] = dateParts;
                        timestamp = new Date(year, month - 1, day, hours, minutes).getTime();
                    }
                } catch (e) {
                    // Use current time if parsing fails
                }

                const entry = new HistoryEntry(
                    null,
                    timestamp,
                    '', // actionId will be empty for imported entries
                    actionName,
                    parseInt(delta1Str) || 0,
                    parseInt(delta2Str) || 0,
                    parseInt(total1Str) || 0,
                    parseInt(total2Str) || 0,
                    note || ''
                );

                history.push(entry);
            }

            // Recalculate current flowers from last entry
            if (history.length > 0 && partners) {
                const lastEntry = history[history.length - 1];
                partners[0].currentFlowers = lastEntry.total1After;
                partners[1].currentFlowers = lastEntry.total2After;
            }

            return history;
        } catch (error) {
            console.error('Error importing history CSV:', error);
            throw error;
        }
    }

    /**
     * Import actions from CSV
     * @returns {Array} Array of Action objects
     */
    static importActions(csvString) {
        try {
            const lines = this.parseCSV(csvString);

            if (lines.length < 2) {
                throw new Error('CSV file is empty or invalid');
            }

            // Skip header row
            const dataRows = lines.slice(1);
            const actions = [];

            for (const row of dataRows) {
                if (row.length < 6) continue; // Skip invalid rows

                const [name, description, type, tagsStr, delta1Str, delta2Str, usageTotalStr, lastUsedStr, activeStr] = row;

                // Parse tags
                const tags = tagsStr ? tagsStr.split(';').map(t => t.trim()).filter(t => t) : [];

                // Parse lastUsed
                let lastUsed = null;
                if (lastUsedStr) {
                    try {
                        lastUsed = new Date(lastUsedStr).getTime();
                    } catch (e) {
                        // Ignore parsing error
                    }
                }

                const action = new Action(
                    null,
                    name,
                    description || '',
                    type || '',
                    tags,
                    parseInt(delta1Str) || 0,
                    parseInt(delta2Str) || 0,
                    parseInt(usageTotalStr) || 0,
                    lastUsed,
                    activeStr === 'Oui'
                );

                actions.push(action);
            }

            return actions;
        } catch (error) {
            console.error('Error importing actions CSV:', error);
            throw error;
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
