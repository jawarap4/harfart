// ============================================
// INDEXEDDB STORAGE MANAGER - SOLUSI MOBILE
// ============================================
class IndexedDBStorage {
    constructor() {
        this.dbName = 'SekolahPortalDB';
        this.dbVersion = 3;
        this.db = null;
        this.isInitialized = false;
    }

    async init() {
        return new Promise((resolve, reject) => {
            if (this.isInitialized) return resolve(true);

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.isInitialized = true;
                console.log('IndexedDB initialized successfully');
                resolve(true);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores for all data types
                if (!db.objectStoreNames.contains('carousel')) {
                    db.createObjectStore('carousel', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('works')) {
                    db.createObjectStore('works', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('materi')) {
                    db.createObjectStore('materi', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('news')) {
                    db.createObjectStore('news', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('perpustakaan')) {
                    db.createObjectStore('perpustakaan', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('users')) {
                    db.createObjectStore('users', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('homeContent')) {
                    db.createObjectStore('homeContent', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('comments')) {
                    db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
                }
                
                console.log('IndexedDB stores created');
            };
        });
    }

    getStore(storeName, mode = 'readonly') {
        if (!this.db) throw new Error('Database not initialized');
        const transaction = this.db.transaction([storeName], mode);
        return transaction.objectStore(storeName);
    }

    async createItem(storeName, data) {
        await this.init();
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName, 'readwrite');
            const request = store.add(data);
            
            request.onsuccess = () => resolve(data);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getItems(storeName) {
        await this.init();
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getItem(storeName, id) {
        await this.init();
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async updateItem(storeName, id, updates) {
        await this.init();
        return new Promise(async (resolve, reject) => {
            const item = await this.getItem(storeName, id);
            if (!item) {
                reject(new Error('Item not found'));
                return;
            }
            
            const updatedItem = {
                ...item,
                ...updates,
                updated: new Date().toISOString()
            };
            
            const store = this.getStore(storeName, 'readwrite');
            const request = store.put(updatedItem);
            
            request.onsuccess = () => resolve(updatedItem);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async deleteItem(storeName, id) {
        await this.init();
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName, 'readwrite');
            const request = store.delete(id);
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async clearStore(storeName) {
        await this.init();
        return new Promise((resolve, reject) => {
            const store = this.getStore(storeName, 'readwrite');
            const request = store.clear();
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async resetToDefaultData() {
        try {
            // Bersihkan semua store
            const stores = ['carousel', 'works', 'materi', 'news', 'perpustakaan', 'users', 'homeContent', 'settings', 'comments'];
            
            for (const store of stores) {
                await this.clearStore(store);
            }

            // Tambahkan data default
            const defaultData = {
                carousel: [
                    {
                        id: 1,
                        title: "Selamat Datang di Portal Sekolah Digital",
                        description: "Portal terintegrasi untuk manajemen sekolah modern",
                        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                        active: true,
                        created: new Date().toISOString()
                    },
                    {
                        id: 2,
                        title: "Pendidikan Berkualitas untuk Generasi Emas",
                        description: "Membentuk karakter dan kompetensi siswa",
                        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                        active: true,
                        created: new Date().toISOString()
                    },
                    {
                        id: 3,
                        title: "Teknologi dalam Pendidikan",
                        description: "Memanfaatkan teknologi untuk pembelajaran yang lebih baik",
                        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                        active: true,
                        created: new Date().toISOString()
                    },
                    {
                        id: 4,
                        title: "Ekstrakurikuler dan Pengembangan Bakat",
                        description: "Mengembangkan potensi siswa melalui berbagai kegiatan",
                        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                        active: true,
                        created: new Date().toISOString()
                    }
                ],
                works: [
                    {
                        id: 1,
                        title: "Lukisan Alam Semesta",
                        description: "Lukisan yang menggambarkan keindahan alam semesta dengan teknik cat minyak",
                        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        studentName: "Budi Santoso",
                        class: "XII IPA 1",
                        date: "15 Mar 2024",
                        likes: 24,
                        comments: 8,
                        views: 156,
                        category: "seni",
                        published: true,
                        created: new Date().toISOString()
                    },
                    {
                        id: 2,
                        title: "Esai tentang Pendidikan Karakter",
                        description: "Esai yang membahas pentingnya pendidikan karakter di era digital",
                        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        studentName: "Siti Rahayu",
                        class: "XI IPS 2",
                        date: "10 Mar 2024",
                        likes: 42,
                        comments: 12,
                        views: 289,
                        category: "tulisan",
                        published: true,
                        created: new Date().toISOString()
                    },
                    {
                        id: 3,
                        title: "Robotika sederhana",
                        description: "Proyek robotika menggunakan Arduino untuk tugas sekolah",
                        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        studentName: "Andi Wijaya",
                        class: "X TKR 1",
                        date: "5 Mar 2024",
                        likes: 35,
                        comments: 15,
                        views: 210,
                        category: "teknologi",
                        published: true,
                        created: new Date().toISOString()
                    },
                    {
                        id: 4,
                        title: "Karya Seni daur ulang",
                        description: "Membuat karya seni dari bahan daur ulang plastik",
                        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        studentName: "Dewi Lestari",
                        class: "XII IPS 1",
                        date: "20 Feb 2024",
                        likes: 58,
                        comments: 22,
                        views: 345,
                        category: "seni",
                        published: true,
                        created: new Date().toISOString()
                    }
                ],
                users: [
                    {
                        id: 1,
                        username: "admin",
                        password: "admin123",
                        name: "Administrator",
                        email: "admin@sekolah.id",
                        role: "admin",
                        created: new Date().toISOString()
                    },
                    {
                        id: 2,
                        username: "guru",
                        password: "guru123",
                        name: "Guru Demo",
                        email: "guru@sekolah.id",
                        role: "guru",
                        created: new Date().toISOString()
                    },
                    {
                        id: 3,
                        username: "siswa",
                        password: "siswa123",
                        name: "Siswa Demo",
                        email: "siswa@sekolah.id",
                        role: "siswa",
                        created: new Date().toISOString()
                    }
                ],
                materi: [
                    {
                        id: 1,
                        nama: "Matematika Dasar",
                        penjelasan: "Pengenalan konsep dasar matematika termasuk operasi hitung, pecahan, dan aljabar sederhana."
                    },
                    {
                        id: 2,
                        nama: "Bahasa Indonesia",
                        penjelasan: "Pembelajaran tata bahasa, membaca, menulis, dan berbicara dalam bahasa Indonesia yang baik dan benar."
                    },
                    {
                        id: 3,
                        nama: "IPA Terpadu",
                        penjelasan: "Ilmu Pengetahuan Alam yang mencakup fisika, kimia, dan biologi dalam kehidupan sehari-hari."
                    },
                    {
                        id: 4,
                        nama: "Sejarah Indonesia",
                        penjelasan: "Sejarah perjuangan bangsa Indonesia dari masa kerajaan hingga kemerdekaan."
                    },
                    {
                        id: 5,
                        nama: "Pendidikan Kewarganegaraan",
                        penjelasan: "Pembelajaran tentang hak dan kewajiban sebagai warga negara yang baik."
                    },
                    {
                        id: 6,
                        nama: "Seni Budaya",
                        penjelasan: "Pengenalan berbagai bentuk seni dan budaya daerah di Indonesia."
                    }
                ],
                news: [
                    {
                        id: 1,
                        title: "Olimpiade Sains Nasional 2024",
                        excerpt: "Siswa kita berhasil meraih medali emas dalam Olimpiade Sains Nasional tingkat provinsi.",
                        content: "Dengan bangga kami umumkan bahwa siswa SMA Negeri 1 berhasil meraih medali emas dalam Olimpiade Sains Nasional 2024 tingkat provinsi. Prestasi ini merupakan hasil dari kerja keras dan dedikasi siswa serta pembimbing dalam mempersiapkan kompetisi bergengsi ini.",
                        image: "https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        date: "25 Mar 2024",
                        category: "Prestasi",
                        author: "Admin Sekolah",
                        views: 145
                    },
                    {
                        id: 2,
                        title: "Workshop Teknologi Pendidikan",
                        excerpt: "Guru-guru mengikuti workshop tentang pemanfaatan teknologi dalam pembelajaran digital.",
                        content: "Sebagai upaya meningkatkan kompetensi guru dalam memanfaatkan teknologi, sekolah menyelenggarakan workshop Teknologi Pendidikan selama dua hari.",
                        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        date: "20 Mar 2024",
                        category: "Kegiatan",
                        author: "Tim Kurikulum",
                        views: 98
                    }
                ],
                perpustakaan: [
                    {
                        id: 1,
                        title: "Matematika Dasar untuk SMA",
                        description: "Buku panduan lengkap matematika dasar untuk siswa SMA kelas X, XI, dan XII.",
                        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        author: "Prof. Dr. Ahmad Surya",
                        publisher: "Penerbit Erlangga",
                        year: "2023",
                        pages: 350,
                        isbn: "978-602-425-012-3",
                        category: "Matematika"
                    },
                    {
                        id: 2,
                        title: "Fisika Modern",
                        description: "Buku fisika modern dengan pendekatan kontekstual untuk pembelajaran abad 21.",
                        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        author: "Dr. Rini Wijayanti",
                        publisher: "Penerbit Yudhistira",
                        year: "2022",
                        pages: 420,
                        isbn: "978-979-746-789-1",
                        category: "Fisika"
                    }
                ],
                homeContent: [
                    {
                        id: 1,
                        heroTitle: "Selamat Datang di Portal Sekolah Digital",
                        heroSubtitle: "Platform terintegrasi untuk manajemen sekolah modern yang mendukung pembelajaran abad 21",
                        features: [
                            {
                                icon: "fas fa-graduation-cap",
                                title: "Pembelajaran Digital",
                                description: "Akses materi pembelajaran kapan saja dan di mana saja dengan sistem pembelajaran terintegrasi"
                            },
                            {
                                icon: "fas fa-users",
                                title: "Kolaborasi Siswa",
                                description: "Tempat berbagi karya dan kolaborasi antar siswa dalam berbagai proyek pembelajaran"
                            },
                            {
                                icon: "fas fa-newspaper",
                                title: "Informasi Terkini",
                                description: "Selalu update dengan berita dan informasi terbaru dari sekolah"
                            }
                        ],
                        stats: {
                            totalStudents: 1250,
                            totalTeachers: 85,
                            activePrograms: 12,
                            achievementCount: 45
                        }
                    }
                ],
                settings: [
                    {
                        id: 1,
                        siteName: "Portal Sekolah Digital",
                        whatsappGroup: "https://chat.whatsapp.com/IWWIrYfYQZZGafHdJJcfga"
                    }
                ]
            };

            // Insert semua data default
            for (const [storeName, items] of Object.entries(defaultData)) {
                for (const item of items) {
                    await this.createItem(storeName, item);
                }
            }

            console.log('Default data inserted successfully');
            return true;
        } catch (error) {
            console.error('Error resetting to default data:', error);
            return false;
        }
    }

    async authenticate(username, password) {
        const users = await this.getItems('users');
        const user = users.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password
        );
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            await this.createItem('currentUser', userWithoutPassword);
            return userWithoutPassword;
        }
        return null;
    }

    async logout() {
        await this.clearStore('currentUser');
    }

    async getCurrentUser() {
        const users = await this.getItems('currentUser');
        return users.length > 0 ? users[0] : null;
    }

    async exportData() {
        const data = {};
        const stores = ['carousel', 'works', 'materi', 'news', 'perpustakaan', 'homeContent', 'settings'];
        
        for (const store of stores) {
            data[store] = await this.getItems(store);
        }
        
        return JSON.stringify(data, null, 2);
    }

    async importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            for (const [storeName, items] of Object.entries(data)) {
                await this.clearStore(storeName);
                for (const item of items) {
                    await this.createItem(storeName, item);
                }
            }
            
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }

    async generateId(storeName) {
        const items = await this.getItems(storeName);
        const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0);
        return maxId + 1;
    }
}

// Buat instance global
const storage = new IndexedDBStorage();
