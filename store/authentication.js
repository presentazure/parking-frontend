export default {
  actions: {
    async LOGIN({commit}, payload) {
      try {
        await this.$auth.loginWith('auth_jwt', {
          data: {
            email: payload.email,
            password: payload.password
          }
        })
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    async REGISTER({commit}, payload) {
      try {
        await this.$axios.post(`/auth/register`, payload)
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },
    async LOGOUT({commit}) {
      try {
        await this.$auth.logout()
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
}