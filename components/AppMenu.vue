<template>
  <div class="absolute top-4 right-4 z-10">
    <div v-if="this.$auth.loggedIn" class="flex items-center space-x-3">
      <nuxt-link 
        class="btn-main transition-all duration-200 hover:shadow-lg" 
        to="/account"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        Account
      </nuxt-link>
      <button 
        @click="logout"
        class="btn-main bg-red-600 hover:bg-red-700 focus:ring-red-500 transition-all duration-200 hover:shadow-lg"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Logout
      </button>
    </div>
    <div class="flex space-x-2" v-else>
      <nuxt-link 
        class="btn-main transition-all duration-200 hover:shadow-lg" 
        to="/login"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
        </svg>
        Login
      </nuxt-link>
      <nuxt-link 
        class="btn-main bg-green-600 hover:bg-green-700 focus:ring-green-500 transition-all duration-200 hover:shadow-lg" 
        to="/register"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
        Register
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  methods: {
    ...mapActions({
      'logoutAction': 'authentication/LOGOUT'
    }),
    async logout() {
      try {
        await this.logoutAction()
        this.$router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
  }
}
</script>