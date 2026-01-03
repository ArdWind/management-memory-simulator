/* ===========================================
   utils.js - Shared Utility Functions
   =========================================== */

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format nanoseconds to human readable format
 * @param {number} ns - Nanoseconds
 * @returns {string}
 */
function formatAccessTime(ns) {
    if (ns < 1000) return `${ns} ns`;
    if (ns < 1000000) return `${(ns / 1000).toFixed(1)} µs`;
    if (ns < 1000000000) return `${(ns / 1000000).toFixed(1)} ms`;
    return `${(ns / 1000000000).toFixed(2)} s`;
}

/**
 * Format bytes to human readable format
 * @param {number} bytes 
 * @returns {string}
 */
function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Generate a random color from process palette
 * @param {number} index - Process index (1-8)
 * @returns {string} CSS color value
 */
function getProcessColor(index) {
    const colors = [
        '#4FC3F7', // Light Blue
        '#81C784', // Green
        '#FF8A65', // Orange
        '#BA68C8', // Purple
        '#FFD54F', // Yellow
        '#4DD0E1', // Cyan
        '#F48FB1', // Pink
        '#AED581'  // Light Green
    ];
    return colors[(index - 1) % colors.length];
}

/**
 * Generate a unique ID
 * @returns {string}
 */
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function calls
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Clamp a number between min and max
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Export for global use
window.Utils = {
    sleep,
    formatAccessTime,
    formatBytes,
    getProcessColor,
    generateId,
    debounce,
    clamp
};
