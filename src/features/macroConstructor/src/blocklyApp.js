import {loadScript} from '../app/scripts/load.mjs';
import * as Blockly from '../blockly/blockly.loader.mjs';
import '../blockly/blocks.loader.mjs';
import {luaGenerator} from '../blockly/lua.loader.mjs';
import {javascriptGenerator} from '../blockly/javascript.loader.mjs';
import {pythonGenerator} from '../blockly/python.loader.mjs';
import {downloadScreenshot} from './screenshot.js';

const AUTOSAVE_INTERVAL_STORAGE_KEY = 'constructorAutosaveInterval';
const DEFAULT_AUTOSAVE_INTERVAL = 180000;
const AUTOSAVE_INTERVALS = new Set([0, 30000, 60000, 180000, 300000]);

function setToolboxIcon(index, iconName) {
  const icon = document.querySelector(`#blockly-${index} .blocklyToolboxCategoryIcon`);
  if (icon) icon.textContent = iconName;
}

export async function initBlocklyApp() {
  await loadScript('/blockly/msg/ru.js');

  let workspace = null;
  let autosaveTimeout = null;
  let isResettingProject = false;
  let isWorkspaceDirty = false;

  function updateEmptyState() {
    const emptyState = document.querySelector('.empty-state');
    if (!emptyState || !workspace) return;
    emptyState.style.display = workspace.getTopBlocks().length > 0 ? 'none' : '';
  }

  function persistWorkspace() {
    if (!workspace || isResettingProject) return;
    if (autosaveTimeout) window.clearTimeout(autosaveTimeout);
    autosaveTimeout = null;
    const state = Blockly.serialization.workspaces.save(workspace);
    localStorage.setItem('blocklyWorkspaceState', JSON.stringify(state));
    isWorkspaceDirty = false;
  }

  function getAutosaveInterval() {
    const savedInterval = Number(localStorage.getItem(AUTOSAVE_INTERVAL_STORAGE_KEY));
    return AUTOSAVE_INTERVALS.has(savedInterval) ? savedInterval : DEFAULT_AUTOSAVE_INTERVAL;
  }

  function scheduleWorkspacePersistence() {
    if (isResettingProject) return;
    isWorkspaceDirty = true;
    if (autosaveTimeout) window.clearTimeout(autosaveTimeout);

    const autosaveInterval = getAutosaveInterval();
    if (autosaveInterval === 0) return;

    autosaveTimeout = window.setTimeout(() => {
      autosaveTimeout = null;
      persistWorkspace();
    }, autosaveInterval);
  }

  function resetProject() {
    if (!workspace) return;
    if (autosaveTimeout) window.clearTimeout(autosaveTimeout);
    autosaveTimeout = null;
    isWorkspaceDirty = false;
    isResettingProject = true;
    workspace.clear();
    localStorage.removeItem('blocklyWorkspaceState');
    sessionStorage.removeItem('textarea');

    const importExport = document.getElementById('importExport');
    if (importExport) importExport.value = '';
    const generatedCode = document.getElementById('generatedCode');
    if (generatedCode) generatedCode.textContent = '';
    updateEmptyState();
    isResettingProject = false;
  }

  function handleAutosaveIntervalChange() {
    if (autosaveTimeout) window.clearTimeout(autosaveTimeout);
    autosaveTimeout = null;
    if (isWorkspaceDirty) scheduleWorkspacePersistence();
  }

  function showImportNotification(message, type) {
    document.querySelector('.notification')?.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    const host = document.getElementById('notifications-root') || document.body;
    host.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  function isValidJsonState(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state)) return false;

    const knownKeys = new Set(['blocks', 'variables', 'workspaceComments']);
    if (Object.keys(state).some((key) => !knownKeys.has(key))) return false;
    if (
      state.blocks &&
      (!Array.isArray(state.blocks.blocks) ||
        (state.blocks.languageVersion !== undefined && typeof state.blocks.languageVersion !== 'number'))
    ) {
      return false;
    }
    if (state.variables && !Array.isArray(state.variables)) return false;
    if (state.workspaceComments && !Array.isArray(state.workspaceComments)) return false;

    return true;
  }

  function saveJson() {
    const output = document.getElementById('importExport');
    const state = Blockly.serialization.workspaces.save(workspace);
    output.value = JSON.stringify(state, null, 2);
    output.focus();
    output.select();
    taChange();
  }

  function load() {
    const input = document.getElementById('importExport');
    if (!input.value) return;

    const valid = saveIsValid(input.value);
    const previousState = Blockly.serialization.workspaces.save(workspace);

    try {
      if (valid.json) {
        Blockly.serialization.workspaces.load(valid.jsonState, workspace);
      } else if (valid.xml) {
        const xml = Blockly.utils.xml.textToDom(input.value);
        Blockly.Xml.domToWorkspace(xml, workspace);
      } else {
        return;
      }

      persistWorkspace();
      updateEmptyState();
      const topBlocks = workspace.getTopBlocks();
      if (topBlocks.length > 0) workspace.centerOnBlock(topBlocks[0].id);
      showImportNotification('Блоки успешно импортированы!', 'success');
    } catch (error) {
      console.error('Ошибка импорта блоков:', error);
      Blockly.serialization.workspaces.load(previousState, workspace);
      persistWorkspace();
      updateEmptyState();
      showImportNotification('Не удалось импортировать блоки. Проверьте данные.', 'error');
    }

    taChange();
  }

  function taChange() {
    const textarea = document.getElementById('importExport');
    if (sessionStorage) {
      sessionStorage.setItem('textarea', textarea.value);
    }

    const valid = saveIsValid(textarea.value);
    document.getElementById('import').disabled = !valid.json && !valid.xml;
  }

  function saveIsValid(save) {
    let jsonState = null;
    try {
      const parsed = JSON.parse(save);
      if (isValidJsonState(parsed)) {
        jsonState = parsed;
      }
    } catch {
      jsonState = null;
    }

    let validXml = true;
    try {
      Blockly.utils.xml.textToDom(save);
    } catch {
      validXml = false;
    }

    return {json: jsonState !== null, jsonState, xml: validXml};
  }

  function configureContextMenu(menuOptions) {
    menuOptions.push({
      text: 'Сделать скриншот',
      enabled: workspace.getTopBlocks().length,
      callback: function () {
        downloadScreenshot(workspace);
      },
    });
  }

  function setupSidebarControls() {
    const radioOptions = document.querySelectorAll('.radio-option');
    const generateBtn = document.querySelector('.generate-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const copyBtn = document.querySelector('.copy-btn');

    const generatedCodeElement = document.getElementById('generatedCode');
    generatedCodeElement.textContent =
      '// Создайте блоки в рабочей области\n// Выберите язык (JavaScript, Lua или Python)\n// Нажмите "Генерировать" для создания кода';

    radioOptions.forEach((option) => {
      option.addEventListener('click', function () {
        radioOptions.forEach((opt) => opt.classList.remove('active'));
        this.classList.add('active');
        const radioInput = this.querySelector('input[type="radio"]');
        if (radioInput) radioInput.checked = true;
      });
    });

    generateBtn.addEventListener('click', function () {
      const selectedLang = getSelectedLanguage();
      const languageConfig = {
        js: {label: 'JavaScript', generator: javascriptGenerator},
        lua: {label: 'Lua', generator: luaGenerator},
        py: {label: 'Python', generator: pythonGenerator},
      };

      const currentLanguage = languageConfig[selectedLang] || languageConfig.js;
      const output = document.getElementById('generatedCode');

      if (workspace.getTopBlocks().length === 0) {
        output.textContent = '// Нет блоков для генерации кода\n// Добавьте блоки в рабочую область';
        showNotification('Добавьте блоки в рабочую область перед генерацией кода', 'warning');
        return;
      }

      try {
        output.textContent = currentLanguage.generator.workspaceToCode(workspace);
        output.className = selectedLang;
        showNotification(`Код на ${currentLanguage.label} успешно сгенерирован!`, 'success');
      } catch (error) {
        console.error('Ошибка генерации кода:', error);
        output.textContent = `// Ошибка при генерации кода\n// ${error.message}`;
        showNotification('Ошибка при генерации кода', 'error');
      }
    });

    clearBtn.addEventListener('click', function () {
      workspace.clear();
      document.getElementById('generatedCode').textContent =
        '// Рабочая область очищена\n// Создайте новые блоки и нажмите "Генерировать"';
      document.getElementById('importExport').value = '';
      taChange();
      showNotification('Рабочая область успешно очищена!', 'info');
    });

    copyBtn.addEventListener('click', function () {
      const codeToCopy = document.getElementById('generatedCode').textContent;
      navigator.clipboard
        .writeText(codeToCopy)
        .then(() => {
          showNotification('Код скопирован в буфер обмена!', 'success');
        })
        .catch((err) => {
          console.error('Ошибка копирования:', err);
          showNotification('Ошибка при копировании кода', 'error');
        });
    });

    function getSelectedLanguage() {
      const activeOption = document.querySelector('.radio-option.active');
      return activeOption ? activeOption.dataset.lang : 'js';
    }

    function showNotification(message, type) {
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
        existingNotification.remove();
      }

      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 32px;
        padding: 12px 16px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
      `;

      if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      const host = document.getElementById('notifications-root') || document.body;
      host.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
      }, 3000);
    }
  }

  function addEventHandlers() {
    document.getElementById('save-json').addEventListener('click', saveJson);
    document.getElementById('import').addEventListener('click', load);
    document.getElementById('importExport').addEventListener('input', taChange);
  }

  function removeEventHandlers() {
    document.getElementById('save-json')?.removeEventListener('click', saveJson);
    document.getElementById('import')?.removeEventListener('click', load);
    document.getElementById('importExport')?.removeEventListener('input', taChange);
  }

  function setupFirstBlockMechanism() {
    const addFirstBlockBtn = document.getElementById('addFirstBlockBtn');
    if (addFirstBlockBtn) {
      addFirstBlockBtn.addEventListener('click', function () {
        const firstBlock = {
          blocks: {
            languageVersion: 0,
            blocks: [
              {
                type: 'procedures_defnoreturn',
                id: 'first_block_' + Date.now(),
                x: -37,
                y: -237,
                icons: {
                  comment: {
                    text: 'Создано в [reCode Конструктор макросов]',
                    pinned: false,
                    height: 80,
                    width: 160,
                  },
                },
                fields: {NAME: 'my_first_func'},
              },
            ],
          },
        };

        Blockly.serialization.workspaces.load(firstBlock, workspace);
        workspace.centerOnBlock(workspace.getTopBlocks()[0].id);
        document.querySelector('.empty-state').style.display = 'none';
      });
    }

    if (workspace) {
      workspace.addChangeListener(function () {
        const emptyState = document.querySelector('.empty-state');
        if (workspace.getTopBlocks().length > 0) {
          emptyState.style.display = 'none';
        } else {
          emptyState.style.display = '';
        }
      });
    }
  }

  function start() {
    const match = location.search.match(/dir=([^&]+)/);
    const rtl = match && match[1] === 'rtl';
    const toolbox = document.getElementById('toolbox-categories');
    const autoimport = !!location.search.match(/autoimport=([^&]+)/);

    workspace = Blockly.inject('blocklyDiv', {
      comments: true,
      collapse: true,
      disable: true,
      grid: {spacing: 25, length: 3, colour: '#ccc', snap: true},
      horizontalLayout: false,
      maxBlocks: Infinity,
      maxInstances: {'test_basic_limit_instances': 3},
      maxTrashcanContents: 256,
      media: '/app/media/',
      oneBasedIndex: true,
      readOnly: false,
      rtl,
      move: {scrollbars: true, drag: true, wheel: false},
      toolbox,
      toolboxPosition: 'start',
      renderer: 'geras',
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 4,
        minScale: 0.25,
        scaleSpeed: 1.1,
      },
    });

    workspace.configureContextMenu = configureContextMenu;
    Blockly.ContextMenuItems.registerCommentOptions();

    const savedState = localStorage.getItem('blocklyWorkspaceState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        Blockly.serialization.workspaces.load(state, workspace);
        const topBlocks = workspace.getTopBlocks();
        if (topBlocks.length > 0) workspace.centerOnBlock(topBlocks[0].id);
        updateEmptyState();
      } catch (error) {
        console.error('Ошибка загрузки сохраненного состояния:', error);
      }
    }

    workspace.addChangeListener(scheduleWorkspacePersistence);
    document.addEventListener('constructor:project-deleted', resetProject);
    document.addEventListener('constructor:autosave-interval-changed', handleAutosaveIntervalChange);

    if (sessionStorage) {
      const text = sessionStorage.getItem('textarea');
      if (text !== '            ') {
        document.getElementById('importExport').value = text;
      }
    }

    taChange();
    if (autoimport) load();

    addEventHandlers();
    setupSidebarControls();
    setupFirstBlockMechanism();

    document.querySelectorAll('.tool-icon').forEach((icon) => {
      icon.addEventListener('click', () => {
        console.log('Выбран инструмент');
      });
    });

    setToolboxIcon(0, 'token');
    setToolboxIcon(1, 'data_object');
    setToolboxIcon(2, 'functions');
    setToolboxIcon(4, 'alt_route');
    setToolboxIcon(5, 'repeat');
    setToolboxIcon(6, 'calculate');
    setToolboxIcon(7, 'format_quote');
    setToolboxIcon(8, 'list_alt');
  }

  start();

  return () => {
    removeEventHandlers();
    if (autosaveTimeout) window.clearTimeout(autosaveTimeout);
    document.removeEventListener('constructor:project-deleted', resetProject);
    document.removeEventListener('constructor:autosave-interval-changed', handleAutosaveIntervalChange);
    workspace?.removeChangeListener(scheduleWorkspacePersistence);
    workspace?.dispose();
  };
}
