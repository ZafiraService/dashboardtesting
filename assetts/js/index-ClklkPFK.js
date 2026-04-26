const root = document.getElementById('root');
const authKey = 'sadi_admin_auth';
const adminCredentials = {
  email: 'support@server',
  password: 'supportstaff',
};
let isAuthenticated = localStorage.getItem(authKey) === 'true';

const servers = [
  {
    id: '1050342190756264960',
    name: 'S.A.D.I. Bot Lounge',
    icon: 'https://cdn.discordapp.com/icons/1050342190756264960/a_7c1d3c8b6b68d2dd1f1b1c4a1b8e4a7c.gif',
    members: 8420,
    online: 512,
    region: 'Europe',
    modules: [
      { id: 'automations', name: 'Automazioni', enabled: true },
      { id: 'logs', name: 'Log', enabled: true },
      { id: 'moderation', name: 'Moderazione', enabled: false },
      { id: 'analytics', name: 'Analytics', enabled: true },
    ],
    status: 'Online',
  },
  {
    id: '759123441384237824',
    name: 'S.A.D.I. Support',
    icon: 'https://cdn.discordapp.com/icons/759123441384237824/563abeddb54b8d8d8bf49faae1e1baf7.png',
    members: 5321,
    online: 299,
    region: 'Italy',
    modules: [
      { id: 'automations', name: 'Automazioni', enabled: true },
      { id: 'logs', name: 'Log', enabled: false },
      { id: 'moderation', name: 'Moderazione', enabled: true },
      { id: 'analytics', name: 'Analytics', enabled: false },
    ],
    status: 'Maintenance',
  },
  {
    id: '984542185276981376',
    name: 'S.A.D.I. Team Hub',
    icon: 'https://cdn.discordapp.com/icons/984542185276981376/6f7e5c0e4b46f68cd6f6c3ae2f3d5b1f.png',
    members: 2719,
    online: 146,
    region: 'Global',
    modules: [
      { id: 'automations', name: 'Automazioni', enabled: true },
      { id: 'logs', name: 'Log', enabled: true },
      { id: 'moderation', name: 'Moderazione', enabled: true },
      { id: 'analytics', name: 'Analytics', enabled: true },
    ],
    status: 'Online',
  },
];

function renderHeader(title, subtitle, actions = '') {
  return `
    <div class="dashboard-header">
      <div>
        <p class="eyebrow">S.A.D.I.</p>
        <h1 class="dashboard-title">${title}</h1>
        <p class="dashboard-subtitle">${subtitle}</p>
      </div>
      ${actions}
    </div>
  `;
}

function renderNavigation(active) {
  return `
    <div class="top-nav">
      <button class="nav-button ${active === 'dashboard' ? 'active' : ''}" id="btn-dashboard">Dashboard</button>
      <button class="nav-button ${active === 'manage' ? 'active' : ''}" id="btn-manage">Gestione Server</button>
    </div>
  `;
}

