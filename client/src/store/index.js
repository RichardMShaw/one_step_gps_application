import Vue from 'vue'
import Vuex from 'vuex'
import Device from '@/utils/deviceClass'
import DeviceAPI from '@/utils/deviceAPI'
const { getDevices } = DeviceAPI

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    getDevicesTimeout: null,
    deviceStatusFilter: 'ALL',
    devices: [],
  },
  getters: {
    devices(state) {
      return state.devices
    },
    deviceStatusFilter(state) {
      return state.deviceStatusFilter
    },
    devicesStatusFiltered(state) {
      let status = state.deviceStatusFilter
      if (!status || status == 'ALL') {
        return state.devices
      }
      return state.devices.filter((item) => item.drive_status == status)
    },
  },
  mutations: {
    setDevices(state, value) {
      state.devices = value
    },
    setDeviceStatusFilter(state, value) {
      state.deviceStatusFilter = value
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
        commit('setDevices', data)
      })
    },
    startGetDevicesTimeout({ commit }) {
      const updateFunc = () => {
        getDevices()
          .then(({ data }) => {
            let devices = []
            data.result_list.forEach((item) => {
              let device = new Device(item)
              devices.push(device)
            })
            console.log(devices)
            commit('setDevices', devices)
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
