/**
 * Partner Model
 * Represents a partner in the couple with their identity, color, and flower count
 */
export class Partner {
    constructor(id, name = '', color = '#4CAF50', initialFlowers = 0, currentFlowers = 0) {
        this.id = id; // 'partner1' or 'partner2'
        this.name = name;
        this.color = color;
        this.initialFlowers = initialFlowers;
        this.currentFlowers = currentFlowers;
    }

    /**
     * Get display name (or default if empty)
     */
    getDisplayName() {
        if (this.name && this.name.trim() !== '') {
            return this.name;
        }
        return this.id === 'partner1' ? 'Partenaire 1' : 'Partenaire 2';
    }

    /**
     * Reset flowers to initial value
     */
    reset() {
        this.currentFlowers = this.initialFlowers;
    }

    /**
     * Add flowers (can be positive or negative)
     */
    addFlowers(delta) {
        this.currentFlowers += delta;
    }

    /**
     * Get alert level based on thresholds
     * @param {number} alert1 - First alert threshold
     * @param {number} alert2 - Second alert threshold (more severe)
     * @returns {number} 0 = no alert, 1 = alert1, 2 = alert2
     */
    getAlertLevel(alert1, alert2) {
        if (this.currentFlowers <= alert2) return 2;
        if (this.currentFlowers <= alert1) return 1;
        return 0;
    }

    /**
     * Convert to plain object for storage
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            initialFlowers: this.initialFlowers,
            currentFlowers: this.currentFlowers
        };
    }

    /**
     * Create from plain object
     */
    static fromJSON(data) {
        return new Partner(
            data.id,
            data.name,
            data.color,
            data.initialFlowers,
            data.currentFlowers
        );
    }
}
