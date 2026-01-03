// noncontiguous.js - Material Design 3 Version

// --- KONSTANTA SIMULASI ---
const TOTAL_MEMORY_KB = 256;
const PAGE_SIZE_KB = 4;
const N_FRAMES = TOTAL_MEMORY_KB / PAGE_SIZE_KB; // 64 Frames
const PAGE_SIZE_BYTES = PAGE_SIZE_KB * 1024; // 4096 Bytes

// --- STATUS SIMULASI GLOBAL ---
let physicalMemory = []; // Array of Frame objects
let processes = {}; // Dictionary of Process objects, keyed by Process ID
let nextProcessId = 1;

/**
 * Menampilkan notifikasi pop-up custom.
 * @param {string} message - Pesan yang akan ditampilkan.
 */
function showNotification(message) {
  document.getElementById('notification-message').innerText = message;
  document.getElementById('custom-notification').classList.add('active');
}

/**
 * Menyembunyikan notifikasi pop-up.
 */
function hideNotification() {
  document.getElementById('custom-notification').classList.remove('active');
}

/**
 * Open Auto Test Modal
 */
function openAutoTestModal() {
  document.getElementById('auto-test-modal').classList.add('active');
}

/**
 * Close Auto Test Modal
 */
function closeAutoTestModal() {
  document.getElementById('auto-test-modal').classList.remove('active');
}

/**
 * Run Auto Test - Scenario
 */
function runAutoTest(scenario) {
  resetMemory();
  closeAutoTestModal();

  if (scenario === 'sequential') {
    // Sequential: Pages dialokasikan berurutan
    setTimeout(() => {
      autoAddProcess(16, 'P1');
    }, 300);

    setTimeout(() => {
      autoAddProcess(24, 'P2');
    }, 600);

    setTimeout(() => {
      autoAddProcess(12, 'P3');
    }, 900);

    setTimeout(() => {
      showNotification("✅ Test 'Sequential Pages' selesai! Pages dialokasikan secara berurutan.");
    }, 1200);

  } else if (scenario === 'scattered') {
    // Scattered: Allocate, deallocate, reallocate untuk create scattered pages
    setTimeout(() => {
      autoAddProcess(20, 'P1');
    }, 300);

    setTimeout(() => {
      autoAddProcess(16, 'P2');
    }, 600);

    setTimeout(() => {
      autoAddProcess(20, 'P3');
    }, 900);

    setTimeout(() => {
      autoAddProcess(16, 'P4');
    }, 1200);

    // Deallocate P2 and P4 to create gaps
    setTimeout(() => {
      deallocateProcess('P2');
    }, 1700);

    setTimeout(() => {
      deallocateProcess('P4');
    }, 2000);

    // Reallocate new process in scattered frames
    setTimeout(() => {
      autoAddProcess(12, 'P5');
    }, 2300);

    setTimeout(() => {
      showNotification("✅ Test 'Scattered Pages' selesai! Pages tersebar di berbagai frames.");
    }, 2600);
  }
}

/**
 * Auto add process (for testing)
 */
function autoAddProcess(sizeKB, processId) {
  const nPages = Math.ceil(sizeKB / PAGE_SIZE_KB);

  const availableFrames = physicalMemory
    .filter((f) => f.status === 'free')
    .slice(0, nPages);

  if (availableFrames.length < nPages) {
    return;
  }

  const newProcess = {
    id: processId,
    sizeKB: sizeKB,
    nPages: nPages,
    pageTable: [],
  };

  availableFrames.forEach((frame, index) => {
    frame.status = 'allocated';
    frame.processId = processId;
    frame.pageId = index;

    newProcess.pageTable.push({
      pageId: index,
      frameId: frame.frameId,
      valid: true,
    });
  });

  processes[processId] = newProcess;
  nextProcessId++;

  renderMemoryGrid();
  renderProcessList();
  updateStats();
}

