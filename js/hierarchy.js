// hierarchy.js - Memory Hierarchy Simulator (Fixed Logic)
// Logika: User MEMBACA data dari hierarki, bukan menulis
// Setiap level sudah terisi dengan data dan fungsi masing-masing

// --- KONSTANTA ---
const ACCESS_TIME = {
    register: 0.5,      // nanoseconds
    l1_cache: 1,        // nanoseconds
    l2_cache: 3,        // nanoseconds
    ram: 100,           // nanoseconds
    disk: 10000000      // nanoseconds (10ms)
};

// Warna untuk setiap level
const LEVEL_COLORS = {
    register: { bg: '#7B1FA2', border: '#9C27B0', glow: '#BA68C880' },
    l1Cache: { bg: '#1976D2', border: '#2196F3', glow: '#64B5F680' },
    l2Cache: { bg: '#00838F', border: '#00ACC1', glow: '#4DD0E180' },
    ram: { bg: '#2E7D32', border: '#43A047', glow: '#81C78480' },
    disk: { bg: '#E65100', border: '#FB8C00', glow: '#FFB74D80' }
};

// --- DATA PRE-POPULATED ---
// Register: CPU internal registers
const REGISTER_DATA = [
    { id: 'EAX', name: 'Accumulator', desc: 'Arithmetic operations' },
    { id: 'EBX', name: 'Base Register', desc: 'Base pointer for memory' },
    { id: 'ECX', name: 'Counter', desc: 'Loop counter' },
    { id: 'EDX', name: 'Data Register', desc: 'I/O operations' },
    { id: 'ESI', name: 'Source Index', desc: 'String operations source' },
    { id: 'EDI', name: 'Dest Index', desc: 'String operations dest' },
    { id: 'ESP', name: 'Stack Pointer', desc: 'Top of stack' },
    { id: 'EBP', name: 'Base Pointer', desc: 'Base of stack frame' },
    { id: 'EIP', name: 'Instruction Ptr', desc: 'Next instruction address' },
    { id: 'EFLAGS', name: 'Flags', desc: 'Status flags (ZF, CF, etc)' },
    { id: 'CS', name: 'Code Segment', desc: 'Code segment selector' },
    { id: 'DS', name: 'Data Segment', desc: 'Data segment selector' },
    { id: 'SS', name: 'Stack Segment', desc: 'Stack segment selector' },
    { id: 'R8', name: 'General Reg 8', desc: 'Extended register' },
    { id: 'R9', name: 'General Reg 9', desc: 'Extended register' },
    { id: 'R10', name: 'General Reg 10', desc: 'Extended register' }
];

// Cache: Recently accessed data
const CACHE_DATA = [
    { id: 'C001', name: 'Current Instruction', desc: 'Instruksi yang sedang dieksekusi' },
    { id: 'C002', name: 'Loop Variable', desc: 'Variabel loop yang sering diakses' },
    { id: 'C003', name: 'Array Index', desc: 'Index array yang sedang diproses' },
    { id: 'C004', name: 'Function Return', desc: 'Alamat return dari function' },
    { id: 'C005', name: 'Local Variable', desc: 'Variabel lokal function' },
    { id: 'C006', name: 'Object Reference', desc: 'Referensi ke object' },
    { id: 'C007', name: 'String Buffer', desc: 'Buffer string temporary' },
    { id: 'C008', name: 'Math Result', desc: 'Hasil kalkulasi matematika' },
    { id: 'C009', name: 'Pointer Value', desc: 'Nilai pointer' },
    { id: 'C010', name: 'Stack Frame', desc: 'Data stack frame aktif' },
    { id: 'C011', name: 'Heap Reference', desc: 'Reference ke heap' },
    { id: 'C012', name: 'Cache Line', desc: 'Cache line data' },
    { id: 'C013', name: 'Branch Target', desc: 'Target branch prediction' },
    { id: 'C014', name: 'Memory Address', desc: 'Alamat memory yang diakses' },
    { id: 'C015', name: 'CPU State', desc: 'State CPU sementara' },
    { id: 'C016', name: 'Interrupt Vector', desc: 'Vector interrupt aktif' }
];

