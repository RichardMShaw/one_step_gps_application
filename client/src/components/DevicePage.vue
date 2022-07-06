<template>
  <v-container class="home-containter">
    <v-row class="no-margin">
      <v-navigation-drawer dark mini-variant mini-variant-width="56" permanent>
        <v-list dense nav>
          <v-list-item>
            <v-list-item-action>
              <v-icon @click.stop="device = !device">mdi-compass</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <device-table v-if="device" />
      <device-map class="map" v-if="showMap" :devices="devices" />
    </v-row>
  </v-container>
</template>

<style scoped>
.map {
  flex-grow: 1;
}
.home-containter {
  margin: 0;
  padding: 0;
  height: 100%;
  max-width: none;
}
.row {
  margin: 0;
  height: 100%;
}
</style>
<script>
import DeviceTable from './DeviceTable.vue'
import DeviceMap from './DeviceMap.vue'
export default {
  name: 'DevicePage',
  components: {
    DeviceTable,
    DeviceMap,
  },
  data: () => ({
    device: true,
    showMap: false,
  }),
  computed: {
    devices() {
      return this.$store.getters.devicesStatusFiltered
    },
  },
  watch: {
    devices() {
      if (this.devices.length > 0) {
        this.showMap = true
      }
    },
  },
}
</script>
