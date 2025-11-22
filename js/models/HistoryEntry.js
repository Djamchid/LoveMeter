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
        actorId = '',
        targetId = '',
        deltaActor = 0,
        deltaPartner = 0,
        totalActorAfter = 0,
        totalPartnerAfter = 0,
        note = ''
    ) {
        this.id = id || this.generateId();
        this.timestamp = timestamp || this.formatTimestamp(new Date());
        this.actionId = actionId;
        this.actionName = actionName;
        this.actorId = actorId;
        this.targetId = targetId;
        this.deltaActor = deltaActor;
        this.deltaPartner = deltaPartner;
        this.totalActorAfter = totalActorAfter;
        this.totalPartnerAfter = totalPartnerAfter;
        this.note = note;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'history_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Format timestamp to normalized format: aaaa-mm-jj hh:mm:ss
     */
    formatTimestamp(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * Format timestamp for display
     */
    getFormattedDate() {
        // If timestamp is already a string in the correct format, return it
        if (typeof this.timestamp === 'string') {
            return this.timestamp;
        }
        // Otherwise, convert from milliseconds (backward compatibility)
        const date = new Date(this.timestamp);
        return this.formatTimestamp(date);
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
            actorId: this.actorId,
            targetId: this.targetId,
            deltaActor: this.deltaActor,
            deltaPartner: this.deltaPartner,
            totalActorAfter: this.totalActorAfter,
            totalPartnerAfter: this.totalPartnerAfter,
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
            data.actorId,
            data.targetId,
            data.deltaActor,
            data.deltaPartner,
            data.totalActorAfter,
            data.totalPartnerAfter,
            data.note || ''
        );
    }

    /**
     * Convert to CSV row
     */
    toCSVRow() {
        return [
            this.getFormattedDate(),
            this.actionId,
            this.actorId,
            this.targetId,
            this.deltaActor,
            this.deltaPartner,
            this.totalActorAfter,
            this.totalPartnerAfter,
            this.note.replace(/"/g, '""') // Escape quotes for CSV
        ];
    }

    /**
     * Get CSV headers (V1.3 format)
     */
    static getCSVHeaders() {
        return ['timestamp', 'actionId', 'actorId', 'targetId', 'deltaActor', 'deltaPartner', 'totalActorAfter', 'totalPartnerAfter', 'note'];
    }
}
