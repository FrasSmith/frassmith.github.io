let initLoad = true;

mapboxgl.accessToken = "pk.eyJ1IjoiZ2xlbmVsZyIsImEiOiJjbWMzNjllcDYwMWMwMmlzY2FpdW9lZjQ4In0.hDeP81vWmyZqhTMr_e7LpQ";
const map = new mapboxgl.Map({
  container: "map",
  //style: 'https://api.maptiler.com/maps/basic/style.json?key=1HCKO0pQuPEfNXXzGgSM',
  style: "mapbox://styles/mapbox/bright-v8",
  center: [-0.67044, 51.9873136],
  zoom: 8,
  projection: "globe",
  minZoom: 6,
  maxZoom: 19,
});

map.on("load", () => {
  let pubs;

  map.once("idle", () => {
    d3.json("./data/pub-pts.json", function (d) {
      pubs = d;
      getSpoke(pubs);
    });

    // use map center
    map.on("move", () => {
      getSpoke(pubs);
    });
  });
});

function getSpoke(pubs) {
  const center = map.getCenter();
  const newPoint = turf.point([center.lng, center.lat]);
  buildSpoke(pubs, newPoint);
}

function buildSpoke(pubs, point) {
  let nearestpubs = turf.featureCollection([]);
  let nearestAirportLines = turf.featureCollection([]);
  let cleanedpubs = JSON.parse(JSON.stringify(pubs));

  for (let i = 1; i <= 5; i++) {
    const nearest = turf.nearestPoint(point, cleanedpubs);
    const startLng = point.geometry.coordinates[0];
    const endLng = nearest.geometry.coordinates[0];

    if (startLng >= 90 && endLng <= -90) {
      nearest.geometry.coordinates[0] += 360;
    } else if (startLng <= -90 && endLng >= 90) {
      nearest.geometry.coordinates[0] -= 360;
    }

    const nearestLine = turf.lineString([point.geometry.coordinates, nearest.geometry.coordinates]);

    nearestpubs.features.push(nearest);
    nearestAirportLines.features.push(nearestLine);

    const index = cleanedpubs.features.findIndex((n) => n.id === nearest.id);
    if (index !== -1) {
      cleanedpubs.features.splice(index, 1);
    }
  }

  if (initLoad) {
    addLayers(pubs, nearestpubs, nearestAirportLines);
  } else {
    map.getSource("newPoint").setData(nearestpubs);
    map.getSource("newLine").setData(nearestAirportLines);
  }
}

function addLayers(pubs, nearest, route) {
  initLoad = false;

  map.addSource("points", {
    type: "geojson",
    data: pubs,
  });

  map.addSource("newPoint", {
    type: "geojson",
    data: nearest,
  });

  map.addSource("newLine", {
    type: "geojson",
    data: route,
  });

  map.addLayer({
    id: "routeLayer",
    type: "line",
    source: "newLine",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#6699CC",
      "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0.1, 3, 3],
    },
  });

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
}