// RAM: Running programs and data
const RAM_DATA = [
    { id: 'M001', name: 'Keyboard Buffer', desc: 'Buffer input keyboard' },
    { id: 'M002', name: 'Mouse Position', desc: 'Koordinat X,Y mouse' },
    { id: 'M003', name: 'Screen Buffer', desc: 'Frame buffer display' },
    { id: 'M004', name: 'Audio Buffer', desc: 'Buffer audio output' },
    { id: 'M005', name: 'Network Packet', desc: 'Packet data jaringan' },
    { id: 'M006', name: 'Process Table', desc: 'Tabel proses aktif' },
    { id: 'M007', name: 'Page Table', desc: 'Tabel paging virtual memory' },
    { id: 'M008', name: 'File Descriptor', desc: 'Descriptor file terbuka' },
    { id: 'M009', name: 'Browser Tab', desc: 'Data tab browser aktif' },
    { id: 'M010', name: 'Text Editor', desc: 'Buffer text editor' },
    { id: 'M011', name: 'Game State', desc: 'State game yang berjalan' },
    { id: 'M012', name: 'Video Frame', desc: 'Frame video aktif' },
    { id: 'M013', name: 'Clipboard', desc: 'Data clipboard' },
    { id: 'M014', name: 'Font Cache', desc: 'Cache font rendering' },
    { id: 'M015', name: 'DLL Module', desc: 'Dynamic library loaded' },
    { id: 'M016', name: 'Thread Stack', desc: 'Stack thread aktif' }
];

// Disk: Persistent storage
const DISK_DATA = [
    { id: 'D001', name: 'boot.sys', desc: 'Boot loader system' },
    { id: 'D002', name: 'kernel32.dll', desc: 'Windows kernel library' },
    { id: 'D003', name: 'ntoskrnl.exe', desc: 'NT OS Kernel' },
    { id: 'D004', name: 'chrome.exe', desc: 'Browser executable' },
    { id: 'D005', name: 'document.docx', desc: 'Dokumen Word' },
    { id: 'D006', name: 'photo.jpg', desc: 'File gambar' },
    { id: 'D007', name: 'video.mp4', desc: 'File video' },
    { id: 'D008', name: 'music.mp3', desc: 'File audio' },
    { id: 'D009', name: 'database.db', desc: 'File database' },
    { id: 'D010', name: 'config.ini', desc: 'File konfigurasi' },
    { id: 'D011', name: 'pagefile.sys', desc: 'Virtual memory swap' },
    { id: 'D012', name: 'hiberfil.sys', desc: 'Hibernation file' },
    { id: 'D013', name: 'registry.dat', desc: 'Windows registry' },
    { id: 'D014', name: 'temp.tmp', desc: 'File temporary' },
    { id: 'D015', name: 'log.txt', desc: 'Log file system' },
    { id: 'D016', name: 'backup.zip', desc: 'File backup' }
];

// --- STATS ---
let stats = {
    totalAccesses: 0,
    registerAccess: 0,
    cacheAccess: 0,
    ramAccess: 0,
    diskAccess: 0,
    totalTime: 0
};

// --- FUNCTIONS ---

function initialize() {
    renderAllLevels();
    updateStats();
}

/**
 * Create clickable memory cell
 */
function createCell(data, level, colors, accessTime, showLabel = true) {
    const cell = document.createElement('div');

    cell.style.cssText = `
        aspect-ratio: 1;
        border-radius: 8px;
        border: 2px solid ${colors.border};
        background-color: ${colors.bg};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${showLabel ? '11px' : '10px'};
        font-weight: 600;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
    `;

    if (showLabel) {
        cell.innerHTML = `<span>${data.id}</span>`;
    }

    cell.title = `${data.id}: ${data.name}`;

    // Hover effect
    cell.onmouseenter = () => {
        cell.style.transform = 'scale(1.15)';
        cell.style.zIndex = '10';
        cell.style.boxShadow = `0 0 20px ${colors.glow}`;
    };
    cell.onmouseleave = () => {
        cell.style.transform = 'scale(1)';
        cell.style.zIndex = '1';
        cell.style.boxShadow = 'none';
    };

    // Click to access/read data
    cell.onclick = () => accessData(data, level, accessTime);

    return cell;
}

/**
 * Access/Read data - show info and record stats
 */
