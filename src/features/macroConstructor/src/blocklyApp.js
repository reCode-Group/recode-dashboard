import { loadScript } from '../app/scripts/load.mjs';
import * as Blockly from '../blockly/blockly.loader.mjs';
import '../blockly/blocks.loader.mjs';
import { javascriptGenerator } from '../blockly/javascript.loader.mjs';
import { luaGenerator } from '../blockly/lua.loader.mjs';
import { pythonGenerator } from '../blockly/python.loader.mjs';
import { openModal } from './modals.js';
import { showToast } from './notifications.js';
import {
	getActiveProject,
	getProjects,
	initializeProjects,
	isActiveProjectDirty,
	isActiveProjectDraft,
	markActiveProjectDirty,
	openProject as openRemoteProject,
	registerProjectDataProvider,
	saveActiveProject,
} from './projectStore.js';
import { downloadScreenshot } from './screenshot.js';

const DEFAULT_AUTOSAVE_INTERVAL = 180000;
const AUTOSAVE_INTERVALS = new Set([0, 30000, 60000, 180000, 300000]);

function setToolboxIcon(index, iconName) {
	const icon = document.querySelector(`#blockly-${index} .blocklyToolboxCategoryIcon`);
	if (icon) icon.textContent = iconName;
}

export async function initBlocklyApp() {
	await loadScript('/blockly/msg/ru.js');

	let workspace = null;
	let autosaveTimer = null;
	let activeAutosaveInterval = null;
	let isResettingProject = false;
	let isWorkspaceDirty = false;
	let isAutosaving = false;
	let unregisterProjectDataProvider = null;
	let ignoreWorkspaceChangesUntil = 0;
	let lastSavedAt = null;

	function updateEmptyState() {
		const emptyState = document.querySelector('.empty-state');
		if (!emptyState || !workspace) return;
		emptyState.style.display = workspace.getTopBlocks().length > 0 ? 'none' : '';
	}

	function getSelectedLanguage() {
		const activeOption = document.querySelector('.radio-option.active');
		return activeOption ? activeOption.dataset.lang : 'js';
	}

	function getProjectData() {
		return {
			workspace: Blockly.serialization.workspaces.save(workspace),
			language: getSelectedLanguage(),
			autosave_interval_ms: getAutosaveInterval(),
		};
	}

	async function persistWorkspace() {
		if (!workspace || isResettingProject) return;
		const project = await saveActiveProject(
			getProjectData(),
			isActiveProjectDraft() ? { createIfDraft: true } : {}
		);
		isWorkspaceDirty = false;
		return project;
	}

	async function saveProjectManually() {
		if (!workspace || isResettingProject) return;

		try {
			if (isActiveProjectDraft()) {
				await saveActiveProject(getProjectData(), { createIfDraft: true });
			} else {
				await saveActiveProject(getProjectData());
			}
			isWorkspaceDirty = false;
			updateAutosaveTimer();
			if (getAutosaveInterval() === 0) {
				document.dispatchEvent(
					new CustomEvent('constructor:autosave-status', { detail: 'disabled' })
				);
			}
			showToast('Проект сохранен.', 'success');
		} catch (error) {
			console.error('Manual save error:', error);
			showToast('Не удалось сохранить проект.', 'error');
		}
	}

	function getAutosaveInterval() {
		const interval = Number(getActiveProject()?.data?.autosave_interval_ms);
		return AUTOSAVE_INTERVALS.has(interval) ? interval : DEFAULT_AUTOSAVE_INTERVAL;
	}

	function stopAutosaveTimer() {
		if (autosaveTimer) window.clearInterval(autosaveTimer);
		autosaveTimer = null;
		activeAutosaveInterval = null;
	}

	function updateAutosaveTimer() {
		const autosaveInterval = getAutosaveInterval();
		if (autosaveInterval === 0) {
			stopAutosaveTimer();
			document.dispatchEvent(
				new CustomEvent('constructor:autosave-status', { detail: 'disabled' })
			);
			return;
		}

		if (autosaveTimer && activeAutosaveInterval === autosaveInterval) return;

		stopAutosaveTimer();
		activeAutosaveInterval = autosaveInterval;
		autosaveTimer = window.setInterval(async () => {
			if (isAutosaving || isResettingProject || hasOpenProjectsModal()) return;

			isAutosaving = true;
			try {
				document.dispatchEvent(
					new CustomEvent('constructor:autosave-status', { detail: 'saving' })
				);
				await persistWorkspace();
			} catch (error) {
				console.error('Autosave error:', error);
				showToast('Не удалось сохранить проект. Повторим по таймеру.', 'error');
			} finally {
				isAutosaving = false;
			}
		}, autosaveInterval);
	}

	function formatLastSaved(value) {
		if (!value) return 'только что';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return 'только что';

		const now = new Date();
		const isSameDay = date.toDateString() === now.toDateString();
		const formatter = new Intl.DateTimeFormat('ru-RU', {
			day: isSameDay ? undefined : '2-digit',
			month: isSameDay ? undefined : '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
		return formatter.format(date);
	}

	function getLastSavedLabel() {
		return lastSavedAt ? formatLastSaved(lastSavedAt) : 'никогда';
	}

	function isWorkspaceMutationEvent(event) {
		if (!event) return true;
		if (event.isUiEvent) return false;

		return [
			'change',
			'create',
			'delete',
			'move',
			'var_create',
			'var_delete',
			'var_rename',
		].includes(event.type);
	}

	function scheduleWorkspacePersistence(event) {
		if (isResettingProject) return;
		if (Date.now() < ignoreWorkspaceChangesUntil) return;
		if (!isWorkspaceMutationEvent(event)) return;

		isWorkspaceDirty = true;
		markActiveProjectDirty();
		document.dispatchEvent(new CustomEvent('constructor:autosave-status', { detail: 'unsaved' }));
		updateAutosaveTimer();
	}

	function resetProject() {
		if (!workspace) return;
		stopAutosaveTimer();
		isWorkspaceDirty = false;
		isResettingProject = true;
		workspace.clear();
		const importExport = document.getElementById('importExport');
		if (importExport) importExport.value = '';
		const generatedCode = document.getElementById('generatedCode');
		if (generatedCode) generatedCode.textContent = '';
		updateEmptyState();
		isResettingProject = false;
	}

	function handleAutosaveIntervalChange() {
		isWorkspaceDirty = true;
		markActiveProjectDirty();
		document.dispatchEvent(new CustomEvent('constructor:autosave-status', { detail: 'unsaved' }));
		updateAutosaveTimer();
	}

	function loadProject(project) {
		if (!workspace || !project) return;
		isResettingProject = true;
		workspace.clear();
		Blockly.serialization.workspaces.load(project.data?.workspace || {}, workspace);

		const language = project.data?.language || 'js';
		document.querySelectorAll('.radio-option').forEach((option) => {
			const isActive = option.dataset.lang === language;
			option.classList.toggle('active', isActive);
			const input = option.querySelector('input');
			if (input) input.checked = isActive;
		});
		const autosaveSelect = document.getElementById('autosaveIntervalSelect');
		if (autosaveSelect) autosaveSelect.value = String(getAutosaveInterval());
		lastSavedAt = project.updated_at || project.updatedAt || null;
		isWorkspaceDirty = false;
		ignoreWorkspaceChangesUntil = Date.now() + 500;
		updateEmptyState();
		isResettingProject = false;
		updateAutosaveTimer();
		document.dispatchEvent(
			new CustomEvent('constructor:autosave-status', {
				detail:
					isActiveProjectDraft() || getAutosaveInterval() === 0
						? { status: getAutosaveInterval() === 0 ? 'disabled' : 'unsaved' }
						: { status: 'saved', savedAt: project.updated_at || project.updatedAt },
			})
		);
	}

	function hasOpenProjectsModal() {
		return document.getElementById('projectsModal')?.style.display === 'flex';
	}

	function handleModalStateChanged() {
		if (!hasOpenProjectsModal()) updateAutosaveTimer();
	}

	function handleBeforeUnload(event) {
		if (!isWorkspaceDirty && !isActiveProjectDirty()) return;
		event.preventDefault();
		event.returnValue = '';
	}

	async function openInitialProjectFromQuery() {
		const projectId = new URLSearchParams(window.location.search).get('project')?.trim();
		if (!projectId) return false;

		try {
			await openRemoteProject(projectId);
			return true;
		} catch (error) {
			console.error('Project query open error:', error);
			showToast('Не удалось открыть проект.', 'error');
			return false;
		}
	}

	function showImportNotification(message, type) {
		showToast(message, type);
	}

	function updateAutosaveStatus(event) {
		const detail =
			typeof event.detail === 'object' && event.detail !== null
				? event.detail
				: { status: event.detail || 'saved' };
		const status = detail.status || 'saved';
		if (status === 'saved') {
			isWorkspaceDirty = false;
			lastSavedAt = detail.savedAt || new Date();
		}

		const labels = {
			unsaved: `Последнее сохранение · ${getLastSavedLabel()}`,
			saved: `Сохранено · ${formatLastSaved(detail.savedAt || new Date())}`,
			saving: 'Сохранение...',
			disabled: 'Автосохранение выключено',
		};
		const className = `autosave-state-${status}`;

		document
			.querySelectorAll('.project-info .status-dot, .autosave-dot, .autosave-badge')
			.forEach((node) => {
				node.classList.remove(
					'autosave-state-saved',
					'autosave-state-saving',
					'autosave-state-unsaved',
					'autosave-state-disabled'
				);
				node.classList.add(className);
			});

		document.querySelectorAll('.autosave').forEach((node) => {
			node.textContent = labels[status] || labels.saved;
		});

		document.querySelectorAll('.manual-save-btn').forEach((node) => {
			node.disabled = status === 'saving';
		});
	}

	function isValidJsonState(state) {
		if (!state || typeof state !== 'object' || Array.isArray(state)) return false;

		const knownKeys = new Set(['blocks', 'variables', 'workspaceComments']);
		if (Object.keys(state).some((key) => !knownKeys.has(key))) return false;
		if (
			state.blocks &&
			(!Array.isArray(state.blocks.blocks) ||
				(state.blocks.languageVersion !== undefined &&
					typeof state.blocks.languageVersion !== 'number'))
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

		return { json: jsonState !== null, jsonState, xml: validXml };
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
				scheduleWorkspacePersistence();
			});
		});

		generateBtn.addEventListener('click', function () {
			const selectedLang = getSelectedLanguage();
			const languageConfig = {
				js: { label: 'JavaScript', generator: javascriptGenerator },
				lua: { label: 'Lua', generator: luaGenerator },
				py: { label: 'Python', generator: pythonGenerator },
			};

			const currentLanguage = languageConfig[selectedLang] || languageConfig.js;
			const output = document.getElementById('generatedCode');

			if (workspace.getTopBlocks().length === 0) {
				output.textContent =
					'// Нет блоков для генерации кода\n// Добавьте блоки в рабочую область';
				showToast('Добавьте блоки в рабочую область перед генерацией кода.', 'warning');
				return;
			}

			try {
				output.textContent = currentLanguage.generator.workspaceToCode(workspace);
				output.className = selectedLang;
				showToast(`Код на ${currentLanguage.label} сгенерирован.`, 'success');
			} catch (error) {
				console.error('Ошибка генерации кода:', error);
				output.textContent = `// Ошибка при генерации кода\n// ${error.message}`;
				showToast('Не удалось сгенерировать код.', 'error');
			}
		});

		clearBtn.addEventListener('click', function () {
			workspace.clear();
			document.getElementById('generatedCode').textContent =
				'// Рабочая область очищена\n// Создайте новые блоки и нажмите "Генерировать"';
			document.getElementById('importExport').value = '';
			taChange();
			persistWorkspace().catch((error) => console.error('Clear save error:', error));
			showToast('Рабочая область очищена.', 'info');
		});

		copyBtn.addEventListener('click', function () {
			const codeToCopy = document.getElementById('generatedCode').textContent;
			navigator.clipboard
				.writeText(codeToCopy)
				.then(() => {
					showToast('Код скопирован в буфер обмена.', 'success');
				})
				.catch((err) => {
					console.error('Ошибка копирования:', err);
					showToast('Не удалось скопировать код.', 'error');
				});
		});
	}

	function addEventHandlers() {
		document.getElementById('save-json').addEventListener('click', saveJson);
		document.getElementById('import').addEventListener('click', load);
		document.getElementById('importExport').addEventListener('input', taChange);
		document.getElementById('manual-save-project')?.addEventListener('click', saveProjectManually);
		document.addEventListener('keydown', handleSaveShortcut, true);
	}

	function removeEventHandlers() {
		document.getElementById('save-json')?.removeEventListener('click', saveJson);
		document.getElementById('import')?.removeEventListener('click', load);
		document.getElementById('importExport')?.removeEventListener('input', taChange);
		document
			.getElementById('manual-save-project')
			?.removeEventListener('click', saveProjectManually);
		document.removeEventListener('keydown', handleSaveShortcut, true);
	}

	function handleSaveShortcut(event) {
		if (!(event.ctrlKey || event.metaKey)) return;
		if (event.code !== 'KeyS' && event.key?.toLowerCase() !== 's') return;
		event.preventDefault();
		event.stopPropagation();
		saveProjectManually();
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
								fields: { NAME: 'my_first_func' },
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

	async function start() {
		const match = location.search.match(/dir=([^&]+)/);
		const rtl = match && match[1] === 'rtl';
		const toolbox = document.getElementById('toolbox-categories');
		const autoimport = !!location.search.match(/autoimport=([^&]+)/);

		workspace = Blockly.inject('blocklyDiv', {
			comments: true,
			collapse: true,
			disable: true,
			grid: { spacing: 25, length: 3, colour: '#ccc', snap: true },
			horizontalLayout: false,
			maxBlocks: Infinity,
			maxInstances: { test_basic_limit_instances: 3 },
			maxTrashcanContents: 256,
			media: '/app/media/',
			oneBasedIndex: true,
			readOnly: false,
			rtl,
			move: { scrollbars: true, drag: true, wheel: false },
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

		unregisterProjectDataProvider = registerProjectDataProvider(getProjectData);
		workspace.addChangeListener(scheduleWorkspacePersistence);
		document.addEventListener('constructor:project-loaded', onProjectLoaded);
		document.addEventListener(
			'constructor:autosave-interval-changed',
			handleAutosaveIntervalChange
		);
		document.addEventListener('constructor:autosave-status', updateAutosaveStatus);
		document.addEventListener('constructor:modal-state-changed', handleModalStateChanged);
		window.addEventListener('beforeunload', handleBeforeUnload);

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

		try {
			await initializeProjects();
			const isQueryProjectOpen = await openInitialProjectFromQuery();
			if (!isQueryProjectOpen && getProjects().length > 0) {
				openModal();
			}
		} catch (error) {
			console.error('Project initialization error:', error);
			showToast('Не удалось загрузить проекты.', 'error');
		}
	}

	function onProjectLoaded(event) {
		loadProject(event.detail);
	}

	await start();

	return () => {
		removeEventHandlers();
		stopAutosaveTimer();
		unregisterProjectDataProvider?.();
		document.removeEventListener('constructor:project-loaded', onProjectLoaded);
		document.removeEventListener(
			'constructor:autosave-interval-changed',
			handleAutosaveIntervalChange
		);
		document.removeEventListener('constructor:autosave-status', updateAutosaveStatus);
		document.removeEventListener('constructor:modal-state-changed', handleModalStateChanged);
		window.removeEventListener('beforeunload', handleBeforeUnload);
		workspace?.removeChangeListener(scheduleWorkspacePersistence);
		workspace?.dispose();
	};
}
