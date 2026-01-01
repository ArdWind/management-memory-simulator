// hierarchy.js - Material Design 3 Version (No Tailwind)

// --- KONSTANTA SIMULASI ---
const REGISTER_COUNT = 16;
const L1_CACHE_BLOCKS = 32;
const L2_CACHE_BLOCKS = 32;
const RAM_BLOCKS = 64;
const DISK_BLOCKS = 64;

// Access times (in nanoseconds, except disk in milliseconds)
const ACCESS_TIME = {
    register: 0.5,
    l1_cache: 1,
    l2_cache: 3,
    l3_cache: 10,
    ram: 100,
    disk: 10000000
};

// Colors for each level
const LEVEL_COLORS = {
    register: { free: '#333538', active: '#BA68C8', border: '#44464E', activeBorder: '#9C27B0' },
    l1Cache: { free: '#333538', active: '#64B5F6', border: '#44464E', activeBorder: '#1976D2' },
    l2Cache: { free: '#333538', active: '#4DD0E1', border: '#44464E', activeBorder: '#00ACC1' },
    ram: { free: '#333538', active: '#81C784', border: '#44464E', activeBorder: '#388E3C' },
    disk: { free: '#333538', active: '#FFD54F', border: '#44464E', activeBorder: '#F57C00' }
};

// --- STATUS SIMULASI GLOBAL ---
let memoryHierarchy = {
    registers: [],
    l1Cache: [],
    l2Cache: [],
    ram: [],
    disk: []
};

let stats = {
    totalAccesses: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalAccessTime: 0
};

/**
 * Show notification
 */
function showNotification(message) {
    document.getElementById('notification-message').innerText = message;
    document.getElementById('custom-notification').classList.add('active');
}

/**
 * Hide notification
 */
function hideNotification() {
    document.getElementById('custom-notification').classList.remove('active');
}

/**
 * Open info modal
 */
function openInfoModal() {
    document.getElementById('info-modal').classList.add('active');
}

/**
 * Close info modal
 */
function closeInfoModal() {
    document.getElementById('info-modal').classList.remove('active');
}

/**
 * Initialize memory hierarchy
 */
function initializeMemory() {
    memoryHierarchy.registers = Array(REGISTER_COUNT).fill(null).map((_, i) => ({
        id: i,
        data: null,
        status: 'free'
    }));

    memoryHierarchy.l1Cache = Array(L1_CACHE_BLOCKS).fill(null).map((_, i) => ({
        id: i,
        data: null,
        status: 'free'
    }));

    memoryHierarchy.l2Cache = Array(L2_CACHE_BLOCKS).fill(null).map((_, i) => ({
        id: i,
        data: null,
        status: 'free'
    }));

    memoryHierarchy.ram = Array(RAM_BLOCKS).fill(null).map((_, i) => ({
        id: i,
        data: null,
        status: 'free'
    }));

    memoryHierarchy.disk = Array(DISK_BLOCKS).fill(null).map((_, i) => ({
        id: i,
        data: null,
        status: 'free'
    }));

    renderAllLevels();
    updateStats();
}

/**
 * Render all memory levels
 */
function renderAllLevels() {
    renderRegisters();
    renderL1Cache();
    renderL2Cache();
    renderRAM();
    renderDisk();
}

/**
 * Create a styled memory cell
 */
function createMemoryCell(id, status, colors, label = null, size = 'normal') {
    const cell = document.createElement('div');

    const isActive = status === 'active';
    const bgColor = isActive ? colors.active : colors.free;
    const borderColor = isActive ? colors.activeBorder : colors.border;

    cell.style.cssText = `
        aspect-ratio: 1;
        border-radius: 8px;
        border: 2px solid ${borderColor};
        background-color: ${bgColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size === 'small' ? '10px' : '12px'};
        font-weight: 600;
        color: ${isActive ? '#fff' : '#8E9099'};
        cursor: pointer;
        transition: all 0.2s ease;
        ${isActive ? `box-shadow: 0 0 12px ${colors.active}80;` : ''}
    `;

    cell.onmouseenter = () => { cell.style.transform = 'scale(1.1)'; cell.style.zIndex = '10'; };
    cell.onmouseleave = () => { cell.style.transform = 'scale(1)'; cell.style.zIndex = '1'; };

    if (label !== null) {
        cell.innerHTML = `<span>${label}</span>`;
    }

    cell.title = `${id} | ${status}`;

    return cell;
}

