//Constants displaying device information
const SHOW = {
  text: 'Show',
  align: 'center',
  value: 'show',
  sortable: false,
  hideInExpand: true,
}
const ICON = {
  text: 'Icon',
  align: 'center',
  value: 'icon',
  sortable: false,
  hideInExpand: true,
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
  display: 'drive_status_display',
}
const DRIVE_STATUS_DURATION = {
  text: 'Status Duration',
  align: 'left',
  value: 'drive_status_duration',
  display: 'drive_status_duration_display',
}
const POSITION = {
  text: 'Position',
  align: 'left',
  value: 'position',
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

//Constants are displayed in this order
const ALL_DEVICE_HEADERS = [
  SHOW,
  ICON,
  NAME,
  DRIVE_STATUS,
  DRIVE_STATUS_DURATION,
  POSITION,
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

//Alphabetized constants for convience
const ALL_DEVICE_HEADERS_ALPHABETICAL = [...ALL_DEVICE_HEADERS].sort((x, y) => {
  if (x.text.toLowerCase() < y.text.toLowerCase()) {
    return -1
  }
  if (x.text.toLowerCase() > y.text.toLowerCase()) {
    return 1
  }
  return 0
})

//Hiding constants which shouldn't be shown while expanding the table to show more device information
const EXPANDED_HEADERS = [...ALL_DEVICE_HEADERS_ALPHABETICAL].filter((item) => {
  return !item.hideInExpand
})

//The default layout for the table displaying the devices
const DEFAULT_DEVICE_HEADER_SETTINGS = {
  show: true,
  icon: true,
  display_name: true,
  speed_mph: true,
  drive_status: true,
  drive_status_duration: true,
  active_state: true,
}

export {
  ALL_DEVICE_HEADERS,
  ALL_DEVICE_HEADERS_ALPHABETICAL,
  EXPANDED_HEADERS,
  DEFAULT_DEVICE_HEADER_SETTINGS,
}
