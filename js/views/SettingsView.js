import { CSVExporter } from '../utils/CSVExporter.js';
import { Action } from '../models/Action.js';

/**
 * SettingsView
 * Handles the settings/configuration interface
 */
export class SettingsView {
    constructor(controller) {
        this.controller = controller;
        this.editingActionId = null;
        this.initElements();
        this.attachEventListeners();
    }

    /**
     * Initialize DOM elements
     */
    initElements() {
        // Partner inputs
        this.partner1Name = document.getElementById('partner1-name');
        this.partner1Color = document.getElementById('partner1-color');
        this.partner2Name = document.getElementById('partner2-name');
        this.partner2Color = document.getElementById('partner2-color');

        // Initial flowers
        this.initialFlowers = document.getElementById('initial-flowers');
        this.applyInitialFlowersBtn = document.getElementById('apply-initial-flowers');

        // Alert thresholds
        this.alert1 = document.getElementById('alert1');
        this.alert2 = document.getElementById('alert2');

        // Default sort
        this.defaultSort = document.getElementById('default-sort');

        // Action form
        this.addActionBtn = document.getElementById('add-action-btn');
        this.actionForm = document.getElementById('action-form');
        this.actionFormTitle = document.getElementById('action-form-title');
        this.actionFormId = document.getElementById('action-form-id');
        this.actionName = document.getElementById('action-name');
        this.actionDescription = document.getElementById('action-description');
        this.actionType = document.getElementById('action-type');
        this.actionTags = document.getElementById('action-tags');
        this.actionImpactActeur = document.getElementById('action-impact-acteur');
        this.actionImpactPartenaire = document.getElementById('action-impact-partenaire');
        this.saveActionBtn = document.getElementById('save-action-btn');
        this.cancelActionBtn = document.getElementById('cancel-action-btn');

        // Actions list
        this.settingsActionsList = document.getElementById('settings-actions-list');

        // CSV buttons
        this.exportActionsBtn = document.getElementById('export-actions-btn');
        this.importActionsBtn = document.getElementById('import-actions-btn');
        this.importActionsFile = document.getElementById('import-actions-file');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Partner changes (auto-save on change)
        this.partner1Name.addEventListener('change', () => this.savePartnerSettings());
        this.partner1Color.addEventListener('change', () => this.savePartnerSettings());
        this.partner2Name.addEventListener('change', () => this.savePartnerSettings());
        this.partner2Color.addEventListener('change', () => this.savePartnerSettings());

        // Initial flowers
        this.applyInitialFlowersBtn.addEventListener('click', () => this.applyInitialFlowers());

        // Alert thresholds (auto-save on change)
        this.alert1.addEventListener('change', () => this.saveAlertSettings());
        this.alert2.addEventListener('change', () => this.saveAlertSettings());

        // Default sort (auto-save on change)
        this.defaultSort.addEventListener('change', () => this.saveDefaultSort());

        // Action form
        this.addActionBtn.addEventListener('click', () => this.showActionForm());
        this.saveActionBtn.addEventListener('click', () => this.saveAction());
        this.cancelActionBtn.addEventListener('click', () => this.hideActionForm());

        // CSV
        this.exportActionsBtn.addEventListener('click', () => this.exportActions());
        this.importActionsBtn.addEventListener('click', () => this.importActionsFile.click());
        this.importActionsFile.addEventListener('change', (e) => this.importActions(e));
    }

    /**
     * Render settings view
     */
    render(data) {
        this.renderPartnerSettings(data.partners);
        this.renderSettings(data.settings);
        this.renderActionsList(data.actions);
    }

    /**
     * Render partner settings
     */
    renderPartnerSettings(partners) {
        this.partner1Name.value = partners[0].name;
        this.partner1Color.value = partners[0].color;
        this.partner2Name.value = partners[1].name;
        this.partner2Color.value = partners[1].color;
        this.initialFlowers.value = partners[0].initialFlowers;
    }

    /**
     * Render settings
     */
    renderSettings(settings) {
        this.alert1.value = settings.alert1;
        this.alert2.value = settings.alert2;
        this.defaultSort.value = settings.defaultSort;
    }

    /**
     * Render actions list in settings
     */
    renderActionsList(actions) {
        this.settingsActionsList.innerHTML = '';

        if (actions.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.innerHTML = '<p>Aucune action configurée. Cliquez sur "Nouvelle Action" pour commencer.</p>';
            this.settingsActionsList.appendChild(emptyDiv);
            return;
        }

        // Sort by name
        const sortedActions = [...actions].sort((a, b) => a.name.localeCompare(b.name));

        sortedActions.forEach(action => {
            const item = this.createSettingsActionItem(action);
            this.settingsActionsList.appendChild(item);
        });
    }

