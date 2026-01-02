// memory-leak.js

// --- CONSTANTS ---
const TOTAL_MEMORY_KB = 256;
const BLOCK_SIZE_KB = 4;
const TOTAL_BLOCKS = 64; // 256 / 4 = 64 blocks
const CHART_MAX_POINTS = 20;

// Block states: 0 = free, 1 = allocated, 2 = leaked
let memoryBlocks = [];
let usedMemory = 0;
let leakedMemory = 0;
let leakCount = 0;
let timeElapsed = 0;
let chartData = { labels: [], data: [] };

// Colors
const COLORS = {
    free: '#333538',
    freeBorder: '#44464E',
    allocated: '#81C784',
    allocatedBorder: '#388E3C',
    leaked: '#EF5350',
    leakedBorder: '#C62828'
};

/**
 * Initialize application
 */
function initialize() {
    memoryBlocks = Array(TOTAL_BLOCKS).fill(0);
    usedMemory = 0;
    leakedMemory = 0;
    leakCount = 0;
    timeElapsed = 0;
    chartData = { labels: [], data: [] };

    renderMemoryBlocks();
    updateStats();
    renderChart();
    addAlert('info', 'Simulator ready. Click "Allocate Memory" to start.');
}

/**
 * Render memory blocks grid with inline styles
 */
function renderMemoryBlocks() {
    const container = document.getElementById('memory-blocks');
    if (!container) return;
    container.innerHTML = '';

    memoryBlocks.forEach((state, index) => {
        const div = document.createElement('div');

        let bgColor, borderColor;
        if (state === 0) {
            bgColor = COLORS.free;
            borderColor = COLORS.freeBorder;
        } else if (state === 1) {
            bgColor = COLORS.allocated;
            borderColor = COLORS.allocatedBorder;
        } else {
            bgColor = COLORS.leaked;
            borderColor = COLORS.leakedBorder;
        }

        div.style.cssText = `
            aspect-ratio: 1;
            border-radius: 6px;
            border: 2px solid ${borderColor};
            background-color: ${bgColor};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            ${state === 2 ? 'animation: pulse 1s infinite;' : ''}
        `;

        div.onmouseenter = () => { div.style.transform = 'scale(1.15)'; div.style.zIndex = '10'; };
        div.onmouseleave = () => { div.style.transform = 'scale(1)'; div.style.zIndex = '1'; };

        const stateText = state === 0 ? 'Free' : (state === 1 ? 'Allocated' : 'Leaked');
        div.title = `Block ${index} (${BLOCK_SIZE_KB} KB) | ${stateText}`;

        container.appendChild(div);
    });
}

/**
 * Allocate memory - allocate random blocks
 */
function allocateMemory() {
    const freeBlocks = memoryBlocks.map((s, i) => s === 0 ? i : -1).filter(i => i >= 0);

    if (freeBlocks.length === 0) {
        showNotification('⚠️ Tidak ada blok memori yang tersedia!');
        addAlert('error', 'Memory full! Cannot allocate more blocks.');
        return;
    }

    // Allocate 1-5 random blocks
    const toAllocate = Math.min(Math.floor(Math.random() * 5) + 1, freeBlocks.length);

    for (let i = 0; i < toAllocate; i++) {
        const randomIdx = Math.floor(Math.random() * freeBlocks.length);
        const blockIdx = freeBlocks.splice(randomIdx, 1)[0];
        memoryBlocks[blockIdx] = 1;
        usedMemory += BLOCK_SIZE_KB;
    }

    timeElapsed++;
    updateChart();
    renderMemoryBlocks();
    updateStats();

    addAlert('info', `✅ Allocated ${toAllocate * BLOCK_SIZE_KB} KB (${toAllocate} blocks)`);
    showNotification(`✅ Berhasil mengalokasikan ${toAllocate * BLOCK_SIZE_KB} KB`);
}

/**
 * Simulate memory leak - convert allocated blocks to leaked
 */
