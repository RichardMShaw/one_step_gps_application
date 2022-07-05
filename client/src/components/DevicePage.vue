<template>
  <v-container class="no-margin">
    <v-row>
      <device-table />
    </v-row>
  </v-container>
</template>

<style scoped>
.no-margin {
  margin: 0;
}
</style>
<script>
import DeviceTable from './DeviceTable.vue'
export default {
  name: 'DevicePage',
  components: {
    DeviceTable,
  },
  data: () => ({}),
}
</script>
