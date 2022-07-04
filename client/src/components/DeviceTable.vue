<template>
  <div class="flex-row">
    <template v-for="(device, i) in devices" :key="i">
      <DeviceTableElement :device="device" />
    </template>
  </div>
</template>

<script>
import DeviceTableElement from './DeviceTableElement'
export default {
  name: 'DeviceTable',
  components: {
    DeviceTableElement,
  },
  props: {},
  computed: {
    devices() {
      return this.$store.getters.devices
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped></style>
