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
    deviceStatusFilter: 'ALL',
    devices: [],
    hiddenDevices: {},
    layoutModel: false,
    deviceHeaderSettings: JSON.parse(
      JSON.stringify(DEFAULT_DEVICE_HEADER_SETTINGS),
    ),
  },
  getters: {
    mapTypeId(state) {
      return state.mapTypeId
    },
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
    hiddenDevices(state) {
      return state.hiddenDevices
    },
    layoutModel(state) {
      return state.layoutModel
    },
    deviceHeaderSettings(state) {
      return state.deviceHeaderSettings
    },
    deviceHeadersFiltered(state) {
      return ALL_DEVICE_HEADERS.filter(
        (item) => state.deviceHeaderSettings[item.value],
      )
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
    changeHiddenDevice(state, device) {
      state.hiddenDevices[device.device_id] = !state.hiddenDevices[
        device.device_id
      ]
    },
    setHiddenDevices(state, { devices, value }) {
      let hiddenDevices = state.hiddenDevices
      devices.forEach((item) => {
        hiddenDevices[item.device_id] = value
        item.show = !value
      })
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
  },
  actions: {
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
        data.forEach((item) => {
          item.show = !state.hiddenDevices[item.device_id]
        })
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
              device.show = !state.hiddenDevices[device.device_id]
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
    stopGetDevicesTimeout({ commit }) {
      commit('stopGetDevicesTimeout')
    },
  },
  modules: {},
})
