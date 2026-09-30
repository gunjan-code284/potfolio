/**
 * ============================================================================
 * MINECRAFT SERVER HUB — Modern Interactive Dashboard
 * Author: Gunjan
 * 
 * This file handles:
 *  1. Server configuration and state
 *  2. Real API integration hooks (e.g. mcsrvstat.us)
 *  3. Mock data for standalone offline/demo use
 *  4. Copy IP to clipboard with toasts
 *  5. Status refresh with loading animations
 *  6. Test controls (Simulate Online vs Offline)
 *  7. Dynamic player list rendering with live search filter
 *  8. Lightweight ambient particles canvas
 * ============================================================================
 */

/* ==========================================================================
   1. SERVER CONFIGURATION
   Change your server details here! Everything updates automatically.
   ========================================================================== */
const SERVER_CONFIG = {
  // Your Server's Display Information
  serverName: "Gunjan's Minecraft Server",
  serverIp: "play.gunjanserver.net",
  javaPort: 25565,
  bedrockPort: 19132,
  version: "1.20.4",
  software: "Purpur / PaperMC",
  location: "Frankfurt, Germany",
  maxPlayers: 20,
  uptime: "99.98% (24/7)",

  // Live API Settings
  // Set `useRealApi: true` when you want to connect to a live public Minecraft server!
  useRealApi: false,
  
  // Free public Minecraft Server status API:
  // Documentation: https://api.mcsrvstat.us/
  apiEndpoint: "https://api.mcsrvstat.us/3/play.gunjanserver.net"
};

/* ==========================================================================
   2. SAMPLE / MOCK DATA
   Used initially so the website works immediately without requiring a backend.
   ========================================================================== */
const MOCK_PLAYERS = [
  { username: "Gunjan", rank: "Owner", activity: "Configuring Plugins", ping: 12 },
  { username: "AlexCraft", rank: "Admin", activity: "Building Spawn Castle", ping: 18 },
  { username: "EnderKnight", rank: "Mod", activity: "Patrolling Nether Hub", ping: 24 },
  { username: "PixelQueen", rank: "VIP", activity: "Designing Mega Farm", ping: 22 },
  { username: "DiamondMiner99", rank: "VIP", activity: "Branch Mining at Y -58", ping: 31 },
  { username: "RedstoneWizard", rank: "VIP", activity: "Tuning Shulker Sorter", ping: 19 },
  { username: "ShadowWolf", rank: "Member", activity: "Trading with Villagers", ping: 28 },
  { username: "CraftingPro", rank: "Member", activity: "Enchanting Netherite Armor", ping: 35 },
  { username: "SkyWalker_MC", rank: "Member", activity: "Exploring End Cities", ping: 42 },
  { username: "CreeperHunter", rank: "Member", activity: "Defending Raid Farm", ping: 25 },
  { username: "Luna_Star", rank: "Member", activity: "Terraforming Village", ping: 30 },
  { username: "BlockMaster", rank: "Member", activity: "Gathering Wood in Taiga", ping: 27 },
  { username: "GoldenApple", rank: "Member", activity: "Brewing Potions", ping: 33 },
  { username: "VoxelHero", rank: "Member", activity: "Shopping District Trade", ping: 21 }
];

// Current State
let serverState = {
  isOnline: true,
  onlinePlayers: 14,
  maxPlayers: SERVER_CONFIG.maxPlayers,
  playersList: [...MOCK_PLAYERS],
  ping: 18,
  tps: 20.0,
  version: SERVER_CONFIG.version,
  motd: "⚔️ Hermitcraft-style SMP • Custom Terrain • Zero Griefing • 24/7 High Performance",
  lastUpdated: new Date()
};

/* ==========================================================================
   3. DOM ELEMENTS
   ========================================================================== */
