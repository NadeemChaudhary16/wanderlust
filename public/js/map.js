
console.log(mapToken);
console.log(coordinates)
const {lng, lat} = coordinates;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [lng, lat],
  zoom: 9,
});

// Create a new marker.

const marker = new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML("<h3>Welcome to Wanderlust</h3>"))
    .addTo(map)