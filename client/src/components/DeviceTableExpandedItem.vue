<template>
  <v-simple-table dense>
    <tbody>
      <tr v-for="header in headers" :key="header.text">
        <td class="key-text table-data">{{ header.text }}</td>
        <td>{{ item[header.value] }}</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<style scoped>
.table-data {
  flex-grow: 1;
}
.key-text {
  font-weight: bold;
}
</style>

<script>
import { ALL_DEVICE_HEADERS_ALPHABETICAL } from '@/constants/deviceHeaders'
export default {
  name: 'DeviceTableExpandedItem',
  props: {
    item: Object,
  },
  data: () => ({}),
  methods: {},
  computed: {
    headers() {
      return ALL_DEVICE_HEADERS_ALPHABETICAL
    },
  },
}
</script>
