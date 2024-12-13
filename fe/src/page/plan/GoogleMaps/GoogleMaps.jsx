import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import React, { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import "./GoogleMaps.css";
import { GoogleMapsPlaceAutocomplete } from "./GoogleMapsPlaceAutocomplete.jsx";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

export function GoogleMaps() {
  const [selected, setSelected] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
    version: "weekly",
  });

  if (!isLoaded) return <Spinner />;

  function Map() {
    const [selected, setSelected] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    const center = {
      lat: 37.5665, // 위도
      lng: 126.978, // 경도
    };

    // 지도 인스턴스 저장
    const handleMapLoad = (map) => {
      setMapInstance(map);
    };

    // 마커 클릭 시 지도 이동
    const handleMarkerClick = (latLng) => {
      if (mapInstance) {
        mapInstance.panTo(latLng);
      }
    };

    return (
      <div>
        <div className="places-container">
          <GoogleMapsPlaceAutocomplete
            setSelected={setSelected}
            setMapCenter={(latLng) => {
              if (mapInstance) {
                mapInstance.panTo(latLng);
              }
            }}
          />
        </div>

        <GoogleMap
          zoom={13}
          center={selected || center}
          mapContainerClassName="map-container"
          onLoad={handleMapLoad}
        >
          {selected && (
            <Marker
              position={selected}
              onClick={() => handleMarkerClick(selected)}
            />
          )}
        </GoogleMap>
      </div>
    );
  }

  return <Map />;
}
