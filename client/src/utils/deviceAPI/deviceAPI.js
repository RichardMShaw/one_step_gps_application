import axios from 'axios'

const DeviceAPI = {
  getDevices: () => axios.get('/api/device'),
}

export default DeviceAPI
