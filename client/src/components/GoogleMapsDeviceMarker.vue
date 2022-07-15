<template>
  <span>
    <div :id="`${id}_info_window`" class="no-display">
      <div class="info-container">
        <img width="32px" height="32px" :src="`${getIcon()}`" />
        <div>{{ name }}</div>
      </div>
    </div>
  </span>
</template>

<style scoped>
.info-container {
  text-align: center;
}
.no-display {
  display: none;
}
</style>

<script>
//Functionality for the markers tracking devices on Google Maps
import DeviceIconAPI from '@/utils/deviceIconAPI'
const { getAndStoreDeviceIcon } = DeviceIconAPI
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import COLORS from '@/constants/colors'
import Device from '@/utils/deviceClass'

export default {
  props: {
    google: {
      type: Object,
      required: true,
    },
    map: {
      type: Object,
      required: true,
    },
    device: {
      type: Device,
      required: true,
    },
    markerCluster: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      marker: null,
      infoWindow: null,
      templateInfo: null,
    }
  },

  methods: {
    getIcon() {
      if (!this.deviceIcons[this.id]) {
        //If icon does not exist, fetch image from database and store it
        //A placeholder is immedately stored before fetching to use while waiting for a response
        getAndStoreDeviceIcon(this.id)
      }
      return this.deviceIcons[this.id]
    },
    appendToInfoWindow() {
      //Appends the template component to the InfoWindow
      //InfoWindow may not immedately render and a timeout is used to ensure it gets appended once it appears
      this.$nextTick(() => {
        let elem = document.getElementById(`${this.id}_info_id`)
        let templateInfo = this.templateInfo
        if (elem && templateInfo) {
          templateInfo.style.display = 'block'
          elem.append(templateInfo)
        } else {
          setTimeout(this.appendToInfoWindow, 1000 / 30)
        }
      })
    },

    openInfoWindow() {
      const { InfoWindow } = this.google.maps
      //Opens InfoWindow if it does not already exist or is closed
      //Otherwise, do nothing
      if (this.infoWindow && this.infoWindow.getMap() != null) {
        return
      }

      //Creates an empty div with an id to append the templateInfo element
      this.infoWindow = new InfoWindow({
        content: `<div id="${this.id}_info_id"></div>`,
        options: { disableAutoPan: true },
      })
      this.infoWindow.open({ anchor: this.marker, map: this.map })
      this.appendToInfoWindow()
    },
  },

  computed: {
    focusDevice() {
      return this.$store.getters.focusDevice
    },
    deviceIcons() {
      return this.$store.getters.deviceIcons
    },
    id() {
      return this.device.device_id
    },
    name() {
      return this.device.display_name
    },
    drive_status() {
      return this.device.drive_status
    },
    lat() {
      return this.device.lat
    },
    lng() {
      return this.device.lng
    },
    angle() {
      //+315 is used to correct the direction of the icon
      return this.device.angle + 315
    },
    icon() {
      return {
        path: faLocationArrow.icon[4],
        fillColor: COLORS[this.drive_status],
        storkeColor: '#212121',
        fillOpacity: 1,
        anchor: new google.maps.Point(
          faLocationArrow.icon[0] / 2, // width
          faLocationArrow.icon[1], // height
        ),
        scale: 0.075,
        rotation: this.angle,
      }
    },
  },

  watch: {
    focusDevice() {
      //When a device is expanded on the DeviceTable, the map centers on the marker
      if (
        !this.focusDevice ||
        !this.device ||
        this.focusDevice.device_id != this.id ||
        !this.marker
      ) {
        return
      }
      this.map.setCenter(this.marker.getPosition())
    },
    device() {
      //Updates marker and icon when device changes
      if (this.marker) {
        let latLng = { lat: this.lat, lng: this.lng }
        this.marker.setPosition(latLng)
        this.marker.setIcon(this.icon)
      }
    },
  },

  mounted() {
    //Stores template element for appending to InfoWindow once it opens
    this.templateInfo = document.getElementById(`${this.id}_info_window`)
    const { Marker } = this.google.maps
    let position = { lat: this.lat, lng: this.lng }
    this.marker = new Marker({
      position: position,
      marker: { id: this.device.device_id, position: position },
      map: this.map,
      icon: this.icon,
    })
    this.markerCluster.addMarker(this.marker)
    this.openInfoWindow()
    this.marker.addListener('click', () => this.openInfoWindow())
  },

  beforeDestroy() {
    if (this.marker) {
      if (this.infoWindow) {
        this.infoWindow.setMap(null)
      }
      this.markerCluster.removeMarker(this.marker)
    }
  },

  render() {},
}
</script>
