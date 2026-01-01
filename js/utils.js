// ===== UTILITY FUNCTIONS =====
const Utils = {
    showAlert: function(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = \`
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: \${type === 'success' ? '#06D6A0' : 
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
                <i class="fas fa-\${type === 'success' ? 'check-circle' : 
                               type === 'warning' ? 'exclamation-triangle' : 
                               type === 'danger' ? 'times-circle' : 'info-circle'}" 
                   style="margin-right: 10px;"></i>
                <span>\${message}</span>
            </div>
        \`;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    },
    
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
};
