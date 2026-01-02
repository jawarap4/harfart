// ============================================
// INDEXEDDB STORAGE MANAGER
// ============================================
class IndexedDBStorage {
    constructor() {
        this.dbName = 'SekolahPortalDB';
        this.dbVersion = 3;
        this.db = null;
        this.isInitialized = false;
    }

    async init() {
        console.log('IndexedDB initializing...');
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
                
                // Create object stores
                const stores = ['carousel', 'works', 'materi', 'news', 'perpustakaan', 
                              'users', 'homeContent', 'settings', 'comments'];
                
                stores.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        if (storeName === 'comments') {
                            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                        } else {
                            db.createObjectStore(storeName, { keyPath: 'id' });
                        }
                    }
                });
                
                console.log('IndexedDB stores created');
            };
        });
    }

    // Basic CRUD methods
    async getItems(storeName) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async createItem(storeName, data) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);
            
            request.onsuccess = () => resolve(data);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // Authentication
    async authenticate(username, password) {
        const users = await this.getItems('users');
        const user = users.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password
        );
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            return userWithoutPassword;
        }
        return null;
    }

    async getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    async logout() {
        localStorage.removeItem('currentUser');
    }
}

// Create global instance
const storage = new IndexedDBStorage();
