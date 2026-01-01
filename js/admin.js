/**
 * AdminPanel - Content Management Interface
 * Allows admin users to manage carousel, works, gallery, and library content
 */

class AdminPanel {
    constructor() {
        this.currentTab = 'carousel';
        this.initModal();
    }

    static getInstance() {
        if (!window.adminPanelInstance) {
            window.adminPanelInstance = new AdminPanel();
        }
        return window.adminPanelInstance;
    }

    static show() {
        const instance = AdminPanel.getInstance();
        instance.show();
    }

    initModal() {
        const modal = document.getElementById('adminModal');
        if (!modal) return;

        modal.innerHTML = `
            <div class="modal-content admin-modal-content">
                <div class="modal-header">
                    <h2>Panel Admin</h2>
                    <button class="close-modal" aria-label="Close">&times;</button>
                </div>

                <div class="admin-tabs">
                    <button class="admin-tab-btn active" data-tab="carousel">
                        <i class="fas fa-images"></i> Carousel
                    </button>
                    <button class="admin-tab-btn" data-tab="works">
                        <i class="fas fa-palette"></i> Karya
                    </button>
                    <button class="admin-tab-btn" data-tab="gallery">
                        <i class="fas fa-photo-video"></i> Galeri
                    </button>
                    <button class="admin-tab-btn" data-tab="library">
                        <i class="fas fa-book"></i> Perpustakaan
                    </button>
                </div>

                <div class="admin-tab-content">
                    <!-- Tab content will be rendered here -->
                </div>
            </div>
        `;

        this.setupEventListeners(modal);
    }

    setupEventListeners(modal) {
        // Close button
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn?.addEventListener('click', () => this.close());

        // Tab buttons
        const tabBtns = modal.querySelectorAll('.admin-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.admin-tab-btn').dataset.tab, modal);
            });
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
    }

    switchTab(tabName, modal) {
        this.currentTab = tabName;

        // Update active tab button
        const tabBtns = modal.querySelectorAll('.admin-tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Render tab content
        this.renderTabContent(tabName, modal);
    }

    renderTabContent(tabName, modal) {
        const contentArea = modal.querySelector('.admin-tab-content');
        
        switch(tabName) {
            case 'carousel':
                contentArea.innerHTML = this.renderCarouselTab();
                break;
            case 'works':
                contentArea.innerHTML = this.renderWorksTab();
                break;
            case 'gallery':
                contentArea.innerHTML = this.renderGalleryTab();
                break;
            case 'library':
                contentArea.innerHTML = this.renderLibraryTab();
                break;
        }

        this.attachTabEventListeners(tabName, contentArea);
    }

    renderCarouselTab() {
        return `
            <div class="admin-tab-section">
                <h3>Kelola Carousel</h3>
                <div class="admin-form">
                    <input type="text" placeholder="Judul Carousel" id="carouselTitle" />
                    <textarea placeholder="Deskripsi Carousel" id="carouselDesc"></textarea>
                    <input type="file" id="carouselImage" accept="image/*" />
                    <button class="btn-add" id="addCarouselBtn">
                        <i class="fas fa-plus"></i> Tambah Carousel
                    </button>
                </div>
                <div id="carouselList" class="admin-item-list">
                    <!-- Items will be loaded here -->
                </div>
            </div>
        `;
    }

    renderWorksTab() {
        return `
            <div class="admin-tab-section">
                <h3>Kelola Karya Siswa</h3>
                <div class="admin-form">
                    <input type="text" placeholder="Judul Karya" id="workTitle" />
                    <textarea placeholder="Deskripsi Karya" id="workDesc"></textarea>
                    <select id="workCategory">
                        <option value="">Pilih Kategori</option>
                        <option value="seni">Seni</option>
                        <option value="tulisan">Tulisan</option>
                        <option value="proyek">Proyek</option>
                    </select>
                    <input type="file" id="workImage" accept="image/*" />
                    <button class="btn-add" id="addWorkBtn">
                        <i class="fas fa-plus"></i> Tambah Karya
                    </button>
                </div>
                <div id="worksList" class="admin-item-list">
                    <!-- Items will be loaded here -->
                </div>
            </div>
        `;
    }

    renderGalleryTab() {
        return `
            <div class="admin-tab-section">
                <h3>Kelola Galeri</h3>
                <div class="admin-form">
                    <input type="text" placeholder="Judul Galeri" id="galleryTitle" />
                    <textarea placeholder="Deskripsi Galeri" id="galleryDesc"></textarea>
                    <input type="file" id="galleryImage" accept="image/*" multiple />
                    <button class="btn-add" id="addGalleryBtn">
                        <i class="fas fa-plus"></i> Tambah Galeri
                    </button>
                </div>
                <div id="galleryList" class="admin-item-list">
                    <!-- Items will be loaded here -->
                </div>
            </div>
        `;
    }

    renderLibraryTab() {
        return `
            <div class="admin-tab-section">
                <h3>Kelola Perpustakaan</h3>
                <div class="admin-form">
                    <input type="text" placeholder="Judul Buku" id="libraryTitle" />
                    <textarea placeholder="Deskripsi Buku" id="libraryDesc"></textarea>
                    <input type="text" placeholder="Penulis" id="libraryAuthor" />
                    <input type="file" id="libraryImage" accept="image/*" />
                    <input type="file" id="libraryFile" accept=".pdf" />
                    <button class="btn-add" id="addLibraryBtn">
                        <i class="fas fa-plus"></i> Tambah Buku
                    </button>
                </div>
                <div id="libraryList" class="admin-item-list">
                    <!-- Items will be loaded here -->
                </div>
            </div>
        `;
    }

    attachTabEventListeners(tabName, contentArea) {
        switch(tabName) {
            case 'carousel':
                contentArea.querySelector('#addCarouselBtn')?.addEventListener('click', () => this.addItem('carousel'));
                break;
            case 'works':
                contentArea.querySelector('#addWorkBtn')?.addEventListener('click', () => this.addItem('works'));
                break;
            case 'gallery':
                contentArea.querySelector('#addGalleryBtn')?.addEventListener('click', () => this.addItem('gallery'));
                break;
            case 'library':
                contentArea.querySelector('#addLibraryBtn')?.addEventListener('click', () => this.addItem('library'));
                break;
        }
    }

    async addItem(type) {
        console.log(`Adding item to ${type}`);
        // This would typically send data to the backend
        alert(`Item ditambahkan ke ${type} (fitur backend belum terintegrasi)`);
    }

    show() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.add('active');
            this.renderTabContent('carousel', modal);
        }
    }

    close() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// Initialize admin panel instance globally
const adminPanel = AdminPanel.getInstance();
