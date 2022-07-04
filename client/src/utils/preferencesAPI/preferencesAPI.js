import axios from 'axios'

const PreferencesAPI = {
  getPreferences: () => axios.get('/api/preferences'),
  createPreferences: (prefrences) => axios.post('/api/preferences', prefrences),
  updatePreferences: (prefrences) => axios.put('/api/preferences', prefrences),
}

export default PreferencesAPI
