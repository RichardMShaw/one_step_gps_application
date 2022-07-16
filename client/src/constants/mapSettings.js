//Constants dealing with google map settings

const GOOGLE_MAPS_KEY = process.env.VUE_APP_GOOGLE_MAPS_KEY
const mapSettings = {
  clickableIcons: false,
  streetViewControl: false,
  panControlOptions: false,
  gestureHandling: 'cooperative',
  mapTypeControl: true,
  zoomControlOptions: {
    style: 'SMALL',
  },
  zoom: 8,
}

export { mapSettings, GOOGLE_MAPS_KEY }
