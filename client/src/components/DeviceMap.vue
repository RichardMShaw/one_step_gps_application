<template>
  <GoogleMapsLoader :mapConfig="mapConfig" :apiKey="api">
    // insert your google maps api key to render styled map
    <template slot-scope="{ google, map }">
      <GoogleMapsDeviceMarker
        v-for="device in devices"
        :key="device.device_id"
        :device="device"
        :google="google"
        :map="map"
      />
    </template>
  </GoogleMapsLoader>
</template>

<script>
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
      if (!this.devices.length) {
        return { lat: 0, lng: 0 }
      }
      let device = this.devices[0]
      return { lat: device.lat, lng: device.lng }
    },
  },
}
</script>
