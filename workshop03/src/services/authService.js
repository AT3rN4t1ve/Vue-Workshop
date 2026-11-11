import http from './http'

export default {
  register({ email, password, firstName, lastName }) {
    return http.post('/register', {
      email: String(email || '').trim(),
      password,
      firstName,
      lastName,
    })
  },

  login({ email, password }) {
    return http.post('/login', { email: String(email || '').trim(), password })
  },

  getUsers() {
    return http.get('/users')
  },

  approveUser(id) {
    return http.put(`/users/${id}/approve`)
  },

  getMe() {
    return http.get('/me')
  },

  updateMe({ firstName, lastName }) {
    return http.put('/me', { firstName, lastName })
  },

  changePassword({ currentPassword, newPassword }) {
    return http.put('/me/password', { currentPassword, newPassword })
  },
}
