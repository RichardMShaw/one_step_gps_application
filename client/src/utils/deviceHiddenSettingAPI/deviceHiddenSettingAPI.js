import axios from 'axios'

const DeviceHiddenSettingAPI = {
  postDeviceHiddenSetting: (json) =>
    axios.post('/api/device-hidden-settings', json),
  getDeviceHiddenSetting: (user_id) =>
    axios.get(`/api/device-hidden-settings/${user_id}`),
}

export default DeviceHiddenSettingAPI
