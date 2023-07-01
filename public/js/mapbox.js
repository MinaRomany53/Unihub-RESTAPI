const Itemlocation = JSON.parse(
  document.getElementById("map").dataset.location
);

mapboxgl.accessToken =
  "pk.eyJ1IjoibWluYXJvbWFueTExIiwiYSI6ImNsamo3dzI4ZTA4dHEza3BweWNhZGZ1Z2UifQ.5m8PaB8bSIVDv7BZgQ3V3Q";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
});

const bounds = new mapboxgl.LngLatBounds();

const el = document.createElement("div");
el.className = "marker";
const marker = new mapboxgl.Marker({
  element: el,
  anchor: "bottom",
})
  .setLngLat(Itemlocation.coordinates)
  .addTo(map);

bounds.extend(Itemlocation.coordinates);

map.fitBounds(bounds, {
  padding: { top: 200, bottom: 150, left: 100, right: 100 },
});
