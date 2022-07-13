import axios from 'axios'
import store from '@/store'
import { DEFAULT_DEVICE_HEADER_SETTINGS } from '@/constants/deviceHeaders.js'

let posting = false

const DeviceHeaderSettingsAPI = {
  getDeviceHeaderSettings: () => axios.get(`/api/device-header-settings`),
  getAndStoreDeviceHeaderSettings: (isInit = false) => {
    if (isInit && store.state.deviceHeaderSettings) {
      let promise = new Promise((resolve) => {
        resolve()
      })
      return promise
    }
    return axios.get(`/api/device-header-settings`).then(({ data }) => {
      if (data) {
        store.commit('setDeviceHeaderSettings', data.header_settings)
      } else {
        store.commit('setDeviceHeaderSettings', DEFAULT_DEVICE_HEADER_SETTINGS)
      }
    })
  },

  postAndStoreDeviceHeaderSettings: (data, instantStore = false) => {
    let body = { header_settings: data.header_settings }
    if (instantStore) {
      store.commit('setDeviceHeaderSettings', body.header_settings)
    }

    if (posting) {
      let promise = new Promise((resolve) => {
        resolve()
      })
      return promise
    }
    posting = true

    return axios
      .post('/api/device-header-settings', body)
      .then((res) => {
        if (!instantStore) {
          store.commit('setDeviceHeaderSettings', body.header_settings)
        }
        posting = false
      })
      .catch((err) => {
        posting = false
        console.error(err)
      })
  },
}

export default DeviceHeaderSettingsAPI
