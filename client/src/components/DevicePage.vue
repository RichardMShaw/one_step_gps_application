<template>
  <v-container class="home-containter">
    <v-row class="no-margin">
      <v-navigation-drawer
        light
        mini-variant
        mini-variant-width="56"
        class="nav-bar"
        permanent
      >
        <v-list dense nav>
          <v-list-item>
            <v-list-item-action>
              <v-icon @click.stop="device = !device" class="nav-icon">
                mdi-compass
              </v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <device-table v-if="device" />
      <device-map class="map" v-if="showMap" :devices="shownDevices" />
      <layout-model v-if="layoutModel" :z-index="0" />
      <device-icon-model v-if="deviceIconModel.show" :z-index="0" />
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
  border-right: 1px solid rgb(135, 135, 135) !important;
}
.nav-icon {
  color: rgb(34, 34, 34) !important;
}
.nav-bar {
  border-right: 1px solid rgb(135, 135, 135) !important;
}
</style>
<script>
import DeviceTable from './DeviceTable.vue'
import DeviceMap from './DeviceMap.vue'
import LayoutModel from './LayoutModel.vue'
import DeviceIconModel from './DeviceIconModal.vue'

export default {
  name: 'DevicePage',
  components: {
    DeviceTable,
    DeviceMap,
    LayoutModel,
    DeviceIconModel,
  },
  data: () => ({
    device: true,
    showMap: false,
  }),
  computed: {
    devices() {
      return this.$store.getters.devicesFilterByStatus
    },
    shownDevices() {
      return this.$store.getters.devicesFilterByStatusAndHidden
    },
    layoutModel() {
      return this.$store.getters.layoutModel
    },
    deviceIconModel() {
      return this.$store.getters.deviceIconModel
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
