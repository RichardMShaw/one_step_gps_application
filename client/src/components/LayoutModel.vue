<template>
  <v-overlay :z-index="zIndex" @click="close">
    <v-sheet
      color="white"
      elevation="1"
      class="modal-sheet"
      outlined
      rounded
      shaped
      @click.stop
      light
    >
      <div class="modal-header-row">
        <h1 class="black-text">Layout Settings</h1>
        <v-spacer></v-spacer>
        <p class="count-text">
          {{ `Active Headers: ${shownHeadersCount}/7` }}
        </p>
      </div>
      <v-divider class="border-color"></v-divider>
      <div class="flex">
        <v-chip
          v-for="header in allHeaders"
          :key="header.value"
          class="ma-2"
          :color="color(header)"
          :text-color="textColor(header)"
          @click="changeHeader(header.value)"
          ripple
          :disabled="isDisabled(header.value)"
        >
          {{ header.text }}
        </v-chip>
      </div>
      <v-divider class="border-color"></v-divider>
      <div class="text-center" style="padding-top: 0.5rem;">
        <v-btn
          class="white--text model-button"
          color="light-blue"
          @click="revertToDefault"
        >
          Default
        </v-btn>
        <v-btn
          class="white--text model-button"
          color="light-blue"
          @click="save"
        >
          Save
        </v-btn>
        <v-btn
          class="white--text model-button"
          color="light-blue"
          @click="close"
        >
          Close
        </v-btn>
      </div>
    </v-sheet>
  </v-overlay>
</template>

<style scoped>
.modal-sheet {
  width: 60vw;
  padding: 1rem;
}
.text-center {
  text-align: center;
}
.flex {
  display: flex;
  flex-wrap: wrap;
}
.model-button {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.border-color {
  border-color: #808080;
}
.black-text {
  color: black;
}
.modal-header-row {
  display: flex;
  flex-direction: row;
}
.count-text {
  font-weight: bold;
  font-size: 16px;
  color: black;
  margin-top: auto;
  margin-bottom: 0;
}
</style>

<script>
//Modal created for modifing the table headers on DeviceTable
//Shows how the table looks beneath the overlay
//Settings only save when the "Save" button is clicked
import DeviceHeaderSettingsAPI from '@/utils/deviceHeaderSettingsAPI'
const { postAndStoreDeviceHeaderSettings } = DeviceHeaderSettingsAPI
import { ALL_DEVICE_HEADERS } from '@/constants/deviceHeaders'
export default {
  name: 'LayoutModel',
  props: ['zIndex'],
  data: () => ({
    oldHeaders: {},
    deviceHeaders: {},
  }),
  methods: {
    close() {
      this.$store.dispatch('setDeviceHeaderSettings', this.oldHeaders)
      this.$store.dispatch('closeLayoutModel')
    },
    save() {
      postAndStoreDeviceHeaderSettings(
        { header_settings: this.deviceHeaders },
        true,
      )
      this.$store.dispatch('closeLayoutModel')
    },
    color(item) {
      return this.deviceHeaders[item.value] ? 'blue' : 'grey'
    },
    textColor(item) {
      return this.deviceHeaders[item.value] ? 'white' : 'black'
    },
    changeHeader(key) {
      this.$store.dispatch('changeDeviceHeaderSetting', key)
      this.deviceHeaders = this.$store.getters.deviceHeaderSettings
    },
    revertToDefault() {
      this.$store.dispatch('setDefaultDeviceHeaderSettings')
      this.deviceHeaders = this.$store.getters.deviceHeaderSettings
    },
    isDisabled(key) {
      let value = this.deviceHeaders[key]
      return !value && this.disableChips
    },
  },
  computed: {
    allHeaders() {
      return ALL_DEVICE_HEADERS
    },
    shownHeadersCount() {
      let count = 0
      let entries = Object.entries(this.deviceHeaders)
      entries.forEach((entry) => {
        if (entry[1]) {
          count++
        }
      })
      return count
    },
    disableChips() {
      return this.shownHeadersCount > 6
    },
  },
  mounted() {
    this.deviceHeaders = this.$store.getters.deviceHeaderSettings
    this.oldHeaders = JSON.parse(JSON.stringify(this.deviceHeaders))
  },
}
</script>
