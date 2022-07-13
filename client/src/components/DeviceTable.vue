<template>
  <v-data-table
    :headers="headers"
    :items="devices"
    :expanded="expanded"
    :item-class="getRowBackground"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    @click:row="expand"
    item-key="device_id"
    hide-default-footer
    class="elevation-1 table-settings"
  >
    <template v-slot:top>
      <div style="display: flex;">
        <v-tabs
          v-model="activeTab"
          :background-color="tabColor"
          center-active
          dark
          show-arrows
        >
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="(tab, i) in tabs" :key="i" @click="setFilter(tab)">
            {{ `${tab} (${deviceStatusCount[tab]})` }}
          </v-tab>
          <v-spacer></v-spacer>
          <v-btn height="100%" dark @click="$store.dispatch('showLayoutModel')">
            Layout
            <v-icon right dark>
              mdi-cog
            </v-icon>
          </v-btn>
        </v-tabs>
      </div>
    </template>
    <template v-slot:header.show>
      <v-icon @click="setAllHiddenDevices">{{ eyeIcon }}</v-icon>
    </template>
    <template v-slot:item.show="{ item }">
      <td class="show-icon-td">
        <v-simple-checkbox
          :value="!hiddenSettings[item.device_id]"
          @click="changeHiddenDevice(item)"
          v-ripple="false"
          color="blue"
        ></v-simple-checkbox>
      </td>
    </template>
    <template v-slot:item.icon="{ item }">
      <v-avatar tile @click.stop="setIcon(item)">
        <img :src="`${getIcon(item)}`" />
      </v-avatar>
    </template>
    <template v-slot:item.odometer_mi="{ item }">
      {{ item.odometer_mi_display }}
    </template>
    <template v-slot:item.odometer_km="{ item }">
      {{ item.odometer_km_display }}
    </template>
    <template v-slot:item.speed_mph="{ item }">
      {{ getInt(item.speed_mph) }}
    </template>
    <template v-slot:item.speed_kph="{ item }">
      {{ getInt(item.speed_kph) }}
    </template>
    <template v-slot:item.drive_status="{ item }">
      {{ item.drive_status_display }}
    </template>
    <template v-slot:item.drive_status_duration="{ item }">
      {{ item.drive_status_duration_display }}
    </template>
    <template v-slot:item.active_state="{ item }">
      <v-icon :color="getActiveStateColor(item.active_state)">
        {{ getActiveStateIcon(item.active_state) }}
      </v-icon>
    </template>
    <template v-slot:item.rssi="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon :color="getSignalColor(item.online)" v-bind="attrs" v-on="on">
            {{ getSignalIcon(item) }}
          </v-icon>
        </template>
        <span>{{ getSignalInfo(item) }}</span>
      </v-tooltip>
    </template>
    <template v-slot:expanded-item="{ item }">
      <td style="padding: 0;" :colspan="headers.length">
        <device-table-expanded-item :item="item" />
      </td>
    </template>
  </v-data-table>
</template>

<style>
.table-settings {
  display: flex;
  flex-direction: column;
  max-width: calc(50% - 56px);
}
.table-settings > .v-data-table__wrapper {
  overflow-y: auto !important;
  flex-grow: 1;
  flex-basis: 0;
}
th {
  white-space: nowrap;
}
td {
  white-space: nowrap;
}
.driving-row {
  background-color: #80cbc4 !important;
}
.idle-row {
  background-color: #90caf9 !important;
}
.stopped-row {
  background-color: #ef9a9a !important;
}
.nosignal-row {
  background-color: #b0bec5 !important;
}
.show-icon-td {
  background-color: white;
  border-right: rgb(56, 56, 56);
  text-align: center;
}
</style>

<script>
//All data relating to devices is shown here
//Sorting is based on the value from the value keys in the Header Constants