/**
 * Render Register level
 */
function renderRegisters() {
    const container = document.getElementById('register-grid');
    if (!container) return;
    container.innerHTML = '';

    memoryHierarchy.registers.forEach((reg) => {
        const cell = createMemoryCell(
            `Register ${reg.id}`,
            reg.status,
            LEVEL_COLORS.register,
            `R${reg.id}`
        );
        container.appendChild(cell);
    });
}

/**
 * Render L1 Cache
 */
function renderL1Cache() {
    const container = document.getElementById('l1-cache-grid');
    if (!container) return;
    container.innerHTML = '';

    memoryHierarchy.l1Cache.forEach((block) => {
        const cell = createMemoryCell(
            `L1 Block ${block.id}`,
            block.status,
            LEVEL_COLORS.l1Cache,
            null,
            'small'
        );
        cell.style.aspectRatio = '1';
        cell.style.minWidth = '20px';
        cell.style.minHeight = '20px';
        container.appendChild(cell);
    });
}

/**
 * Render L2 Cache
 */
function renderL2Cache() {
    const container = document.getElementById('l2-cache-grid');
    if (!container) return;
    container.innerHTML = '';

    memoryHierarchy.l2Cache.forEach((block) => {
        const cell = createMemoryCell(
            `L2 Block ${block.id}`,
            block.status,
            LEVEL_COLORS.l2Cache,
            null,
            'small'
        );
        cell.style.aspectRatio = '1';
        cell.style.minWidth = '20px';
        cell.style.minHeight = '20px';
        container.appendChild(cell);
    });
}

/**
 * Render RAM
 */
function renderRAM() {
    const container = document.getElementById('ram-grid');
    if (!container) return;
    container.innerHTML = '';

    memoryHierarchy.ram.forEach((block) => {
        const cell = createMemoryCell(
            `RAM Block ${block.id}`,
            block.status,
            LEVEL_COLORS.ram,
            block.id
        );
        container.appendChild(cell);
    });
}

/**
 * Render Disk
 */
function renderDisk() {
    const container = document.getElementById('disk-grid');
    if (!container) return;
    container.innerHTML = '';

    memoryHierarchy.disk.forEach((block) => {
        const cell = createMemoryCell(
            `Disk Block ${block.id}`,
            block.status,
            LEVEL_COLORS.disk,
            block.id
        );
        container.appendChild(cell);
    });
}

/**
 * Simulate memory access
 */
async function simulateMemoryAccess() {
    const dataSize = parseInt(document.getElementById('data-size').value);
    const startLevel = document.getElementById('start-level').value;

    stats.totalAccesses++;
    let accessTime = 0;
    let foundInCache = false;

    // Reset previous active states before new simulation
    resetActiveStates();
    renderAllLevels();

    // Wait a bit for reset to be visible
    await new Promise(resolve => setTimeout(resolve, 300));

    // Simulate access flow based on start level
    if (startLevel === 'register') {
        // Data already in register - fastest
        await highlightLevel('register', 1500);
        accessTime = ACCESS_TIME.register;
        foundInCache = true;
        stats.cacheHits++;
        showNotification(`✅ Cache Hit! Data ditemukan di Register. Access time: ${accessTime.toFixed(2)} ns`);

    } else if (startLevel === 'cache') {
        // Check cache levels
        await highlightLevel('register', 500);
        await highlightLevel('cache', 1500);

        // Random cache hit/miss (80% hit rate)
        if (Math.random() < 0.8) {
            accessTime = ACCESS_TIME.l1_cache;
            foundInCache = true;
            stats.cacheHits++;
            showNotification(`✅ Cache Hit! Data ditemukan di L1 Cache. Access time: ${accessTime.toFixed(2)} ns`);
        } else {
            // Cache miss - go to RAM
            await highlightLevel('ram', 1500);
            accessTime = ACCESS_TIME.ram;
            stats.cacheMisses++;
            showNotification(`❌ Cache Miss! Data diambil dari RAM. Access time: ${accessTime.toFixed(2)} ns`);
        }

    } else if (startLevel === 'ram') {
        // Access from RAM (cold start)
        await highlightLevel('register', 300);
        await highlightLevel('cache', 500);
        await highlightLevel('ram', 1500);
        accessTime = ACCESS_TIME.ram;
        stats.cacheMisses++;
        showNotification(`⚠️ Data diambil dari RAM (Cold start). Access time: ${accessTime.toFixed(2)} ns`);

    } else if (startLevel === 'disk') {
        // Full hierarchy traversal - slowest (page fault)
        await highlightLevel('register', 300);
        await highlightLevel('cache', 500);
        await highlightLevel('ram', 800);
        await highlightLevel('disk', 2000);
        accessTime = ACCESS_TIME.disk;
        stats.cacheMisses++;
        showNotification(`🐌 Page Fault! Data diambil dari Disk (sangat lambat). Access time: ${(accessTime / 1000000).toFixed(2)} ms`);
    }

    stats.totalAccessTime += accessTime;
    updateStats();
}

