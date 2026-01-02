// contiguous.js - Material Design 3 Version
// Supports: First-Fit, Best-Fit, Worst-Fit algorithms

// --- SIMULATION CONSTANTS ---
const TOTAL_MEMORY_KB = 1024;
const UNIT_SIZE_KB = 16;
const TOTAL_BLOCKS = TOTAL_MEMORY_KB / UNIT_SIZE_KB; // 64 blocks (8x8)

// --- GLOBAL STATE ---
let memoryBlocks = [];
let nextProcessId = 1;

// Process colors (matching CSS variables)
const PROCESS_COLORS = [
    '#4FC3F7', // Light Blue
    '#81C784', // Green
    '#FF8A65', // Orange
    '#BA68C8', // Purple
    '#FFD54F', // Yellow
    '#4DD0E1', // Cyan
    '#F48FB1', // Pink
    '#AED581', // Light Green
];

// --- NOTIFICATION FUNCTIONS ---
function showNotification(message) {
    document.getElementById("notification-message").innerText = message;
    document.getElementById("custom-notification").classList.add("active");
}

function hideNotification() {
    document.getElementById("custom-notification").classList.remove("active");
}

function openAutoTestModal() {
    document.getElementById("auto-test-modal").classList.add("active");
}

function closeAutoTestModal() {
    document.getElementById("auto-test-modal").classList.remove("active");
}

// --- ALLOCATION ALGORITHMS ---

/**
 * First-Fit: Find first block that fits
 */
function findFirstFit(sizeKB) {
    for (let i = 0; i < memoryBlocks.length; i++) {
        if (memoryBlocks[i].status === "free" && memoryBlocks[i].sizeKB >= sizeKB) {
            return i;
        }
    }
    return -1;
}

/**
 * Best-Fit: Find smallest block that fits (minimize wasted space)
 */
function findBestFit(sizeKB) {
    let bestIndex = -1;
    let bestSize = Infinity;

    for (let i = 0; i < memoryBlocks.length; i++) {
        const block = memoryBlocks[i];
        if (block.status === "free" && block.sizeKB >= sizeKB) {
            if (block.sizeKB < bestSize) {
                bestSize = block.sizeKB;
                bestIndex = i;
            }
        }
    }
    return bestIndex;
}

/**
 * Worst-Fit: Find largest block that fits (leave largest remainder)
 */
function findWorstFit(sizeKB) {
    let worstIndex = -1;
    let worstSize = -1;

    for (let i = 0; i < memoryBlocks.length; i++) {
        const block = memoryBlocks[i];
        if (block.status === "free" && block.sizeKB >= sizeKB) {
            if (block.sizeKB > worstSize) {
                worstSize = block.sizeKB;
                worstIndex = i;
            }
        }
    }
    return worstIndex;
}

/**
 * Get the selected algorithm
 */
function getSelectedAlgorithm() {
    const selector = document.getElementById("algorithm");
    return selector ? selector.value : "first-fit";
}

/**
 * Find suitable block based on selected algorithm
 */
function findSuitableBlock(sizeKB) {
    const algorithm = getSelectedAlgorithm();

    switch (algorithm) {
        case "best-fit":
            return findBestFit(sizeKB);
        case "worst-fit":
            return findWorstFit(sizeKB);
        case "first-fit":
        default:
            return findFirstFit(sizeKB);
    }
}

