/**
 * Action Model
 * Represents an action that can be performed and affects both partners
 */
export class Action {
    constructor(
        id = null,
        name = '',
        description = '',
        type = '',
        tags = [],
        delta1 = 0,
        delta2 = 0,
        usageTotal = 0,
        lastUsed = null,
        active = true
    ) {
        this.id = id || this.generateId();
        this.name = name;
        this.description = description;
        this.type = type;
        this.tags = Array.isArray(tags) ? tags : [];
        this.delta1 = parseInt(delta1) || 0;
        this.delta2 = parseInt(delta2) || 0;
        this.usageTotal = parseInt(usageTotal) || 0;
        this.lastUsed = lastUsed;
        this.active = active;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'action_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Record usage of this action
     */
    recordUsage() {
        this.usageTotal++;
        this.lastUsed = Date.now();
    }

    /**
     * Get total impact (sum of both deltas)
     */
    getTotalImpact() {
        return this.delta1 + this.delta2;
    }

    /**
     * Check if action matches search query
     */
    matchesSearch(query) {
        if (!query) return true;

        const lowerQuery = query.toLowerCase();
        return (
            this.name.toLowerCase().includes(lowerQuery) ||
            this.type.toLowerCase().includes(lowerQuery) ||
            this.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Convert to plain object for storage
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            type: this.type,
            tags: this.tags,
            delta1: this.delta1,
            delta2: this.delta2,
            usageTotal: this.usageTotal,
            lastUsed: this.lastUsed,
            active: this.active
        };
    }

    /**
     * Create from plain object
     */
    static fromJSON(data) {
        return new Action(
            data.id,
            data.name,
            data.description || '',
            data.type || '',
            data.tags || [],
            data.delta1,
            data.delta2,
            data.usageTotal || 0,
            data.lastUsed || null,
            data.active !== undefined ? data.active : true
        );
    }

    /**
     * Create default actions for initial setup
     */
    static getDefaultActions() {
        return [
            new Action(
                'default_1',
                'Écoute active',
                'Écouter attentivement sans interrompre',
                'réparation',
                ['communication', 'écoute'],
                3,
                3,
                0,
                null,
                true
            ),
            new Action(
                'default_2',
                'Critique personnelle',
                'Attaquer la personne plutôt que le problème',
                'escalade',
                ['conflit', 'communication'],
                -5,
                -3,
                0,
                null,
                true
            ),
            new Action(
                'default_3',
                'Excuse sincère',
                'Présenter des excuses authentiques',
                'réparation',
                ['communication', 'réparation'],
                5,
                5,
                0,
                null,
                true
            ),
            new Action(
                'default_4',
                'Retrait / stonewalling',
                'Se fermer et refuser de communiquer',
                'escalade',
                ['conflit', 'communication'],
                -4,
                -6,
                0,
                null,
                true
            ),
            new Action(
                'default_5',
                'Compromis',
                'Trouver un terrain d\'entente',
                'réparation',
                ['résolution', 'collaboration'],
                4,
                4,
                0,
                null,
                true
            ),
            new Action(
                'default_6',
                'Généralisation',
                'Utiliser "toujours" ou "jamais"',
                'escalade',
                ['conflit', 'communication'],
                -3,
                -3,
                0,
                null,
                true
            )
        ];
    }
}
