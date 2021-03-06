import axios from 'axios'
import store from '@/store'

//Prevents excessiving post requests.
//Set to true when post request starts and false after a response
let posting = false

//Utility object to handle all API requests
//All functions return promise to use .then() in all cases

//getAndStore functions immedately store data once retreieved
//getAndStore has an option to not fetch if data has already been saved to store

//postAndStore functions have the option to store data immedately before a response is returned or afterward
const DeviceHiddenSettingsAPI = {
  getDeviceHiddenSettings: () => axios.get(`/api/device-hidden-settings`),
  getAndStoreDeviceHiddenSettings: (isInit = false) => {
    if (isInit && store.state.deviceHiddenSettings) {
      let promise = new Promise((resolve) => {
        resolve()
      })
      return promise
    }
    return axios.get(`/api/device-hidden-settings`).then(({ data }) => {
      if (data.hidden_devices) {
        store.commit('setDeviceHiddenSettings', data.hidden_devices)
      } else {
        store.commit('setDeviceHiddenSettings', {})
      }
    })
  },
  postDeviceHiddenSettings: (data) => {
    if (posting) {
      let promise = new Promise((resolve) => {
        resolve()
      })
      return promise
    }
    posting = true

    let body = { hidden_devices: data.hidden_devices }
    return axios
      .post('/api/device-hidden-settings', body)
      .then((res) => {
        posting = false
      })
      .catch((err) => {
        posting = false
        console.error(err)
      })
  },
  postAndStoreDeviceHiddenSettings: (data, instantStore = false) => {
    let body = { hidden_devices: data.hidden_devices }

    if (instantStore) {
      store.commit('setDeviceHiddenSettings', body.hidden_devices)
    }

    if (posting) {
      let promise = new Promise((resolve) => {
        resolve()
      })
      return promise
    }
    posting = true
    return axios
      .post('/api/device-hidden-settings', body)
      .then((res) => {
        if (!instantStore) {
          store.commit('setDeviceHiddenSettings', body.hidden_devices)
        }
        posting = false
      })
      .catch((err) => {
        posting = false
        console.error(err)
      })
  },
}

export default DeviceHiddenSettingsAPI