// --- AUTO TEST ---
function runAutoTest(scenario) {
    resetMemory();
    closeAutoTestModal();

    if (scenario === 'no-frag') {
        setTimeout(() => autoAddProcess(192, 'P1'), 300);
        setTimeout(() => autoAddProcess(320, 'P2'), 600);
        setTimeout(() => autoAddProcess(160, 'P3'), 900);
        setTimeout(() => {
            showNotification("✅ Test 'No Fragmentation' selesai! Semua proses berurutan tanpa gap.");
        }, 1200);
    } else if (scenario === 'with-frag') {
        setTimeout(() => autoAddProcess(96, 'P1'), 300);
        setTimeout(() => autoAddProcess(160, 'P2'), 600);
        setTimeout(() => autoAddProcess(96, 'P3'), 900);
        setTimeout(() => autoAddProcess(160, 'P4'), 1200);
        setTimeout(() => autoAddProcess(96, 'P5'), 1500);
        setTimeout(() => deallocateProcess('P2'), 2000);
        setTimeout(() => deallocateProcess('P4'), 2300);
        setTimeout(() => {
            showNotification("⚠️ Test 'With Fragmentation' selesai! Ada 2 gap free memory yang tersebar (External Fragmentation).");
        }, 2600);
    }
}

function autoAddProcess(sizeKB, processId) {
    const blockIndex = findSuitableBlock(sizeKB);

    if (blockIndex === -1) return false;

    const block = memoryBlocks[blockIndex];
    const remainingSize = block.sizeKB - sizeKB;

    memoryBlocks.splice(blockIndex, 1, {
        startAddress: block.startAddress,
        sizeKB: sizeKB,
        status: "allocated",
        processId: processId,
    });

    if (remainingSize > 0) {
        memoryBlocks.splice(blockIndex + 1, 0, {
            startAddress: block.startAddress + sizeKB,
            sizeKB: remainingSize,
            status: "free",
        });
    }

    nextProcessId++;
    renderGridView();
    renderProcessList();
    updateStats();
    return true;
}

// --- MEMORY GRID RENDERING ---
function renderGridView() {
    const gridContainer = document.getElementById('memory-grid');
    gridContainer.innerHTML = '';

    let cellArray = [];

    memoryBlocks.forEach((block) => {
        const numCells = Math.round(block.sizeKB / UNIT_SIZE_KB);
        const processNum = block.processId ? parseInt(block.processId.replace('P', '')) : 0;
        const colorIndex = (processNum - 1) % PROCESS_COLORS.length;
        const color = block.status === 'free' ? null : PROCESS_COLORS[colorIndex];
        const label = block.status === 'free' ? '' : block.processId.replace('P', '');

        for (let i = 0; i < numCells; i++) {
            cellArray.push({
                color: color,
                label: i === 0 ? label : '',
                processId: block.processId || 'Free',
                sizeKB: block.sizeKB,
                status: block.status,
                cellIndex: i
            });
        }
    });

    // Fill remaining if needed
    while (cellArray.length < TOTAL_BLOCKS) {
        cellArray.push({
            color: null,
            label: '',
            processId: 'Empty',
            sizeKB: UNIT_SIZE_KB,
            status: 'empty',
            cellIndex: 0
        });
    }

    // Render cells
    cellArray.forEach((cellData, index) => {
        const cell = document.createElement('div');
        cell.className = 'memory-cell';

        if (cellData.status === 'free' || cellData.status === 'empty') {
            cell.classList.add('free');
        } else {
            cell.classList.add('allocated');
            cell.style.backgroundColor = cellData.color;
        }

        // Tooltip
        const row = Math.floor(index / 8) + 1;
        const col = (index % 8) + 1;
        cell.setAttribute('data-tooltip', `Block [${row},${col}] | ${cellData.processId}`);

        // Label
        if (cellData.label) {
            cell.innerHTML = `<span>${cellData.label}</span>`;
        }

        gridContainer.appendChild(cell);
    });

    updateFragmentationInfo();
}

