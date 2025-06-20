let initLoad = true;
let pubIndex;

// Mapbox Access
mapboxgl.accessToken = "pk.eyJ1IjoiZ2xlbmVsZyIsImEiOiJjbWMzNjllcDYwMWMwMmlzY2FpdW9lZjQ4In0.hDeP81vWmyZqhTMr_e7LpQ";

// Init map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/bright-v8",
  center: [-0.67044, 51.9873136],
  zoom: 8,
  projection: "globe",
  minZoom: 6,
  maxZoom: 19,
});

// Enable scroll zoom around mouse pointer
map.scrollZoom.enable({ around: "pointer" });
map.scrollZoom.setWheelZoomRate(1 / 180);

document.getElementById("resetBearingBtn").addEventListener("click", () => {
  map.easeTo({
    bearing: 0,
    pitch: 0, // optional: reset tilt
    duration: 1000,
  });
});

document.getElementById("locateMeBtn").addEventListener("click", () => {

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.easeTo({
          center: [longitude, latitude],
          duration: 1000,
          zoom: 14, // Adjust zoom to your preference
        });
      },
      (err) => {
        alert("Unable to retrieve your location.");
        console.error(err);
      },
      {
        enableHighAccuracy: true,
      },
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

document.getElementById("infoBtn").addEventListener("click", () => {
  // Create popup content (HTML allowed)
  const htmlContent = `
    <div style="max-width: 250px; font-family: sans-serif;">
      <h3>Welcome yo the Pub Crawler</h3>
      <p>This interactive map shows the 8 pubs closest to the center of the map. Drag it to see what happens.</p>

      <p> You can: </p>
      <ul>
        <li>Reset orientation (top right)</li>
        <li>Jump to your location (if your browser supports it)</li>
        <li>View this info panel</li>
      </ul>

      <p>Based on an original site by Alastair Rae, <a href=https://alasdairrae.github.io/steakbakespider/>Steak Bake Spider</a></p>
    </div>
  `;

  // Use current map center to anchor the popup
  const center = map.getCenter();

  new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat([center.lng, center.lat])
    .setHTML(htmlContent)
    .addTo(map);
});

let pubs; // raw GeoJSON

map.on("load", () => {
  map.once("idle", () => {
    d3.json("./data/pub-pts.json", function (data) {
      pubs = data;
      buildIndex(pubs); // 🔍 index for fast querying
      getSpoke();
    });

    // Throttle move events
    // use map center
    map.on("move", () => {
      getSpoke(pubs);
    });
  });
});

let pubTree;

function buildIndex(pubsGeoJSON) {
  pubTree = new RBush();

  const items = pubsGeoJSON.features.map((feature, index) => {
    const [lon, lat] = feature.geometry.coordinates;
    return {
      minX: lon,
      minY: lat,
      maxX: lon,
      maxY: lat,
      feature: feature, // store entire feature
    };
  });

  pubTree.load(items);
}

/** Main action: find nearest and update layers */
function getSpoke() {
  const center = map.getCenter();
  const [lng, lat] = [center.lng, center.lat];

  const nearest = pubTree
    .all()
    .map((f) => ({ feature: f.feature, dist: distance(lng, lat, f.minX, f.minY) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 8)
    .map((f) => f.feature);

  const nearestpubs = turf.featureCollection(nearest);

  const lines = turf.featureCollection(
    nearest.map((pub) => {
      return turf.lineString([[lng, lat], pub.geometry.coordinates]);
    }),
  );

  if (initLoad) {
    addLayers(pubs, nearestpubs, lines);
    initLoad = false;
  } else {
    map.getSource("newPoint").setData(nearestpubs);
    map.getSource("newLine").setData(lines);
  }
}

function distance(lon1, lat1, lon2, lat2) {
  // Quick haversine approximation (in degrees — NOT accurate for large distances)
  const dx = lon1 - lon2;
  const dy = lat1 - lat2;
  return dx * dx + dy * dy;
}
/** Add all Mapbox layers once */
function addLayers(pubs, nearest, route) {
  map.addSource("points", { type: "geojson", data: pubs });
  map.addSource("newPoint", { type: "geojson", data: nearest });
  map.addSource("newLine", { type: "geojson", data: route });

  // Spoke lines
  map.addLayer({
    id: "routeLayer",
    type: "line",
    source: "newLine",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: {
      "line-color": "#6699CC",
      "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0.1, 3, 3],
    },
  });

  // All pub points
  map.addLayer({
    id: "globe-points",
    type: "circle",
    source: "points",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 0.1, 3, 3],
      "circle-opacity": 1,
      "circle-blur": 0,
      "circle-color": "#a7a79b",
    },
  });

  // Nearest pub points
  map.addLayer({
    id: "globe-newPoint",
    type: "circle",
    source: "newPoint",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 0.25, 3, 4],
      "circle-opacity": 1,
      "circle-blur": 0,
      "circle-color": "#035690",
    },
  });

  map.addLayer({
    id: "globe-points-hitbox",
    type: "circle",
    source: "points",
    paint: {
      "circle-radius": 20,
      "circle-opacity": 0,
    },
  });

  // Add hover cursor
  map.on("mouseenter", "globe-points-hitbox", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "globe-points-hitbox", () => {
    map.getCanvas().style.cursor = "";
  });

  // Add click popup to all pubs
  map.on("click", "globe-points-hitbox", (e) => {
    const feature = e.features[0];

    const popupHtml = `
      <strong>${feature.properties.name || "Pub"}</strong><br/>
      Real Ale: ${feature.properties.real_ale || "unknown"}<br/>
      CAMRA: ${feature.properties.camra || "unknown"}<br/>
      Website: <a href=${feature.properties.website || "#"}>Link</a><br/>
    `;

    new mapboxgl.Popup().setLngLat(feature.geometry.coordinates).setHTML(popupHtml).addTo(map);
  });
}
