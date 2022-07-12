import Vue from 'vue'
import Vuex from 'vuex'
import Device from '@/utils/deviceClass'
import DeviceAPI from '@/utils/deviceAPI'
const { getDevices } = DeviceAPI
import {
  ALL_DEVICE_HEADERS,
  DEFAULT_DEVICE_HEADER_SETTINGS,
} from '@/constants/deviceHeaders.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapTypeId: 'terrain',
    getDevicesTimeout: null,
    layoutModel: false,
    deviceIconModel: { device: null, show: false },
    devices: [],

    deviceHeaderSettings: null,
    deviceSortSettings: null,
    deviceHiddenSettings: null,
    deviceFilterSettings: null,
  },
  getters: {
    mapTypeId(state) {
      return state.mapTypeId
    },
    deviceSortSettings(state) {
      return state.deviceSortSettings
    },
    deviceHiddenSettings(state) {
      return state.deviceHiddenSettings
    },
    devices(state) {
      return state.devices
    },
    deviceStatusFilter(state) {
      return state.deviceFilterSettings
    },
    devicesStatusFiltered(state) {
      let status = state.deviceFilterSettings
      if (!status || status == 'ALL') {
        return state.devices
      }
      return state.devices.filter((item) => item.drive_status == status)
    },
    hiddenDevices(state) {
      return state.deviceHiddenSettings
    },
    layoutModel(state) {
      return state.layoutModel
    },
    deviceHeaderSettings(state) {
      return state.deviceHeaderSettings
    },
    deviceHeadersFiltered(state) {
      if (!state.deviceHeaderSettings) {
        return ALL_DEVICE_HEADERS.filter(
          (item) => DEFAULT_DEVICE_HEADER_SETTINGS[item.value],
        )
      }
      return ALL_DEVICE_HEADERS.filter(
        (item) => state.deviceHeaderSettings[item.value],
      )
    },
    deviceIconModel(state) {
      return state.deviceIconModel
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
    changeHiddenDevice(state, device) {
      if (!state.deviceHiddenSettings) {
        return
      }
      if (state.deviceHiddenSettings[value] == undefined) {
        let obj = { ...state.deviceHiddenSettings }
        obj[value] = false
        state.deviceHiddenSettings = obj
        return
      }
      state.deviceHiddenSettings[device.device_id] = !state
        .deviceHiddenSettings[device.device_id]
    },
    setHiddenDevices(state, { devices, value }) {
      let obj = {}
      devices.forEach((item) => {
        obj[item.device_id] = value
      })
      state.deviceHiddenSettings = obj
    },
    setLayoutModel(state, value) {
      state.layoutModel = value
    },
    changeDeviceHeaderSetting(state, value) {
      if (state.deviceHeaderSettings[value] == undefined) {
        let obj = { ...state.deviceHeaderSettings }
        obj[value] = true
        state.deviceHeaderSettings = obj
        return
      }
      state.deviceHeaderSettings[value] = !state.deviceHeaderSettings[value]
    },
    setDeviceHeaderSettings(state, value) {
      state.deviceHeaderSettings = value
    },
    setDeviceIconModal(state, value) {
      state.deviceIconModel = value
    },
    setDeviceHeaderSettings(state, value) {
      state.deviceHeaderSettings = value
    },
    setDeviceSortSettings(state, value) {
      state.deviceSortSettings = value
    },
    setDeviceHiddenSettings(state, value) {
      state.deviceHiddenSettings = value
    },
    setDeviceFilterSettings(state, value) {
      state.deviceFilterSettings = value
    },
  },
  actions: {
    closeDeviceIconModal({ commit }) {
      commit('setDeviceIconModal', { device: null, show: false })
    },
    showDeviceIconModal({ commit }, value) {
      commit('setDeviceIconModal', { device: value, show: true })
    },
    changeDeviceHeaderSetting({ commit }, value) {
      commit('changeDeviceHeaderSetting', value)
    },
    setDeviceHeaderSettings({ commit }, value) {
      commit('setDeviceHeaderSettings', value)
    },
    setDefaultDeviceHeaderSettings({ commit }) {
      let defaultHeaders = JSON.parse(
        JSON.stringify(DEFAULT_DEVICE_HEADER_SETTINGS),
      )
      commit('setDeviceHeaderSettings', defaultHeaders)
    },
    showLayoutModel({ commit }) {
      commit('setLayoutModel', true)
    },
    closeLayoutModel({ commit }) {
      commit('setLayoutModel', false)
    },
    getDevices({ commit, state }) {
      getDevices().then(({ data }) => {
        commit('setDevices', data)
      })
    },
    startGetDevicesTimeout({ commit, state }) {
      const updateFunc = () => {
        getDevices()
          .then(({ data }) => {
            let devices = []
            data.result_list.forEach((item) => {
              let device = new Device(item)
              devices.push(device)
            })
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
  },
  modules: {},
})
