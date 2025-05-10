import React, { useRef, useEffect } from "react";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";

function ZoomToGeoJson({ geoJsonData, mapRef }) {
  const geoJsonLayerRef = useRef();

  useEffect(() => {
    if (geoJsonData && mapRef.current && geoJsonLayerRef.current) {
      const layer = geoJsonLayerRef.current;
      if (layer.getBounds && layer.getBounds().isValid()) {
        mapRef.current.fitBounds(layer.getBounds(), { maxZoom: 16 });
      }
    }
  }, [geoJsonData, mapRef]);

  return geoJsonData ? (
    <GeoJSON
      data={geoJsonData}
      style={{ color: "#2196f3", weight: 3, fillOpacity: 0.2 }}
      ref={geoJsonLayerRef}
    />
  ) : null;
}

export default ZoomToGeoJson;