// ===== MAIN APPLICATION =====
class SekolahPortal {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;
        this.isLoading = true;
        this.data = {
            carousel: [], works: [], gallery: [], 
            perpustakaan: [], materi: [], news: [],
            homeContent: [], settings: []
        };
        this.init();
    }

    async init() {
        try {
            await storage.init();
            this.hideLoading();
            console.log('Portal initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            this.hideLoading();
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        this.isLoading = false;
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        const isGithubPages = window.location.hostname.includes('github.io');
        const swPath = isGithubPages ? '/harfart/sw.js' : './sw.js';
        
        navigator.serviceWorker.register(swPath)
            .then(reg => console.log('Service Worker registered:', reg.scope))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new SekolahPortal();
});
