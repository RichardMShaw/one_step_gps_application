<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot :google="google" :map="map" />
    </template>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader'

export default {
  props: {
    mapConfig: Object,
    apiKey: String,
  },

  data() {
    return {
      google: null,
      map: null,
    }
  },

  async mounted() {
    const googleMapApi = new Loader({
      apiKey: this.apiKey,
    })
    this.google = await googleMapApi.load().catch((err) => console.error(err))
    this.initializeMap()
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig)
      this.$store.commit('newMarkerCluster', { map: this.map })
    },
  },
}
</script>

<style scoped>
.google-map {
  width: 100%;
  min-height: 100%;
}
</style>