function accessData(data, level, accessTime) {
    stats.totalAccesses++;
    stats.totalTime += accessTime;

    // Update level-specific stats
    switch (level) {
        case 'Register': stats.registerAccess++; break;
        case 'L1 Cache':
        case 'L2 Cache': stats.cacheAccess++; break;
        case 'RAM': stats.ramAccess++; break;
        case 'Disk': stats.diskAccess++; break;
    }

    // Format access time
    let timeStr;
    if (accessTime < 1000) {
        timeStr = `${accessTime} ns`;
    } else if (accessTime < 1000000) {
        timeStr = `${(accessTime / 1000).toFixed(1)} μs`;
    } else {
        timeStr = `${(accessTime / 1000000).toFixed(1)} ms`;
    }

    // Show notification with data info
    const message = `
📍 ID: ${data.id}
📝 Nama: ${data.name}
💡 Fungsi: ${data.desc}
📂 Lokasi: ${level}
⚡ Kecepatan Akses: ${timeStr}
    `.trim();

    showNotification(message);
    updateStats();
}

/**
 * Render all levels
 */
function renderAllLevels() {
    renderLevel('register-grid', REGISTER_DATA, 'Register', LEVEL_COLORS.register, ACCESS_TIME.register);
    renderLevel('l1-cache-grid', CACHE_DATA.slice(0, 16), 'L1 Cache', LEVEL_COLORS.l1Cache, ACCESS_TIME.l1_cache, false);
    renderLevel('l2-cache-grid', CACHE_DATA, 'L2 Cache', LEVEL_COLORS.l2Cache, ACCESS_TIME.l2_cache, false);
    renderLevel('ram-grid', RAM_DATA, 'RAM', LEVEL_COLORS.ram, ACCESS_TIME.ram);
    renderLevel('disk-grid', DISK_DATA, 'Disk', LEVEL_COLORS.disk, ACCESS_TIME.disk);
}

/**
 * Render a specific level
 */
function renderLevel(containerId, data, level, colors, accessTime, showLabel = true) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    data.forEach(item => {
        const cell = createCell(item, level, colors, accessTime, showLabel);
        container.appendChild(cell);
    });
}

/**
 * Update statistics display
 */
function updateStats() {
    const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setEl('total-accesses', stats.totalAccesses);
    setEl('cache-hits', stats.cacheAccess);
    setEl('cache-misses', stats.ramAccess + stats.diskAccess);

    const hitRate = stats.totalAccesses > 0
        ? (((stats.registerAccess + stats.cacheAccess) / stats.totalAccesses) * 100).toFixed(1)
        : 0;
    setEl('hit-rate', `${hitRate}%`);

    // Average time
    const avgTime = stats.totalAccesses > 0
        ? (stats.totalTime / stats.totalAccesses)
        : 0;

    let timeStr;
    if (avgTime < 1000) {
        timeStr = `${avgTime.toFixed(2)} ns`;
    } else if (avgTime < 1000000) {
        timeStr = `${(avgTime / 1000).toFixed(2)} μs`;
    } else {
        timeStr = `${(avgTime / 1000000).toFixed(2)} ms`;
    }
    setEl('avg-time', timeStr);
}

/**
 * Reset simulation
 */
function resetSimulation() {
    stats = {
        totalAccesses: 0,
        registerAccess: 0,
        cacheAccess: 0,
        ramAccess: 0,
        diskAccess: 0,
        totalTime: 0
    };
    updateStats();
    showNotification('🔄 Statistik telah direset!');
}

/**
 * Show notification modal
 */
function showNotification(message) {
    const msgEl = document.getElementById('notification-message');
    const modal = document.getElementById('custom-notification');
    if (msgEl) {
        // Preserve line breaks
        msgEl.innerHTML = message.replace(/\n/g, '<br>');
    }
    if (modal) modal.classList.add('active');
}

function hideNotification() {
    const modal = document.getElementById('custom-notification');
    if (modal) modal.classList.remove('active');
}

function openInfoModal() {
    const modal = document.getElementById('info-modal');
    if (modal) modal.classList.add('active');
}

function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    if (modal) modal.classList.remove('active');
}

// Initialize on load
window.onload = initialize;

// Expose functions
window.resetSimulation = resetSimulation;
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.openInfoModal = openInfoModal;
window.closeInfoModal = closeInfoModal;
