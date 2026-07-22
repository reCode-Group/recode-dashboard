import { apiRequest } from './apiClient';

const PROJECTS_PATH = '/api/macro-constructor/projects';

export function listMacroConstructorProjects() {
	return apiRequest(PROJECTS_PATH, { method: 'GET' });
}

export function createMacroConstructorProject(payload) {
	return apiRequest(PROJECTS_PATH, { method: 'POST', body: JSON.stringify(payload) });
}

export function getMacroConstructorProject(projectId) {
	return apiRequest(`${PROJECTS_PATH}/${projectId}`, { method: 'GET' });
}

export function updateMacroConstructorProject(projectId, payload) {
	return apiRequest(`${PROJECTS_PATH}/${projectId}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteMacroConstructorProject(projectId) {
	return apiRequest(`${PROJECTS_PATH}/${projectId}`, { method: 'DELETE' });
}