function simulateLeak() {
    const allocatedBlocks = memoryBlocks.map((s, i) => s === 1 ? i : -1).filter(i => i >= 0);

    if (allocatedBlocks.length === 0) {
        // If no allocated blocks, allocate some first then leak them
        const freeBlocks = memoryBlocks.map((s, i) => s === 0 ? i : -1).filter(i => i >= 0);
        if (freeBlocks.length < 3) {
            showNotification('⚠️ Tidak cukup memori untuk disimulasikan!');
            return;
        }

        // Allocate and immediately leak 3 blocks
        for (let i = 0; i < 3; i++) {
            const randomIdx = Math.floor(Math.random() * freeBlocks.length);
            const blockIdx = freeBlocks.splice(randomIdx, 1)[0];
            memoryBlocks[blockIdx] = 2; // directly leaked
            leakedMemory += BLOCK_SIZE_KB;
            leakCount++;
        }
    } else {
        // Convert 1-3 allocated blocks to leaked
        const toConvert = Math.min(Math.floor(Math.random() * 3) + 1, allocatedBlocks.length);

        for (let i = 0; i < toConvert; i++) {
            const randomIdx = Math.floor(Math.random() * allocatedBlocks.length);
            const blockIdx = allocatedBlocks.splice(randomIdx, 1)[0];
            memoryBlocks[blockIdx] = 2; // leaked
            leakedMemory += BLOCK_SIZE_KB;
            leakCount++;
        }
    }

    timeElapsed++;
    updateChart();
    renderMemoryBlocks();
    updateStats();

    addAlert('error', `🐛 Memory leak detected! ${leakCount} leaks (${leakedMemory} KB total)`);
    showNotification(`🐛 Memory leak terdeteksi! Total: ${leakedMemory} KB`);
}

/**
 * Garbage collect - free leaked memory
 */
function garbageCollect() {
    let freedCount = 0;
    let freedMemory = 0;

    memoryBlocks.forEach((state, idx) => {
        if (state === 2) { // leaked
            memoryBlocks[idx] = 0;
            freedCount++;
            freedMemory += BLOCK_SIZE_KB;
            usedMemory = Math.max(0, usedMemory - BLOCK_SIZE_KB);
        }
    });

    if (freedCount === 0) {
        showNotification('ℹ️ Tidak ada memory leak untuk dibersihkan');
        return;
    }

    leakedMemory = 0;
    leakCount = 0;

    timeElapsed++;
    updateChart();
    renderMemoryBlocks();
    updateStats();

    addAlert('info', `🧹 Garbage collected! Freed ${freedMemory} KB (${freedCount} blocks)`);
    showNotification(`🧹 Berhasil membersihkan ${freedMemory} KB`);
}

/**
 * Reset simulation
 */
function resetSimulation() {
    initialize();
    showNotification('🔄 Simulasi telah direset');
}

/**
 * Update statistics display
 */
function updateStats() {
    const totalMemoryEl = document.getElementById('total-memory');
    const usedMemoryEl = document.getElementById('used-memory');
    const leakedMemoryEl = document.getElementById('leaked-memory');
    const freeMemoryEl = document.getElementById('free-memory');
    const leakCountEl = document.getElementById('leak-count');

    // Calculate actual used memory (allocated + leaked)
    const allocatedCount = memoryBlocks.filter(s => s === 1).length;
    const leakedCount = memoryBlocks.filter(s => s === 2).length;
    const freeCount = memoryBlocks.filter(s => s === 0).length;

    const actualUsed = (allocatedCount + leakedCount) * BLOCK_SIZE_KB;
    const actualLeaked = leakedCount * BLOCK_SIZE_KB;
    const actualFree = freeCount * BLOCK_SIZE_KB;

    if (totalMemoryEl) totalMemoryEl.textContent = `${TOTAL_MEMORY_KB} KB`;
    if (usedMemoryEl) usedMemoryEl.textContent = `${actualUsed} KB`;
    if (leakedMemoryEl) leakedMemoryEl.textContent = `${actualLeaked} KB`;
    if (freeMemoryEl) freeMemoryEl.textContent = `${actualFree} KB`;
    if (leakCountEl) leakCountEl.textContent = leakedCount.toString();
}

