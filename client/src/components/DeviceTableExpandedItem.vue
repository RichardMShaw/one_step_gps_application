<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <tr v-if="battery">
          <td class="key-text">Battery</td>
          <td>{{ battery }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<style scoped>
.key-text {
  font-weight: bold;
}
</style>

<script>
export default {
  name: 'DeviceTableExpandedItem',
  props: {
    item: Object,
  },
  data: () => ({}),
  methods: {},
  computed: {
    battery() {
      return this.item.external_volt
    },
    lat() {
      return this.item.lat
    },
    lng() {
      return this.item.lng
    },
    position() {
      let truncLat = Math.floor(this.lat * 1000000) / 1000000
      let truncLng = Math.floor(this.lng * 1000000) / 1000000
      return `${truncLat}°,${truncLng}°`
    },
  },
}
</script>
