import axios from 'axios'
import store from '@/store'

let posting = false

const DeviceFilterSettingsAPI = {
  getDeviceFilterSettings: () => axios.get(`/api/device-filter-settings`),
  getAndStoreDeviceFilterSettings: (isInit = false) => {
    if (isInit && store.state.deviceFilterSettings) {
      return
    }
    return axios.get(`/api/device-filter-settings`).then(({ data }) => {
      if (data) {
        store.commit('setDeviceFilterSettings', data.drive_status)
      }
    })
  },
  postDeviceFilterSettings: (data) => {
    if (posting) {
      return
    }
    posting = true

    let formData = new FormData()
    formData.append('drive_status', data.drive_status)
    axios
      .post('/api/device-filter-settings', formData)
      .then((res) => {
        posting = false
      })
      .catch((err) => {
        posting = false
        console.error(err)
      })
  },
  postAndStoreDeviceFilterSettings: (data, instantStore = false) => {
    if (instantStore) {
      store.commit('setDeviceFilterSettings', data.drive_status)
    }

    if (posting) {
      return
    }
    posting = true

    let formData = new FormData()
    formData.append('drive_status', data.drive_status)

    axios
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
