import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import DamDetailsPanel from "./DamDetailsPanel";
import { GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Small circular marker icon
const circleMarkerIcon = L.divIcon({
  className: "custom-circle-marker",
  iconSize: [12, 12],
  html: '<div></div>',
});

function DamMap({ dams }) {
  const [selectedDam, setSelectedDam] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBasin, setSelectedBasin] = useState("All");
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  // Unique river basins
  const basins = [
    "All",
    ...Array.from(new Set(dams.map((d) => d["River basin name"])).values()),
  ];

  // Filtered dams
  const filteredDams = dams.filter((dam) => {
    const matchesName = dam["Station name"]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBasin =
      selectedBasin === "All" || dam["River basin name"] === selectedBasin;
    return matchesName && matchesBasin;
  });

  // Fetch GeoJSON & select dam
  const handleDamSelect = async (dam) => {
    setSelectedDam(dam);
    setGeoJsonData(null); // Clear previous polygon immediately for better UX
    try {
      const resp = await fetch(process.env.PUBLIC_URL + `/shapefiles/${dam["Station id"]}.geojson`);
      if (resp.ok) {
        const json = await resp.json();
        setGeoJsonData(json.geojson ? json.geojson : json);
      } else {
        setGeoJsonData(null);
      }
    } catch {
      setGeoJsonData(null);
    }
  };

  // Zoom to polygon after it appears
  useEffect(() => {
    if (
      geoJsonData &&
      mapRef.current &&
      geoJsonLayerRef.current &&
      geoJsonLayerRef.current.getBounds &&
      geoJsonLayerRef.current.getBounds().isValid()
    ) {
      mapRef.current.fitBounds(geoJsonLayerRef.current.getBounds(), {
        maxZoom: 16,
      });
    }
  }, [geoJsonData]);

  return (
    <div className="app-layout">
      <header className="header">
        <span className="header-title">Wain Data Set</span>
      </header>
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search dam name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="toolbar-input"
        />
        <select
          value={selectedBasin}
          onChange={(e) => setSelectedBasin(e.target.value)}
          className="toolbar-select"
        >
          {basins.map((basin) => (
            <option key={basin} value={basin}>
              {basin}
            </option>
          ))}
        </select>
      </div>
      <div className="main-content">
        <div className="map-container">
          <MapContainer
            center={[22.5, 78.9]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {filteredDams.map((dam) => {
              const lat = parseFloat(dam["latitude"]);
              const lng = parseFloat(dam["longitude"]);
              if (!lat || !lng) return null;
              return (
                <Marker
                  key={dam["Station id"]}
                  position={[lat, lng]}
                  icon={circleMarkerIcon}
                  eventHandlers={{
                    click: () => handleDamSelect(dam),
                  }}
                />
              );
            })}
            {geoJsonData && (
              <GeoJSON
                data={geoJsonData}
                style={{ color: "#2196f3", weight: 3, fillOpacity: 0.2 }}
                ref={geoJsonLayerRef}
              />
            )}
          </MapContainer>
        </div>
        <DamDetailsPanel
          dam={selectedDam}
          geoJsonData={geoJsonData}
          open={!!selectedDam}
          onClose={() => {
            setSelectedDam(null);
            setGeoJsonData(null);
          }}
        />
      </div>
    </div>
  );
}

export default DamMap;