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
        impactActeur = 0,
        impactPartenaire = 0,
        usageTotal = 0,
        lastUsed = null,
        active = true
    ) {
        this.id = id || this.generateId();
        this.name = name;
        this.description = description;
        this.type = type;
        this.tags = Array.isArray(tags) ? tags : [];
        this.impactActeur = parseInt(impactActeur) || 0;
        this.impactPartenaire = parseInt(impactPartenaire) || 0;
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
        this.lastUsed = this.formatTimestamp(new Date());
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
     * Get total impact (sum of both impacts)
     */
    getTotalImpact() {
        return this.impactActeur + this.impactPartenaire;
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
            impactActeur: this.impactActeur,
            impactPartenaire: this.impactPartenaire,
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
            data.impactActeur,
            data.impactPartenaire,
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
            // ========== ACTIONS ++ (impact positif pour les deux) ==========
            new Action(
                'default_1',
                'Dire merci',
                'Exprimer sa gratitude sincèrement',
                'réparation',
                ['communication', 'reconnaissance'],
                3,
                3,
                0,
                null,
                true
            ),
            new Action(
                'default_2',
                'Compliment sincère',
                'Valoriser l\'autre de manière authentique',
                'réparation',
                ['communication', 'valorisation'],
                4,
                4,
                0,
                null,
                true
            ),
            new Action(
                'default_3',
                'Câlin spontané',
                'Offrir un geste d\'affection physique',
                'réparation',
                ['affection', 'contact'],
                5,
                5,
                0,
                null,
                true
            ),
            new Action(
                'default_4',
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
                'default_5',
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
                'default_6',
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
                'default_7',
                'Acte de service',
                'Faire quelque chose d\'utile pour l\'autre',
                'réparation',
                ['service', 'attention'],
                4,
                5,
                0,
                null,
                true
            ),
            new Action(
                'default_8',
                'Paroles d\'encouragement',
                'Soutenir et encourager l\'autre',
                'réparation',
                ['communication', 'soutien'],
                3,
                4,
                0,
                null,
                true
            ),
            new Action(
                'default_9',
                'Temps de qualité',
                'Passer un moment privilégié ensemble',
                'réparation',
                ['présence', 'qualité'],
                5,
                5,
                0,
                null,
                true
            ),
            new Action(
                'default_10',
                'Surprise agréable',
                'Faire une attention inattendue',
                'réparation',
                ['surprise', 'attention'],
                4,
                6,
                0,
                null,
                true
            ),

            // ========== ACTIONS -- (impact négatif pour les deux) ==========
            new Action(
                'default_11',
                'Critique personnelle',
                'Attaquer la personne plutôt que le problème',
                'escalade',
                ['conflit', 'communication'],
                -5,
                -5,
                0,
                null,
                true
            ),
            new Action(
                'default_12',
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
                'default_13',
                'Généralisation',
                'Utiliser "toujours" ou "jamais"',
                'escalade',
                ['conflit', 'communication'],
                -3,
                -3,
                0,
                null,
                true
            ),
            new Action(
                'default_14',
                'Crier / hausser le ton',
                'Élever la voix de manière agressive',
                'escalade',
                ['conflit', 'violence verbale'],
                -4,
                -5,
                0,
                null,
                true
            ),
            new Action(
                'default_15',
                'Sarcasme blessant',
                'Utiliser l\'ironie pour blesser',
                'escalade',
                ['conflit', 'mépris'],
                -3,
                -4,
                0,
                null,
                true
            ),
            new Action(
                'default_16',
                'Interruption constante',
                'Couper la parole systématiquement',
                'escalade',
                ['conflit', 'communication'],
                -2,
                -4,
                0,
                null,
                true
            ),
            new Action(
                'default_17',
                'Minimiser les sentiments',
                'Nier ou diminuer les émotions de l\'autre',
                'escalade',
                ['conflit', 'invalidation'],
                -3,
                -5,
                0,
                null,
                true
            ),
            new Action(
                'default_18',
                'Menaces',
                'Menacer de partir ou de faire quelque chose',
                'escalade',
                ['conflit', 'manipulation'],
                -6,
                -7,
                0,
                null,
                true
            ),
            new Action(
                'default_19',
                'Rappeler les erreurs passées',
                'Ressortir d\'anciennes fautes',
                'escalade',
                ['conflit', 'rancune'],
                -4,
                -4,
                0,
                null,
                true
            ),
            new Action(
                'default_20',
                'Ignorer intentionnellement',
                'Faire comme si l\'autre n\'existait pas',
                'escalade',
                ['conflit', 'mépris'],
                -5,
                -6,
                0,
                null,
                true
            ),

            // ========== ACTIONS +- (positif acteur, négatif partenaire) ==========
            new Action(
                'default_21',
                'Imposer sa décision',
                'Décider seul sans consulter',
                'domination',
                ['contrôle', 'décision'],
                3,
                -4,
                0,
                null,
                true
            ),
            new Action(
                'default_22',
                'Être condescendant',
                'Parler avec un ton supérieur',
                'domination',
                ['mépris', 'communication'],
                2,
                -5,
                0,
                null,
                true
            ),
            new Action(
                'default_23',
                'Se défendre sans écouter',
                'Se justifier sans entendre l\'autre',
                'défense',
                ['communication', 'égocentrisme'],
                2,
                -3,
                0,
                null,
                true
            ),

            // ========== ACTIONS -+ (négatif acteur, positif partenaire) ==========
            new Action(
                'default_24',
                'S\'excuser à tort',
                'Présenter des excuses non méritées',
                'soumission',
                ['évitement', 'abnégation'],
                -3,
                2,
                0,
                null,
                true
            ),
            new Action(
                'default_25',
                'Céder systématiquement',
                'Renoncer à ses besoins par habitude',
                'soumission',
                ['abnégation', 'évitement'],
                -4,
                3,
                0,
                null,
                true
            ),
            new Action(
                'default_26',
                'Se sacrifier excessivement',
                'S\'oublier complètement pour l\'autre',
                'soumission',
                ['abnégation', 'déséquilibre'],
                -5,
                4,
                0,
                null,
                true
            ),

            // ========== ACTIONS 00 (impact neutre) ==========
            new Action(
                'default_27',
                'Débat factuel',
                'Discuter de faits sans émotion',
                'neutre',
                ['communication', 'logique'],
                0,
                0,
                0,
                null,
                true
            ),
            new Action(
                'default_28',
                'Pause dans la discussion',
                'Prendre du recul temporairement (consensuel)',
                'neutre',
                ['gestion', 'pause'],
                0,
                0,
                0,
                null,
                true
            )
        ];
    }
}
