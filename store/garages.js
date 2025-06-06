import {getters} from '../plugins/common/base'

const state = () => ({
  all: []
});

export default {
  state,
  mutations: {
    SET_GARAGES(state, garages) {
      state.all = garages
    }
  },
  actions: {
    async ENSURE({commit}) {
      try {
        const {data} = await this.$axios.$get(`/garages`)
        commit('SET_GARAGES', data)
      } catch (error) {
        console.error('Error fetching garages:', error)
        commit('SET_GARAGES', [])
      }
    }
  },
  getters: {
    ...getters
  }
}