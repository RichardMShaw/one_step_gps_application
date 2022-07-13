const convertSecondsToTime = (value) => {
  if (value < 1) {
    return '0 s'
  }
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

const formatDate = (timeString) => {
  return new Date(timeString).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

//A class created to parse and store data from /v3/api/public/device?latest_point=true
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

      //Truncating lat and lng for displaying position while keeping original values
      let truncLat = Math.floor(this.lat * 1000000) / 1000000
      let truncLng = Math.floor(this.lng * 1000000) / 1000000
      this.position = `${truncLat}°,${truncLng}°`

      this.angle = latest_accurate_device_point.angle

      //Storing original dates while creating new formatted timestamps
      this.dt_server = latest_accurate_device_point.dt_server
      this.dt_server_display = formatDate(
        latest_accurate_device_point.dt_server,
      )
      this.dt_tracker = latest_accurate_device_point.dt_tracker
      this.dt_tracker_display = formatDate(
        latest_accurate_device_point.dt_tracker,
      )

      let device_point_detail = latest_accurate_device_point.device_point_detail
      if (device_point_detail) {
        //Getting Mph from Kph and vice-versa
        let speeds = getMphAndKph(
          device_point_detail.speed.unit,
          device_point_detail.speed.value,
        )
        this.speed_mph = Math.floor(speeds.mph)
        this.speed_kph = Math.floor(speeds.kph)

        this.heading = device_point_detail.heading
        this.rssi = device_point_detail.rssi
        this.external_volt = device_point_detail.external_volt
        this.battery = `${device_point_detail.external_volt} Volts`
      }

      let params = latest_accurate_device_point.params
      if (params) {
        this.gpslev = params.gpslev
      }

      let device_state = latest_accurate_device_point.device_state
      if (device_state) {
        if (!this.online) {
          //Converting PFF drive status to NO SIGNAL
          this.drive_status = 'NOSIGNAL'
          this.drive_status_display = 'NO SIGNAL'

          //Getting offline duration by comparing dt_server time to current time
          let now = new Date()
          let last_online = new Date(latest_accurate_device_point.dt_server)
          let seconds = Math.floor(
            (now.getTime() - last_online.getTime()) / 1000,
          )
          this.drive_status_duration = seconds
          this.drive_status_duration_display = convertSecondsToTime(seconds)
        } else {
          //Converting status to upper case and converting OFF to STOPPED for presentation
          let drive_status = device_state.drive_status.toUpperCase()
          drive_status = drive_status == 'OFF' ? 'STOPPED' : drive_status
          this.drive_status = drive_status
          this.drive_status_display = drive_status

          //Storing original value of seconds for sorting and retreving timestamp for displaying
          let seconds = device_state.drive_status_duration.value
          this.drive_status_duration = seconds
          this.drive_status_duration_display = convertSecondsToTime(seconds)
        }

        //Combining drive status and duration for displaying
        this.drive_status_and_duration = `${this.drive_status_display} ${this.drive_status_duration_display}`
        let odometer = device_state.odometer

        //Odometer can sometimes not exist and must be checked for
        if (Object.keys(odometer).length) {
          //Getting Mi from Km and vice-versa
          let odometers = getMiAndKm(
            device_state.odometer.unit,
            device_state.odometer.value,
          )
          this.odometer_mi = Math.floor(odometers.mi)
          this.odometer_km = Math.floor(odometers.km)
        }

        //0 can be a valid odometer value. Display UNKNOWN if undefined
        this.odometer_mi_display =
          this.odometer_mi !== undefined ? this.odometer_mi : 'UNKNOWN'
        this.odometer_km_display =
          this.odometer_km !== undefined ? this.odometer_km : 'UNKNOWN'
      }
    }
  }
}

export default Device