// Fungsi pembantu untuk pewarnaan
function getColorForProcess(id) {
  const colors = [
    '#4FC3F7', // Light Blue
    '#81C784', // Green
    '#FF8A65', // Orange
    '#BA68C8', // Purple
    '#FFD54F', // Yellow
    '#4DD0E1', // Cyan
    '#F48FB1', // Pink
    '#AED581', // Light Green
  ];
  if (!id || id === 'P0') return colors[0];
  const index = parseInt(id.replace('P', '')) - 1;
  return colors[index % colors.length];
}

// 1. Initializer
function initializeMemory() {
  physicalMemory = [];
  processes = {};
  nextProcessId = 1;

  for (let i = 0; i < N_FRAMES; i++) {
    physicalMemory.push({
      frameId: i,
      status: 'free',
      processId: null,
      pageId: null,
    });
  }

  renderMemoryGrid();
  renderProcessList();
  updateStats();
}

/**
 * Reset Memory
 */
function resetMemory() {
  initializeMemory();
  showNotification('🔄 Memory telah direset ke kondisi awal!');

  // Clear translation result and page table
  document.getElementById('translation-result').innerHTML = 'Hasil translasi akan muncul di sini';
  document.getElementById('page-table').querySelector('tbody').innerHTML = '';
}

// 2. Logika Alokasi
function addProcess() {
  const sizeKB = parseInt(document.getElementById('process-size').value);

  if (isNaN(sizeKB) || sizeKB <= 0) {
    return showNotification('⚠️ Ukuran proses tidak valid. Masukkan angka positif!');
  }

  if (sizeKB > TOTAL_MEMORY_KB) {
    return showNotification(`⚠️ Ukuran proses (${sizeKB} KB) melebihi total memori (${TOTAL_MEMORY_KB} KB)!`);
  }

  const nPages = Math.ceil(sizeKB / PAGE_SIZE_KB);

  const availableFrames = physicalMemory
    .filter((f) => f.status === 'free')
    .slice(0, nPages);

  if (availableFrames.length < nPages) {
    return showNotification(
      `❌ Alokasi GAGAL! Proses butuh ${nPages} frames, tersedia hanya ${availableFrames.length} frames.`
    );
  }

  const processId = `P${nextProcessId}`;
  const newProcess = {
    id: processId,
    sizeKB: sizeKB,
    nPages: nPages,
    pageTable: [],
  };

  availableFrames.forEach((frame, index) => {
    frame.status = 'allocated';
    frame.processId = processId;
    frame.pageId = index;

    newProcess.pageTable.push({
      pageId: index,
      frameId: frame.frameId,
      valid: true,
    });
  });

  processes[processId] = newProcess;
  nextProcessId++;

  renderMemoryGrid();
  renderProcessList();
  updateStats();

  showNotification(`✅ Proses ${processId} berhasil dialokasikan (${sizeKB} KB, ${nPages} pages)`);
}

