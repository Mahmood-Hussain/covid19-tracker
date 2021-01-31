import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import "./Map.css";
import { showDataOnMap } from "./util";

function Map({ casesType, countries, center, zoom }) {
  function MapInternalComponent() {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }
  return (
    <div className="map">
      <MapContainer center={center} zoom={zoom}>
        <MapInternalComponent />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  );
}

export default Map;
