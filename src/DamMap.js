import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import DamDetails from "./DamDetails";

// Fix marker icons for leaflet in React
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function DamMap({ dams }) {
  const [selectedDam, setSelectedDam] = useState(null);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        style={{ height: "100vh", width: "100vw" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {dams.map((dam) => {
          const lat = parseFloat(dam["latitude"]);
          const lng = parseFloat(dam["longitude"]);
          if (!lat || !lng) return null;
          return (
            <Marker
              key={dam["Station id"]}
              position={[lat, lng]}
              eventHandlers={{
                click: () => setSelectedDam(dam)
              }}
            >
              <Popup>
                <strong>{dam["Station name"]}</strong>
                <br />
                {dam["River basin name"]}
                <br />
                <button onClick={() => setSelectedDam(dam)}>
                  More info
                </button>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {selectedDam && (
        <DamDetails dam={selectedDam} onClose={() => setSelectedDam(null)} />
      )}
    </div>
  );
}

export default DamMap;