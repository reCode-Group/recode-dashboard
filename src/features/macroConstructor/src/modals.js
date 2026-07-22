const projects = [
  {id: 1, name: 'Без_названия_проект_001.rcd', lastModified: '2 часа назад', createdDate: '15.01.2024', status: 'active'},
  {id: 2, name: 'Без_названия_проект_002.rcd', lastModified: 'Вчера', createdDate: '10.01.2024', status: 'active'},
  {id: 3, name: 'Без_названия_проект_003.rcd', lastModified: '3 дня назад', createdDate: '05.01.2024', status: 'inactive'},
  {id: 4, name: 'Без_названия_проект_004.rcd', lastModified: 'Неделю назад', createdDate: '25.12.2023', status: 'active'},
  {id: 5, name: 'Без_названия_проект_005.rcd', lastModified: '2 недели назад', createdDate: '15.12.2023', status: 'active'},
  {id: 6, name: 'Без_названия_проект_006.rcd', lastModified: '2 недели назад', createdDate: '15.12.2023', status: 'active'},
  {id: 7, name: 'Без_названия_проект_007.rcd', lastModified: '2 недели назад', createdDate: '15.12.2023', status: 'active'},
  {id: 8, name: 'Без_названия_проект_008.rcd', lastModified: '2 недели назад', createdDate: '15.12.2023', status: 'active'},
  {id: 9, name: 'Без_названия_проект_009.rcd', lastModified: '2 недели назад', createdDate: '15.12.2023', status: 'active'},
  {id: 10, name: 'Без_названия_проект_010.rcd', lastModified: '2 недели назад', createdDate: '15.12.2023', status: 'active'},
  {id: 11, name: 'Без_названия_проект_011.rcd', lastModified: '2 недели назад', createdDate: '15.12.2023', status: 'active'},
];

const AUTOSAVE_INTERVAL_STORAGE_KEY = 'constructorAutosaveInterval';
const DEFAULT_AUTOSAVE_INTERVAL = 180000;
const AUTOSAVE_INTERVALS = new Set([0, 30000, 60000, 180000, 300000]);

let initialized = false;
const listeners = [];

function addListener(target, event, handler) {
  if (!target) return;
  target.addEventListener(event, handler);
  listeners.push(() => target.removeEventListener(event, handler));
}

function closeOverlay(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.opacity = '0';
  setTimeout(() => {
    modal.style.display = 'none';
    const hasOpenModal = [...document.querySelectorAll('.modal-overlay')].some(
      (overlay) => overlay.style.display === 'flex',
    );
    if (!hasOpenModal) document.body.style.overflow = 'auto';
  }, 300);
}

function openOverlay(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return null;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);
  return modal;
}

function getAutosaveInterval() {
  const savedInterval = Number(localStorage.getItem(AUTOSAVE_INTERVAL_STORAGE_KEY));
  return AUTOSAVE_INTERVALS.has(savedInterval) ? savedInterval : DEFAULT_AUTOSAVE_INTERVAL;
}

export function openModal() {
  const modal = document.getElementById('projectsModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  loadProjects();
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);
}

export function closeModal() {
  closeOverlay('projectsModal');
}

function selectProject(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  document.querySelectorAll('.table-row').forEach((row) => row.classList.remove('selected'));
  const selectedRow = document.querySelector(`[data-project-id="${projectId}"]`);
  selectedRow?.classList.add('selected');
}

function openProject(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  alert(`Открываем проект: ${project.name}`);
  closeModal();
}

