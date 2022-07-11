import axios from 'axios'

const DeviceFilterSettingAPI = {
  postDeviceFilterSetting: (formData) =>
    axios.post('/api/device-filter-settings', formData),
  getDeviceFilterSetting: (user_id) =>
    axios.get(`/api/device-filter-settings/${user_id}`),
}

export default DeviceFilterSettingAPI