function renderLogin(errorMessage = '') {
  root.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <p class="eyebrow">Accesso Admin</p>
        <h1 class="dashboard-title">Login Amministratore</h1>
        <p class="dashboard-subtitle">Inserisci email e password per accedere al pannello di gestione server.</p>
        ${errorMessage ? `<p class="login-error">${errorMessage}</p>` : ''}
        <form id="login-form" class="login-form">
          <label class="form-label" for="login-email">Email</label>
          <input class="form-input" id="login-email" type="email" value="support@server" required />

          <label class="form-label" for="login-password">Password</label>
          <input class="form-input" id="login-password" type="password" value="supportstaff" required />

          <button type="submit" class="primary-button login-submit">Accedi</button>
        </form>
      </div>
    </div>
  `;
  attachLoginListeners();
}

function renderDashboard() {
  if (!isAuthenticated) {
    renderLogin();
    return;
  }

  root.innerHTML = `
    <div class="dashboard-container">
      ${renderNavigation('dashboard')}
      ${renderHeader('Dashboard', 'Stato attuale automazioni, eventi e controllo rapido.')}
      <div class="dashboard-grid">
        <article class="card">
          <p class="card-label">Attività totali</p>
          <p class="card-value">1.248</p>
          <p class="card-note">Monitorate nelle ultime 24h</p>
        </article>
        <article class="card">
          <p class="card-label">Automazioni attive</p>
          <p class="card-value">87</p>
          <p class="card-note">Tutte funzionanti correttamente</p>
        </article>
        <article class="card">
          <p class="card-label">Allarmi aperti</p>
          <p class="card-value">3</p>
          <p class="card-note">Interventi consigliati</p>
        </article>
        <article class="card card-wide">
          <p class="card-label">Prossimo controllo</p>
          <p class="card-value">Domani, 09:00</p>
          <p class="card-note">Programma la manutenzione preventiva</p>
        </article>
      </div>
    </div>
  `;
  attachNavListeners();
}

function renderModuleToggle(serverId, module) {
  return `
    <label class="toggle-switch">
      <input type="checkbox" data-server="${serverId}" data-module="${module.id}" ${module.enabled ? 'checked' : ''} />
      <span class="slider"></span>
      <span class="toggle-label">${module.name}</span>
    </label>
  `;
}

function renderServerCard(server) {
  return `
    <article class="server-card">
      <div class="server-card-heading">
        <div class="server-avatar">
          <img src="${server.icon}" alt="${server.name}" />
        </div>
        <div>
          <p class="server-name">${server.name}</p>
          <p class="server-meta">ID: ${server.id}</p>
        </div>
        <span class="status-badge ${server.status === 'Online' ? 'online' : server.status === 'Maintenance' ? 'maintenance' : 'offline'}">${server.status}</span>
      </div>
      <div class="server-stats">
        <div>
          <p class="stat-label">Membri</p>
          <p class="stat-value">${server.members}</p>
        </div>
        <div>
          <p class="stat-label">Online</p>
          <p class="stat-value">${server.online}</p>
        </div>
        <div>
          <p class="stat-label">Area</p>
          <p class="stat-value">${server.region}</p>
        </div>
      </div>
      <div class="module-grid">
        ${server.modules.map((module) => renderModuleToggle(server.id, module)).join('')}
      </div>
      <div class="server-actions">
        <button class="ghost-button" data-action="open" data-server="${server.id}">Apri Moduli</button>
        <button class="primary-button" data-action="settings" data-server="${server.id}">Impostazioni Server</button>
      </div>
    </article>
  `;
}

function renderManage() {
  root.innerHTML = `
    <div class="dashboard-container">
      ${renderNavigation('manage')}
      ${renderHeader('Gestione Server', 'Controlla i server Discord collegati e abilita i moduli necessari.')}

      <section class="manage-panel">
        <div class="manage-topbar">
          <div>
            <p class="manage-title">Server collegati</p>
            <p class="manage-description">Questi sono i server reali presi da Discord: puoi attivare o disattivare i moduli per gestire il comportamento del bot.</p>
          </div>
          <div class="search-box">
            <input type="search" id="server-search" placeholder="Cerca server..." />
          </div>
        </div>

        <div id="server-list" class="server-grid">
          ${servers.map(renderServerCard).join('')}
        </div>
      </section>
    </div>
  `;
  attachNavListeners();
  attachServerListeners();
}

function attachNavListeners() {
  const dashboardButton = document.getElementById('btn-dashboard');
  const manageButton = document.getElementById('btn-manage');
  if (dashboardButton) dashboardButton.addEventListener('click', renderDashboard);
  if (manageButton) {
    manageButton.addEventListener('click', () => {
      if (!isAuthenticated) {
        renderLogin();
      } else {
        renderManage();
      }
    });
  }
}

function attachLoginListeners() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (email === adminCredentials.email && password === adminCredentials.password) {
      isAuthenticated = true;
      localStorage.setItem(authKey, 'true');
      renderManage();
    } else {
      renderLogin('Email o password errata. Usa support@server / supportstaff.');
    }
  });
}

function attachServerListeners() {
  const toggles = Array.from(document.querySelectorAll('.toggle-switch input'));
  toggles.forEach((toggle) => {
    toggle.addEventListener('change', (event) => {
      const target = event.target;
      const serverId = target.dataset.server;
      const moduleId = target.dataset.module;
      const server = servers.find((item) => item.id === serverId);
      if (!server) return;
      const moduleItem = server.modules.find((item) => item.id === moduleId);
      if (!moduleItem) return;
      moduleItem.enabled = target.checked;
    });
  });

  const actionButtons = Array.from(document.querySelectorAll('.server-actions button'));
  actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const serverId = button.dataset.server;
      const action = button.dataset.action;
      alert(`Azione: ${action} su server ${serverId}`);
    });
  });

  const searchInput = document.getElementById('server-search');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();
      const list = document.getElementById('server-list');
      if (!list) return;
      list.innerHTML = servers
        .filter((server) => server.name.toLowerCase().includes(query) || server.id.includes(query))
        .map(renderServerCard)
        .join('');
      attachServerListeners();
    });
  }
}

if (isAuthenticated) {
  renderManage();
} else {
  renderLogin();
}
