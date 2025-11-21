/**
 * Settings Model
 * Global application settings
 */
export class Settings {
    constructor(
        defaultSort = 'frequency',
        alert1 = -10,
        alert2 = -20
    ) {
        this.defaultSort = defaultSort;
        this.alert1 = parseInt(alert1) || -10;
        this.alert2 = parseInt(alert2) || -20;
    }

    /**
     * Validate alert thresholds
     * alert2 should be less than alert1 for logical alerting
     */
    validateAlerts() {
        if (this.alert2 > this.alert1) {
            // Swap them if they're in the wrong order
            [this.alert1, this.alert2] = [this.alert2, this.alert1];
        }
    }

    /**
     * Convert to plain object for storage
     */
    toJSON() {
        return {
            defaultSort: this.defaultSort,
            alert1: this.alert1,
            alert2: this.alert2
        };
    }

    /**
     * Create from plain object
     */
    static fromJSON(data) {
        return new Settings(
            data.defaultSort || 'frequency',
            data.alert1 || -10,
            data.alert2 || -20
        );
    }

    /**
     * Get default settings
     */
    static getDefaults() {
        return new Settings('frequency', -10, -20);
    }
}
