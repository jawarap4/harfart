// Main Application Controller
class SekolahPortal {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;
        this.isLoading = true;
        this.data = {
            carousel: [],
            works: [],
            students: [],
            gallery: []
        };
        
        this.init();
    }

    async init() {
        // Load configuration and data
        await this.loadData();
        
        // Render initial UI
        this.renderNavigation();
        this.renderCarousel();
        this.renderPage(this.currentPage);
        
        // Hide loading screen
        this.hideLoading();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check if user was previously logged in
        this.checkAuthState();
    }

    async loadData() {
        try {
            // Determine API base URL
            const apiBaseUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000' 
                : '';
            
            // Load data from MySQL backend via API
            const responses = await Promise.all([
                fetch(`${apiBaseUrl}/api/carousel`),
                fetch(`${apiBaseUrl}/api/works`),
                fetch(`${apiBaseUrl}/api/gallery`),
                fetch(`${apiBaseUrl}/api/perpustakaan`)
            ]);
            
            const [carouselData, worksData, galleryData, perpustakaanData] = await Promise.all(
                responses.map(r => {
                    if (!r.ok) throw new Error(`API error: ${r.status}`);
                    return r.json();
                })
            );
            
            this.data.carousel = carouselData || [];
            this.data.works = worksData || [];
            this.data.gallery = galleryData || [];
            this.data.perpustakaan = perpustakaanData || [];
            
            console.log('Data loaded successfully from API');
        } catch (error) {
            console.error('Error loading data from API:', error);
            // Fallback: try loading from JSON files if API is unavailable
            console.log('Attempting to load from JSON fallback...');
            try {
                const responses = await Promise.all([
                    fetch('data/carousel-data.json').catch(() => ({ json: () => [] })),
                    fetch('data/works-data.json').catch(() => ({ json: () => [] })),
                    fetch('data/gallery-data.json').catch(() => ({ json: () => [] })),
                    fetch('data/perpustakaan-data.json').catch(() => ({ json: () => [] }))
                ]);
                
                const [carouselData, worksData, galleryData, perpustakaanData] = await Promise.all(
                    responses.map(r => r.json().catch(() => []))
                );
                
                this.data.carousel = carouselData || [];
                this.data.works = worksData || [];
                this.data.gallery = galleryData || [];
                this.data.perpustakaan = perpustakaanData || [];
                
                console.log('Data loaded from JSON fallback');
            } catch (fallbackError) {
                console.error('Fallback loading also failed:', fallbackError);
                this.showError('Gagal memuat data. Silakan refresh halaman atau hubungi administrator.');
            }
        }
    }

    renderNavigation() {
        const headerNav = document.getElementById('headerNav');
        const footerNav = document.getElementById('footerNav');
        const currentMode = localStorage.getItem('harfart_mode') || 'mock';
        
        // Header Navigation
        headerNav.innerHTML = `
            <div class="header-nav-container">
                <div class="mode-toggle" title="Toggle between Mock and API mode">
                    <button id="modeToggleBtn" class="mode-toggle-btn" data-mode="${currentMode}">
                        <i class="fas fa-${currentMode === 'api' ? 'database' : 'cube'}\"></i>
                        <span class="mode-label">${currentMode === 'api' ? 'API' : 'Mock'}</span>
                    </button>
                </div>
                <a href="#home" class="nav-item ${this.currentPage === 'home' ? 'active' : ''}" data-page="home">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
                <a href="#siswa" class="nav-item ${this.currentPage === 'siswa' ? 'active' : ''}" data-page="siswa">
                    <i class="fas fa-users"></i>
                    <span>Siswa</span>
                </a>
                <a href="#data-siswa" class="nav-item ${this.currentPage === 'data-siswa' ? 'active' : ''}" data-page="data-siswa">
                    <i class="fas fa-user-graduate"></i>
                    <span>Data Siswa</span>
                </a>
                <a href="#gallery" class="nav-item ${this.currentPage === 'gallery' ? 'active' : ''}" data-page="gallery">
                    <i class="fas fa-images"></i>
                    <span>Galeri</span>
                </a>
            </div>
        `;
        
        // Footer Navigation
        footerNav.innerHTML = `
            <div class="footer-nav-container">
                <a href="#bike" class="nav-item ${this.currentPage === 'bike' ? 'active' : ''}" data-page="bike">
                    <i class="fas fa-bicycle"></i>
                    <span>Sepeda</span>
                </a>
                <a href="#book" class="nav-item ${this.currentPage === 'book' ? 'active' : ''}" data-page="book">
                    <i class="fas fa-book"></i>
                    <span>Buku</span>
                </a>
                <a href="https://wa.me/6281234567890" target="_blank" class="nav-item" data-page="whatsapp">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                </a>
                <button class="nav-item" id="adminPanelBtn" data-page="admin">
                    <i class="fas fa-cog"></i>
                    <span>Admin</span>
                </button>
            </div>
        `;
    }

    renderCarousel() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;
        
        const activeSlides = this.data.carousel.filter(slide => slide.active);
        
        if (activeSlides.length === 0) {
            carouselContainer.innerHTML = `
                <div class="carousel">
                    <div class="carousel-slide active" style="background-color: var(--primary);">
                        <div class="carousel-text">
                            <h3>Selamat Datang</h3>
                            <p>Portal sekolah sedang dalam pengembangan.</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        carouselContainer.innerHTML = `
            <div class="carousel">
                ${activeSlides.map((slide, index) => `
                    <div class="carousel-slide ${index === 0 ? 'active' : ''}" 
                         style="background-image: url('${slide.image}')">
                        <div class="carousel-text">
                            <h3>${slide.title}</h3>
                            <p>${slide.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="carousel-indicators">
                ${activeSlides.map((_, index) => `
                    <div class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                         data-index="${index}"></div>
                `).join('')}
            </div>
        `;
        
        // Initialize carousel functionality
        this.initCarousel();
    }

    renderPage(pageId) {
        const mainContent = document.getElementById('mainContent');
        this.currentPage = pageId;
        
        // Update navigation active state
        this.renderNavigation();
        
        // Render page content
        switch(pageId) {
            case 'home':
                mainContent.innerHTML = this.renderHomePage();
                break;
            case 'siswa':
                mainContent.innerHTML = this.renderStudentWorksPage();
                break;
            case 'data-siswa':
                mainContent.innerHTML = this.renderStudentDataPage();
                break;
            case 'gallery':
                mainContent.innerHTML = this.renderGalleryPage();
                break;
            case 'bike':
                mainContent.innerHTML = this.renderBikePage();
                break;
            case 'book':
                mainContent.innerHTML = this.renderBookPage();
                break;
            default:
                mainContent.innerHTML = this.renderHomePage();
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderHomePage() {
        return `
            <div class="main-content">
                <h1 class="page-title">
                    <i class="fas fa-home"></i> Home
                </h1>
                <div class="p-4">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        Selamat datang di Portal Sekolah Digital
                    </div>
                    <div class="d-grid gap-3 mt-4">
                        <div class="p-3 bg-light rounded">
                            <h4><i class="fas fa-bullhorn text-primary"></i> Pengumuman Terbaru</h4>
                            <p class="mt-2">Portal ini akan terus dikembangkan untuk memberikan layanan terbaik.</p>
                        </div>
                        <div class="p-3 bg-light rounded">
                            <h4><i class="fas fa-calendar-alt text-success"></i> Agenda Sekolah</h4>
                            <p class="mt-2">Lihat agenda dan kegiatan sekolah di menu terkait.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStudentWorksPage() {
        if (this.data.works.length === 0) {
            return `
                <div class="main-content">
                    <h1 class="page-title">
                        <i class="fas fa-paint-brush"></i> Karya Siswa
                    </h1>
                    <div class="empty-state">
                        <i class="fas fa-paint-brush"></i>
                        <h3>Belum ada karya siswa</h3>
                        <p>Admin belum menambahkan karya siswa ke galeri.</p>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="main-content">
                <h1 class="page-title">
                    <i class="fas fa-paint-brush"></i> Karya Siswa
                </h1>
                <div class="works-grid" id="worksGrid">
                    ${this.data.works.map(work => `
                        <div class="work-item" data-id="${work.id}">
                            <img src="${work.image}" alt="${work.title}" class="work-image">
                            <div class="work-info">
                                <div class="work-meta">
                                    <div class="work-student">
                                        <div class="student-avatar">
                                            ${work.studentName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div class="student-details">
                                            <h4>${work.studentName}</h4>
                                            <p>Kelas ${work.class}</p>
                                        </div>
                                    </div>
                                    <div class="work-date">${work.date}</div>
                                </div>
                                <h3 class="work-title">${work.title}</h3>
                                <p class="work-description">${work.description}</p>
                                <div class="work-stats">
                                    <div class="stat-item" data-action="like" data-id="${work.id}">
                                        <i class="fas fa-heart"></i>
                                        <span>${work.likes} Suka</span>
                                    </div>
                                    <div class="stat-item" data-action="comment" data-id="${work.id}">
                                        <i class="fas fa-comment"></i>
                                        <span>${work.comments} Komentar</span>
                                    </div>
                                    <div class="stat-item">
                                        <i class="fas fa-eye"></i>
                                        <span>${work.views}x Dilihat</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div id="commentsSection" class="d-none"></div>
            </div>
        `;
    }

    renderStudentDataPage() {
        if (!this.currentUser) {
            return `
                <div class="main-content">
                    <h1 class="page-title">
                        <i class="fas fa-lock"></i> Data Siswa Terproteksi
                    </h1>
                    <div class="p-4 text-center">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            Anda harus login untuk mengakses data siswa
                        </div>
                        <button class="btn btn-primary btn-lg mt-3" id="loginDataBtn">
                            <i class="fas fa-sign-in-alt"></i> Login Sekarang
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Render based on user role
        return this.renderProtectedStudentData();
    }

    renderProtectedStudentData() {
        // This will be implemented in the students.js module
        return `
            <div class="main-content">
                <h1 class="page-title">
                    <i class="fas fa-user-graduate"></i> Data Siswa
                </h1>
                <div id="protectedDataContent">
                    <!-- Content will be loaded by students.js -->
                </div>
            </div>
        `;
    }

    renderGalleryPage() {
        return `
            <div class="main-content">
                <h1 class="page-title">
                    <i class="fas fa-images"></i> Galeri Kegiatan
                </h1>
                <div class="p-4">
                    <p>Galeri kegiatan sekolah akan ditampilkan di sini.</p>
                </div>
            </div>
        `;
    }

    renderBikePage() {
        return `
            <div class="main-content">
                <h1 class="page-title">
                    <i class="fas fa-bicycle"></i> Parkir Sepeda
                </h1>
                <div class="p-4">
                    <p>Informasi parkir sepeda akan ditampilkan di sini.</p>
                </div>
            </div>
        `;
    }

    renderBookPage() {
        return `
            <div class="main-content">
                <h1 class="page-title">
                    <i class="fas fa-book"></i> Perpustakaan Digital
                </h1>
                <div class="p-4">
                    <p>Koleksi perpustakaan digital akan ditampilkan di sini.</p>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Mode toggle button
        const modeToggleBtn = document.getElementById('modeToggleBtn');
        if (modeToggleBtn) {
            modeToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const currentMode = localStorage.getItem('harfart_mode') || 'mock';
                const newMode = currentMode === 'api' ? 'mock' : 'api';
                authSystem.setMode(newMode === 'api');
                this.renderNavigation();
                this.setupEventListeners();
                alert(`Switched to ${newMode === 'api' ? 'API Backend' : 'Mock (localStorage)'} mode.`);\n            });
        }

        // Navigation clicks
        document.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (navItem && navItem.dataset.page) {
                e.preventDefault();
                const pageId = navItem.dataset.page;
                
                if (pageId === 'admin') {
                    this.openAdminPanel();
                } else {
                    this.renderPage(pageId);
                }
            }
            
            // Comment actions
            if (e.target.closest('[data-action="comment"]')) {
                const workId = e.target.closest('[data-action="comment"]').dataset.id;
                this.showComments(workId);
            }
            
            if (e.target.closest('[data-action="like"]')) {
                const workId = e.target.closest('[data-action="like"]').dataset.id;
                this.likeWork(workId);
            }
        });
        
        // Hash change for direct links
        window.addEventListener('hashchange', () => {
            const pageId = window.location.hash.substring(1) || 'home';
            this.renderPage(pageId);
        });
        
        // Login button for data page
        document.addEventListener('click', (e) => {
            if (e.target.id === 'loginDataBtn') {
                this.openLoginModal();
            }
        });
    }

    initCarousel() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        if (slides.length <= 1) return;
        
        // Set up indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                slides[currentSlide].classList.remove('active');
                indicators[currentSlide].classList.remove('active');
                
                currentSlide = index;
                
                slides[currentSlide].classList.add('active');
                indicators[currentSlide].classList.add('active');
            });
        });
        
        // Auto advance slides
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            currentSlide = (currentSlide + 1) % slides.length;
            
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }, 5000);
    }

    showComments(workId) {
        // This will be implemented in the comments system
        console.log('Show comments for work:', workId);
    }

    likeWork(workId) {
        // This will be implemented in the likes system
        console.log('Like work:', workId);
    }

    showError(message) {
        // Show error message to user
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        alert.style.position = 'fixed';
        alert.style.top = '100px';
        alert.style.right = '20px';
        alert.style.zIndex = '9999';
        alert.style.maxWidth = '400px';
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
        this.isLoading = false;
    }

    // Authentication methods
    checkAuthState() {
        // Check localStorage or Firebase auth state
        const savedUser = localStorage.getItem('portal_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser();
        }
    }

    openLoginModal() {
        // Load and show login modal
        import('./auth.js').then(module => {
            module.AuthSystem.showLoginModal();
        });
    }

    openAdminPanel() {
        if (!this.currentUser || this.currentUser.role !== 'admin') {
            this.openLoginModal();
            return;
        }
        
        if (typeof adminPanel !== 'undefined') {
            adminPanel.show();
        } else {
            console.error('Admin panel not initialized');
        }
    }

    updateUIForLoggedInUser() {
        // Update UI based on user login state
        if (this.currentUser) {
            // Update navigation or show user info
            console.log('User logged in:', this.currentUser.name);
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is configured
    if (typeof firebase === 'undefined') {
        console.warn('Firebase not loaded, using local data only');
    }
    
    // Create and export the main application instance
    window.app = new SekolahPortal();
});