function loadProjects() {
  const tableBody = document.getElementById('projectsTableBody');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  projects.forEach((project) => {
    const row = document.createElement('div');
    row.className = 'table-row';
    row.setAttribute('data-project-id', String(project.id));

    row.innerHTML = `
      <div class="table-cell name-cell">
        <span class="status-dot ${project.status}"></span>
        ${project.name}
      </div>
      <div class="table-cell modified-cell">${project.lastModified}</div>
      <div class="table-cell created-cell">${project.createdDate}</div>
      <div class="table-cell actions-cell">
        <button class="action-btn" title="Открыть проект" data-open-project="${project.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M10 6H6C5.46957 6 4.96086 6.21071 4.58579 6.58579C4.21071 6.96086 4 7.46957 4 8V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    addListener(row, 'click', (e) => {
      if (!e.target.closest('.action-btn')) {
        selectProject(project.id);
      }
    });

    const actionButton = row.querySelector('[data-open-project]');
    addListener(actionButton, 'click', () => openProject(project.id));

    tableBody.appendChild(row);
  });
}

export function createNewProject() {
  const projectName = prompt('Введите название нового проекта:', 'Новый проект');
  if (!projectName || projectName.trim() === '') return;

  projects.unshift({
    id: projects.length + 1,
    name: projectName.trim(),
    lastModified: 'Только что',
    createdDate: new Date().toLocaleDateString('ru-RU'),
    status: 'active',
  });

  loadProjects();
}

export function openProjectEditModal() {
  const modal = openOverlay('projectEditModal');
  const currentName = document.querySelector('.project-name')?.textContent || '';
  const input = document.getElementById('projectNameInput');
  const autosaveSelect = document.getElementById('autosaveIntervalSelect');
  if (!modal || !input) return;

  input.value = currentName;
  if (autosaveSelect) autosaveSelect.value = String(getAutosaveInterval());

  setTimeout(() => {
    modal.style.opacity = '1';
    input.focus();
    input.select();
  }, 10);
}

export function closeProjectEditModal() {
  closeOverlay('projectEditModal');
}

export function openProjectDeleteModal() {
  openOverlay('projectDeleteModal');
}

export function closeProjectDeleteModal() {
  closeOverlay('projectDeleteModal');
}

export function confirmProjectDeletion() {
  localStorage.removeItem('projectName');
  const projectNameEl = document.querySelector('.project-name');
  if (projectNameEl) projectNameEl.textContent = 'Без_названия_проект_001.rcd';

  document.dispatchEvent(new CustomEvent('constructor:project-deleted'));
  closeProjectDeleteModal();
  closeProjectEditModal();
  showNotification('Проект удалён. Открыт новый пустой проект.', 'info');
}

export function saveProjectName() {
  const input = document.getElementById('projectNameInput');
  const newName = input?.value.trim();

  if (!newName) {
    alert('Введите название проекта');
    input?.focus();
    return;
  }

  const projectNameEl = document.querySelector('.project-name');
  if (projectNameEl) projectNameEl.textContent = newName;
  closeProjectEditModal();
  localStorage.setItem('projectName', newName);
}

function getSelectedLanguage() {
  const activeOption = document.querySelector('.radio-option.active');
  return activeOption ? activeOption.dataset.lang : 'js';
}

function showNotification(message, type) {
  const existingNotifications = document.querySelectorAll('.notification-toast');
  existingNotifications.forEach((note) => note.remove());

  const notification = document.createElement('div');
  notification.className = 'notification-toast';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white;
      font-size: 14px;
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      z-index: 1001;
      animation: slideIn 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
      ${message}
    </div>
  `;

  const host = document.getElementById('notifications-root') || document.body;
  host.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

export function openCodeFullModal() {
  const modal = document.getElementById('codeFullModal');
  const codeElement = document.getElementById('generatedCode');
  const fullCodeElement = document.getElementById('fullGeneratedCode');
  if (!modal || !codeElement || !fullCodeElement) return;

  const code = codeElement.textContent || '';
  const language = getSelectedLanguage();
  const languageNames = {js: 'JavaScript', lua: 'Lua', py: 'Python'};

  fullCodeElement.textContent = code;
  fullCodeElement.className = language;

  const fullCodeLanguage = document.getElementById('fullCodeLanguage');
  if (fullCodeLanguage) fullCodeLanguage.textContent = languageNames[language] || 'JavaScript';

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);
}

export function closeCodeFullModal() {
  closeOverlay('codeFullModal');
}

export function copyFullCode() {
  const codeToCopy = document.getElementById('fullGeneratedCode')?.textContent || '';
  navigator.clipboard
    .writeText(codeToCopy)
    .then(() => showNotification('Код скопирован в буфер обмена!', 'success'))
    .catch((err) => {
      console.error('Ошибка копирования:', err);
      showNotification('Ошибка при копировании кода', 'error');
    });
}

export function downloadFullCode() {
  const codeToDownload = document.getElementById('fullGeneratedCode')?.textContent || '';
  const language = getSelectedLanguage();
  const extension = {js: 'js', lua: 'lua', py: 'py'}[language] || 'js';
  const filename = `generated_code_${Date.now()}.${extension}`;

  const blob = new Blob([codeToDownload], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showNotification('Код скачан!', 'success');
}

export function initModals() {
  if (initialized) return () => {};
  initialized = true;

  const notificationStyles = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;

  if (!document.querySelector('#notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = notificationStyles;
    document.head.appendChild(style);
  }

  const onKeydown = (e) => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('codeFullModal')?.style.display === 'flex') closeCodeFullModal();
    if (document.getElementById('projectDeleteModal')?.style.display === 'flex') closeProjectDeleteModal();
    if (document.getElementById('projectEditModal')?.style.display === 'flex') closeProjectEditModal();
    closeModal();
  };

  addListener(document, 'keydown', onKeydown);

  addListener(document.getElementById('projectsModal'), 'click', function (e) {
    if (e.target === this) closeModal();
  });

  addListener(document.getElementById('projectEditModal'), 'click', function (e) {
    if (e.target === this) closeProjectEditModal();
  });

  addListener(document.getElementById('projectDeleteModal'), 'click', function (e) {
    if (e.target === this) closeProjectDeleteModal();
  });

  addListener(document.getElementById('codeFullModal'), 'click', function (e) {
    if (e.target === this) closeCodeFullModal();
  });

  addListener(document.getElementById('projectNameInput'), 'keypress', (e) => {
    if (e.key === 'Enter') saveProjectName();
  });

  addListener(document.getElementById('autosaveIntervalSelect'), 'change', (e) => {
    const interval = Number(e.target.value);
    localStorage.setItem(
      AUTOSAVE_INTERVAL_STORAGE_KEY,
      String(AUTOSAVE_INTERVALS.has(interval) ? interval : DEFAULT_AUTOSAVE_INTERVAL),
    );
    document.dispatchEvent(new CustomEvent('constructor:autosave-interval-changed'));
  });

  if (!localStorage.getItem(AUTOSAVE_INTERVAL_STORAGE_KEY)) {
    localStorage.setItem(AUTOSAVE_INTERVAL_STORAGE_KEY, String(DEFAULT_AUTOSAVE_INTERVAL));
  }

  const savedName = localStorage.getItem('projectName');
  if (savedName) {
    const projectNameEl = document.querySelector('.project-name');
    if (projectNameEl) projectNameEl.textContent = savedName;
  }

  return () => {
    listeners.splice(0).forEach((off) => off());
    initialized = false;
  };
}
