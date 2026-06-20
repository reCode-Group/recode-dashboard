import { apiRequest } from './apiClient';

export function getOrganizationDetails() {
	return apiRequest('/api/organization/details', {
		method: 'GET',
	});
}

export function createOrganization(payload) {
	return apiRequest('/api/organization/create', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export function getOrganizationEmployees() {
	return apiRequest('/api/organization/employees', {
		method: 'GET',
	});
}

export function createOrganizationEmployee(payload) {
	return apiRequest('/api/organization/employees/create', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export function addExistingOrganizationEmployee(email) {
	return apiRequest('/api/organization/employees/add', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});
}

export function deactivateOrganizationEmployee(email) {
	return apiRequest('/api/organization/employees/deactivate', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});
}

export function transferTokensToEmployee(organizationMemberID, amount) {
	return apiRequest('/api/organization/employees/tokens/transfer', {
		method: 'POST',
		body: JSON.stringify({
			organization_member_id: organizationMemberID,
			amount,
		}),
	});
}
