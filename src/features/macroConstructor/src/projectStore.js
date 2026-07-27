import {
  createMacroConstructorProject,
  deleteMacroConstructorProject,
  getMacroConstructorProject,
  listMacroConstructorProjects,
  updateMacroConstructorProject,
} from 'services/macroConstructor';

const DEFAULT_AUTOSAVE_INTERVAL = 180000;
const DEFAULT_PROJECT_NAME = 'Новый проект';

let activeProject = null;
let projects = [];
let projectDataProvider = null;
let activeProjectDirty = false;

export function getDefaultProjectData() {
  return { workspace: {}, language: 'js', autosave_interval_ms: DEFAULT_AUTOSAVE_INTERVAL };
}

function normalizeProject(project) {
  return { ...project, data: project?.data && typeof project.data === 'object' ? project.data : getDefaultProjectData() };
}

function emit(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

function syncProjectQuery(projectId) {
  if (projectId == null || typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.set('project', String(projectId));
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

function clearProjectQuery() {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('project');
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

function updateProjectName() {
  document.querySelectorAll('.project-name').forEach((node) => {
    node.textContent = activeProject?.name || DEFAULT_PROJECT_NAME;
  });
}

function setActiveProject(project, options = {}) {
  activeProject = normalizeProject(project);
  activeProjectDirty = false;
  if (options.syncUrl && !isActiveProjectDraft()) {
    syncProjectQuery(activeProject.id);
  } else if (options.syncUrl && isActiveProjectDraft()) {
    clearProjectQuery();
  }
  updateProjectName();
  emit('constructor:project-loaded', activeProject);
  return activeProject;
}

function createDraftProject(data = getDefaultProjectData()) {
  return {
    id: null,
    name: DEFAULT_PROJECT_NAME,
    data,
    isDraft: true,
  };
}

export function getActiveProject() {
  return activeProject;
}

export function isActiveProjectDraft() {
  return activeProject?.isDraft === true || activeProject?.id == null;
}

export function isActiveProjectDirty() {
  return activeProjectDirty;
}

export function markActiveProjectDirty() {
  activeProjectDirty = true;
}

export function registerProjectDataProvider(provider) {
  projectDataProvider = typeof provider === 'function' ? provider : null;
  return () => {
    if (projectDataProvider === provider) {
      projectDataProvider = null;
    }
  };
}

export function getCurrentProjectData() {
  if (typeof projectDataProvider === 'function') {
    return projectDataProvider();
  }

  return activeProject?.data || getDefaultProjectData();
}

export function patchActiveProjectData(patch) {
  if (!activeProject) return;
  activeProject = { ...activeProject, data: { ...activeProject.data, ...patch } };
}

export async function initializeProjects() {
  projects = (await listMacroConstructorProjects()).map(normalizeProject);
  return setActiveProject(createDraftProject());
}

export async function refreshProjects() {
  projects = (await listMacroConstructorProjects()).map(normalizeProject);
  return projects;
}

export async function openProject(projectId) {
  const project = normalizeProject(await getMacroConstructorProject(projectId));
  projects = projects.map((item) => (item.id === project.id ? project : item));
  return setActiveProject(project, { syncUrl: true });
}

export async function createProject(name) {
  const project = normalizeProject(await createMacroConstructorProject({ name, data: getDefaultProjectData() }));
  projects = [project, ...projects];
  return setActiveProject(project, { syncUrl: true });
}

export async function saveActiveProject(data, options = {}) {
  if (!activeProject) return null;
  const name = options.name || activeProject.name;

  if (isActiveProjectDraft()) {
    if (!options.createIfDraft) return null;

    emit('constructor:autosave-status', 'saving');
    try {
      const project = normalizeProject(await createMacroConstructorProject({ name, data }));
      projects = [project, ...projects];
      activeProject = project;
      activeProjectDirty = false;
      syncProjectQuery(project.id);
      updateProjectName();
      emit('constructor:autosave-status', {status: 'saved', savedAt: project.updated_at || project.updatedAt});
      return project;
    } catch (error) {
      emit('constructor:autosave-status', 'saving');
      throw error;
    }
  }

  emit('constructor:autosave-status', 'saving');
  try {
    const project = normalizeProject(
      await updateMacroConstructorProject(activeProject.id, { name, data }),
    );
    projects = projects.map((item) => (item.id === project.id ? project : item));
    activeProject = project;
    activeProjectDirty = false;
    emit('constructor:autosave-status', {status: 'saved', savedAt: project.updated_at || project.updatedAt});
    return project;
  } catch (error) {
    emit('constructor:autosave-status', 'saving');
    throw error;
  }
}

export async function renameActiveProject(name) {
  if (!activeProject) return null;
  const data = getCurrentProjectData();

  if (isActiveProjectDraft()) {
    return saveActiveProject(data, { createIfDraft: true, name });
  }

  return saveActiveProject(data, { name });
}

export async function deleteActiveProject() {
  if (!activeProject) return null;
  const deletedId = activeProject.id;
  await deleteMacroConstructorProject(deletedId);
  projects = projects.filter((project) => project.id !== deletedId);
  if (projects.length === 0) return setActiveProject(createDraftProject(), { syncUrl: true });
  return openProject(projects[0].id);
}

export function getProjects() {
  return projects;
}
