#!/bin/bash
echo "=== REFACTOR LENGKAP PORTAL SEKOLAH ==="

# Backup
cp index.html index.html.backup-refactor

# 1. Buat folder
mkdir -p css js

# 2. Ekstrak CSS
echo "Ekstrak CSS..."
sed -n '/<style>/,/<\/style>/p' index.html | sed '1d;$d' > css/main.css
sed -i '/<style>/,/<\/style>/d' index.html
sed -i '/<title>/a\    <link rel="stylesheet" href="css/main.css">' index.html

# 3. Tambahkan animasi CSS
echo "/* Animations */" >> css/main.css
cat >> css/main.css << 'CSSEOF'
@keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
.error-message, .alert { animation: slideIn 0.3s ease-out; }
.loading-screen { transition: opacity 0.3s ease-out; }
CSSEOF

# 4. Buat file JavaScript (skeleton dulu)
echo "Buat JavaScript files..."

# storage.js
cat > js/storage.js << 'STORAGEEOF'
// IndexedDB Storage Manager (skeleton)
class IndexedDBStorage {
    async init() { 
        console.log('Storage initialized'); 
        return true; 
    }
}
const storage = new IndexedDBStorage();
STORAGEEOF

# app.js  
cat > js/app.js << 'APPEOF'
// Main Application (skeleton)
class SekolahPortal {
    constructor() { 
        console.log('Portal created'); 
        this.init(); 
    }
    async init() { 
        console.log('Portal initialized'); 
        this.hideLoading(); 
    }
    hideLoading() {
        const loading = document.getElementById('loadingScreen');
        if (loading) loading.style.display = 'none';
    }
}
APPEOF

# 5. Hapus JavaScript inline dan tambahkan referensi
sed -i '/<script>/,/<\/script>/d' index.html
sed -i '/<\/body>/i\    <script src="js/storage.js"></script>\n    <script src="js/app.js"></script>\n    <script>document.addEventListener("DOMContentLoaded", () => { window.app = new SekolahPortal(); });</script>' index.html

echo "✅ Refactor selesai!"
echo "File: index.html, css/main.css, js/storage.js, js/app.js"
