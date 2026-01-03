/* ===========================================
   notifications.js - Modal & Notification System
   Shared across all pages
   =========================================== */

/**
 * Show a notification/alert modal
 * @param {string} message - Message to display (supports \n for line breaks)
 */
function showNotification(message) {
    const msgEl = document.getElementById('notification-message');
    const modal = document.getElementById('custom-notification');
    if (msgEl) {
        msgEl.innerHTML = message.replace(/\n/g, '<br>');
    }
    if (modal) modal.classList.add('active');
}

/**
 * Hide the notification modal
 */
function hideNotification() {
    const modal = document.getElementById('custom-notification');
    if (modal) modal.classList.remove('active');
}

/**
 * Open the info/help modal
 */
function openInfoModal() {
    const modal = document.getElementById('info-modal');
    if (modal) modal.classList.add('active');
}

/**
 * Close the info/help modal
 */
function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    if (modal) modal.classList.remove('active');
}

/**
 * Show a toast notification (non-blocking)
 * @param {string} message 
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in ms
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 300;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;
        document.body.appendChild(container);
    }

    const colors = {
        success: { bg: '#2E7D32', icon: '✅' },
        error: { bg: '#C62828', icon: '❌' },
        warning: { bg: '#F57C00', icon: '⚠️' },
        info: { bg: '#1976D2', icon: 'ℹ️' }
    };

    const config = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${config.bg};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    toast.innerHTML = `<span>${config.icon}</span><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Create a confirmation dialog
 * @param {string} title 
 * @param {string} message 
 * @returns {Promise<boolean>}
 */
function confirm(title, message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <div class="modal-icon" style="background-color: rgba(255, 180, 171, 0.2); color: #FFB4AB;">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-outlined" id="confirm-cancel">Batal</button>
                    <button class="btn btn-filled" id="confirm-ok">Ya</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector('#confirm-cancel').onclick = () => {
            overlay.remove();
            resolve(false);
        };

        overlay.querySelector('#confirm-ok').onclick = () => {
            overlay.remove();
            resolve(true);
        };
    });
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export for global use
window.Notifications = {
    show: showNotification,
    hide: hideNotification,
    openInfo: openInfoModal,
    closeInfo: closeInfoModal,
    toast: showToast,
    confirm: confirm
};

// Also expose as global functions for backward compatibility
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.openInfoModal = openInfoModal;
window.closeInfoModal = closeInfoModal;