const elements = {
  // Navigation & Header
  headerStatusPill: document.getElementById('headerStatusPill'),
  headerStatusText: document.querySelector('.header-status-text'),
  menuToggle: document.getElementById('menuToggle'),
  navLinks: document.getElementById('navLinks'),
  quickCopyBtn: document.getElementById('quickCopyBtn'),

  // Hero / Dashboard
  serverTitle: document.getElementById('serverTitle'),
  serverMotd: document.getElementById('serverMotd'),
  statusBadge: document.getElementById('statusBadge'),
  statusText: document.getElementById('statusText'),
  serverIpText: document.getElementById('serverIpText'),
  copyIpBtn: document.getElementById('copyIpBtn'),
  copyBtnLabel: document.getElementById('copyBtnLabel'),
  refreshBtn: document.getElementById('refreshBtn'),
  refreshIcon: document.getElementById('refreshIcon'),
  copyBedrockPortBtn: document.getElementById('copyBedrockPortBtn'),
  offlineAlertBanner: document.getElementById('offlineAlertBanner'),
  simulateToggleBtn: document.getElementById('simulateToggleBtn'),
  simulateToggleText: document.getElementById('simulateToggleText'),

  // Stats
  playerCountRatio: document.getElementById('playerCountRatio'),
  playerProgressFill: document.getElementById('playerProgressFill'),
  slotsRemaining: document.getElementById('slotsRemaining'),
  pingValue: document.getElementById('pingValue'),
  tpsValue: document.getElementById('tpsValue'),
  tpsStatValue: document.getElementById('tpsStatValue'),
  tpsProgressFill: document.getElementById('tpsProgressFill'),
  tpsSubtext: document.getElementById('tpsSubtext'),
  uptimeValue: document.getElementById('uptimeValue'),
  lastUpdatedTime: document.getElementById('lastUpdatedTime'),

  // Players
  playersGrid: document.getElementById('playersGrid'),
  playerSearchInput: document.getElementById('playerSearchInput'),
  playerSearchEmpty: document.getElementById('playerSearchEmpty'),
  searchQueryText: document.getElementById('searchQueryText'),
  onlineCountNum: document.getElementById('onlineCountNum'),
  playersOfflineState: document.getElementById('playersOfflineState'),

  // Server Info Specs
  infoVersion: document.getElementById('infoVersion'),
  infoSoftware: document.getElementById('infoSoftware'),
  infoLocation: document.getElementById('infoLocation'),
  infoMaxPlayers: document.getElementById('infoMaxPlayers'),
  infoUptime: document.getElementById('infoUptime'),

  // Toast
  toastContainer: document.getElementById('toastContainer'),
  currentYear: document.getElementById('currentYear')
};

/* ==========================================================================
   4. INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  if (elements.currentYear) {
    elements.currentYear.textContent = new Date().getFullYear();
  }

  // Populate initial DOM from configuration
  initServerConfigView();

  // Render initial player cards
  renderPlayers(serverState.playersList);

  // Set up event listeners
  setupEventListeners();

  // Start background ambient particles
  initAmbientParticles();

  // Auto refresh every 60 seconds (silent refresh)
  setInterval(() => {
    refreshServerStatus(false);
  }, 60000);
});

/**
 * Initializes static information from SERVER_CONFIG
 */
function initServerConfigView() {
  if (elements.serverTitle) elements.serverTitle.textContent = SERVER_CONFIG.serverName;
  if (elements.serverIpText) elements.serverIpText.textContent = SERVER_CONFIG.serverIp;
  if (elements.infoVersion) elements.infoVersion.textContent = SERVER_CONFIG.version;
  if (elements.infoSoftware) elements.infoSoftware.textContent = SERVER_CONFIG.software;
  if (elements.infoLocation) elements.infoLocation.textContent = SERVER_CONFIG.location;
  if (elements.infoMaxPlayers) elements.infoMaxPlayers.textContent = `${SERVER_CONFIG.maxPlayers} Slots`;
  if (elements.infoUptime) elements.infoUptime.textContent = SERVER_CONFIG.uptime;
  if (elements.uptimeValue) elements.uptimeValue.textContent = SERVER_CONFIG.uptime;

  const inlineJavaIp = document.getElementById('inlineJavaIp');
  if (inlineJavaIp) inlineJavaIp.textContent = SERVER_CONFIG.serverIp;
}

/* ==========================================================================
   5. EVENT LISTENERS
   ========================================================================== */