// --- FRAGMENTATION INFO ---
function updateFragmentationInfo() {
    const fragmentationDiv = document.getElementById("fragmentation-info");
    
    const totalFree = memoryBlocks
        .filter(b => b.status === "free")
        .reduce((sum, b) => sum + b.sizeKB, 0);

    const largestFree = memoryBlocks
        .filter(b => b.status === "free")
        .reduce((max, b) => Math.max(max, b.sizeKB), 0);

    const freeBlockCount = memoryBlocks.filter(b => b.status === "free").length;
    const externalFrag = totalFree - largestFree;

    const algorithm = getSelectedAlgorithm();
    const algoNames = {
        'first-fit': 'First-Fit',
        'best-fit': 'Best-Fit',
        'worst-fit': 'Worst-Fit'
    };

    fragmentationDiv.innerHTML = `
        <div class="frag-stats">
            <div class="frag-stat">
                <span class="frag-label">Algoritma</span>
                <span class="frag-value" style="color: var(--md-primary);">${algoNames[algorithm]}</span>
            </div>
            <div class="frag-stat">
                <span class="frag-label">Total Free</span>
                <span class="frag-value">${totalFree} KB</span>
            </div>
            <div class="frag-stat">
                <span class="frag-label">Largest Block</span>
                <span class="frag-value">${largestFree} KB</span>
            </div>
            <div class="frag-stat">
                <span class="frag-label">Free Blocks</span>
                <span class="frag-value">${freeBlockCount}</span>
            </div>
        </div>
        ${externalFrag > 0 ? `
            <div class="frag-alert warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>External Fragmentation: ${externalFrag} KB wasted space tersebar di ${freeBlockCount} blok terpisah</span>
            </div>
        ` : `
            <div class="frag-alert success">
                <i class="fas fa-check-circle"></i>
                <span>No fragmentation - Memory optimal!</span>
            </div>
        `}
    `;
}

// --- MEMORY OPERATIONS ---
function initializeMemory() {
    memoryBlocks = [{
        startAddress: 0,
        sizeKB: TOTAL_MEMORY_KB,
        status: "free",
    }];
    nextProcessId = 1;
    renderGridView();
    renderProcessList();
    updateStats();
}

function resetMemory() {
    initializeMemory();
    showNotification("🔄 Memory telah direset ke kondisi awal!");
}

function addProcess() {
    const sizeInput = document.getElementById("process-size");
    const sizeKB = parseInt(sizeInput.value);

    if (isNaN(sizeKB) || sizeKB <= 0) {
        return showNotification("⚠️ Ukuran proses tidak valid!");
    }

    if (sizeKB > TOTAL_MEMORY_KB) {
        return showNotification(`⚠️ Ukuran (${sizeKB} KB) melebihi total memori (${TOTAL_MEMORY_KB} KB)!`);
    }

    if (sizeKB % UNIT_SIZE_KB !== 0) {
        return showNotification(`⚠️ Ukuran harus kelipatan ${UNIT_SIZE_KB} KB!`);
    }

    const algorithm = getSelectedAlgorithm();
    const algoNames = {
        'first-fit': 'First-Fit',
        'best-fit': 'Best-Fit',
        'worst-fit': 'Worst-Fit'
    };

    const blockIndex = findSuitableBlock(sizeKB);

    if (blockIndex === -1) {
        return showNotification(`❌ Alokasi GAGAL dengan ${algoNames[algorithm]}! Tidak ada blok contiguous yang cukup untuk ${sizeKB} KB.`);
    }

    const processId = `P${nextProcessId}`;
    const block = memoryBlocks[blockIndex];
    const remainingSize = block.sizeKB - sizeKB;

    memoryBlocks.splice(blockIndex, 1, {
        startAddress: block.startAddress,
        sizeKB: sizeKB,
        status: "allocated",
        processId: processId,
    });

    if (remainingSize > 0) {
        memoryBlocks.splice(blockIndex + 1, 0, {
            startAddress: block.startAddress + sizeKB,
            sizeKB: remainingSize,
            status: "free",
        });
    }

    nextProcessId++;
    showNotification(`✅ ${processId} dialokasikan (${sizeKB} KB) menggunakan ${algoNames[algorithm]} di alamat ${block.startAddress} KB`);
    
    renderGridView();
    renderProcessList();
    updateStats();
}