/**
 * Render simple chart using canvas
 */
function renderChart() {
    const canvas = document.getElementById('memory-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth - 48;
    const height = 250;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#1D1B20';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#44464E';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 10, y);
        ctx.stroke();

        // Y-axis labels
        const label = TOTAL_MEMORY_KB - (TOTAL_MEMORY_KB / 4) * i;
        ctx.fillStyle = '#8E9099';
        ctx.font = '11px Roboto';
        ctx.fillText(`${label}`, 5, y + 4);
    }

    // Draw data if exists
    if (chartData.data.length > 1) {
        const dataPoints = chartData.data;
        const xStep = (width - 50) / (CHART_MAX_POINTS - 1);

        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = '#FFB74D';
        ctx.lineWidth = 2;

        dataPoints.forEach((value, i) => {
            const x = 40 + (i * xStep);
            const y = height - (value / TOTAL_MEMORY_KB * height);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        dataPoints.forEach((value, i) => {
            const x = 40 + (i * xStep);
            const y = height - (value / TOTAL_MEMORY_KB * height);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#FFB74D';
            ctx.fill();
        });
    }

    // Draw X-axis label
    ctx.fillStyle = '#8E9099';
    ctx.font = '11px Roboto';
    ctx.fillText('Time →', width - 50, height - 5);
}

/**
 * Update chart data
 */
function updateChart() {
    const allocatedCount = memoryBlocks.filter(s => s === 1).length;
    const leakedCount = memoryBlocks.filter(s => s === 2).length;
    const usedKB = (allocatedCount + leakedCount) * BLOCK_SIZE_KB;

    chartData.labels.push(`${timeElapsed}s`);
    chartData.data.push(usedKB);

    // Keep only last N points
    if (chartData.data.length > CHART_MAX_POINTS) {
        chartData.labels.shift();
        chartData.data.shift();
    }

    renderChart();
}

/**
 * Add alert to alerts container
 */
function addAlert(type, message) {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    let iconClass, borderColor, iconColor;
    switch (type) {
        case 'error':
            iconClass = 'fas fa-exclamation-triangle';
            borderColor = '#EF5350';
            iconColor = '#EF5350';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-circle';
            borderColor = '#FFB74D';
            iconColor = '#FFB74D';
            break;
        default:
            iconClass = 'fas fa-info-circle';
            borderColor = '#4FD8EB';
            iconColor = '#4FD8EB';
    }

    const alertHTML = `
        <div class="alert-item" style="border-left-color: ${borderColor};">
            <i class="${iconClass}" style="color: ${iconColor};"></i>
            <span class="alert-text">${message}</span>
            <span class="alert-time">${timeStr}</span>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', alertHTML);

    // Keep only last 5 alerts
    while (container.children.length > 5) {
        container.removeChild(container.lastChild);
    }
}

/**
 * Show notification modal
 */
function showNotification(message) {
    const msgEl = document.getElementById('notification-message');
    const modal = document.getElementById('custom-notification');
    if (msgEl) msgEl.textContent = message;
    if (modal) modal.classList.add('active');
}

/**
 * Hide notification modal
 */
function hideNotification() {
    const modal = document.getElementById('custom-notification');
    if (modal) modal.classList.remove('active');
}

// Initialize on window load
window.onload = initialize;

// Expose functions to global scope
window.allocateMemory = allocateMemory;
window.simulateLeak = simulateLeak;
window.garbageCollect = garbageCollect;
window.resetSimulation = resetSimulation;
window.showNotification = showNotification;
window.hideNotification = hideNotification;
