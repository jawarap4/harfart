// ============================================
// STORAGE MODULE (IndexedDB Backend)
// ============================================
const storage = (function() {
    const DB_NAME = 'SekolahPortalDB';
    const DB_VERSION = 1;
    let db = null;
    let isInitialized = false;
    let initPromise = null;

    // Database schema
    const STORES = {
        USERS: 'users',
        CAROUSEL: 'carousel',
        WORKS: 'works',
        NEWS: 'news',
        ANNOUNCEMENTS: 'announcements'
    };

    // Initialize IndexedDB
    const init = async function() {
        // Return existing promise if initialization is in progress
        if (initPromise) {
            return initPromise;
        }

        initPromise = (async () => {
            if (isInitialized) {
                console.log('IndexedDB already initialized');
                return;
            }

            console.log('IndexedDB initializing...');

            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onerror = function(event) {
                    console.error('IndexedDB error:', event.target.error);
                    reject(new Error('Failed to open database'));
                };

                request.onsuccess = function(event) {
                    db = event.target.result;
                    isInitialized = true;
                    console.log('IndexedDB initialized successfully');
                    resolve();
                };

                request.onupgradeneeded = function(event) {
                    const db = event.target.result;
                    console.log('Database upgrade needed, creating stores...');

                    // Create object stores if they don't exist
                    Object.values(STORES).forEach(storeName => {
                        if (!db.objectStoreNames.contains(storeName)) {
                            const store = db.createObjectStore(storeName, {
                                keyPath: 'id',
                                autoIncrement: true
                            });
                            // Create indexes
                            store.createIndex('active', 'active', { unique: false });
                            store.createIndex('createdAt', 'createdAt', { unique: false });
                            console.log(`Created store: ${storeName}`);
                        }
                    });

                    // Add default users
                    const transaction = event.target.transaction;
                    const userStore = transaction.objectStore(STORES.USERS);
                    
                    const defaultUsers = [
                        {
                            username: "admin@sekolah.id",
                            email: "admin@sekolah.id",
                            password: "admin123",
                            name: "Administrator",
                            role: "admin",
                            createdAt: new Date().toISOString(),
                            active: true
                        },
                        {
                            username: "guru@sekolah.id",
                            email: "guru@sekolah.id",
                            password: "guru123",
                            name: "Guru Demo",
                            role: "guru",
                            createdAt: new Date().toISOString(),
                            active: true
                        },
                        {
                            username: "ortu@sekolah.id",
                            email: "ortu@sekolah.id",
                            password: "ortu123",
                            name: "Orang Tua Demo",
                            role: "ortu",
                            createdAt: new Date().toISOString(),
                            active: true
                        }
                    ];

                    defaultUsers.forEach(user => {
                        userStore.add(user);
                    });
                };
            });
        })();

        return initPromise;
    };

    // Helper function to get object store
    const getStore = function(storeName, mode = 'readonly') {
        if (!db) {
            throw new Error('Database not initialized. Call init() first.');
        }
        
        const transaction = db.transaction([storeName], mode);
        return transaction.objectStore(storeName);
    };

    // CRUD Operations
    const getItems = async function(storeName, filter = {}) {
        await init(); // Ensure DB is initialized
        
        return new Promise((resolve, reject) => {
            try {
                const store = getStore(storeName);
                const request = store.getAll();
                
                request.onsuccess = function() {
                    let items = request.result || [];
                    
                    // Apply filters if any
                    if (Object.keys(filter).length > 0) {
                        items = items.filter(item => {
                            return Object.keys(filter).every(key => {
                                return item[key] === filter[key];
                            });
                        });
                    }
                    
                    resolve(items);
                };
                
                request.onerror = function(event) {
                    reject(new Error('Failed to get items: ' + event.target.error));
                };
            } catch (error) {
                reject(error);
            }
        });
    };

    const createItem = async function(storeName, item) {
        await init();
        
        return new Promise((resolve, reject) => {
            try {
                const store = getStore(storeName, 'readwrite');
                const timestamp = new Date().toISOString();
                
                const itemToAdd = {
                    ...item,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                    active: item.active !== undefined ? item.active : true
                };
                
                const request = store.add(itemToAdd);
                
                request.onsuccess = function() {
                    resolve({
                        id: request.result,
                        ...itemToAdd
                    });
                };
                
                request.onerror = function(event) {
                    reject(new Error('Failed to create item: ' + event.target.error));
                };
            } catch (error) {
                reject(error);
            }
        });
    };

    const updateItem = async function(storeName, id, updates) {
        await init();
        
        return new Promise((resolve, reject) => {
            try {
                const store = getStore(storeName, 'readwrite');
                
                // First get the item
                const getRequest = store.get(id);
                
                getRequest.onsuccess = function() {
                    const item = getRequest.result;
                    
                    if (!item) {
                        reject(new Error('Item not found'));
                        return;
                    }
                    
                    // Update the item
                    const updatedItem = {
                        ...item,
                        ...updates,
                        updatedAt: new Date().toISOString()
                    };
                    
                    const putRequest = store.put(updatedItem);
                    
                    putRequest.onsuccess = function() {
                        resolve(updatedItem);
                    };
                    
                    putRequest.onerror = function(event) {
                        reject(new Error('Failed to update item: ' + event.target.error));
                    };
                };
                
                getRequest.onerror = function(event) {
                    reject(new Error('Failed to get item: ' + event.target.error));
                };
            } catch (error) {
                reject(error);
            }
        });
    };

    const deleteItem = async function(storeName, id) {
        await init();
        
        return new Promise((resolve, reject) => {
            try {
                const store = getStore(storeName, 'readwrite');
                const request = store.delete(id);
                
                request.onsuccess = function() {
                    resolve(true);
                };
                
                request.onerror = function(event) {
                    reject(new Error('Failed to delete item: ' + event.target.error));
                };
            } catch (error) {
                reject(error);
            }
        });
    };

    // User Management
    const getCurrentUser = async function() {
        try {
            const user = localStorage.getItem('portal_user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    };

    const setCurrentUser = async function(user) {
        try {
            if (user) {
                localStorage.setItem('portal_user', JSON.stringify(user));
            } else {
                localStorage.removeItem('portal_user');
            }
            return true;
        } catch (error) {
            console.error('Error setting current user:', error);
            return false;
        }
    };

    const login = async function(email, password) {
        try {
            const users = await getItems(STORES.USERS, { email, active: true });
            
            if (users.length === 0) {
                throw new Error('Email atau password salah');
            }
            
            const user = users[0];
            
            // Check password
            if (user.password !== password) {
                throw new Error('Email atau password salah');
            }
            
            // Remove password from user object before storing
            const { password: _, ...userWithoutPassword } = user;
            
            // Store in localStorage
            await setCurrentUser(userWithoutPassword);
            
            return userWithoutPassword;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async function() {
        try {
            await setCurrentUser(null);
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    };

    // Debug and maintenance
    const clearDatabase = async function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(DB_NAME);
            
            request.onsuccess = function() {
                console.log('Database deleted successfully');
                db = null;
                isInitialized = false;
                initPromise = null;
                resolve();
            };
            
            request.onerror = function(event) {
                reject(new Error('Failed to delete database: ' + event.target.error));
            };
        });
    };

    const exportData = async function() {
        await init();
        
        const exportObj = {};
        
        for (const storeName of Object.values(STORES)) {
            exportObj[storeName] = await getItems(storeName);
        }
        
        return exportObj;
    };

    return {
        init,
        getItems,
        createItem,
        updateItem,
        deleteItem,
        getCurrentUser,
        setCurrentUser,
        login,
        logout,
        clearDatabase,
        exportData,
        
        // Store names (optional, for convenience)
        STORES
    };
})();