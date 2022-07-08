const GOOGLE_MAPS_KEY = 'AIzaSyCVnXuQws5QjC8WDSLX86Lgpmvzt7JadbE'

const mapSettings = {
  clickableIcons: false,
  streetViewControl: false,
  panControlOptions: false,
  gestureHandling: 'cooperative',
  mapTypeControl: true,
  zoomControlOptions: {
    style: 'SMALL',
  },
  zoom: 11,
}

export { mapSettings, GOOGLE_MAPS_KEY }
