#!/bin/bash
echo "Monitoring portal status..."

# Test HTTP status
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://jawarap4.github.io/harfart/)
echo "HTTP Status: $STATUS"

# Test file accessibility
echo "Testing file access:"
curl -s https://jawarap4.github.io/harfart/css/main.css | head -1
curl -s https://jawarap4.github.io/harfart/js/app.js | head -1

# Check console errors (via simple test)
echo -e "\nJika ada error di console, cek:"
echo "1. Buka DevTools (F12)"
echo "2. Lihat tab Console"
echo "3. Unregister Service Worker jika ada masalah"
