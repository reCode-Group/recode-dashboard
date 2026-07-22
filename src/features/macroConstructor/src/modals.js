import {
  createProject,
  deleteActiveProject,
  getActiveProject,
  getProjects,
  openProject as openRemoteProject,
  patchActiveProjectData,
  refreshProjects,
  renameActiveProject,
} from './projectStore.js';
import {showToast} from './notifications.js';

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

function formatDate(value) {
  if (!value) return 'Только что';
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getAutosaveInterval() {
  const interval = Number(getActiveProject()?.data?.autosave_interval_ms);
  return AUTOSAVE_INTERVALS.has(interval) ? interval : DEFAULT_AUTOSAVE_INTERVAL;
}

function getProjectName() {
  return getActiveProject()?.name || 'Новый проект';
}

function updateDeleteConfirmationState() {
  const input = document.getElementById('projectDeleteConfirmInput');
  const button = document.getElementById('projectDeleteConfirmButton');
  if (!input || !button) return;
  button.disabled = input.value.trim() !== getProjectName();
}

export async function openModal() {
  const modal = openOverlay('projectsModal');
  if (!modal) return;

  try {
    await refreshProjects();
    loadProjects();
  } catch (error) {
    console.error('Projects load error:', error);
    showToast('Не удалось загрузить список проектов.', 'error');
  }
}

export function closeModal() {
  closeOverlay('projectsModal');
}

function selectProject(projectId) {
  document.querySelectorAll('.table-row').forEach((row) => row.classList.remove('selected'));
  const selectedRow = document.querySelector(`[data-project-id="${projectId}"]`);
  selectedRow?.classList.add('selected');
}

async function openProject(projectId) {
  try {
    await openRemoteProject(projectId);
    selectProject(projectId);
    closeModal();
    showToast('Проект открыт.', 'success');
  } catch (error) {
    console.error('Project open error:', error);
    showToast('Не удалось открыть проект.', 'error');
  }
}

function loadProjects() {
  const tableBody = document.getElementById('projectsTableBody');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  const activeProjectId = getActiveProject()?.id;
  const projects = getProjects();

  if (projects.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'projects-empty-state';
    emptyState.innerHTML = `
      <span class="material-symbols-outlined">folder_off</span>
      <h3>Проектов пока нет</h3>
      <p>Создайте первый проект, чтобы начать собирать и сохранять макросы.</p>
    `;
    tableBody.appendChild(emptyState);
    return;
  }

  projects.forEach((project) => {
    const row = document.createElement('div');
    row.className = `table-row${project.id === activeProjectId ? ' selected' : ''}`;
    row.setAttribute('data-project-id', String(project.id));

    row.innerHTML = `
      <div class="table-cell name-cell">
        <span class="status-dot ${project.id === activeProjectId ? 'active' : 'inactive'}"></span>
        ${escapeHtml(project.name)}
      </div>
      <div class="table-cell modified-cell">${formatDate(project.updated_at || project.updatedAt)}</div>
      <div class="table-cell created-cell">${formatDate(project.created_at || project.createdAt)}</div>
      <div class="table-cell actions-cell">
        <button class="action-btn" type="button" title="Открыть проект" data-open-project="${project.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M10 6H6C5.46957 6 4.96086 6.21071 4.58579 6.58579C4.21071 6.96086 4 7.46957 4 8V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    row.addEventListener('click', (e) => {
      if (!e.target.closest('.action-btn')) selectProject(project.id);
    });

    const actionButton = row.querySelector('[data-open-project]');
    actionButton?.addEventListener('click', () => openProject(project.id));

    tableBody.appendChild(row);
  });
}

export function createNewProject() {
  const modal = openOverlay('projectCreateModal');
  const input = document.getElementById('newProjectNameInput');
  if (!modal || !input) return;

  input.value = 'Новый проект';
  setTimeout(() => {
    input.focus();
    input.select();
  }, 10);
}

export function closeProjectCreateModal() {
  closeOverlay('projectCreateModal');
}

export async function confirmProjectCreation() {
  const input = document.getElementById('newProjectNameInput');
  const name = input?.value.trim();

  if (!name) {
    showToast('Введите название проекта.', 'warning');
    input?.focus();
    return;
  }

  try {
    await createProject(name);
    closeProjectCreateModal();
    loadProjects();
    showToast('Проект создан.', 'success');
  } catch (error) {
    console.error('Project create error:', error);
    showToast('Не удалось создать проект.', 'error');
  }
}

export function openProjectEditModal() {
  const modal = openOverlay('projectEditModal');
  const input = document.getElementById('projectNameInput');
  const autosaveSelect = document.getElementById('autosaveIntervalSelect');
  if (!modal || !input) return;

  input.value = getProjectName();
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
  const nameEl = document.getElementById('projectDeleteName');
  if (nameEl) nameEl.textContent = getProjectName();
  const confirmNameEl = document.getElementById('projectDeleteConfirmName');
  if (confirmNameEl) confirmNameEl.textContent = getProjectName();
  const input = document.getElementById('projectDeleteConfirmInput');
  if (input) input.value = '';
  updateDeleteConfirmationState();
  const modal = openOverlay('projectDeleteModal');
  if (modal && input) {
    setTimeout(() => input.focus(), 10);
  }
}

export function closeProjectDeleteModal() {
  closeOverlay('projectDeleteModal');
}

export async function confirmProjectDeletion() {
  const input = document.getElementById('projectDeleteConfirmInput');
  if (input?.value.trim() !== getProjectName()) {
    showToast('Введите точное название проекта для подтверждения.', 'warning');
    input?.focus();
    return;
  }

  try {
    const deletedName = getProjectName();
    await deleteActiveProject();
    closeProjectDeleteModal();
    closeProjectEditModal();
    showToast(`Проект «${deletedName}» удалён.`, 'info');
  } catch (error) {
    console.error('Project delete error:', error);
    showToast('Не удалось удалить проект.', 'error');
  }
}

export async function saveProjectName() {
  const input = document.getElementById('projectNameInput');
  const newName = input?.value.trim();

  if (!newName) {
    showToast('Введите название проекта.', 'warning');
    input?.focus();
    return;
  }

  try {
    await renameActiveProject(newName);
    closeProjectEditModal();
    showToast('Настройки проекта сохранены.', 'success');
  } catch (error) {
    console.error('Project rename error:', error);
    showToast('Не удалось сохранить настройки проекта.', 'error');
  }
}

function getSelectedLanguage() {
  const activeOption = document.querySelector('.radio-option.active');
  return activeOption ? activeOption.dataset.lang : 'js';
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
    .then(() => showToast('Код скопирован в буфер обмена.', 'success'))
    .catch((err) => {
      console.error('Copy error:', err);
      showToast('Не удалось скопировать код.', 'error');
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

  showToast('Код скачан.', 'success');
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
    if (document.getElementById('projectCreateModal')?.style.display === 'flex') closeProjectCreateModal();
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

  addListener(document.getElementById('projectCreateModal'), 'click', function (e) {
    if (e.target === this) closeProjectCreateModal();
  });

  addListener(document.getElementById('codeFullModal'), 'click', function (e) {
    if (e.target === this) closeCodeFullModal();
  });

  addListener(document.getElementById('projectNameInput'), 'keypress', (e) => {
    if (e.key === 'Enter') saveProjectName();
  });

  addListener(document.getElementById('newProjectNameInput'), 'keypress', (e) => {
    if (e.key === 'Enter') confirmProjectCreation();
  });

  addListener(document.getElementById('projectDeleteConfirmInput'), 'input', updateDeleteConfirmationState);

  addListener(document.getElementById('autosaveIntervalSelect'), 'change', (e) => {
    const interval = Number(e.target.value);
    patchActiveProjectData({
      autosave_interval_ms: AUTOSAVE_INTERVALS.has(interval) ? interval : DEFAULT_AUTOSAVE_INTERVAL,
    });
    document.dispatchEvent(new CustomEvent('constructor:autosave-interval-changed'));
  });

  return () => {
    listeners.splice(0).forEach((off) => off());
    initialized = false;
  };
}
