// Audit Trail System
class AuditTrail {
    constructor() {
        this.auditLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
        this.maxLogs = 100;
        this.init();
    }

    init() {
        // Listen for authentication events
        document.addEventListener('userLoggedIn', (e) => {
            this.log('LOGIN', 'User logged in', e.detail.user);
        });

        document.addEventListener('userLoggedOut', (e) => {
            this.log('LOGOUT', 'User logged out', e.detail.user);
        });

        // Listen for data access events
        document.addEventListener('dataAccessed', (e) => {
            this.log('DATA_ACCESS', e.detail.action, e.detail.user, e.detail.data);
        });

        // Listen for admin actions
        document.addEventListener('adminAction', (e) => {
            this.log('ADMIN_ACTION', e.detail.action, e.detail.user, e.detail.details);
        });
    }

    log(action, description, user, metadata = null) {
        const logEntry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            action: action,
            description: description,
            user: {
                id: user?.id || 'anonymous',
                name: user?.name || 'Unknown',
                role: user?.role || 'guest'
            },
            ip: this.getClientIP(),
            userAgent: navigator.userAgent,
            metadata: metadata
        };

        // Add to logs array
        this.auditLogs.unshift(logEntry);

        // Keep only last maxLogs entries
        if (this.auditLogs.length > this.maxLogs) {
            this.auditLogs = this.auditLogs.slice(0, this.maxLogs);
        }

        // Save to localStorage
        localStorage.setItem('audit_logs', JSON.stringify(this.auditLogs));

        // Send to server if available
        this.sendToServer(logEntry);

        console.log('Audit Log:', logEntry);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getClientIP() {
        // In a real application, this would come from the server
        return localStorage.getItem('client_ip') || 'unknown';
    }

    async sendToServer(logEntry) {
        // In production, send to your backend or Firebase
        if (typeof firebase !== 'undefined' && firebase.database) {
            try {
                await firebase.database().ref('audit_logs').push(logEntry);
            } catch (error) {
                console.error('Failed to send audit log to server:', error);
            }
        }
    }

    getLogs(filter = {}) {
        let logs = [...this.auditLogs];

        if (filter.userId) {
            logs = logs.filter(log => log.user.id === filter.userId);
        }

        if (filter.action) {
            logs = logs.filter(log => log.action === filter.action);
        }

        if (filter.startDate) {
            logs = logs.filter(log => new Date(log.timestamp) >= new Date(filter.startDate));
        }

        if (filter.endDate) {
            logs = logs.filter(log => new Date(log.timestamp) <= new Date(filter.endDate));
        }

        return logs;
    }

    generateReport(type = 'daily') {
        const now = new Date();
        let startDate;

        switch (type) {
            case 'daily':
                startDate = new Date(now.setDate(now.getDate() - 1));
                break;
            case 'weekly':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'monthly':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            default:
                startDate = new Date(now.setDate(now.getDate() - 1));
        }

        const logs = this.getLogs({ startDate: startDate.toISOString() });
        
        const report = {
            period: type,
            startDate: startDate.toISOString(),
            endDate: new Date().toISOString(),
            totalLogs: logs.length,
            actions: this.countActions(logs),
            users: this.countUsers(logs),
            timeline: this.createTimeline(logs)
        };

        return report;
    }

    countActions(logs) {
        const actions = {};
        logs.forEach(log => {
            actions[log.action] = (actions[log.action] || 0) + 1;
        });
        return actions;
    }

    countUsers(logs) {
        const users = {};
        logs.forEach(log => {
            const userId = log.user.id;
            if (!users[userId]) {
                users[userId] = {
                    name: log.user.name,
                    role: log.user.role,
                    count: 0,
                    lastActivity: log.timestamp
                };
            }
            users[userId].count++;
            if (new Date(log.timestamp) > new Date(users[userId].lastActivity)) {
                users[userId].lastActivity = log.timestamp;
            }
        });
        return users;
    }

    createTimeline(logs) {
        const timeline = [];
        const hours = {};
        
        logs.forEach(log => {
            const hour = new Date(log.timestamp).getHours();
            hours[hour] = (hours[hour] || 0) + 1;
        });
        
        for (let i = 0; i < 24; i++) {
            timeline.push({
                hour: i,
                count: hours[i] || 0
            });
        }
        
        return timeline;
    }

    clearOldLogs(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        this.auditLogs = this.auditLogs.filter(log => 
            new Date(log.timestamp) > cutoffDate
        );
        
        localStorage.setItem('audit_logs', JSON.stringify(this.auditLogs));
        return this.auditLogs.length;
    }

    exportToCSV() {
        const logs = this.auditLogs;
        let csv = 'Timestamp,Action,Description,User Name,User Role,IP Address\n';
        
        logs.forEach(log => {
            const row = [
                log.timestamp,
                log.action,
                `"${log.description.replace(/"/g, '""')}"`,
                log.user.name,
                log.user.role,
                log.ip
            ].join(',');
            
            csv += row + '\n';
        });
        
        return csv;
    }
}

// Initialize audit trail system
const auditTrail = new AuditTrail();