// 3. Logika Translasi Alamat
function translateAddress() {
  const processId = document.getElementById('translate-process-id').value;
  const logicalAddress = parseInt(document.getElementById('logical-address').value);

  if (!processId) {
    return showNotification('⚠️ Pilih proses terlebih dahulu!');
  }

  if (isNaN(logicalAddress) || logicalAddress < 0) {
    return showNotification('⚠️ Alamat logis tidak valid!');
  }

  const pageNumber = Math.floor(logicalAddress / PAGE_SIZE_BYTES);
  const offset = logicalAddress % PAGE_SIZE_BYTES;

  const process = processes[processId];
  if (!process || pageNumber >= process.nPages) {
    document.getElementById('translation-result').innerHTML = `
      <div class="text-red-400">
        <i class="fas fa-exclamation-circle mr-1"></i>
        <span>Alamat logis tidak valid atau melampaui batas proses.</span>
      </div>
    `;
    return;
  }

  const pageEntry = process.pageTable.find((p) => p.pageId === pageNumber);

  if (pageEntry && pageEntry.valid) {
    const frameNumber = pageEntry.frameId;
    const physicalAddress = frameNumber * PAGE_SIZE_BYTES + offset;

    document.getElementById('translation-result').innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-green-200">Logical Address:</span>
          <span class="text-white font-bold">${logicalAddress} bytes</span>
        </div>
        <div class="flex justify-between">
          <span class="text-green-200">Page Number (P):</span>
          <span class="text-white font-bold">${pageNumber}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-green-200">Offset (D):</span>
          <span class="text-white font-bold">${offset} bytes</span>
        </div>
        <div class="flex justify-between">
          <span class="text-green-200">Frame Number (F):</span>
          <span class="text-white font-bold">${frameNumber}</span>
        </div>
        <div class="pt-2 border-t border-white/20">
          <div class="flex justify-between">
            <span class="text-cyan-300">Physical Address:</span>
            <span class="text-cyan-400 font-bold text-lg">${physicalAddress} bytes</span>
          </div>
        </div>
        <div class="text-xs text-green-300 text-center mt-2">
          <i class="fas fa-check-circle mr-1"></i>
          Page ${pageNumber} → Frame ${frameNumber}
        </div>
      </div>
    `;
  } else {
    document.getElementById('translation-result').innerHTML = `
      <div class="text-red-400">
        <i class="fas fa-times-circle mr-1"></i>
        <span>Page tidak valid (Page Fault).</span>
      </div>
    `;
  }
}

// --- FUNGSI RENDERING ---

/**
 * Render Grid View (8x8 = 64 frames)
 */
function renderMemoryGrid() {
  const gridContainer = document.getElementById('memory-grid');
  gridContainer.innerHTML = '';

  physicalMemory.forEach((frame, index) => {
    const cell = document.createElement('div');
    cell.className = 'memory-cell';

    const isAllocated = frame.status !== 'free';
    const color = isAllocated ? getColorForProcess(frame.processId) : null;

    cell.style.cssText = `
      aspect-ratio: 1;
      border-radius: 8px;
      border: ${isAllocated ? '2px solid ' + color : '1px dashed #44464E'};
      background-color: ${isAllocated ? color : '#333538'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: ${isAllocated ? '#fff' : '#8E9099'};
      cursor: pointer;
      transition: all 0.15s ease;
      ${isAllocated ? 'box-shadow: 0 2px 8px ' + color + '60;' : ''}
    `;

    cell.onmouseenter = () => { cell.style.transform = 'scale(1.1)'; cell.style.zIndex = '10'; };
    cell.onmouseleave = () => { cell.style.transform = 'scale(1)'; cell.style.zIndex = '1'; };

    if (isAllocated) {
      cell.innerHTML = `<span>${frame.processId.replace('P', '')}</span>`;
    }

    // Tooltip
    const row = Math.floor(index / 8) + 1;
    const col = (index % 8) + 1;
    const tooltipText = frame.status === 'free'
      ? `Frame ${frame.frameId} [${row},${col}] | Free`
      : `Frame ${frame.frameId} [${row},${col}] | ${frame.processId} Page ${frame.pageId}`;
    cell.title = tooltipText;

    gridContainer.appendChild(cell);
  });

  updateFragmentationInfo();
}

/**
 * Update fragmentation info
 */
function updateFragmentationInfo() {
  const fragmentationDiv = document.getElementById('fragmentation-info');
  if (!fragmentationDiv) return;

  const totalFree = physicalMemory.filter(f => f.status === 'free').length;
  const totalUsed = N_FRAMES - totalFree;
  const utilization = ((totalUsed / N_FRAMES) * 100).toFixed(1);

  const statStyle = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #44464E;';
  const labelStyle = 'color: #CAC4D0; font-size: 14px; display: flex; align-items: center; gap: 8px;';
  const valueStyle = 'color: #E3E2E6; font-weight: 600; font-size: 16px;';

  fragmentationDiv.innerHTML = `
    <div style="${statStyle}">
      <span style="${labelStyle}"><i class="fas fa-cube"></i> Free Frames</span>
      <span style="${valueStyle}">${totalFree} / ${N_FRAMES}</span>
    </div>
    <div style="${statStyle}">
      <span style="${labelStyle}"><i class="fas fa-cubes"></i> Used Frames</span>
      <span style="${valueStyle}">${totalUsed} / ${N_FRAMES}</span>
    </div>
    <div style="${statStyle} border-bottom: none;">
      <span style="${labelStyle}"><i class="fas fa-chart-pie"></i> Utilization</span>
      <span style="${valueStyle}">${utilization}%</span>
    </div>
    ${totalFree === 0 ? `
      <div style="margin-top: 12px; padding: 12px; background: rgba(239, 83, 80, 0.1); border-left: 3px solid #EF5350; border-radius: 4px;">
        <p style="color: #EF5350; font-size: 12px; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Memory penuh! Tidak ada frame tersedia.</span>
        </p>
      </div>
    ` : `
      <div style="margin-top: 12px; padding: 12px; background: rgba(129, 199, 132, 0.1); border-left: 3px solid #81C784; border-radius: 4px;">
        <p style="color: #81C784; font-size: 12px; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-check-circle"></i>
          <span>${totalFree} frames tersedia untuk alokasi baru.</span>
        </p>
      </div>
    `}
  `;
}

/**
 * Render Process List
 */
function renderProcessList() {
  const listContainer = document.getElementById('process-list');
  const selectDropdown = document.getElementById('translate-process-id');

  const processIds = Object.keys(processes);

  if (processIds.length === 0) {
    listContainer.innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-inbox text-4xl text-white/30 mb-3 block"></i>
        <p class="text-white/50 text-sm">Belum ada proses aktif</p>
        <p class="text-white/30 text-xs mt-1">Tambahkan proses untuk memulai</p>
      </div>
    `;
    selectDropdown.innerHTML = '<option value="">Pilih Proses</option>';
    return;
  }

  listContainer.innerHTML = '';
  selectDropdown.innerHTML = '';

  processIds.forEach((id) => {
    const process = processes[id];
    const color = getColorForProcess(id);

    // Process card
    const processDiv = document.createElement('div');
    processDiv.className = 'p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition animate-slide-in';

    processDiv.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full animate-pulse" style="background-color: ${color}"></div>
          <span class="text-white font-bold text-lg">${id}</span>
        </div>
        <button
          onclick="deallocateProcess('${id}')"
          class="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition text-sm font-medium flex items-center gap-1"
          title="Hentikan proses"
        >
          <i class="fas fa-trash text-xs"></i>
          <span>Stop</span>
        </button>
      </div>
      <div class="space-y-2 text-xs">
        <div class="flex justify-between text-white/70">
          <span class="flex items-center gap-1">
            <i class="fas fa-memory text-green-400"></i>
            Size:
          </span>
          <span class="text-white font-semibold">${process.sizeKB} KB</span>
        </div>
        <div class="flex justify-between text-white/70">
          <span class="flex items-center gap-1">
            <i class="fas fa-file text-cyan-400"></i>
            Pages:
          </span>
          <span class="text-white font-semibold">${process.nPages} pages</span>
        </div>
        <div class="flex justify-between text-white/70">
          <span class="flex items-center gap-1">
            <i class="fas fa-th-large text-purple-400"></i>
            Frames:
          </span>
          <span class="text-white font-semibold">${process.pageTable.map(p => p.frameId).join(', ')}</span>
        </div>
        <button
          onclick="showPageTable('${id}')"
          class="w-full mt-2 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition text-xs font-medium"
        >
          <i class="fas fa-table mr-1"></i>
          Lihat Page Table
        </button>
      </div>
    `;

    listContainer.appendChild(processDiv);

    // Dropdown option
    const option = document.createElement('option');
    option.value = id;
    option.innerText = `${id} (${process.sizeKB} KB)`;
    selectDropdown.appendChild(option);
  });
}

/**
 * Show Page Table
 */
function showPageTable(processId) {
  const process = processes[processId];
  const tableBody = document.getElementById('page-table').querySelector('tbody');
  tableBody.innerHTML = '';

  if (!process) return;

  process.pageTable.forEach((entry) => {
    const row = tableBody.insertRow();
    row.className = 'border-b border-white/10 hover:bg-white/5 transition';

    const pageCell = row.insertCell();
    pageCell.className = 'py-2 px-2 text-white';
    pageCell.innerText = entry.pageId;

    const frameCell = row.insertCell();
    frameCell.className = 'py-2 px-2 text-cyan-400 font-semibold';
    frameCell.innerText = entry.frameId !== null ? entry.frameId : 'N/A';

    const statusCell = row.insertCell();
    statusCell.className = 'py-2 px-2';
    if (entry.valid) {
      statusCell.innerHTML = '<span class="text-green-400 text-xs"><i class="fas fa-check-circle mr-1"></i>Valid</span>';
    } else {
      statusCell.innerHTML = '<span class="text-red-400 text-xs"><i class="fas fa-times-circle mr-1"></i>Invalid</span>';
    }
  });

  showNotification(`✅ Page table untuk ${processId} ditampilkan!`);
}

/**
 * Deallocate Process
 */
window.deallocateProcess = function (processId) {
  if (!processes[processId]) {
    return showNotification(`❌ Proses ${processId} tidak ditemukan.`);
  }

  const nPagesReleased = processes[processId].nPages;

  physicalMemory.forEach((frame) => {
    if (frame.processId === processId) {
      frame.status = 'free';
      frame.processId = null;
      frame.pageId = null;
    }
  });

  delete processes[processId];

  renderMemoryGrid();
  renderProcessList();
  updateStats();

  document.getElementById('page-table').querySelector('tbody').innerHTML = '';
  document.getElementById('translation-result').innerHTML = 'Hasil translasi akan muncul di sini';

  showNotification(`✅ Proses ${processId} dihentikan! ${nPagesReleased} frames dibebaskan.`);
};

/**
 * Update Stats
 */
function updateStats() {
  const totalProcesses = Object.keys(processes).length;
  const framesUsed = physicalMemory.filter(f => f.status === 'allocated').length;
  const framesFree = N_FRAMES - framesUsed;
  const memoryFree = framesFree * PAGE_SIZE_KB;
  const utilizationPercent = ((framesUsed / N_FRAMES) * 100).toFixed(1);

  const totalProcEl = document.getElementById('total-processes');
  const framesUsedEl = document.getElementById('frames-used');
  const freeEl = document.getElementById('memory-free');
  const utilEl = document.getElementById('memory-utilization');

  if (totalProcEl) totalProcEl.textContent = totalProcesses;
  if (framesUsedEl) framesUsedEl.textContent = `${framesUsed} / ${N_FRAMES}`;

  if (freeEl) {
    freeEl.textContent = `${memoryFree} KB`;
    if (framesFree < 5) {
      freeEl.className = 'font-semibold text-red-400';
    } else if (framesFree < 20) {
      freeEl.className = 'font-semibold text-yellow-400';
    } else {
      freeEl.className = 'font-semibold text-green-400';
    }
  }

  if (utilEl) {
    utilEl.textContent = `${utilizationPercent}%`;
  }
}

// INISIALISASI
window.onload = initializeMemory;

// Expose functions to global scope
window.addProcess = addProcess;
window.resetMemory = resetMemory;
window.translateAddress = translateAddress;
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.openAutoTestModal = openAutoTestModal;
window.closeAutoTestModal = closeAutoTestModal;
window.runAutoTest = runAutoTest;
