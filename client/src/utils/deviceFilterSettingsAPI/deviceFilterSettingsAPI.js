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
const DeviceFilterSettingsAPI = {
  getDeviceFilterSettings: () => axios.get(`/api/device-filter-settings`),
  getAndStoreDeviceFilterSettings: (isInit = false) => {
    if (isInit && store.state.deviceFilterSettings) {
      let promise = new Promise((resolve) => {
        resolve()
      })
      return promise
    }
    return axios.get(`/api/device-filter-settings`).then(({ data }) => {
      if (data) {
        store.commit('setDeviceFilterSettings', data.drive_status)
      }
    })
  },
  postAndStoreDeviceFilterSettings: (data, instantStore = false) => {
    if (instantStore) {
      store.commit('setDeviceFilterSettings', data.drive_status)
    }

    if (posting) {
      let promise = new Promise((resolve) => {
        resolve()
      })
      return promise
    }
    posting = true

    let formData = new FormData()
    formData.append('drive_status', data.drive_status)

    return axios
      .post('/api/device-filter-settings', formData)
      .then((res) => {
        if (!instantStore) {
          store.commit('setDeviceFilterSettings', data.drive_status)
        }
        posting = false
      })
      .catch((err) => {
        posting = false
        console.error(err)
      })
  },
}

export default DeviceFilterSettingsAPI
