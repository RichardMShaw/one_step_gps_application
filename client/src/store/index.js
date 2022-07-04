import { createStore, storeKey } from 'vuex'
import DeviceAPI from '@/utils/deviceAPI'
const { getDevices } = DeviceAPI

export default createStore({
  state: {
    getDevicesTimeout: null,
    devices: [],
  },
  getters: {
    devices(state) {
      return state.devices
    },
  },
  mutations: {
    setDevices(state, value) {
      state.devices = value
    },
    setGetDevicesTimeout(state, value) {
      state.getDevicesTimeout = value
    },
    stopGetDevicesTimeout(state) {
      clearTimeout(state.getDevicesTimeout)
    },
  },
  actions: {
    getDevices({ commit }) {
      getDevices().then(({ data }) => {
        commit('setDevices', data.result_list)
      })
    },
    startGetDevicesTimeout({ commit }) {
      const updateFunc = () => {
        getDevices()
          .then(({ data }) => {
            commit('setDevices', data.result_list)
            commit('setGetDevicesTimeout', setTimeout(updateFunc, 20000))
          })
          .catch((err) => {
            console.error(err)
            commit('setGetDevicesTimeout', setTimeout(updateFunc, 20000))
          })
      }
      commit('stopGetDevicesTimeout')
      commit('setGetDevicesTimeout', setTimeout(updateFunc, 0))
    },
    stopGetDevicesTimeout({ commit }) {
      commit('stopGetDevicesTimeout')
    },
  },
  modules: {},
})
