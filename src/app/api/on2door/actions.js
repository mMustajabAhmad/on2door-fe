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
export function createAdministratorInvitationApi(payload) {
  return client()
    .post('/administrator/invitation', payload)
    .then(response => response.data)
}

// Accept invitation
export function acceptInvitationApi(payload) {
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

//Teams
export function getTeamsApi() {
  return client()
    .get('/administrators/teams')
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
