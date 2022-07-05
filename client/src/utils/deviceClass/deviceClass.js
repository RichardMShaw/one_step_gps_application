const convertSecondsToTime = (value) => {
  let totalSeconds = value

  let days = Math.floor(totalSeconds / (24 * 3600))
  totalSeconds %= 24 * 3600

  let hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600

  let minutes = Math.floor(totalSeconds / 60)
  totalSeconds %= 60

  let seconds = totalSeconds

  let secondsString = seconds ? `${seconds} s` : ''
  let minutesString = minutes ? `${minutes} m` : ''
  let hoursString = hours ? `${hours} h` : ''
  let daysString = days ? `${days} d` : ''

  let timeString = `${daysString} ${hoursString} ${minutesString} ${secondsString}`
  return timeString.trim()
}

const getMiAndKm = (type, value) => {
  let result = { km: 0, mi: 0 }
  if (type == 'km') {
    result.km = value
    result.mi = value / 1.609344
  } else if (type == 'm') {
    result.km = value / 1000
    result.mi = result.km / 1.609344
  } else {
    result.mi = value
    result.km = value * 1.609344
  }
  return result
}

const getMphAndKph = (type, value) => {
  let result = { kph: 0, mph: 0 }
  if (type == 'km/h') {
    result.kph = value
    result.mph = value / 1.609344
  } else {
    result.mph = value
    result.kph = value * 1.609344
  }
  return result
}

class Device {
  constructor(device) {
    this.device_id = device.device_id
    this.display_name = device.display_name
    this.active_state = device.active_state
    this.model = device.model
    this.online = device.online
    let latest_accurate_device_point = device.latest_accurate_device_point
    if (latest_accurate_device_point) {
      this.lat = latest_accurate_device_point.lat
      this.lng = latest_accurate_device_point.lng
      this.angle = latest_accurate_device_point.angle
      this.dt_server = latest_accurate_device_point.dt_server
      this.dt_tracker = latest_accurate_device_point.dt_tracker
      let device_point_detail = latest_accurate_device_point.device_point_detail
      if (device_point_detail) {
        let speeds = getMphAndKph(
          device_point_detail.speed.unit,
          device_point_detail.speed.value,
        )
        this.speed_mph = speeds.mph
        this.speed_kph = speeds.kph
        this.heading = device_point_detail.heading
        this.rssi = device_point_detail.rssi
        this.external_volt = device_point_detail.external_volt
      }
      let device_state = latest_accurate_device_point.device_state
      if (device_state) {
        if (!this.online) {
          this.drive_status = 'NOSIGNAL'
          this.drive_status_display = 'NO SIGNAL'
          let now = new Date()
          let last_online = new Date(latest_accurate_device_point.dt_server)
          let seconds = Math.floor(
            (now.getTime() - last_online.getTime()) / 1000,
          )
          this.drive_status_duration = seconds
          this.drive_status_duration_display = convertSecondsToTime(seconds)
        } else {
          let drive_status = device_state.drive_status.toUpperCase()
          drive_status = drive_status == 'OFF' ? 'STOPPED' : drive_status
          this.drive_status = drive_status
          this.drive_status_display = drive_status
          let seconds = device_state.drive_status_duration.value
          this.drive_status_duration = seconds
          this.drive_status_duration_display = convertSecondsToTime(seconds)
        }
        let odometer = device_state.odometer
        if (odometer) {
          let odometers = getMiAndKm(
            device_state.odometer.unit,
            device_state.odometer.value,
          )
          this.odometer_mi = odometers.mi
          this.odometer_km = odometers.km
        } else {
          this.odometer_mi = null
          this.odometer_km = null
        }
      }
    }
  }
}

export default Device
