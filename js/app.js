// ============================================
// MAIN APPLICATION
// ============================================
class SekolahPortal {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;
        this.isLoading = true;
        
        this.init();
        // Debounce untuk prevent multiple instantiation
        if (window.SekolahPortalInstance) {
            console.warn("SekolahPortal already instantiated, returning existing instance");
            return window.SekolahPortalInstance;
        }
        window.SekolahPortalInstance = this;
    }

    async init() {
        try {
            await storage.init();
            this.currentUser = await storage.getCurrentUser();
            this.hideLoading();
            
            // Load data
            await this.loadData();
            
            // Setup UI
            this.renderNavigation();
            this.renderPage(this.currentPage);
            
            console.log('Portal initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Gagal memuat aplikasi');
            this.hideLoading();
        }
    }

// Di app.js, cari bagian loadData() dan update:
async loadData() {
    try {
        // Load initial data from IndexedDB
        this.carouselData = await storage.getItems(storage.STORES.CAROUSEL);
        this.worksData = await storage.getItems(storage.STORES.WORKS);
        this.newsData = await storage.getItems(storage.STORES.NEWS);
        
        console.log('Data loaded from IndexedDB:', {
            carousel: this.carouselData.length,
            works: this.worksData.length,
            news: this.newsData.length
        });
        
        // If no carousel data, create defaults
        if (this.carouselData.length === 0) {
            console.log('No carousel data found, creating default...');
            await this.createDefaultData();
            // Reload data
            await this.loadData();
        }
    } catch (error) {
        console.error('Error loading data from IndexedDB:', error);
        // Fallback to empty arrays
        this.carouselData = [];
        this.worksData = [];
        this.newsData = [];
    }
}
// ============================================
// ERROR HANDLING FOR MISSING FAVICON
// ============================================

// Ignore favicon 404 errors (non-critical)
window.addEventListener('error', function(e) {
    // Cek apakah error berasal dari favicon request
    if (e.target && 
        (e.target.tagName === 'LINK' && e.target.rel.includes('icon')) ||
        (e.target.tagName === 'IMG' && e.target.src.includes('favicon')) ||
        e.target.href && e.target.href.includes('favicon')) {
        
        e.preventDefault();
        e.stopPropagation();
        console.log('Favicon tidak ditemukan - ini normal jika belum ditambahkan');
        return false;
    }
}, true);

// Atau alternatif lebih sederhana:
// Tambahkan favicon secara dinamis jika tidak ada
document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah sudah ada favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    
    if (!existingFavicon) {
        // Tambahkan favicon default
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/x-icon';
        favicon.href = 'https://img.icons8.com/color/96/000000/school.png';
        document.head.appendChild(favicon);
        console.log('Favicon default ditambahkan');
    }
});
// ============================================
// ERROR HANDLING - IGNORE NON-CRITICAL ERRORS
// ============================================

// Ignore favicon 404 errors
window.addEventListener('error', function(e) {
    if (e.target && (
        (e.target.tagName === 'LINK' && e.target.rel.includes('icon')) ||
        (e.target.tagName === 'IMG' && e.target.src && e.target.src.includes('favicon'))
    )) {
        e.preventDefault();
        console.log('Info: Favicon tidak ditemukan, menggunakan default');
        return false;
    }
}, true);

// Suppress non-critical console warnings
const originalWarn = console.warn;
console.warn = function(...args) {
    // Ignore specific warnings
    if (typeof args[0] === 'string' && (
        args[0].includes('favicon') || 
        args[0].includes('Failed to load') ||
        args[0].includes('404')
    )) {
        return; // Jangan tampilkan warning ini
    }
    originalWarn.apply(console, args);
};
