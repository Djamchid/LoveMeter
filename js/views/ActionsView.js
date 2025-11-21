/**
 * ActionsView
 * Handles the actions recording interface
 */
export class ActionsView {
    constructor(controller) {
        this.controller = controller;
        this.currentFilter = '';
        this.currentSort = 'frequency';
        this.initElements();
        this.attachEventListeners();
    }

    /**
     * Initialize DOM elements
     */
    initElements() {
        this.actionsList = document.getElementById('actions-list');
        this.filterInput = document.getElementById('action-filter');
        this.sortSelect = document.getElementById('action-sort');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        this.filterInput.addEventListener('input', (e) => {
            this.currentFilter = e.target.value;
            this.render(this.controller.getData());
        });

        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render(this.controller.getData());
        });
    }

    /**
     * Render actions list
     */
    render(data) {
        // Update sort select if needed
        if (this.sortSelect.value !== this.currentSort) {
            this.sortSelect.value = this.currentSort;
        }

        // Filter and sort actions
        let actions = data.actions.filter(action => action.active);

        if (this.currentFilter) {
            actions = actions.filter(action => action.matchesSearch(this.currentFilter));
        }

        actions = this.sortActions(actions, this.currentSort);

        // Render
        this.actionsList.innerHTML = '';

        if (actions.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.innerHTML = '<p>Aucune action trouvée.</p>';
            this.actionsList.appendChild(emptyDiv);
            return;
        }

        actions.forEach(action => {
            const actionItem = this.createActionItem(action, data.partners);
            this.actionsList.appendChild(actionItem);
        });
    }

    /**
     * Create action item element
     */
    createActionItem(action, partners) {
        const div = document.createElement('div');
        div.className = 'action-item';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'action-info';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'action-name';
        nameDiv.textContent = action.name;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'action-meta';

        const deltasSpan = document.createElement('span');
        deltasSpan.className = 'action-deltas';
        deltasSpan.innerHTML = `
            <span style="color: ${partners[0].color}">
                Effet Acteur: ${this.formatDelta(action.impactActeur)}
            </span>
            <span style="color: ${partners[1].color}">
                Effet Partenaire: ${this.formatDelta(action.impactPartenaire)}
            </span>
        `;

        if (action.type) {
            const typeSpan = document.createElement('span');
            typeSpan.textContent = `Type: ${action.type}`;
            metaDiv.appendChild(typeSpan);
        }

        const usageSpan = document.createElement('span');
        usageSpan.textContent = `Utilisé ${action.usageTotal} fois`;
        metaDiv.appendChild(usageSpan);

        if (action.lastUsed) {
            const lastUsedSpan = document.createElement('span');
            const date = new Date(action.lastUsed);
            lastUsedSpan.textContent = `Dernier: ${date.toLocaleDateString('fr-FR')}`;
            metaDiv.appendChild(lastUsedSpan);
        }

        metaDiv.appendChild(deltasSpan);

        infoDiv.appendChild(nameDiv);

        if (action.description) {
            const descDiv = document.createElement('div');
            descDiv.style.fontSize = '0.9rem';
            descDiv.style.color = 'var(--text-secondary)';
            descDiv.textContent = action.description;
            infoDiv.appendChild(descDiv);
        }

        if (action.tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'action-tags';
            action.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = tag;
                tagsDiv.appendChild(tagSpan);
            });
            infoDiv.appendChild(tagsDiv);
        }

        infoDiv.appendChild(metaDiv);

        // V1.3: Two buttons per action (one for each partner)
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'action-buttons';

        const recordBtn1 = document.createElement('button');
        recordBtn1.className = 'btn btn-record';
        recordBtn1.textContent = `Agit : ${partners[0].getDisplayName()}`;
        recordBtn1.style.borderColor = partners[0].color;
        recordBtn1.addEventListener('click', () => {
            this.controller.recordAction(action.id, partners[0].id);
        });

        const recordBtn2 = document.createElement('button');
        recordBtn2.className = 'btn btn-record';
        recordBtn2.textContent = `Agit : ${partners[1].getDisplayName()}`;
        recordBtn2.style.borderColor = partners[1].color;
        recordBtn2.addEventListener('click', () => {
            this.controller.recordAction(action.id, partners[1].id);
        });

        buttonsDiv.appendChild(recordBtn1);
        buttonsDiv.appendChild(recordBtn2);

        div.appendChild(infoDiv);
        div.appendChild(buttonsDiv);

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
     * Sort actions based on sort mode
     */
    sortActions(actions, sortMode) {
        const sorted = [...actions];

        switch (sortMode) {
            case 'frequency':
                sorted.sort((a, b) => b.usageTotal - a.usageTotal);
                break;
            case 'recent':
                sorted.sort((a, b) => {
                    if (!a.lastUsed && !b.lastUsed) return 0;
                    if (!a.lastUsed) return 1;
                    if (!b.lastUsed) return -1;
                    return b.lastUsed - a.lastUsed;
                });
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'impact':
                sorted.sort((a, b) => b.getTotalImpact() - a.getTotalImpact());
                break;
        }

        return sorted;
    }

    /**
     * Set current sort mode
     */
    setSortMode(sortMode) {
        this.currentSort = sortMode;
        this.sortSelect.value = sortMode;
    }
}
