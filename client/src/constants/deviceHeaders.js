const SHOW = {
  text: 'Show',
  align: 'start',
  value: 'show',
  sortable: false,
}
const NAME = {
  text: 'Name',
  align: 'left',
  value: 'display_name',
}
const DRIVE_STATUS = {
  text: 'Drive Status',
  align: 'center',
  value: 'drive_status',
}
const DRIVE_STATUS_DURATION = {
  text: 'Status Duration',
  align: 'left',
  value: 'drive_status_duration',
}
const MODEL = {
  text: 'Model',
  align: 'left',
  value: 'model',
}
const ODOMETER_MI = {
  text: 'Odometer (mi)',
  align: 'right',
  value: 'odometer_mi_display',
}
const ODOMETER_KM = {
  text: 'Odometer (km)',
  align: 'right',
  value: 'odometer_km_display',
}
const MPH = {
  text: 'MPH',
  align: 'right',
  value: 'speed_mph',
}
const KPH = {
  text: 'KPH',
  align: 'right',
  value: 'speed_kph',
}
const BATTERY = {
  text: 'Battery',
  algin: 'left',
  value: 'battery',
}
const GPSLEV = {
  text: 'GPS Sat',
  align: 'right',
  value: 'gpslev',
}
const DT_SERVER = {
  text: 'Time (server)',
  align: 'center',
  value: 'dt_server_display',
}
const DT_TRACKER = {
  text: 'Time (position)',
  align: 'center',
  value: 'dt_tracker_display',
}
const RSSI = {
  text: 'Signal',
  align: 'center',
  value: 'rssi',
}
const ACTIVE_STATE = {
  text: 'Active',
  align: 'center',
  value: 'active_state',
}

const ALL_DEVICE_HEADERS = [
  SHOW,
  NAME,
  DRIVE_STATUS,
  DRIVE_STATUS_DURATION,
  MODEL,
  ODOMETER_MI,
  ODOMETER_KM,
  MPH,
  KPH,
  BATTERY,
  GPSLEV,
  DT_SERVER,
  DT_TRACKER,
  RSSI,
  ACTIVE_STATE,
]

const ALL_DEVICE_HEADERS_ALPHABETICAL = [...ALL_DEVICE_HEADERS].sort((x, y) => {
  if (x.text.toLowerCase() < y.text.toLowerCase()) {
    return -1
  }
  if (x.text.toLowerCase() > y.text.toLowerCase()) {
    return 1
  }
  return 0
})

const DEFAULT_DEVICE_HEADER_SETTINGS = {
  show: true,
  display_name: true,
  model: true,
  odometer_mi_display: true,
  speed_mph: true,
  drive_status: true,
  drive_status_duration: true,
  rssi: true,
  active_state: true,
}

export {
  ALL_DEVICE_HEADERS,
  ALL_DEVICE_HEADERS_ALPHABETICAL,
  DEFAULT_DEVICE_HEADER_SETTINGS,
}
