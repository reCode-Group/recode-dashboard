import * as Blockly from '../blockly/src/core/blockly.js';
import { blocks } from '../blockly/src/blocks/blocks.js';
import { defineBlocks } from '../blockly/src/core/common.js';
import { luaGenerator } from '../blockly/src/generators/lua.js';
import { javascriptGenerator } from '../blockly/src/generators/javascript.js';
import { pythonGenerator } from '../blockly/src/generators/python.js';
import {blocklyMediaUrl} from './assets.js';
import {downloadScreenshot} from './screenshot.js';

function setToolboxIcon(index, iconName) {
  const icon = document.querySelector(`#blockly-${index} .blocklyToolboxCategoryIcon`);
  if (icon) icon.textContent = iconName;
}

export async function initBlocklyApp() {
  defineBlocks(blocks);

  let workspace = null;

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
    if (valid.json) {
      const state = JSON.parse(input.value);
      Blockly.serialization.workspaces.load(state, workspace);
    } else if (valid.xml) {
      const xml = Blockly.utils.xml.textToDom(input.value);
      Blockly.Xml.domToWorkspace(xml, workspace);
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
    let validJson = true;
    try {
      JSON.parse(save);
    } catch {
      validJson = false;
    }

    let validXml = true;
    try {
      Blockly.utils.xml.textToDom(save);
    } catch {
      validXml = false;
    }

    return {json: validJson, xml: validXml};
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
      media: blocklyMediaUrl,
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

    workspace.addChangeListener(function () {
      const state = Blockly.serialization.workspaces.save(workspace);
      localStorage.setItem('blocklyWorkspaceState', JSON.stringify(state));
    });

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

    setTimeout(() => {
      const savedState = localStorage.getItem('blocklyWorkspaceState');
      if (!savedState) return;

      try {
        const state = JSON.parse(savedState);
        Blockly.serialization.workspaces.load(state, workspace);
        const topBlocks = workspace.getTopBlocks();
        if (topBlocks.length > 0) {
          workspace.centerOnBlock(topBlocks[0].id);
          const emptyState = document.querySelector('.empty-state');
          if (emptyState) emptyState.style.display = 'none';
        }
      } catch (e) {
        console.error('Ошибка загрузки сохраненного состояния:', e);
      }
    }, 100);

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
    workspace?.dispose();
  };
}
