import axios from 'axios'
import store from '@/store'

let posting = false

const DeviceSortSettingsAPI = {
  getDeviceSortSettings: () => axios.get(`/api/device-sort-settings`),
  getAndStoreDeviceSortSettings: (isInit = false) => {
    if (isInit && store.state.deviceSortSettings) {
      return
    }
    return axios.get(`/api/device-sort-settings`).then(({ data }) => {
      if (data) {
        store.commit('setDeviceSortSettings', {
          sort_by: data.sort_by,
          sort_desc: data.sort_desc ? true : false,
        })
      }
    })
  },
  postAndStoreDeviceSortSettings: (data, instantStore = false) => {
    if (instantStore) {
      store.commit('setDeviceSortSettings', {
        sort_by: data.sort_by,
        sort_desc: data.sort_desc ? true : false,
      })
    }

    if (posting) {
      return
    }
    posting = true

    let formData = new FormData()
    formData.append('sort_by', data.sort_by)
    formData.append('sort_desc', data.sort_desc ? true : false)

    return axios
      .post('/api/device-sort-settings', formData)
      .then((res) => {
        posting = false
        if (!instantStore) {
          store.commit('setDeviceSortSettings', {
            sort_by: data.sort_by,
            sort_desc: data.sort_desc,
          })
        }
      })
      .catch((err) => {
        posting = false
        console.error(err)
      })
  },
}

export default DeviceSortSettingsAPI
