<template>
  <v-overlay :z-index="zIndex">
    <v-sheet
      color="white"
      elevation="1"
      class="card-padding"
      outlined
      rounded
      shaped
      light
    >
      <h1 class="black-text">{{ `Icon Upload - ${name}` }}</h1>
      <v-divider class="border-color"></v-divider>
      <div class="image-preview-div image-preview-size">
        <img class="image-preview-size" v-if="previewFile" :src="previewFile" />
        <v-sheet v-else class="icon-placeholder-div image-preview-size">
          <v-icon class="icon-placeholder">mdi-image</v-icon>
        </v-sheet>
      </div>
      <v-divider class="border-color"></v-divider>
      <v-file-input
        label="Image Select"
        filled
        prepend-icon="mdi-camera"
        accept="image/png, image/jpeg, image/jpg"
        @change="fileSelected"
      ></v-file-input>
      <div class="justify-center">
        <v-btn
          class="white--text model-button"
          color="light-blue"
          @click="close"
        >
          Close
        </v-btn>
        <v-btn
          class="white--text model-button"
          color="light-blue"
          @click="upload"
        >
          Upload
        </v-btn>
      </div>
    </v-sheet>
  </v-overlay>
</template>

<style scoped>
.card-padding {
  padding: 1rem;
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
.image-preview-size {
  width: 512px;
  height: 512px;
}
.image-preview-div {
  margin: 0.5rem;
}
.icon-placeholder {
  margin: auto;
  font-size: 5rem;
}
.icon-placeholder-div {
  display: flex;
  justify-content: center;
  background-color: lightgray;
}
.justify-center {
  display: flex;
  justify-content: center;
}
</style>

<script>
import DeviceIconAPI from '@/utils/deviceIconAPI'
const { postDeviceIcon } = DeviceIconAPI
import { USER } from '@/constants/user.js'
export default {
  name: 'DeviceIconModel',
  props: ['zIndex'],
  data: () => ({
    previewFile: null,
    selectedFile: null,
  }),
  methods: {
    close() {
      this.$store.dispatch('closeDeviceIconModal')
    },
    upload() {
      let form = new FormData()
      form.append('icon', this.selectedFile)
      form.append('device_id', this.id)
      form.append('user_id', USER.user_id)
      postDeviceIcon(form)
    },
    setPreviewImage(file) {
      if (file) {
        let reader = new FileReader()
        reader.onload = (e) => {
          this.previewFile = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.previewFile = null
      }
    },
    fileSelected(file) {
      this.selectedFile = file
      this.setPreviewImage(file)
    },
  },
  computed: {
    device() {
      return this.$store.getters.deviceIconModel.device
    },
    id() {
      return this.device.device_id
    },
    name() {
      return this.device.display_name
    },
  },
  mounted() {},
}
</script>
