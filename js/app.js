// ============================================
// MAIN APPLICATION
// ============================================
class SekolahPortal {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;
        this.isLoading = true;
        
        this.init();
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

    async loadData() {
        try {
            // Load initial data
            this.carouselData = await storage.getItems('carousel');
            this.worksData = await storage.getItems('works');
            this.newsData = await storage.getItems('news');
            
            // If no data, create defaults
            if (this.carouselData.length === 0) {
                await this.createDefaultData();
                await this.loadData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async createDefaultData() {
        const defaultCarousel = [
            {
                id: 1,
                title: "Selamat Datang di Portal Sekolah",
                description: "Portal terintegrasi untuk manajemen sekolah modern",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                active: true
            }
        ];

        const defaultUsers = [
            {
                id: 1,
                username: "admin",
                password: "admin123",
                name: "Administrator",
                role: "admin"
            },
            {
                id: 2,
                username: "guru",
                password: "guru123",
                name: "Guru Demo",
                role: "guru"
            },
            {
                id: 3,
                username: "siswa",
                password: "siswa123",
                name: "Siswa Demo",
                role: "siswa"
            }
        ];

        try {
            for (const item of defaultCarousel) {
                await storage.createItem('carousel', item);
            }
            for (const user of defaultUsers) {
                await storage.createItem('users', user);
            }
            console.log('Default data created');
        } catch (error) {
            console.error('Error creating default data:', error);
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.transition = 'opacity 0.3s';
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
        this.isLoading = false;
    }

    showError(message) {
        console.error('Error:', message);
        // Simple error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #EF476F;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    renderNavigation() {
        const headerNav = document.getElementById('headerNav');
        if (headerNav) {
            headerNav.innerHTML = `
                <div class="header-nav-container">
                    <div class="nav-brand">
                        <i class="fas fa-school"></i>
                        <span>Portal Sekolah</span>
                    </div>
                    <div class="nav-menu">
                        ${this.currentUser ? 
                            `<div class="user-menu">
                                <span class="user-name">${this.currentUser.name}</span>
                                <button class="btn-logout">Logout</button>
                            </div>` : 
                            `<button class="btn-login">Login</button>`
                        }
                    </div>
                </div>
            `;
        }
    }

    renderPage(page) {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        switch(page) {
            case 'home':
                this.renderHome(mainContent);
                break;
            default:
                mainContent.innerHTML = `<h2>Halaman ${page}</h2>`;
        }
    }

    renderHome(container) {
        container.innerHTML = `
            <div class="home-container">
                <h1>Selamat Datang di Portal Sekolah Digital</h1>
                <p>Sistem terintegrasi untuk manajemen sekolah modern</p>
                
                ${this.carouselData && this.carouselData.length > 0 ? `
                <div class="carousel">
                    ${this.carouselData.map(item => `
                        <div class="carousel-item">
                            <img src="${item.image}" alt="${item.title}">
                            <div class="carousel-caption">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                <div class="features">
                    <div class="feature-card">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Pembelajaran Digital</h3>
                        <p>Akses materi pembelajaran kapan saja</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-users"></i>
                        <h3>Kolaborasi Siswa</h3>
                        <p>Berbagi karya dan kolaborasi</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-newspaper"></i>
                        <h3>Informasi Terkini</h3>
                        <p>Update berita dan informasi sekolah</p>
                    </div>
                </div>
            </div>
        `;
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
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SekolahPortal();
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
