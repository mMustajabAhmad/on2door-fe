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

// Administrators
export function getAdministratorsApi(payload) {
  return client()
    .get('/administrators/administrators', { params: payload })
    .then(response => response.data)
}

export function getAdministratorByIdApi(id) {
  return client()
    .get(`/administrators/administrators/${id}`)
    .then(response => response.data)
}

export function updateAdministratorApi(id, payload) {
  return client()
    .put(`/administrators/administrators/${id}`, payload)
    .then(response => response.data)
}

export function deleteAdministratorApi(id) {
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

export function getDispatcherByIdApi(id) {
  return client()
    .get(`/administrators/administrators/${id}`)
    .then(response => response.data)
}

export function updateDispatcherApi(id, payload) {
  return client()
    .put(`/administrators/administrators/${id}`, payload)
    .then(response => response.data)
}

export function deleteDispatcherApi(id) {
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
