#!/bin/bash
echo "=== REFACTOR AMAN BERTAHAP ==="

# 1. Backup lagi
cp index.html index.html.full

# 2. Ekstrak CSS (tapi jangan hapus dari HTML dulu)
sed -n '/<style>/,/<\/style>/p' index.html | sed '1d;$d' > css/main.css

# 3. Buat file JS dengan kode lengkap
# Ekstrak semua JavaScript
sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d' > js/full.js

# 4. Buat index.html baru yang ringkas (TAPI SIMPAN YANG LAMA)
cat > index.html.new << 'HTML_EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sekolah Portal - Sistem Terintegrasi</title>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Local CSS -->
    <link rel="stylesheet" href="css/main.css">
    
    <!-- Cache Control -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
</head>
<body>
    <!-- Loading Screen -->
    <div id="loadingScreen" class="loading-screen">
        <div class="loading-spinner"></div>
        <p>Memuat Portal Sekolah...</p>
    </div>

    <!-- Header Navigation -->
    <nav class="header-nav" id="headerNav"></nav>

    <!-- Main Content -->
    <main id="mainContent"></main>

    <!-- Footer Navigation -->
    <nav class="footer-nav" id="footerNav"></nav>

    <!-- Modals -->
    <div id="loginModal" class="modal"></div>
    <div id="adminModal" class="modal"></div>
    <div id="newsDetailModal" class="modal"></div>

    <!-- JavaScript (sementara satu file dulu) -->
    <script src="js/full.js"></script>
</body>
</html>
HTML_EOF

echo "✓ File baru dibuat: index.html.new"
echo "✓ CSS: css/main.css"
echo "✓ JavaScript: js/full.js (lengkap)"
echo ""
echo "Langkah selanjutnya:"
echo "1. Test index.html.new di lokal"
echo "2. Jika berhasil, ganti index.html"
echo "3. Kemudian pisahkan JavaScript bertahap"
