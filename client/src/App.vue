<template>
  <v-app>
    <v-app-bar app class="app-bar">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/OSGPS.png"
          transition="scale-transition"
          width="60"
        />
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<style scoped>
.app-bar {
  background: -webkit-linear-gradient(220deg, #1976d2 75%, #ffffff 60%);
  background: -o-linear-gradient(220deg, #1976d2 75%, #ffffff 60%);
  background: -moz-linear-gradient(220deg, #1976d2 75%, #ffffff 60%);
  background: linear-gradient(220deg, #1976d2 75%, #ffffff 60%);
}
</style>
<style>
html {
  overflow-y: hidden !important;
}
</style>
<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