function setupEventListeners() {
  // Copy IP Buttons
  if (elements.copyIpBtn) {
    elements.copyIpBtn.addEventListener('click', () => {
      copyToClipboard(SERVER_CONFIG.serverIp, "Server IP copied to clipboard! (play.gunjanserver.net)");
    });
  }

  if (elements.quickCopyBtn) {
    elements.quickCopyBtn.addEventListener('click', () => {
      copyToClipboard(SERVER_CONFIG.serverIp, "Server IP copied to clipboard!");
    });
  }

  // Copy Bedrock Port Button
  if (elements.copyBedrockPortBtn) {
    elements.copyBedrockPortBtn.addEventListener('click', () => {
      copyToClipboard(String(SERVER_CONFIG.bedrockPort), `Bedrock Port (${SERVER_CONFIG.bedrockPort}) copied!`);
    });
  }

  // Generic data-copy buttons (e.g. in How to Join section)
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const textToCopy = e.currentTarget.getAttribute('data-copy');
      copyToClipboard(textToCopy, `Copied: ${textToCopy}`);
    });
  });

  // Refresh Status Button
  if (elements.refreshBtn) {
    elements.refreshBtn.addEventListener('click', () => {
      refreshServerStatus(true);
    });
  }

  // Demo Simulate Online / Offline Toggle
  if (elements.simulateToggleBtn) {
    elements.simulateToggleBtn.addEventListener('click', toggleSimulateState);
  }

  // Player search filter
  if (elements.playerSearchInput) {
    elements.playerSearchInput.addEventListener('input', handlePlayerSearch);
  }

  // Mobile menu toggle
  if (elements.menuToggle && elements.navLinks) {
    elements.menuToggle.addEventListener('click', () => {
      elements.menuToggle.classList.toggle('open');
      elements.navLinks.classList.toggle('open');
    });

    // Close menu when clicking any nav item
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        elements.menuToggle.classList.remove('open');
        elements.navLinks.classList.remove('open');
      });
    });
  }

  // Active navigation link highlighting on scroll
  setupScrollSpy();
}

/* ==========================================================================
   6. SERVER STATUS REFRESH & API INTEGRATION
   ========================================================================== */
/**
 * Refreshes server information.
 * If useRealApi is true, fetches live data from the public Minecraft API.
 * Otherwise, calculates updated mock data with slight natural variations.
 * 
 * @param {boolean} showToast Whether to display a completion toast notification
 */
async function refreshServerStatus(showToast = true) {
  // Start loading animation on the refresh icon
  if (elements.refreshIcon) {
    elements.refreshIcon.classList.add('spinning');
  }

  try {
    if (SERVER_CONFIG.useRealApi) {
      // Connect to real Minecraft Server API
      await fetchRealServerStatus();
    } else {
      // Simulate realistic network delay (400ms - 800ms)
      await new Promise(resolve => setTimeout(resolve, 600));

      if (serverState.isOnline) {
        // Natural small jitter in ping and player activity
        serverState.ping = Math.floor(16 + Math.random() * 8);
        serverState.tps = +(19.8 + Math.random() * 0.2).toFixed(1);
        serverState.lastUpdated = new Date();
      }
    }

    // Update the dashboard UI
    updateDashboardUI();

    if (showToast) {
      showToastNotification("Server status refreshed successfully!", "success");
    }
  } catch (error) {
    console.error("Failed to refresh server status:", error);
    if (showToast) {
      showToastNotification("Could not reach server status API.", "error");
    }
  } finally {
    // Stop loading animation
    if (elements.refreshIcon) {
      elements.refreshIcon.classList.remove('spinning');
    }
  }
}

/**
 * Real API Fetch Implementation
 * Connects to public API: https://api.mcsrvstat.us/
 * To use: set `SERVER_CONFIG.useRealApi = true` at the top of this file.
 */