//Routing functions are imported from utility save and fetch data
import DeviceFilterSettingsAPI from '@/utils/deviceFilterSettingsAPI'
const {
  getAndStoreDeviceFilterSettings,
  postAndStoreDeviceFilterSettings,
} = DeviceFilterSettingsAPI

import DeviceHeaderSettingsAPI from '@/utils/deviceHeaderSettingsAPI'
const { getAndStoreDeviceHeaderSettings } = DeviceHeaderSettingsAPI

import DeviceHiddenSettingsAPI from '@/utils/deviceHiddenSettingsAPI'
const {
  getAndStoreDeviceHiddenSettings,
  postDeviceHiddenSettings,
} = DeviceHiddenSettingsAPI

import DeviceSortSettingsAPI from '@/utils/deviceSortSettingsAPI'
const {
  getAndStoreDeviceSortSettings,
  postAndStoreDeviceSortSettings,
} = DeviceSortSettingsAPI

import DeviceIconAPI from '@/utils/deviceIconAPI'
const { getAndStoreDeviceIcon } = DeviceIconAPI

import DeviceTableExpandedItem from './DeviceTableExpandedItem.vue'

export default {
  name: 'DeviceTable',
  components: {
    DeviceTableExpandedItem,
  },
  data: () => ({
    expanded: [],
    tabColors: {
      ALL: 'blue-grey darken-4',
      DRIVING: 'teal darken-4',
      IDLE: 'blue darken-4',
      STOPPED: 'red darken-4',
      NOSIGNAL: 'grey darken-4',
    },
    sortBy: null,
    sortDesc: null,
    activeTab: 0,
    tabs: ['ALL', 'DRIVING', 'IDLE', 'STOPPED', 'NOSIGNAL'],
  }),
  mounted() {
    //Gets and Stores settings if not yet retrieved
    getAndStoreDeviceFilterSettings(true)
    getAndStoreDeviceHeaderSettings(true)
    getAndStoreDeviceHiddenSettings(true)
    getAndStoreDeviceSortSettings(true).then(() => {
      this.sortBy = this.sortSettings.sort_by
      this.sortDesc = this.sortSettings.sort_desc
    })

    this.activeTab = this.tabs.indexOf(this.statusFilter)
  },
  methods: {
    expand(device) {
      //Expands the table to show more information about the device
      //Device must be stored in a list
      if (this.expanded[0] == device) {
        this.expanded = []
        this.$store.commit('setFocusDevice', null)
        return
      }
      this.expanded = [device]
      this.$store.commit('setFocusDevice', device)
    },
    setFilter(status) {
      //Saves new filter to database. Value is immedately stored locally
      postAndStoreDeviceFilterSettings({ drive_status: status }, true)
    },
    setAllHiddenDevices() {
      //If 1 more devices are shown, then set the rest to hidden
      //Otherwise, show all devices
      //Then save the setting to the database
      if (this.noHiddenDevices) {
        this.$store.commit('setAllHiddenDevices', {
          devices: this.devices,
          value: true,
        })
      } else {
        this.$store.commit('setAllHiddenDevices', {
          devices: this.devices,
          value: false,
        })
      }
      postDeviceHiddenSettings({ hidden_devices: this.hiddenSettings })
    },
    setIcon(item) {
      this.$store.dispatch('showDeviceIconModal', item)
    },
    changeHiddenDevice(item) {
      //Makes shown devices hidden and vice-verse
      //Then saves to the database
      this.$store.commit('changeHiddenDevice', item)
      postDeviceHiddenSettings({ hidden_devices: this.hiddenSettings })
    },
    getInt(value) {
      if (isNaN(value)) {
        return 'UNKNOWN'
      }
      return Math.floor(value)
    },
    getRowBackground(item) {
      switch (item.drive_status) {
        case 'DRIVING':
          return 'driving-row'
        case 'IDLE':
          return 'idle-row'
        case 'STOPPED':
          return 'stopped-row'
        default:
          return 'nosignal-row'
      }
    },
    getIcon(item) {
      if (!this.deviceIcons[item.device_id]) {
        //If icon does not exist, fetch image from the database and store it
        //A placeholder is immedately stored before fetching to use while waiting for a response
        getAndStoreDeviceIcon(item.device_id)
      }
      return this.deviceIcons[item.device_id]
    },
    getSignalIcon(item) {
      //Determines what icon the RSSI header will use
      if (!item.online) {
        return 'mdi-wifi-strength-off'
      }
      const rssi = item.rssi
      switch (true) {
        case rssi < -120:
          return 'mdi-wifi-strength-1'
        case rssi < -105:
          return 'mdi-wifi-strength-2'
        case rssi < -90:
          return 'mdi-wifi-strength-3'
        default:
          return 'mdi-wifi-strength-4'
      }
    },
    getSignalColor(value) {
      return value ? '#388E3C' : 'grey darken-4'
    },
    getSignalInfo(item) {
      //Computes RSSI tooltip information
      if (!item.online) {
        return 'Connection: No'
      }
      let rssiQuality = ''
      const rssi = item.rssi
      switch (true) {
        case rssi < -120:
          rssiQuality = 'Weak'
          break
        case rssi < -105:
          rssiQuality = 'Fair'
          break
        case rssi < -90:
          rssiQuality = 'Good'
          break
        default:
          rssiQuality = 'Excellent'
          break
      }
      return `Connection: Yes, RSSI: ${rssi} ${rssiQuality}`
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
  },
  computed: {
    headers() {
      return this.$store.getters.deviceHeadersFiltered
    },
    unfilteredDevices() {
      return this.$store.getters.devices
    },
    devices() {
      return this.$store.getters.devicesFilterByStatus
    },
    statusFilter() {
      return this.$store.getters.deviceStatusFilter
    },
    sortSettings() {
      return this.$store.getters.deviceSortSettings
    },
    hiddenSettings() {
      //If hidden settings haven't been fetched, default to an empty object to prevent errors
      return this.$store.getters.deviceHiddenSettings
        ? this.$store.getters.deviceHiddenSettings
        : {}
    },
    deviceIcons() {
      return this.$store.getters.deviceIcons
    },
    tabColor() {
      if (!this.statusFilter) {
        return this.tabColors['ALL']
      }
      return this.tabColors[this.statusFilter]
    },
    deviceStatusCount() {
      let list = this.unfilteredDevices
      let count = { ALL: 0, DRIVING: 0, IDLE: 0, STOPPED: 0, NOSIGNAL: 0 }
      list.forEach((item) => {
        count['ALL']++
        count[item.drive_status]++
      })
      return count
    },
    noHiddenDevices() {
      let hidden = this.hiddenSettings
      if (Object.keys(hidden).length < 1) {
        return true
      }
      let devices = this.devices
      let len = devices.length
      for (let i = 0; i < len; i++) {
        if (!hidden[devices[i].device_id]) {
          return true
        }
      }
      return false
    },
    eyeIcon() {
      if (this.noHiddenDevices) {
        return 'mdi-eye'
      }
      return 'mdi-eye-off'
    },
  },
  watch: {
    statusFilter() {
      this.activeTab = this.tabs.indexOf(this.statusFilter)
    },
    sortBy(newVal, oldVal) {
      //Save sort settings on change to database if not redundant
      if (oldVal == null || this.sortSettings.sort_by == this.sortBy) {
        return
      }
      this.$nextTick().then(() => {
        postAndStoreDeviceSortSettings(
          { sort_by: this.sortBy, sort_desc: this.sortDesc },
          true,
        )
      })
    },
    sortDesc(newVal, oldVal) {
      //Save sort settings on change to database if not redundant
      if (oldVal == null || this.sortSettings.sort_desc == this.sortDesc) {
        return
      }
      this.$nextTick().then(() => {
        postAndStoreDeviceSortSettings(
          { sort_by: this.sortBy, sort_desc: this.sortDesc },
          true,
        )
      })
    },
  },
}
</script>
