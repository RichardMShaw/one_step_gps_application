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
    return {
      mapConfig: {
        ...mapSettings,
        mapTypeId: this.$store.getters.mapTypeId,
        center: this.getCenter(),
      },
    }
  },

  mounted() {},

  methods: {
    getCenter() {
      let latLng = { lat: 0, lng: 0 }
      if (!this.devices.length) {
        return latLng
      }
      let firstDevice = this.devices[0]

      let smallestLat = firstDevice.lat
      let largestLat = firstDevice.lat

      let smallestLng = firstDevice.lng
      let largestLng = firstDevice.lng
      this.devices.forEach((item) => {
        smallestLat = item.lat < smallestLat ? item.lat : smallestLat
        smallestLng = item.lng < smallestLng ? item.lng : smallestLng

        largestLat = item.lat > largestLat ? item.lat : largestLat
        largestLng = item.lng > largestLng ? item.lng : largestLng
      })
      let latDiff = largestLat - smallestLat
      let lngDiff = largestLng - smallestLng
      latLng.lat = smallestLat + latDiff / 2
      latLng.lng = smallestLng + lngDiff / 2

      return latLng
    },
  },

  computed: {
    markerCluster() {
      return this.$store.getters.markerCluster
    },
    api() {
      return GOOGLE_MAPS_KEY
    },
  },
}
</script>
