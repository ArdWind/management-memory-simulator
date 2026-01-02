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

// ==========================================
// SCENARIO SIMULATIONS - POPUP VERSION
// ==========================================

const SIM_SCREENS = {
    typing: () => `
        <div style="height: 280px; background: linear-gradient(180deg, #1e3a5f 0%, #0d1b2a 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: #fff; width: 90%; max-width: 350px; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); overflow: hidden;">
                <div style="background: #2196F3; padding: 8px 12px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 14px;">📝</span>
                    <span style="color: white; font-size: 12px; font-weight: 500;">Microsoft Word</span>
                </div>
                <div style="padding: 20px; min-height: 120px; font-family: 'Times New Roman', serif; font-size: 16px; color: #333;">
                    <div id="typing-text" style="display: inline;"></div><span style="animation: typing-cursor 0.5s infinite;">|</span>
                </div>
            </div>
            <div style="margin-top: 20px; color: #64B5F6; font-size: 11px;">⌨️ Keyboard → Register → Cache</div>
        </div>
    `,
    gaming: () => `
        <div style="height: 280px; background: linear-gradient(180deg, #87CEEB 0%, #98FB98 60%, #8B4513 100%); position: relative; overflow: hidden;">
            <div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); color: #333; font-size: 18px; font-weight: bold;">🎮 Flappy Bird</div>
            <div id="flappy-bird" style="position: absolute; left: 30%; top: 50%; font-size: 40px; transition: top 0.15s;">🐦</div>
            <div class="pipe" style="position: absolute; right: 15%; top: 0; width: 40px; height: 70px; background: linear-gradient(90deg, #2E7D32, #4CAF50); border-radius: 0 0 8px 8px;"></div>
            <div class="pipe" style="position: absolute; right: 15%; bottom: 50px; width: 40px; height: 90px; background: linear-gradient(90deg, #2E7D32, #4CAF50); border-radius: 8px 8px 0 0;"></div>
            <div style="position: absolute; bottom: 0; width: 100%; height: 50px; background: #8B4513;"></div>
            <div style="position: absolute; top: 50px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); padding: 6px 16px; border-radius: 15px;">
                <span style="color: white; font-size: 18px; font-weight: bold;">Score: <span id="game-score">0</span></span>
            </div>
        </div>
    `,
    openfile: () => `
        <div style="height: 280px; background: linear-gradient(180deg, #1a237e 0%, #0d1421 100%); display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="font-size: 50px; margin-bottom: 15px;">📂</div>
            <div style="color: white; font-size: 15px;">Membuka File...</div>
            <div style="color: #64B5F6; font-size: 13px; margin: 8px 0;">document.docx</div>
            <div style="width: 70%; height: 18px; background: #333; border-radius: 9px; overflow: hidden; margin-top: 10px;">
                <div id="file-progress" style="height: 100%; background: linear-gradient(90deg, #2196F3, #00BCD4); width: 0%; border-radius: 9px;"></div>
            </div>
            <div id="file-percent" style="color: #4FD8EB; font-size: 14px; margin-top: 8px;">0%</div>
        </div>
    `,
    video: () => `
        <div style="height: 280px; background: #1a1a2e;">
            <div style="background: #2d2d3a; padding: 6px 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #444;">
                <span>🎬</span><span style="color: #00BCD4; font-size: 11px;">Adobe Premiere Pro</span>
            </div>
            <div style="padding: 12px;">
                <div style="background: #000; height: 90px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                    <div style="font-size: 35px;">🎥</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;">
                    <div style="display: flex; gap: 6px; align-items: center;"><span style="color: #888; font-size: 9px; width: 20px;">V1</span><div style="flex: 1; height: 16px; background: #FF5722; border-radius: 3px;"></div></div>
                    <div style="display: flex; gap: 6px; align-items: center;"><span style="color: #888; font-size: 9px; width: 20px;">A1</span><div style="flex: 1; height: 14px; background: #4CAF50; border-radius: 3px;"></div></div>
                </div>
                <div><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: #FB8C00; font-size: 10px;">Rendering...</span><span id="render-percent" style="color: #FB8C00; font-size: 10px;">0%</span></div>
                <div style="height: 8px; background: #333; border-radius: 4px; overflow: hidden;"><div id="render-progress" style="height: 100%; background: linear-gradient(90deg, #FB8C00, #FF5722); width: 0%;"></div></div></div>
            </div>
        </div>
    `,
    smalldata: () => `
        <div style="height: 280px; background: linear-gradient(180deg, #004d40 0%, #00251a 100%); display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="font-size: 50px;">📋</div>
            <div style="color: #4DD0E1; font-size: 16px; margin-top: 10px;">1 KB Data</div>
            <div id="small-result" style="margin-top: 25px; color: #4CAF50; font-size: 28px; opacity: 0; transition: opacity 0.3s;">✅ Instan!</div>
        </div>
    `,
    bigdata: () => `
        <div style="height: 280px; background: linear-gradient(180deg, #4a148c 0%, #12005e 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 15px;">
                <div style="text-align: center;"><div style="font-size: 35px;">💾</div><div style="color: #888; font-size: 9px;">Disk A</div></div>
                <div style="font-size: 20px; color: #E91E63;">➡️</div>
                <div style="text-align: center;"><div style="font-size: 35px;">💾</div><div style="color: #888; font-size: 9px;">Disk B</div></div>
            </div>
            <div style="color: white; font-size: 13px;">Copying 5 GB...</div>
            <div style="width: 75%; height: 20px; background: #333; border-radius: 10px; overflow: hidden; margin: 12px 0;">
                <div id="big-progress" style="height: 100%; background: linear-gradient(90deg, #E91E63, #9C27B0); width: 0%; border-radius: 10px;"></div>
            </div>
            <div id="big-stats" style="color: #888; font-size: 11px;">0 MB / 5000 MB</div>
        </div>
    `
};

