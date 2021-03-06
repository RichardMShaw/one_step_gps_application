import axios from 'axios'
import store from '@/store'

import { DEFAULT_ICON } from '@/constants/assets.js'

//Prevents excessiving post requests.
//Set to true when post request starts and false after a response
let posting = false

//Utility object to handle all API requests
//All functions return promise to use .then() in all cases

//getAndStore functions immedately store data once retreieved
//getAndStore has an option to not fetch if data has already been saved to store

//postAndStore functions have the option to store data immedately before a response is returned or afterward
const DeviceIconAPI = {
  getAndStoreDeviceIcon: (device_id) => {
    if (!store.state.deviceIcons[device_id]) {
      store.commit('setDeviceIcon', {
        device_id: device_id,
        icon: DEFAULT_ICON,
      })
    }
    return axios
      .get(`/api/device-icon/${device_id}`, { responseType: 'blob' })
      .then((res) => {
        if (res.status == 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          store.commit('setDeviceIcon', {
            device_id: device_id,
            icon: url,
          })
        } else {
          store.commit('setDeviceIcon', {
            device_id: device_id,
            icon: DEFAULT_ICON,
          })
        }
      })
  },
  postAndStoreDeviceIcon: (data, instantStore = false) => {
    if (instantStore) {
      store.commit('setDeviceIcon', {
        device_id: data.device_id,
        icon: data.file_url,
      })
    }

    if (posting) {
      return
    }

    let formData = new FormData()
    formData.append('icon', data.icon)
    formData.append('device_id', data.device_id)

    return axios
      .post('/api/device-icon', formData)
      .then((res) => {
        if (res.status == 200) {
          if (!instantStore) {
            store.commit('setDeviceIcon', {
              device_id: data.device_id,
              icon: data.file_url,
            })
          }
        }
      })
      .catch((err) => console.error(err))
  },
}

export default DeviceIconAPI
