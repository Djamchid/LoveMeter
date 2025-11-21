/**
 * HistoryEntry Model
 * Represents a recorded action in the history
 */
export class HistoryEntry {
    constructor(
        id = null,
        timestamp = null,
        actionId = '',
        actionName = '',
        delta1 = 0,
        delta2 = 0,
        total1After = 0,
        total2After = 0,
        note = ''
    ) {
        this.id = id || this.generateId();
        this.timestamp = timestamp || Date.now();
        this.actionId = actionId;
        this.actionName = actionName;
        this.delta1 = delta1;
        this.delta2 = delta2;
        this.total1After = total1After;
        this.total2After = total2After;
        this.note = note;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'history_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Format timestamp for display
     */
    getFormattedDate() {
        const date = new Date(this.timestamp);
        return date.toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Update note
     */
    updateNote(note) {
        this.note = note;
    }

    /**
     * Convert to plain object for storage
     */
    toJSON() {
        return {
            id: this.id,
            timestamp: this.timestamp,
            actionId: this.actionId,
            actionName: this.actionName,
            delta1: this.delta1,
            delta2: this.delta2,
            total1After: this.total1After,
            total2After: this.total2After,
            note: this.note
        };
    }

    /**
     * Create from plain object
     */
    static fromJSON(data) {
        return new HistoryEntry(
            data.id,
            data.timestamp,
            data.actionId,
            data.actionName,
            data.delta1,
            data.delta2,
            data.total1After,
            data.total2After,
            data.note || ''
        );
    }

    /**
     * Convert to CSV row
     */
    toCSVRow() {
        return [
            this.getFormattedDate(),
            this.actionName,
            this.delta1,
            this.delta2,
            this.total1After,
            this.total2After,
            this.note.replace(/"/g, '""') // Escape quotes for CSV
        ];
    }

    /**
     * Get CSV headers
     */
    static getCSVHeaders() {
        return ['Date/Heure', 'Action', 'Δ P1', 'Δ P2', 'Total P1', 'Total P2', 'Note'];
    }
}
