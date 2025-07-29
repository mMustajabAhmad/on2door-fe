import client from './client'

// Authentications
export function loginAdministratorApi(payload) {
  return client()
    .post('/administrator/login', payload)
    .then(response => response.data)
}
export function logoutAdministratorApi() {
  return client()
    .delete('/administrator/logout')
    .then(response => response.data)
}
