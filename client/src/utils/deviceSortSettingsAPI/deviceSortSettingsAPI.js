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
const DeviceSortSettingsAPI = {
  getDeviceSortSettings: () => axios.get(`/api/device-sort-settings`),
  getAndStoreDeviceSortSettings: (isInit = false) => {
    if (isInit && store.state.deviceSortSettings) {
      let promise = new Promise((resolve) => {
        resolve()
      })
      return promise
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
      let promise = new Promise((resolve) => {
        resolve()
      })
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
