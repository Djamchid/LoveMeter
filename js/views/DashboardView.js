import { CSVExporter } from '../utils/CSVExporter.js';

/**
 * DashboardView
 * Handles the dashboard display with partners, indicators, and history
 */
export class DashboardView {
    constructor(controller) {
        this.controller = controller;
        this.initElements();
        this.attachEventListeners();
    }

    /**
     * Initialize DOM elements
     */
    initElements() {
        this.partner1Card = document.getElementById('partner1-card');
        this.partner2Card = document.getElementById('partner2-card');
        this.weatherValue = document.getElementById('weather-value');
        this.balanceValue = document.getElementById('balance-value');
        this.historyTbody = document.getElementById('history-tbody');
        this.exportHistoryBtn = document.getElementById('export-history-btn');
        this.importHistoryBtn = document.getElementById('import-history-btn');
        this.importHistoryFile = document.getElementById('import-history-file');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        this.exportHistoryBtn.addEventListener('click', () => this.exportHistory());
        this.importHistoryBtn.addEventListener('click', () => this.importHistoryFile.click());
        this.importHistoryFile.addEventListener('change', (e) => this.importHistory(e));
    }

    /**
     * Render the complete dashboard
     */
    render(data) {
        this.renderPartners(data.partners, data.settings);
        this.renderIndicators(data.partners);
        this.renderHistory(data.history, data.partners);
    }

    /**
     * Render partner cards
     */
    renderPartners(partners, settings) {
        this.renderPartnerCard(this.partner1Card, partners[0], settings);
        this.renderPartnerCard(this.partner2Card, partners[1], settings);
    }

    /**
     * Render individual partner card
     */
    renderPartnerCard(card, partner, settings) {
        const colorIndicator = card.querySelector('.partner-color-indicator');
        const nameElement = card.querySelector('.partner-name');
        const valueElement = card.querySelector('.flower-value');
        const alertIndicator = card.querySelector('.alert-indicator');

        // Set color
        colorIndicator.style.backgroundColor = partner.color;

        // Set name
        nameElement.textContent = partner.getDisplayName();
        nameElement.style.color = partner.color;

        // Set flower count
        valueElement.textContent = partner.currentFlowers;

        // Set alert indicator
        const alertLevel = partner.getAlertLevel(settings.alert1, settings.alert2);
        alertIndicator.className = 'alert-indicator';

        if (alertLevel === 2) {
            alertIndicator.classList.add('alert-2');
            alertIndicator.textContent = '⚠️ Alerte forte';
        } else if (alertLevel === 1) {
            alertIndicator.classList.add('alert-1');
            alertIndicator.textContent = '⚠ Alerte modérée';
        } else {
            alertIndicator.textContent = '';
        }
    }

    /**
     * Render weather and balance indicators
     */
    renderIndicators(partners) {
        // Calculate weather
        const average = (partners[0].currentFlowers + partners[1].currentFlowers) / 2;
        this.weatherValue.className = 'indicator-value';

        if (average > 20) {
            this.weatherValue.classList.add('sunny');
            this.weatherValue.textContent = '☀️ Ensoleillé';
        } else if (average < -5) {
            this.weatherValue.classList.add('stormy');
            this.weatherValue.textContent = '⛈️ Orageux';
        } else {
            this.weatherValue.classList.add('variable');
            this.weatherValue.textContent = '🌤️ Variable';
        }

        // Calculate balance
        const diff = Math.abs(partners[0].currentFlowers - partners[1].currentFlowers);
        this.balanceValue.className = 'indicator-value';

        if (diff <= 5) {
            this.balanceValue.classList.add('balanced');
            this.balanceValue.textContent = '⚖️ Équilibré';
        } else if (diff > 15) {
            this.balanceValue.classList.add('highly-unbalanced');
            this.balanceValue.textContent = '⚠️ Fortement déséquilibré';
        } else {
            this.balanceValue.classList.add('slightly-unbalanced');
            this.balanceValue.textContent = '⚖ Légèrement déséquilibré';
        }
    }

    /**
     * Render history table
     */
    renderHistory(history, partners) {
        this.historyTbody.innerHTML = '';

        if (history.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-state';
            emptyRow.innerHTML = '<td colspan="7">Aucune action enregistrée</td>';
            this.historyTbody.appendChild(emptyRow);
            return;
        }

        // Render in reverse order (most recent first)
        const reversedHistory = [...history].reverse();

        reversedHistory.forEach(entry => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${entry.getFormattedDate()}</td>
                <td>${entry.actionName}</td>
                <td class="${this.getDeltaClass(entry.delta1)}">${this.formatDelta(entry.delta1)}</td>
                <td class="${this.getDeltaClass(entry.delta2)}">${this.formatDelta(entry.delta2)}</td>
                <td style="color: ${partners[0].color}; font-weight: 600;">${entry.total1After}</td>
                <td style="color: ${partners[1].color}; font-weight: 600;">${entry.total2After}</td>
                <td>
                    <input type="text"
                           class="note-input"
                           value="${entry.note}"
                           data-entry-id="${entry.id}"
                           placeholder="Ajouter une note...">
                </td>
            `;

            // Add note change listener
            const noteInput = row.querySelector('.note-input');
            noteInput.addEventListener('blur', () => {
                this.controller.updateHistoryNote(entry.id, noteInput.value);
            });

            this.historyTbody.appendChild(row);
        });
    }

    /**
     * Get CSS class for delta value
     */
    getDeltaClass(delta) {
        if (delta > 0) return 'delta-positive';
        if (delta < 0) return 'delta-negative';
        return 'delta-neutral';
    }

    /**
     * Format delta with sign
     */
    formatDelta(delta) {
        if (delta > 0) return '+' + delta;
        return delta.toString();
    }

    /**
     * Export history to CSV
     */
    exportHistory() {
        const data = this.controller.getData();
        const csvContent = CSVExporter.exportHistory(data.history);
        const filename = `lovemeter_historique_${new Date().toISOString().split('T')[0]}.csv`;
        CSVExporter.download(csvContent, filename);
    }

    /**
     * Import history from CSV
     */
    async importHistory(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const csvContent = await CSVExporter.readFile(file);
            const data = this.controller.getData();
            const history = CSVExporter.importHistory(csvContent, data.partners);

            if (confirm('Importer cet historique remplacera l\'historique actuel et recalculera les totaux de fleurs. Continuer ?')) {
                this.controller.importHistory(history);
            }
        } catch (error) {
            alert('Erreur lors de l\'import du fichier CSV : ' + error.message);
        }

        // Reset file input
        event.target.value = '';
    }
}
