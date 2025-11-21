import { AppController } from './controllers/AppController.js';
import { StorageManager } from './storage/StorageManager.js';

/**
 * Main application entry point
 */

// Check if localStorage is available
if (!StorageManager.isAvailable()) {
    alert('⚠️ localStorage n\'est pas disponible dans ce navigateur. Les données ne seront pas sauvegardées.');
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create and initialize the app controller
        window.loveMeterApp = new AppController();

        console.log('✅ LoveMeter application initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing LoveMeter:', error);

        // Display error to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #fee2e2;
            color: #991b1b;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 80%;
        `;
        errorDiv.innerHTML = `
            <strong>Erreur d'initialisation</strong><br>
            ${error.message}
        `;
        document.body.appendChild(errorDiv);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    console.log('👋 LoveMeter application closing');
});

// Expose version info
console.log(`
╔═══════════════════════════════╗
║        🌸 LoveMeter 🌸        ║
║   Suivi de la dynamique de    ║
║            couple             ║
║         Version 1.0           ║
╚═══════════════════════════════╝
`);
