<template>
  <GoogleMapsLoader :mapConfig="mapConfig" :apiKey="api">
    <template slot-scope="{ google, map }" v-if="devices && markerCluster">
      <GoogleMapsDeviceMarker
        v-for="device in devices"
        :key="device.device_id"
        :device="device"
        :google="google"
        :map="map"
        :marker-cluster="markerCluster"
      />
    </template>
  </GoogleMapsLoader>
</template>

<script>
//Component loads google maps using devices which are filtered based on their status and if not hidden
import GoogleMapsLoader from './GoogleMapsLoader'
import GoogleMapsDeviceMarker from './GoogleMapsDeviceMarker'

import { GOOGLE_MAPS_KEY, mapSettings } from '@/constants/mapSettings'

export default {
  props: ['devices'],
  components: {
    GoogleMapsLoader,
    GoogleMapsDeviceMarker,
  },

  data() {
    return {}
  },

  mounted() {},

  computed: {
    markerCluster() {
      return this.$store.getters.markerCluster
    },
    mapTypeId() {
      return this.$store.getters.mapTypeId
    },
    api() {
      return GOOGLE_MAPS_KEY
    },
    mapConfig() {
      return {
        ...mapSettings,
        mapTypeId: this.mapTypeId,
        center: this.mapCenter,
      }
    },
    mapCenter() {
      let latLng = { lat: 0, lng: 0 }
      if (!this.devices.length) {
        return latLng
      }
      this.devices.forEach((item) => {
        latLng.lat += item.lat
        latLng.lng += item.lng
      })
      latLng.lat /= this.devices.length
      latLng.lng /= this.devices.length
      return latLng
    },
  },
}
</script>
