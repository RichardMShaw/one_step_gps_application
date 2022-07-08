<template>
  <div :id="`${id}_info_window`">
    {{ name }}
  </div>
</template>

<script>
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
  },

  data() {
    return {
      marker: null,
      infoWindow: null,
    }
  },

  computed: {
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
      return this.device.angle + 315
    },
    icon() {
      return this.marker.icon
    },
  },

  watch: {
    device() {
      if (this.marker) {
        let latLng = { lat: this.lat, lng: this.lng }
        this.marker.setPosition(latLng)
        let icon = this.marker.getIcon()
        icon.rotation = this.angle
        icon.fillColor = COLORS[this.drive_status]
      }
    },
  },

  mounted() {
    const { Marker, InfoWindow } = this.google.maps
    // const { InfoWindow } = this.google.maps
    let position = { lat: this.lat, lng: this.lng }
    let icon = {
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

    this.marker = new Marker({
      position: position,
      marker: { id: this.device.device_id, position: position },
      map: this.map,
      icon: icon,
    })
    this.infoWindow = new InfoWindow({
      content: `<div id="${this.id}_info_id"></div>`,
    })
    this.infoWindow.open({ anchor: this.marker, map: this.map })
    setTimeout(() => {
      let elem = document.getElementById(`${this.id}_info_id`)
      if (elem) {
        let parent = elem.parentElement.parentElement.parentElement
        let removeBtn = parent.children[1]
        parent.removeChild(removeBtn)
        let realInfo = document.getElementById(`${this.id}_info_window`)
        elem.append(realInfo)
      }
    }, 1000 / 15)
  },

  beforeDestroy() {
    if (this.marker) {
      this.marker.setMap(null)
      if (this.infoWindow) {
        this.infoWindow.setMap(null)
      }
    }
  },

  render() {},
}
</script>