async function fetchRealServerStatus() {
  const url = `https://api.mcsrvstat.us/3/${encodeURIComponent(SERVER_CONFIG.serverIp)}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }

  const data = await response.json();

  if (data.online) {
    serverState.isOnline = true;
    serverState.onlinePlayers = data.players?.online || 0;
    serverState.maxPlayers = data.players?.max || SERVER_CONFIG.maxPlayers;
    serverState.version = data.version || SERVER_CONFIG.version;
    serverState.motd = data.motd?.clean?.join(' ') || serverState.motd;

    // If API returns player list, map it; otherwise keep mock or empty
    if (data.players?.list && Array.isArray(data.players.list)) {
      serverState.playersList = data.players.list.map(p => ({
        username: typeof p === 'string' ? p : p.name,
        rank: "Member",
        activity: "Playing online",
        ping: Math.floor(20 + Math.random() * 20)
      }));
    }
  } else {
    serverState.isOnline = false;
    serverState.onlinePlayers = 0;
    serverState.playersList = [];
  }

  serverState.lastUpdated = new Date();
}

/**
 * Updates all visual elements in the dashboard based on `serverState`
 */
function updateDashboardUI() {
  const isOnline = serverState.isOnline;

  // Header status pill
  if (elements.headerStatusPill) {
    if (isOnline) {
      elements.headerStatusPill.classList.remove('offline');
      elements.headerStatusText.textContent = 'ONLINE';
    } else {
      elements.headerStatusPill.classList.add('offline');
      elements.headerStatusText.textContent = 'OFFLINE';
    }
  }

  // Hero status badge
  if (elements.statusBadge) {
    if (isOnline) {
      elements.statusBadge.className = 'status-badge status-online';
      elements.statusText.textContent = 'ONLINE';
    } else {
      elements.statusBadge.className = 'status-badge status-offline';
      elements.statusText.textContent = 'OFFLINE';
    }
  }

  // Offline alert banner
  if (elements.offlineAlertBanner) {
    elements.offlineAlertBanner.style.display = isOnline ? 'none' : 'flex';
  }

  // Player count & slots
  if (elements.playerCountRatio) {
    elements.playerCountRatio.textContent = `${serverState.onlinePlayers} / ${serverState.maxPlayers}`;
  }

  if (elements.playerProgressFill) {
    const percentage = Math.min(100, Math.round((serverState.onlinePlayers / serverState.maxPlayers) * 100));
    elements.playerProgressFill.style.width = `${percentage}%`;
  }

  if (elements.slotsRemaining) {
    if (isOnline) {
      const openSlots = Math.max(0, serverState.maxPlayers - serverState.onlinePlayers);
      elements.slotsRemaining.textContent = `${openSlots} slots available`;
    } else {
      elements.slotsRemaining.textContent = 'Server is currently offline';
    }
  }

  // Ping
  if (elements.pingValue) {
    elements.pingValue.textContent = isOnline ? `${serverState.ping} ms` : 'N/A';
  }

  // TPS
  if (elements.tpsValue) {
    elements.tpsValue.textContent = isOnline ? serverState.tps.toFixed(1) : '0.0';
  }
  if (elements.tpsStatValue) {
    elements.tpsStatValue.textContent = isOnline ? `${serverState.tps.toFixed(1)} / 20.0` : '0.0 / 20.0';
  }
  if (elements.tpsSubtext) {
    elements.tpsSubtext.textContent = isOnline ? "Flawless performance (0% lag)" : "Server offline";
  }

  // Last Updated
  if (elements.lastUpdatedTime) {
    const timeStr = serverState.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    elements.lastUpdatedTime.textContent = timeStr;
  }

  // Players section update
  if (elements.onlineCountNum) {
    elements.onlineCountNum.textContent = isOnline ? serverState.onlinePlayers : 0;
  }

  if (elements.playersOfflineState && elements.playersGrid) {
    if (isOnline) {
      elements.playersOfflineState.style.display = 'none';
      elements.playersGrid.style.display = 'grid';
      renderPlayers(serverState.playersList);
    } else {
      elements.playersOfflineState.style.display = 'block';
      elements.playersGrid.style.display = 'none';
      if (elements.playerSearchEmpty) elements.playerSearchEmpty.style.display = 'none';
    }
  }
}

/**
 * Toggles simulation state between Online and Offline for quick testing
 */
function toggleSimulateState() {
  serverState.isOnline = !serverState.isOnline;

  if (serverState.isOnline) {
    serverState.onlinePlayers = 14;
    serverState.playersList = [...MOCK_PLAYERS];
    serverState.ping = 18;
    serverState.tps = 20.0;
    if (elements.simulateToggleText) elements.simulateToggleText.textContent = "Simulate Offline";
    showToastNotification("Simulating ONLINE state.", "success");
  } else {
    serverState.onlinePlayers = 0;
    serverState.playersList = [];
    serverState.ping = 0;
    serverState.tps = 0;
    if (elements.simulateToggleText) elements.simulateToggleText.textContent = "Simulate Online";
    showToastNotification("Simulating OFFLINE state.", "info");
  }

  updateDashboardUI();
}

/* ==========================================================================
   7. PLAYERS RENDERING & SEARCH
   ========================================================================== */
/**
 * Renders the player cards into the grid
 * @param {Array} players Array of player objects
 */
function renderPlayers(players) {
  if (!elements.playersGrid) return;
  elements.playersGrid.innerHTML = '';

  if (!players || players.length === 0) {
    return;
  }

  players.forEach(player => {
    const card = createPlayerCard(player);
    elements.playersGrid.appendChild(card);
  });
}

/**
 * Creates a single player DOM card
 * @param {Object} player
 * @returns {HTMLElement}
 */
function createPlayerCard(player) {
  const card = document.createElement('div');
  card.className = 'player-card';

  // Determine rank CSS class
  const rankClass = `rank-${player.rank.toLowerCase()}`;

  // Avatar source with fallback SVG placeholder
  const avatarUrl = `https://mc-heads.net/avatar/${encodeURIComponent(player.username)}/64`;

  card.innerHTML = `
    <div class="player-avatar-wrap">
      <img src="${avatarUrl}" 
           alt="${player.username}" 
           class="player-avatar" 
           loading="lazy"
           onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect width=%2232%22 height=%2232%22 fill=%22%23334155%22/><rect x=%228%22 y=%228%22 width=%2216%22 height=%2216%22 fill=%22%2322c55e%22/></svg>';">
      <span class="player-online-dot" title="Online"></span>
    </div>
    <div class="player-info">
      <div class="player-name-row">
        <span class="player-name" title="${player.username}">${escapeHtml(player.username)}</span>
        <span class="player-rank ${rankClass}">[${player.rank}]</span>
      </div>
      <div class="player-activity" title="${player.activity}">${escapeHtml(player.activity || 'Surviving')}</div>
      <div class="player-ping">📶 ${player.ping} ms</div>
    </div>
  `;

  return card;
}

