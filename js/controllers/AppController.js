import { StorageManager } from '../storage/StorageManager.js';
import { DashboardView } from '../views/DashboardView.js';
import { ActionsView } from '../views/ActionsView.js';
import { SettingsView } from '../views/SettingsView.js';
import { Action } from '../models/Action.js';
import { HistoryEntry } from '../models/HistoryEntry.js';

/**
 * AppController
 * Main application controller that manages data and coordinates views
 */
export class AppController {
    constructor() {
        this.storage = new StorageManager();
        this.data = this.storage.loadData();
        this.currentView = 'dashboard';

        // Initialize views
        this.dashboardView = new DashboardView(this);
        this.actionsView = new ActionsView(this);
        this.settingsView = new SettingsView(this);

        this.initNavigation();
        this.render();
    }

    /**
     * Initialize navigation
     */
    initNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const views = document.querySelectorAll('.view');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const viewName = btn.dataset.view;

                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update active view
                views.forEach(v => v.classList.remove('active'));
                document.getElementById(`${viewName}-view`).classList.add('active');

                this.currentView = viewName;
                this.render();
            });
        });
    }

    /**
     * Get current data
     */
    getData() {
        return this.data;
    }

    /**
     * Save data to storage
     */
    saveData() {
        this.storage.saveData(this.data);
    }

    /**
     * Render current view
     */
    render() {
        switch (this.currentView) {
            case 'dashboard':
                this.dashboardView.render(this.data);
                break;
            case 'actions':
                this.actionsView.render(this.data);
                break;
            case 'settings':
                this.settingsView.render(this.data);
                break;
        }
    }

    /**
     * Render all views (useful after data changes)
     */
    renderAll() {
        this.dashboardView.render(this.data);
        this.actionsView.render(this.data);
        this.settingsView.render(this.data);
    }

    /**
     * Record an action (V1.3 with actorId)
     */
    recordAction(actionId, actorId) {
        const action = this.data.actions.find(a => a.id === actionId);
        if (!action) return;

        // Find actor and target
        const actor = this.data.partners.find(p => p.id === actorId);
        const target = this.data.partners.find(p => p.id !== actorId);

        if (!actor || !target) return;

        // Update partner flowers
        actor.addFlowers(action.impactActeur);
        target.addFlowers(action.impactPartenaire);

        // Update action usage
        action.recordUsage();

        // Create history entry (V1.3 format)
        const historyEntry = new HistoryEntry(
            null,
            null, // Will use current timestamp
            action.id,
            action.name,
            actor.id,
            target.id,
            action.impactActeur,
            action.impactPartenaire,
            actor.currentFlowers,
            target.currentFlowers,
            ''
        );

        this.data.history.push(historyEntry);

        // Save and render
        this.saveData();
        this.renderAll();
    }

    /**
     * Update history note
     */
    updateHistoryNote(entryId, note) {
        const entry = this.data.history.find(e => e.id === entryId);
        if (entry) {
            entry.updateNote(note);
            this.saveData();
        }
    }

    /**
     * Import history
     */
    importHistory(history) {
        this.data.history = history;

        // Recalculate current flowers from last entry
        if (history.length > 0) {
            const lastEntry = history[history.length - 1];
            this.data.partners[0].currentFlowers = lastEntry.total1After;
            this.data.partners[1].currentFlowers = lastEntry.total2After;
        }

        this.saveData();
        this.renderAll();
    }

    /**
     * Update partner settings
     */
    updatePartnerSettings(partnerData) {
        this.data.partners[0].name = partnerData.partner1.name;
        this.data.partners[0].color = partnerData.partner1.color;
        this.data.partners[1].name = partnerData.partner2.name;
        this.data.partners[1].color = partnerData.partner2.color;

        this.saveData();
        this.renderAll();
    }

    /**
     * Apply initial flowers to both partners
     */
    applyInitialFlowers(initialFlowers) {
        this.data.partners[0].initialFlowers = initialFlowers;
        this.data.partners[0].currentFlowers = initialFlowers;
        this.data.partners[1].initialFlowers = initialFlowers;
        this.data.partners[1].currentFlowers = initialFlowers;

        this.saveData();
        this.renderAll();
    }

    /**
     * Update alert settings
     */
    updateAlertSettings(alertData) {
        this.data.settings.alert1 = alertData.alert1;
        this.data.settings.alert2 = alertData.alert2;
        this.data.settings.validateAlerts();

        this.saveData();
        this.renderAll();
    }

    /**
     * Update default sort
     */
    updateDefaultSort(sortMode) {
        this.data.settings.defaultSort = sortMode;
        this.actionsView.setSortMode(sortMode);

        this.saveData();
        this.render();
    }

    /**
     * Add new action
     */
    addAction(actionData) {
        const action = new Action(
            null,
            actionData.name,
            actionData.description,
            actionData.type,
            actionData.tags,
            actionData.impactActeur,
            actionData.impactPartenaire,
            0,
            null,
            true
        );

        this.data.actions.push(action);

        this.saveData();
        this.renderAll();
    }

    /**
     * Update existing action
     */
    updateAction(actionData) {
        const action = this.data.actions.find(a => a.id === actionData.id);
        if (!action) return;

        action.name = actionData.name;
        action.description = actionData.description;
        action.type = actionData.type;
        action.tags = actionData.tags;
        action.impactActeur = actionData.impactActeur;
        action.impactPartenaire = actionData.impactPartenaire;

        this.saveData();
        this.renderAll();
    }

    /**
     * Delete action
     */
    deleteAction(actionId) {
        const index = this.data.actions.findIndex(a => a.id === actionId);
        if (index !== -1) {
            this.data.actions.splice(index, 1);
            this.saveData();
            this.renderAll();
        }
    }

    /**
     * Import actions
     */
    importActions(actions) {
        this.data.actions = actions;
        this.saveData();
        this.renderAll();
    }
}
