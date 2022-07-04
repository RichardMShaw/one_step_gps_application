<template>
  <div class="flex-row">
    <HelloWorld />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
  },

  mounted() {
    this.$store.dispatch('startGetDevicesTimeout')
  },
}
</script>
