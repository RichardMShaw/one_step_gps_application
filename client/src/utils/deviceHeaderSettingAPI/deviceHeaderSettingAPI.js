import axios from 'axios'

const DeviceHeaderSettingAPI = {
  postDeviceHeaderSetting: (json) =>
    axios.post('/api/device-header-settings', json),
  getDeviceHeaderSetting: (user_id) =>
    axios.get(`/api/device-header-settings/${user_id}`),
}

export default DeviceHeaderSettingAPI
