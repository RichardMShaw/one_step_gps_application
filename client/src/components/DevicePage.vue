<template>
  <v-container class="containter">
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
    </v-row>
  </v-container>
</template>

<style scoped>
.containter {
  margin: 0;
  padding: 0;
  height: 100%;
}
.row {
  margin: 0;
  height: 100%;
}
</style>
<script>
import DeviceTable from './DeviceTable.vue'
export default {
  name: 'DevicePage',
  components: {
    DeviceTable,
  },
  data: () => ({
    device: true,
  }),
}
</script>
