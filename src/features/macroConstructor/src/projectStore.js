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

export function getDefaultProjectData() {
  return { workspace: {}, language: 'js', autosave_interval_ms: DEFAULT_AUTOSAVE_INTERVAL };
}

function normalizeProject(project) {
  return { ...project, data: project?.data && typeof project.data === 'object' ? project.data : getDefaultProjectData() };
}

function emit(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

function updateProjectName() {
  document.querySelectorAll('.project-name').forEach((node) => {
    node.textContent = activeProject?.name || DEFAULT_PROJECT_NAME;
  });
}

function setActiveProject(project) {
  activeProject = normalizeProject(project);
  updateProjectName();
  emit('constructor:project-loaded', activeProject);
  return activeProject;
}

export function getActiveProject() {
  return activeProject;
}

export function patchActiveProjectData(patch) {
  if (!activeProject) return;
  activeProject = { ...activeProject, data: { ...activeProject.data, ...patch } };
}

export async function initializeProjects() {
  projects = (await listMacroConstructorProjects()).map(normalizeProject);
  if (projects.length === 0) {
    const project = await createMacroConstructorProject({ name: DEFAULT_PROJECT_NAME, data: getDefaultProjectData() });
    projects = [normalizeProject(project)];
  }
  return setActiveProject(projects[0]);
}

export async function refreshProjects() {
  projects = (await listMacroConstructorProjects()).map(normalizeProject);
  return projects;
}

export async function openProject(projectId) {
  const project = normalizeProject(await getMacroConstructorProject(projectId));
  projects = projects.map((item) => (item.id === project.id ? project : item));
  return setActiveProject(project);
}

export async function createProject(name) {
  const project = normalizeProject(await createMacroConstructorProject({ name, data: getDefaultProjectData() }));
  projects = [project, ...projects];
  return setActiveProject(project);
}

export async function saveActiveProject(data) {
  if (!activeProject) return null;
  emit('constructor:autosave-status', 'saving');
  try {
    const project = normalizeProject(
      await updateMacroConstructorProject(activeProject.id, { name: activeProject.name, data }),
    );
    projects = projects.map((item) => (item.id === project.id ? project : item));
    activeProject = project;
    emit('constructor:autosave-status', {status: 'saved', savedAt: project.updated_at || project.updatedAt});
    return project;
  } catch (error) {
    emit('constructor:autosave-status', 'saving');
    throw error;
  }
}

export async function renameActiveProject(name) {
  if (!activeProject) return null;
  const project = normalizeProject(
    await updateMacroConstructorProject(activeProject.id, { name, data: activeProject.data }),
  );
  projects = projects.map((item) => (item.id === project.id ? project : item));
  return setActiveProject(project);
}

export async function deleteActiveProject() {
  if (!activeProject) return null;
  const deletedId = activeProject.id;
  await deleteMacroConstructorProject(deletedId);
  projects = projects.filter((project) => project.id !== deletedId);
  if (projects.length === 0) return createProject(DEFAULT_PROJECT_NAME);
  return openProject(projects[0].id);
}

export function getProjects() {
  return projects;
}