/**
 * Highlight specific level
 */
async function highlightLevel(level, duration) {
    const levelMap = {
        'register': memoryHierarchy.registers,
        'cache': [...memoryHierarchy.l1Cache, ...memoryHierarchy.l2Cache],
        'ram': memoryHierarchy.ram,
        'disk': memoryHierarchy.disk
    };

    const blocks = levelMap[level];
    if (blocks) {
        // Mark 3-5 random blocks as active for better visualization
        const numBlocks = Math.min(Math.floor(Math.random() * 3) + 3, blocks.length);
        const indices = [];

        while (indices.length < numBlocks) {
            const idx = Math.floor(Math.random() * blocks.length);
            if (!indices.includes(idx)) {
                indices.push(idx);
                blocks[idx].status = 'active';
            }
        }

        renderAllLevels();
    }

    return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Reset all active states
 */
function resetActiveStates() {
    memoryHierarchy.registers.forEach(r => r.status = 'free');
    memoryHierarchy.l1Cache.forEach(c => c.status = 'free');
    memoryHierarchy.l2Cache.forEach(c => c.status = 'free');
    memoryHierarchy.ram.forEach(r => r.status = 'free');
    memoryHierarchy.disk.forEach(d => d.status = 'free');
}

/**
 * Update statistics display
 */
function updateStats() {
    const totalAccessEl = document.getElementById('total-accesses');
    const cacheHitsEl = document.getElementById('cache-hits');
    const cacheMissesEl = document.getElementById('cache-misses');
    const hitRateEl = document.getElementById('hit-rate');
    const avgTimeEl = document.getElementById('avg-time');

    if (totalAccessEl) totalAccessEl.textContent = stats.totalAccesses;
    if (cacheHitsEl) cacheHitsEl.textContent = stats.cacheHits;
    if (cacheMissesEl) cacheMissesEl.textContent = stats.cacheMisses;

    const hitRate = stats.totalAccesses > 0
        ? ((stats.cacheHits / stats.totalAccesses) * 100).toFixed(1)
        : 0;
    if (hitRateEl) hitRateEl.textContent = `${hitRate}%`;

    const avgTime = stats.totalAccesses > 0
        ? (stats.totalAccessTime / stats.totalAccesses).toFixed(2)
        : 0;

    // Format time appropriately
    let timeDisplay;
    if (avgTime < 1000) {
        timeDisplay = `${avgTime} ns`;
    } else if (avgTime < 1000000) {
        timeDisplay = `${(avgTime / 1000).toFixed(2)} μs`;
    } else {
        timeDisplay = `${(avgTime / 1000000).toFixed(2)} ms`;
    }

    if (avgTimeEl) avgTimeEl.textContent = timeDisplay;
}

/**
 * Reset simulation
 */
function resetSimulation() {
    stats = {
        totalAccesses: 0,
        cacheHits: 0,
        cacheMisses: 0,
        totalAccessTime: 0
    };

    resetActiveStates();
    renderAllLevels();
    updateStats();

    showNotification('🔄 Simulasi telah direset ke kondisi awal!');
}

// Initialize on load
window.onload = initializeMemory;

// Expose functions to global scope
window.simulateMemoryAccess = simulateMemoryAccess;
window.resetSimulation = resetSimulation;
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.openInfoModal = openInfoModal;
window.closeInfoModal = closeInfoModal;
