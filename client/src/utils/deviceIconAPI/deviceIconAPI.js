import axios from 'axios'

const DeviceIconAPI = {
  postDeviceIcon: (formData) => axios.post('/api/device-icon', formData),
}

export default DeviceIconAPI
