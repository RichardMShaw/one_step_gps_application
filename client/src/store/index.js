import Vue from 'vue'
import Vuex from 'vuex'
import Device from '@/utils/deviceClass'
import DeviceSortSettingAPI from '@/utils/deviceSortSettingAPI'
const { postDeviceSortSetting } = DeviceSortSettingAPI
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
    deviceIconModel: { device: null, show: false },
    deviceHeaderSettings: JSON.parse(
      JSON.stringify(DEFAULT_DEVICE_HEADER_SETTINGS),
    ),
    postDeviceSortSettingTimeout: null,
    postDeviceFilterSettingTimeout: null,
    postDeviceHiddenSettingTimeout: null,
    postDeviceHeaderSettingTimeout: null,
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
    deviceIconModel(state) {
      return state.deviceIconModel
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
    setDeviceIconModal(state, value) {
      state.deviceIconModel = value
    },
    setPostDeviceSortSettingTimeout(state, value) {
      state.postDeviceSortSettingTimeout = value
    },
    stopPostDeviceSortSettingTimeout(state) {
      clearTimeout(state.postDeviceSortSettingTimeout)
    },
    setPostDeviceFilterSettingTimeout(state, value) {
      state.postDeviceFilterSettingTimeout = value
    },
    stopPostDeviceFilterSettingTimeout(state) {
      clearTimeout(state.postDeviceFilterSettingTimeout)
    },
    setPostDeviceHiddenSettingTimeout(state, value) {
      state.postDeviceHiddenSettingTimeout = value
    },
    stopPostDeviceHiddenSettingTimeout(state) {
      clearTimeout(state.postDeviceHiddenSettingTimeout)
    },
    setPostDeviceHeaderSettingTimeout(state, value) {
      state.postDeviceHeaderSettingTimeout = value
    },
    stopPostDeviceHeaderSettingTimeout(state) {
      clearTimeout(state.postDeviceHeaderSettingTimeout)
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
    stopPostDeviceSortSetting({ commit }) {
      commit('stopDeviceSortSettingTimeout')
    },
    startPostDeviceSortSetting({ commit }, value) {
      commit('stopDeviceSortSettingTimeout')
      commit(
        'setDeviceSortSettingTimeout',
        setTimeout(() => {
          let formData = new FormData()
          formData.append('sort_by', value.sortBy)
          formData.append('sort_desc', value.sortDesc)
          postDeviceSortSetting(formData).catch((err) => console.error(err))
        }, 5000),
      )
    },
    stopPostDeviceFilterSetting({ commit }) {
      commit('stopDeviceSortSettingTimeout')
    },
    startPostDeviceFilterSetting({ commit }, value) {
      commit('stopDeviceFilterSettingTimeout')
      commit(
        'setDeviceFilterSettingTimeout',
        setTimeout(() => {
          let formData = new FormData()
          formData.append('drive_status', value.drive_status)
          postDeviceFilterSetting(formData).catch((err) => console.error(err))
        }, 5000),
      )
    },
    stopPostDeviceHiddenSetting({ commit }) {
      commit('stopDeviceHidden.SettingTimeout')
    },
    startPostDeviceHiddenSetting({ commit }, value) {
      commit('stopDeviceHiddenSettingTimeout')
      commit(
        'setDeviceHiddenSettingTimeout',
        setTimeout(() => {
          let formJson = { hidden_devices: value }
          postDeviceFilterSetting(formJson).catch((err) => console.error(err))
        }, 5000),
      )
    },
    stopPostDeviceHeaderSetting({ commit }) {
      commit('stopDeviceFilterSettingTimeout')
    },
    startPostDeviceHeaderSetting({ commit }, value) {
      commit('stopDeviceHeaderSettingTimeout')
      commit(
        'setDeviceHeaderSettingTimeout',
        setTimeout(() => {
          let formJson = { header_settings: value }
          postDeviceFilterSetting(formJson).catch((err) => console.error(err))
        }, 5000),
      )
    },
  },
  modules: {},
})
