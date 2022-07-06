<script>
import { POINT_MARKER_ICON_CONFIG } from '@/constants/mapSettings'
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
    }
  },

  mounted() {
    const { Marker } = this.google.maps
    let position = { lat: this.device.lat, lng: this.device.lng }
    this.marker = new Marker({
      position: position,
      marker: { id: this.device.device_id, position: position },
      map: this.map,
      icon: POINT_MARKER_ICON_CONFIG,
    })
  },

  computed: {
    lat() {
      return this.device.lat
    },
    lng() {
      return this.device.lng
    },
  },

  watch: {
    lat() {
      let latLng = { lat: this.lat, lng: this.lng }
      if (this.marker) {
        this.marker.setPosition(latLng)
      }
    },
    lng() {
      let latLng = { lat: this.lat, lng: this.lng }
      if (this.marker) {
        this.marker.setPosition(latLng)
      }
    },
  },

  render() {},
}
</script>
