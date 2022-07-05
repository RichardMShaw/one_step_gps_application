<template>
  <v-data-table
    :headers="headers"
    :items="devices"
    :expanded="expanded"
    @click:row="expand"
    item-key="device_id"
    hide-default-footer
    class="elevation-1"
  >
    <template v-slot:top>
      <v-tabs background-color="deep-purple accent-4" center-active dark>
        <v-tab>All</v-tab>
        <v-tab>Driving</v-tab>
        <v-tab>Idle</v-tab>
        <v-tab>Stopped</v-tab>
      </v-tabs>
    </template>
    <template v-slot:item.odometer_mi="{ item }">
      {{ convertToInt(item.odometer_mi) }}
    </template>
    <template v-slot:item.odometer_km="{ item }">
      {{ convertToInt(item.odometer_km) }}
    </template>
    <template v-slot:item.speed_mph="{ item }">
      {{ convertToInt(item.speed_mph) }}
    </template>
    <template v-slot:item.speed_kph="{ item }">
      {{ convertToInt(item.speed_kph) }}
    </template>
    <template v-slot:item.drive_status="{ item }">
      {{ item.drive_status.toUpperCase() }}
    </template>
    <template v-slot:item.drive_status_duration_s="{ item }">
      {{ convertToTime(item.drive_status_duration_s) }}
    </template>
    <template v-slot:item.active_state="{ item }">
      <v-icon :color="getActiveStateColor(item.active_state)">
        {{ getActiveStateIcon(item.active_state) }}
      </v-icon>
    </template>
    <template v-slot:expanded-item="{ item }">
      <device-table-expanded-item :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import DeviceTableExpandedItem from './DeviceTableExpandedItem.vue'
export default {
  name: 'DeviceTable',
  components: {
    DeviceTableExpandedItem,
  },
  data: () => ({
    expanded: [],
    headers: [
      {
        text: 'Name',
        align: 'start',
        value: 'display_name',
      },
      {
        text: 'Model',
        align: 'left',
        value: 'model',
      },
      {
        text: 'Odometer (mi)',
        align: 'right',
        value: 'odometer_mi',
      },
      {
        text: 'Odometer (km)',
        align: 'right',
        value: 'odometer_km',
      },
      {
        text: 'mph',
        align: 'right',
        value: 'speed_mph',
      },
      {
        text: 'kph',
        align: 'right',
        value: 'speed_kph',
      },
      {
        text: 'Drive Status',
        align: 'center',
        value: 'drive_status',
      },
      {
        text: 'Status Duration',
        align: 'left',
        value: 'drive_status_duration_s',
      },
      {
        text: 'Active',
        align: 'center',
        value: 'active_state',
      },
    ],
  }),
  methods: {
    expand(value) {
      if (this.expanded[0] == value) {
        this.expanded = []
        return
      }
      this.expanded = [value]
    },
    convertToTime(value) {
      console.log(value)
      let totalSeconds = value

      let days = Math.floor(totalSeconds / (24 * 3600))
      totalSeconds %= 24 * 3600

      let hours = Math.floor(totalSeconds / 3600)
      totalSeconds %= 3600

      let minutes = Math.floor(totalSeconds / 60)
      totalSeconds %= 60

      let seconds = totalSeconds

      let secondsString = seconds ? `${seconds} s` : ''
      let minutesString = minutes ? `${minutes} m` : ''
      let hoursString = hours ? `${hours} h` : ''
      let daysString = days ? `${days} d` : ''

      let timeString = `${daysString} ${hoursString} ${minutesString} ${secondsString}`
      return timeString.trim()
    },
    convertToInt(value) {
      return Math.floor(value)
    },
    getActiveStateIcon(value) {
      if (value == 'active') {
        return 'mdi-checkbox-marked-circle'
      }
      return 'close-circle'
    },
    getActiveStateColor(value) {
      if (value == 'active') {
        return 'green darken-2'
      }
      return 'red darken-2'
    },
    position(lat, lng) {
      let truncLat = Math.floor(lat * 1000000) / 1000000
      let truncLng = Math.floor(lng * 1000000) / 1000000
      return `${truncLat}°,${truncLng}°`
    },
  },
  computed: {
    devices() {
      return this.$store.getters.devices
    },
  },
}
</script>
