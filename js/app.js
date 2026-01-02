// ============================================
// MAIN APPLICATION
// ============================================
class SekolahPortal {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;
        this.isLoading = true;
        this.data = {
            carousel: [],
            works: [],
            gallery: [],
            perpustakaan: [],
            materi: [],
            news: [],
            homeContent: [],
            settings: []
        };
        
        this.init();
    }

    setupAuthListener() {
        document.addEventListener('userLoggedIn', (e) => {
            this.currentUser = e.detail.user;
            this.updateUI();
        });

        document.addEventListener('userLoggedOut', () => {
            this.currentUser = null;
            this.updateUI();
        });
    }

    showError(message) {
        console.error('Error:', message);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef476f;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 10000;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
            ">
                <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
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

    updateUI() {
        const loginBtn = document.querySelector('.login-btn');
        const userMenu = document.querySelector('.user-menu');
        
        if (this.currentUser && userMenu) {
            if (loginBtn) loginBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            const userName = userMenu.querySelector('.user-name');
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    async init() {
        try {
            await storage.init();
            this.hideLoading();
            await this.loadDataFromStorage();
            this.setupAuthListener();
            this.renderNavigation();
            this.renderPage(this.currentPage);
            this.setupEventListeners();
            this.handleHashChange();
            
            console.log('Portal initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Gagal memuat aplikasi. Silakan refresh halaman.');
            this.hideLoading();
        }
    }

    async loadDataFromStorage() {
        try {
            this.data.carousel = await storage.getItems('carousel');
            this.data.works = await storage.getItems('works');
            this.data.perpustakaan = await storage.getItems('perpustakaan');
            this.data.materi = await storage.getItems('materi');
            this.data.news = await storage.getItems('news');
            this.data.homeContent = await storage.getItems('homeContent');
            this.data.settings = await storage.getItems('settings');
            
            if (this.data.carousel.length === 0) {
                await storage.resetToDefaultData();
                await this.loadDataFromStorage();
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-item')) {
                const page = e.target.closest('.nav-item').dataset.page;
                if (page) {
                    this.renderPage(page);
                }
            }
            
            if (e.target.classList.contains('modal-close') || 
                e.target.classList.contains('modal') && e.target.id) {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }

    handleHashChange() {
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.substring(1) || 'home';
            this.renderPage(page);
        });
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${type === 'success' ? '#06D6A0' : 
                            type === 'warning' ? '#FFD166' : 
                            type === 'danger' ? '#EF476F' : '#118AB2'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 9999;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
            ">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                               type === 'warning' ? 'exclamation-triangle' : 
                               type === 'danger' ? 'times-circle' : 'info-circle'}" 
                   style="margin-right: 10px;"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }

    // Method render akan ditambahkan nanti
    renderNavigation() {
        // Placeholder - akan diisi dari kode asli
        console.log('renderNavigation called');
    }

    renderPage(page) {
        // Placeholder - akan diisi dari kode asli
        console.log('renderPage called:', page);
    }

    renderCarousel() {
        // Placeholder
        console.log('renderCarousel called');
    }
}