const SIM_CONFIG = {
    typing: { levels: ['reg', 'cache'], time: '~1 ns', desc: 'Keyboard → Register → Cache. Super cepat!' },
    gaming: { levels: ['disk', 'ram', 'cache'], time: '~10-100 ms', desc: 'Game load dari Disk → RAM → Cache' },
    openfile: { levels: ['disk', 'ram', 'cache'], time: '~10 ms', desc: 'File: Disk → RAM → Cache' },
    video: { levels: ['disk', 'ram', 'cache', 'reg'], time: '~1-10 detik', desc: 'Video render: Disk ↔ RAM ↔ Cache' },
    smalldata: { levels: ['reg', 'cache'], time: '<1 ns', desc: 'Data kecil langsung di Register!' },
    bigdata: { levels: ['disk', 'ram'], time: '~5 detik+', desc: 'Transfer besar: Disk → RAM → Disk' }
};

let birdInterval = null;

async function runScenario(type) {
    const modal = document.getElementById('simulation-modal');
    const screen = document.getElementById('sim-screen');
    const status = document.getElementById('sim-status');
    const config = SIM_CONFIG[type];
    if (!modal || !screen || !config) return;

    ['reg', 'cache', 'ram', 'disk'].forEach(l => {
        const el = document.getElementById(`sim-${l}`);
        if (el) { el.style.background = '#333'; el.style.boxShadow = 'none'; }
    });

    modal.classList.add('active');
    screen.innerHTML = SIM_SCREENS[type]();
    status.innerHTML = '<span style="color: #4FD8EB;">⏳ Memulai...</span>';

    for (const level of config.levels) {
        await activateSimLevel(level);
        await sleep(500);
    }

    switch (type) {
        case 'typing': await animTyping(); break;
        case 'gaming': await animGaming(); break;
        case 'openfile': await animFile(); break;
        case 'video': await animVideo(); break;
        case 'smalldata': await animSmall(); break;
        case 'bigdata': await animBig(); break;
    }

    status.innerHTML = `<div style="text-align:left;"><div style="color:#4CAF50;font-size:12px;">✅ Selesai!</div><div style="color:#FFB74D;font-size:11px;">⏱️ ${config.time}</div><div style="color:#888;font-size:10px;margin-top:4px;">${config.desc}</div></div>`;
}

async function activateSimLevel(l) {
    const c = { reg: '#9C27B0', cache: '#2196F3', ram: '#43A047', disk: '#FB8C00' };
    const el = document.getElementById(`sim-${l}`);
    if (el) { el.style.background = c[l]; el.style.boxShadow = `0 0 15px ${c[l]}`; }
}

async function animTyping() {
    const t = "Hello World! Mengetik sangat cepat...";
    const el = document.getElementById('typing-text');
    if (!el) return;
    for (let i = 0; i <= t.length; i++) { el.textContent = t.substring(0, i); await sleep(40); }
}

async function animGaming() {
    const bird = document.getElementById('flappy-bird');
    const score = document.getElementById('game-score');
    let y = 50, dir = -1, s = 0;
    for (let i = 0; i < 30; i++) {
        y += dir * 8;
        if (y < 30 || y > 70) dir *= -1;
        if (bird) bird.style.top = y + '%';
        if (i % 3 === 0 && score) score.textContent = ++s;
        await sleep(100);
    }
}

async function animFile() {
    const p = document.getElementById('file-progress');
    const t = document.getElementById('file-percent');
    for (let i = 0; i <= 100; i += 4) { if (p) p.style.width = i + '%'; if (t) t.textContent = i + '%'; await sleep(80); }
}

async function animVideo() {
    const p = document.getElementById('render-progress');
    const t = document.getElementById('render-percent');
    for (let i = 0; i <= 100; i += 2) { if (p) p.style.width = i + '%'; if (t) t.textContent = i + '%'; await sleep(60); }
}

async function animSmall() {
    await sleep(400);
    const r = document.getElementById('small-result');
    if (r) r.style.opacity = '1';
}

async function animBig() {
    const p = document.getElementById('big-progress');
    const s = document.getElementById('big-stats');
    for (let i = 0; i <= 100; i += 2) {
        if (p) p.style.width = i + '%';
        if (s) s.textContent = `${i * 50} MB / 5000 MB`;
        await sleep(80);
    }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function closeSimulation() {
    const modal = document.getElementById('simulation-modal');
    if (modal) modal.classList.remove('active');
    if (birdInterval) clearInterval(birdInterval);
}

window.onload = initialize;
window.runScenario = runScenario;
window.closeSimulation = closeSimulation;
window.resetSimulation = resetSimulation;
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.openInfoModal = openInfoModal;
window.closeInfoModal = closeInfoModal;


