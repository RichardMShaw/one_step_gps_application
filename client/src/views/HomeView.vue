<template>
  <device-page />
</template>

<script>
import DevicePage from '../components/DevicePage.vue'

export default {
  name: 'HomeView',

  components: {
    DevicePage,
  },

  mounted() {
    this.$store.dispatch('startGetDevicesTimeout')
  },
}
</script>
