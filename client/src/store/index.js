import Vue from 'vue'
import Vuex from 'vuex'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

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
    deviceIcons: {},
    deviceIconModel: { device: null, show: false },
    devices: [],

    deviceHeaderSettings: null,
    deviceSortSettings: null,
    deviceHiddenSettings: null,
    deviceFilterSettings: null,
    markerCluster: null,

    focusDevice: null,
  },
  getters: {
    focusDevice(state) {
      return state.focusDevice
    },
    markerCluster(state) {
      return state.markerCluster
    },
    deviceIcons(state) {
      return state.deviceIcons
    },
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
    devicesFilterByStatus(state) {
      let status = state.deviceFilterSettings
      if (!status || status == 'ALL') {
        return state.devices
      }
      return state.devices.filter((item) => item.drive_status == status)
    },
    devicesFilterByStatusAndHidden(state, getters) {
      let filteredDevices = getters.devicesFilterByStatus
      let hidden = getters.deviceHiddenSettings
      if (!hidden) {
        return filteredDevices
      }
      return filteredDevices.filter((item) => !hidden[item.device_id])
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
    setFocusDevice(state, value) {
      state.focusDevice = value
    },
    newMarkerCluster(state, value) {
      state.markerCluster = new MarkerClusterer({ map: value.map })
    },
    setDeviceIcon(state, value) {
      if (state.deviceIcons[value.device_id]) {
        let obj = { ...state.deviceIcons }
        obj[value.device_id] = value.icon
        state.deviceIcons = obj
        return
      }
      state.deviceIcons[value.device_id] = value.icon
    },
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
      if (state.deviceHiddenSettings[device.device_id] == undefined) {
        let obj = { ...state.deviceHiddenSettings }
        obj[device.device_id] = false
        state.deviceHiddenSettings = obj
        return
      }
      state.deviceHiddenSettings[device.device_id] = !state
        .deviceHiddenSettings[device.device_id]
    },
    setAllHiddenDevices(state, { devices, value }) {
      devices.forEach((item) => {
        state.deviceHiddenSettings[item.device_id] = value
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
      if (value) {
        let devices = state.devices
        if (devices) {
          devices.forEach((item) => {
            item.show = !value[item.device_id]
          })
        }
      }
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