/**
 * Filters online players in real-time as the user types
 */
function handlePlayerSearch(e) {
  const query = e.target.value.trim().toLowerCase();
  
  if (!serverState.isOnline) return;

  const filtered = serverState.playersList.filter(player => {
    return player.username.toLowerCase().includes(query) ||
           player.rank.toLowerCase().includes(query) ||
           (player.activity && player.activity.toLowerCase().includes(query));
  });

  renderPlayers(filtered);

  if (elements.playerSearchEmpty && elements.searchQueryText) {
    if (filtered.length === 0 && query !== '') {
      elements.searchQueryText.textContent = query;
      elements.playerSearchEmpty.style.display = 'block';
    } else {
      elements.playerSearchEmpty.style.display = 'none';
    }
  }
}

/* ==========================================================================
   8. CLIPBOARD & TOAST NOTIFICATIONS
   ========================================================================== */
/**
 * Copies text to clipboard and displays user feedback
 * @param {string} text Text to copy
 * @param {string} successMessage Toast notification message
 */
async function copyToClipboard(text, successMessage = "Copied to clipboard!") {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers or non-HTTPS contexts
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }

    // Visual button feedback
    if (elements.copyBtnLabel) {
      const originalText = elements.copyBtnLabel.textContent;
      elements.copyBtnLabel.textContent = "Copied!";
      setTimeout(() => {
        elements.copyBtnLabel.textContent = originalText;
      }, 2000);
    }

    showToastNotification(successMessage, "success");
  } catch (err) {
    console.error("Failed to copy text: ", err);
    showToastNotification("Failed to copy. Please copy manually: " + text, "error");
  }
}

/**
 * Displays a toast notification in the bottom right corner
 * @param {string} message 
 * @param {'success'|'info'|'error'} type 
 */
function showToastNotification(message, type = "success") {
  if (!elements.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icons = {
    success: '✅',
    info: 'ℹ️',
    error: '⚠️'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '✨'}</span>
    <span class="toast-text">${escapeHtml(message)}</span>
  `;

  elements.toastContainer.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ==========================================================================
   9. SCROLL SPY (HIGHLIGHT ACTIVE NAV LINK)
   ========================================================================== */
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-item');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   10. AMBIENT PARTICLES CANVAS (MINECRAFT XP ORBS / EMBER PARTICLES)
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Number of particles based on screen width
  const particleCount = Math.min(35, Math.floor(window.innerWidth / 35));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1.2,
      speedY: Math.random() * 0.45 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.3 ? '#22c55e' : '#10b981'
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

      // Wrap around edges
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(0.65, p.opacity));
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

/**
 * Utility to escape HTML entities and prevent XSS
 */
function escapeHtml(string) {
  if (typeof string !== 'string') return string;
  return string
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
