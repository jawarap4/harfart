// Firebase Configuration
// Replace with your own Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
        
        // Check connection
        const connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
                console.log("Connected to Firebase");
                document.dispatchEvent(new CustomEvent('firebaseConnected'));
            } else {
                console.log("Not connected to Firebase");
                document.dispatchEvent(new CustomEvent('firebaseDisconnected'));
            }
        });
    } else {
        console.warn('Using mock Firebase config. Please update with your actual Firebase config.');
        setupMockFirebase();
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
    setupMockFirebase();
}

function setupMockFirebase() {
    // Mock Firebase for development
    window.firebase = {
        auth: () => ({
            currentUser: null,
            signInWithEmailAndPassword: (email, password) => {
                return new Promise((resolve, reject) => {
                    // Mock authentication
                    const mockUsers = {
                        'admin@sekolah.id': { password: 'admin123', uid: 'admin123', email: 'admin@sekolah.id' },
                        'guru@sekolah.id': { password: 'guru123', uid: 'guru123', email: 'guru@sekolah.id' },
                        'ortu@sekolah.id': { password: 'ortu123', uid: 'ortu123', email: 'ortu@sekolah.id' }
                    };
                    
                    if (mockUsers[email] && mockUsers[email].password === password) {
                        resolve({ user: mockUsers[email] });
                    } else {
                        reject(new Error('Auth failed'));
                    }
                });
            },
            createUserWithEmailAndPassword: () => Promise.reject(new Error('Mock: Sign up disabled')),
            signOut: () => Promise.resolve(),
            onAuthStateChanged: (callback) => {
                // Simulate auth state
                const user = JSON.parse(localStorage.getItem('firebase_user'));
                callback(user);
                return () => {};
            }
        }),
        database: () => ({
            ref: (path) => ({
                set: (data) => {
                    console.log('Mock set:', path, data);
                    localStorage.setItem(`firebase_${path}`, JSON.stringify(data));
                    return Promise.resolve();
                },
                update: (data) => {
                    console.log('Mock update:', path, data);
                    const existing = JSON.parse(localStorage.getItem(`firebase_${path}`) || '{}');
                    localStorage.setItem(`firebase_${path}`, JSON.stringify({...existing, ...data}));
                    return Promise.resolve();
                },
                remove: () => {
                    console.log('Mock remove:', path);
                    localStorage.removeItem(`firebase_${path}`);
                    return Promise.resolve();
                },
                once: (value) => {
                    console.log('Mock once:', path, value);
                    const data = JSON.parse(localStorage.getItem(`firebase_${path}`) || 'null');
                    return Promise.resolve({ val: () => data });
                },
                on: (event, callback) => {
                    console.log('Mock on:', path, event);
                    // Mock real-time updates (polling)
                    const interval = setInterval(() => {
                        const data = JSON.parse(localStorage.getItem(`firebase_${path}`) || 'null');
                        callback({ val: () => data });
                    }, 5000);
                    
                    return () => clearInterval(interval);
                }
            })
        })
    };
}

// Firebase Service
class FirebaseService {
    constructor() {
        this.db = firebase.database();
        this.auth = firebase.auth();
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    init() {
        window.addEventListener('online', () => this.setOnlineStatus(true));
        window.addEventListener('offline', () => this.setOnlineStatus(false));
    }

    setOnlineStatus(status) {
        this.isOnline = status;
        console.log('Firebase Service:', status ? 'Online' : 'Offline');
    }

    // Add more Firebase service methods as needed
}

// Create Firebase service instance
const firebaseService = new FirebaseService();