window.deallocateProcess = function(processId) {
    const sizeReleased = memoryBlocks
        .filter(b => b.processId === processId)
        .reduce((sum, b) => sum + b.sizeKB, 0);

    memoryBlocks.forEach(block => {
        if (block.processId === processId) {
            block.status = "free";
            block.processId = null;
        }
    });

    // Coalescing adjacent free blocks
    let i = 0;
    while (i < memoryBlocks.length - 1) {
        if (memoryBlocks[i].status === "free" && memoryBlocks[i + 1].status === "free") {
            memoryBlocks[i].sizeKB += memoryBlocks[i + 1].sizeKB;
            memoryBlocks.splice(i + 1, 1);
        } else {
            i++;
        }
    }

    renderGridView();
    renderProcessList();
    updateStats();
    showNotification(`✅ ${processId} dihentikan! ${sizeReleased} KB dibebaskan.`);
};

// --- PROCESS LIST RENDERING ---
function renderProcessList() {
    const listContainer = document.getElementById("process-list");

    const allocatedProcesses = [...new Set(
        memoryBlocks.filter(b => b.status === "allocated").map(b => b.processId)
    )];

    if (allocatedProcesses.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Belum ada proses aktif</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = "";

    allocatedProcesses.forEach(id => {
        const processBlocks = memoryBlocks.filter(b => b.processId === id);
        const totalSize = processBlocks.reduce((sum, b) => sum + b.sizeKB, 0);
        const startAddress = processBlocks[0]?.startAddress ?? 'N/A';
        const numCells = Math.round(totalSize / UNIT_SIZE_KB);
        const processNum = parseInt(id.replace('P', ''));
        const colorIndex = (processNum - 1) % PROCESS_COLORS.length;
        const color = PROCESS_COLORS[colorIndex];

        const processDiv = document.createElement("div");
        processDiv.className = "process-item";
        processDiv.innerHTML = `
            <div class="process-header">
                <div class="process-name">
                    <div class="process-indicator" style="background-color: ${color};"></div>
                    <span>${id}</span>
                </div>
                <button onclick="deallocateProcess('${id}')" class="btn btn-danger btn-icon" title="Stop Process">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="process-details">
                <span><i class="fas fa-memory"></i> ${totalSize} KB</span>
                <span><i class="fas fa-th-large"></i> ${numCells} blocks</span>
                <span><i class="fas fa-map-marker-alt"></i> @${startAddress} KB</span>
                <span><i class="fas fa-check-circle" style="color: var(--md-success);"></i> Active</span>
            </div>
        `;
        listContainer.appendChild(processDiv);
    });
}

// --- STATS UPDATE ---
function updateStats() {
    const allocatedBlocks = memoryBlocks.filter(b => b.status === "allocated");
    const totalProcesses = [...new Set(allocatedBlocks.map(b => b.processId))].length;
    const usedMemory = allocatedBlocks.reduce((sum, b) => sum + b.sizeKB, 0);
    const freeMemory = TOTAL_MEMORY_KB - usedMemory;
    const utilization = ((usedMemory / TOTAL_MEMORY_KB) * 100).toFixed(1);

    const totalProcEl = document.getElementById("total-processes");
    const usedEl = document.getElementById("memory-used");
    const freeEl = document.getElementById("memory-free");
    const utilEl = document.getElementById("memory-utilization");

    if (totalProcEl) totalProcEl.textContent = totalProcesses;
    if (usedEl) usedEl.textContent = `${usedMemory} KB`;
    if (freeEl) {
        freeEl.textContent = `${freeMemory} KB`;
        freeEl.className = "stats-value " + (freeMemory < 100 ? "error" : freeMemory < 300 ? "warning" : "success");
    }
    if (utilEl) utilEl.textContent = `${utilization}%`;
}

// --- INITIALIZATION ---
window.onload = initializeMemory;

// Expose functions globally
window.addProcess = addProcess;
window.resetMemory = resetMemory;
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.openAutoTestModal = openAutoTestModal;
window.closeAutoTestModal = closeAutoTestModal;
window.runAutoTest = runAutoTest;
