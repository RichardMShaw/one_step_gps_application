<template>
  <v-card class="mx-auto" max-width="64" tile>
    <v-list dense>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-icon>
            <v-icon v-text="item"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'NavigationList',
  components: {},
  data: () => ({
    selectedItem: 0,
    items: ['compass'],
  }),
}
</script>
