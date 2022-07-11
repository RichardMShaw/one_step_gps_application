import axios from 'axios'

const DeviceSortSettingAPI = {
  postDeviceSortSetting: (formData) =>
    axios.post('/api/device-sort-settings', formData),
  getDeviceSortSetting: (user_id) =>
    axios.get(`/api/device-sort-settings/${user_id}`),
}

export default DeviceSortSettingAPI
