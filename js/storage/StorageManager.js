import { Partner } from '../models/Partner.js';
import { Action } from '../models/Action.js';
import { HistoryEntry } from '../models/HistoryEntry.js';
import { Settings } from '../models/Settings.js';

/**
 * StorageManager
 * Handles all localStorage operations with data persistence and recovery
 */
export class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'lovemeter_data';
        this.VERSION = '1.0';
    }

    /**
     * Save all data to localStorage
     */
    saveData(data) {
        try {
            const storageData = {
                version: this.VERSION,
                timestamp: Date.now(),
                partners: data.partners.map(p => p.toJSON()),
                actions: data.actions.map(a => a.toJSON()),
                history: data.history.map(h => h.toJSON()),
                settings: data.settings.toJSON()
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageData));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    /**
     * Load all data from localStorage
     * Returns default data if nothing is stored or if data is corrupted
     */
    loadData() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);

            if (!stored) {
                return this.getDefaultData();
            }

            const data = JSON.parse(stored);

            // Validate and restore data
            return {
                partners: this.restorePartners(data.partners),
                actions: this.restoreActions(data.actions),
                history: this.restoreHistory(data.history),
                settings: this.restoreSettings(data.settings)
            };
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            // Return default data if there's an error
            return this.getDefaultData();
        }
    }

    /**
     * Get default data for initial setup
     */
    getDefaultData() {
        return {
            partners: [
                new Partner('partner1', '', '#4CAF50', 0, 0),
                new Partner('partner2', '', '#2196F3', 0, 0)
            ],
            actions: Action.getDefaultActions(),
            history: [],
            settings: Settings.getDefaults()
        };
    }

    /**
     * Restore partners from stored data
     */
    restorePartners(partnersData) {
        if (!Array.isArray(partnersData) || partnersData.length !== 2) {
            return this.getDefaultData().partners;
        }

        try {
            return partnersData.map(p => Partner.fromJSON(p));
        } catch (error) {
            console.error('Error restoring partners:', error);
            return this.getDefaultData().partners;
        }
    }

    /**
     * Restore actions from stored data
     */
    restoreActions(actionsData) {
        if (!Array.isArray(actionsData)) {
            return Action.getDefaultActions();
        }

        try {
            const actions = actionsData.map(a => Action.fromJSON(a));
            // If no actions, return default actions
            return actions.length > 0 ? actions : Action.getDefaultActions();
        } catch (error) {
            console.error('Error restoring actions:', error);
            return Action.getDefaultActions();
        }
    }

    /**
     * Restore history from stored data
     */
    restoreHistory(historyData) {
        if (!Array.isArray(historyData)) {
            return [];
        }

        try {
            return historyData.map(h => HistoryEntry.fromJSON(h));
        } catch (error) {
            console.error('Error restoring history:', error);
            return [];
        }
    }

    /**
     * Restore settings from stored data
     */
    restoreSettings(settingsData) {
        if (!settingsData) {
            return Settings.getDefaults();
        }

        try {
            return Settings.fromJSON(settingsData);
        } catch (error) {
            console.error('Error restoring settings:', error);
            return Settings.getDefaults();
        }
    }

    /**
     * Clear all data (for reset functionality)
     */
    clearData() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    /**
     * Export all data as JSON string
     */
    exportData(data) {
        try {
            const exportData = {
                version: this.VERSION,
                exportDate: new Date().toISOString(),
                partners: data.partners.map(p => p.toJSON()),
                actions: data.actions.map(a => a.toJSON()),
                history: data.history.map(h => h.toJSON()),
                settings: data.settings.toJSON()
            };

            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    }

    /**
     * Import data from JSON string
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            return {
                partners: this.restorePartners(data.partners),
                actions: this.restoreActions(data.actions),
                history: this.restoreHistory(data.history),
                settings: this.restoreSettings(data.settings)
            };
        } catch (error) {
            console.error('Error importing data:', error);
            return null;
        }
    }

    /**
     * Check if localStorage is available
     */
    static isAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}
