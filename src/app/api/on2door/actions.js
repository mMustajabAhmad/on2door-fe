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

// Administrators
export function getAdministratorsApi(payload = {}) {
  return client()
    .get('/administrators/administrators', {
      params: payload
    })
    .then(response => response.data)
}

export function deleteAdministratorApi(id) {
  return client()
    .delete(`/administrators/administrators/${id}`)
    .then(response => response.data)
}