    /**
     * Create settings action item
     */
    createSettingsActionItem(action) {
        const div = document.createElement('div');
        div.className = 'settings-action-item';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'settings-action-info';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'settings-action-name';
        nameDiv.textContent = action.name;

        const deltasDiv = document.createElement('div');
        deltasDiv.className = 'settings-action-deltas';
        deltasDiv.innerHTML = `
            Impact Acteur: <strong>${this.formatDelta(action.impactActeur)}</strong> |
            Impact Partenaire: <strong>${this.formatDelta(action.impactPartenaire)}</strong> |
            Type: ${action.type || 'N/A'} |
            Utilisé: ${action.usageTotal} fois
        `;

        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(deltasDiv);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'settings-action-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-secondary btn-small';
        editBtn.textContent = 'Modifier';
        editBtn.addEventListener('click', () => this.editAction(action));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-small';
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.addEventListener('click', () => this.deleteAction(action.id));

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        div.appendChild(infoDiv);
        div.appendChild(actionsDiv);

        return div;
    }

    /**
     * Format delta with sign
     */
    formatDelta(delta) {
        if (delta > 0) return '+' + delta;
        return delta.toString();
    }

    /**
     * Save partner settings
     */
    savePartnerSettings() {
        const data = {
            partner1: {
                name: this.partner1Name.value,
                color: this.partner1Color.value
            },
            partner2: {
                name: this.partner2Name.value,
                color: this.partner2Color.value
            }
        };

        this.controller.updatePartnerSettings(data);
    }

    /**
     * Apply initial flowers to both partners
     */
    applyInitialFlowers() {
        const initialFlowers = parseInt(this.initialFlowers.value) || 0;

        if (confirm('⚠️ Cela réinitialisera les fleurs actuelles et l\'historique. Continuer ?')) {
            this.controller.applyInitialFlowers(initialFlowers);
        }
    }

    /**
     * Save alert settings
     */
    saveAlertSettings() {
        const data = {
            alert1: parseInt(this.alert1.value) || -10,
            alert2: parseInt(this.alert2.value) || -20
        };

        this.controller.updateAlertSettings(data);
    }

    /**
     * Save default sort
     */
    saveDefaultSort() {
        this.controller.updateDefaultSort(this.defaultSort.value);
    }

    /**
     * Show action form for new action
     */
    showActionForm(action = null) {
        this.editingActionId = action ? action.id : null;

        if (action) {
            this.actionFormTitle.textContent = 'Modifier l\'Action';
            this.actionFormId.value = action.id;
            this.actionName.value = action.name;
            this.actionDescription.value = action.description;
            this.actionType.value = action.type;
            this.actionTags.value = action.tags.join(', ');
            this.actionImpactActeur.value = action.impactActeur;
            this.actionImpactPartenaire.value = action.impactPartenaire;
        } else {
            this.actionFormTitle.textContent = 'Nouvelle Action';
            this.actionFormId.value = '';
            this.actionName.value = '';
            this.actionDescription.value = '';
            this.actionType.value = '';
            this.actionTags.value = '';
            this.actionImpactActeur.value = 0;
            this.actionImpactPartenaire.value = 0;
        }

        this.actionForm.style.display = 'block';
        this.actionName.focus();
    }

    /**
     * Hide action form
     */
    hideActionForm() {
        this.actionForm.style.display = 'none';
        this.editingActionId = null;
    }

    /**
     * Save action (create or update)
     */
    saveAction() {
        const name = this.actionName.value.trim();

        if (!name) {
            alert('Le nom de l\'action est obligatoire.');
            return;
        }

        const tags = this.actionTags.value
            .split(',')
            .map(t => t.trim())
            .filter(t => t);

        const actionData = {
            id: this.actionFormId.value || null,
            name: name,
            description: this.actionDescription.value.trim(),
            type: this.actionType.value.trim(),
            tags: tags,
            impactActeur: parseInt(this.actionImpactActeur.value) || 0,
            impactPartenaire: parseInt(this.actionImpactPartenaire.value) || 0
        };

        if (this.editingActionId) {
            this.controller.updateAction(actionData);
        } else {
            this.controller.addAction(actionData);
        }

        this.hideActionForm();
    }

    /**
     * Edit action
     */
    editAction(action) {
        this.showActionForm(action);
    }

    /**
     * Delete action
     */
    deleteAction(actionId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette action ?')) {
            this.controller.deleteAction(actionId);
        }
    }

    /**
     * Export actions to CSV
     */
    exportActions() {
        const data = this.controller.getData();
        const csvContent = CSVExporter.exportActions(data.actions);
        const filename = `lovemeter_actions_${new Date().toISOString().split('T')[0]}.csv`;
        CSVExporter.download(csvContent, filename);
    }

    /**
     * Import actions from CSV
     */
    async importActions(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const csvContent = await CSVExporter.readFile(file);
            const actions = CSVExporter.importActions(csvContent);

            if (confirm(`Importer ${actions.length} actions ? Cela remplacera la liste d'actions actuelle.`)) {
                this.controller.importActions(actions);
            }
        } catch (error) {
            alert('Erreur lors de l\'import du fichier CSV : ' + error.message);
        }

        // Reset file input
        event.target.value = '';
    }
}
