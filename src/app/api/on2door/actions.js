import client from './client'

// Authentications
export function loginAdministratorApi(payload) {
  return client()
    .post('/administrator/login', payload)
    .then(response => response.data)
}

export function signupAdministratorApi(payload) {
  return client()
    .post('/administrator/signup', payload)
    .then(response => response.data)
}

export function logoutAdministratorApi() {
  return client()
    .delete('/administrator/logout')
    .then(response => response.data)
}

// Invitations
export function createAdministratorApi(payload) {
  return client()
    .post('/administrator/invitation', payload)
    .then(response => response.data)
}

// Accept invitation
export function acceptAdministratorInvitationApi(payload) {
  return client()
    .put('/administrator/invitation', payload)
    .then(response => response.data)
}

// Admins
export function getAdminsApi(payload) {
  return client()
    .get('/administrators/administrators', { params: payload })
    .then(response => response.data)
}

export function getAdminApi(id) {
  return client()
    .get(`/administrators/administrators/${id}`)
    .then(response => response.data)
}

export function updateAdminApi(id, payload) {
  return client()
    .put(`/administrators/administrators/${id}`, payload)
    .then(response => response.data)
}

export function destroyAdminApi(id) {
  return client()
    .delete(`/administrators/administrators/${id}`)
    .then(response => response.data)
}

// Dispatchers
export function getDispatchersApi(payload) {
  return client()
    .get('/administrators/administrators', { params: payload })
    .then(response => response.data)
}

export function getDispatcherApi(id) {
  return client()
    .get(`/administrators/administrators/${id}`)
    .then(response => response.data)
}

export function updateDispatcherApi(id, payload) {
  return client()
    .put(`/administrators/administrators/${id}`, payload)
    .then(response => response.data)
}

export function destroyDispatcherApi(id) {
  return client()
    .delete(`/administrators/administrators/${id}`)
    .then(response => response.data)
}

// Drivers
export function getDriversApi(payload) {
  return client()
    .get('/administrators/drivers', { params: payload })
    .then(response => response.data)
}

export function getDriverApi(id) {
  return client()
    .get(`/administrators/drivers/${id}`)
    .then(response => response.data)
}

export function createDriverApi(payload) {
  return client()
    .post('/driver/invitation', payload)
    .then(response => response.data)
}

export function updateDriverApi(id, payload) {
  return client()
    .put(`/administrators/drivers/${id}`, payload)
    .then(response => response.data)
}

export function destroyDriverApi(id) {
  return client()
    .delete(`/administrators/drivers/${id}`)
    .then(response => response.data)
}

export function acceptDriverInvitationApi(payload) {
  return client()
    .put('/driver/invitation', payload)
    .then(response => response.data)
}

//Teams
export function getTeamsApi(payload) {
  return client()
    .get('/administrators/teams', { params: payload })
    .then(response => response.data)
}

export function getTeamApi(id) {
  return client()
    .get(`/administrators/teams/${id}`)
    .then(response => response.data)
}

export function createTeamApi(payload) {
  return client()
    .post('/administrators/teams', payload)
    .then(response => response.data)
}

export function updateTeamApi(id, payload) {
  return client()
    .put(`/administrators/teams/${id}`, payload)
    .then(response => response.data)
}

export function destroyTeamApi(id) {
  return client()
    .delete(`/administrators/teams/${id}`)
    .then(response => response.data)
}

// Hubs
export function getHubsApi(payload) {
  return client()
    .get('/administrators/hubs', { params: payload })
    .then(response => response.data)
}

export function getHubApi(id) {
  return client()
    .get(`/administrators/hubs/${id}`)
    .then(response => response.data)
}

export function createHubApi(payload) {
  return client()
    .post('/administrators/hubs', payload)
    .then(response => response.data)
}

export function updateHubApi(id, payload) {
  return client()
    .put(`/administrators/hubs/${id}`, payload)
    .then(response => response.data)
}

export function destroyHubApi(id) {
  return client()
    .delete(`/administrators/hubs/${id}`)
    .then(response => response.data)
}

// Organizations
export function getOrganizationApi(payload) {
  return client()
    .get('/administrators/organizations', { params: payload })
    .then(response => response.data)
}

export function updateOrganizationApi(id, payload) {
  return client()
    .put(`/administrators/organizations/${id}`, payload)
    .then(response => response.data)
}

//Tasks
export function getTasksApi(payload) {
  return client()
    .get('/administrators/tasks', { params: payload })
    .then(response => response.data)
}

export function getTaskApi(id) {
  return client()
    .get(`/administrators/tasks/${id}`)
    .then(response => response.data)
}

export function createTaskApi(payload) {
  return client()
    .post('/administrators/tasks', payload)
    .then(response => response.data)
}

export function updateTaskApi(id, payload) {
  return client()
    .put(`/administrators/tasks/${id}`, payload)
    .then(response => response.data)
}

export function destroyTaskApi(id) {
  return client()
    .delete(`/administrators/tasks/${id}`)
    .then(response => response.data)
}

// Schedules
export function getSchedulesApi(payload) {
  return client()
    .get('/administrators/schedules', { params: payload })
    .then(response => response.data)
}

export function createScheduleApi(payload) {
  return client()
    .post('/administrators/schedules', payload)
    .then(response => response.data)
}

export function createSubscheduleApi(payload) {
  return client()
    .post('/administrators/subschedules', payload)
    .then(response => response.data)
}

export function destroySubscheduleApi(id) {
  return client()
    .delete(`/administrators/subschedules/${id}`)
    .then(response => response.data)
}
