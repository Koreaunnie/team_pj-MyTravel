import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import "./GoogleMaps.css";
import { Spinner } from "@chakra-ui/react";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

export function GoogleMapsView({ placeIds }) {
  const [placesDetails, setPlacesDetails] = useState([]); // 여러 개의 장소 정보
  const [selectedPlaceId, setSelectedPlaceId] = useState(null); // 선택된 마커의 placeId
  const mapInstanceRef = useRef(null);
  const libraries = ["places"];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    version: "weekly",
  });

  useEffect(() => {
    if (placeIds && isLoaded) {
      const service = new google.maps.places.PlacesService(
        mapInstanceRef.current,
      );

      // 모든 placeId에 대해 상세 정보를 가져오기
      const promises = placeIds.map(
        (id) =>
          new Promise((resolve) => {
            service.getDetails({ placeId: id }, (result, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(result);
              } else {
                resolve(null);
              }
            });
          }),
      );

      // 모든 장소 정보 받아오기
      Promise.all(promises).then((details) => {
        setPlacesDetails(details.filter(Boolean)); // 유효한 장소 정보만 필터링
      });
    }
  }, [placeIds, isLoaded]);

  if (!isLoaded) return <Spinner />;

  const center = {
    lat: 37.5665, // 기본 중심 위치 (서울)
    lng: 126.978, // 기본 경도
  };

  // 지도 인스턴스
  const handleMapLoad = (map) => {
    console.log("Map loaded:", map);
    mapInstanceRef.current = map;
  };

  return (
    <div>
      <GoogleMap
        zoom={15}
        center={center}
        mapContainerClassName="map-view-container"
        onLoad={handleMapLoad}
      >
        {placesDetails.map((place, index) => {
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          console.log(`Marker ${index}:`, position); // 마커 위치 확인

          // 지도 중심을 마커 위치로 이동
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(position);
          }

          return (
            <Marker
              key={index}
              position={position}
              onClick={() => setSelectedPlaceId(place.place_id)} // 클릭 시 선택된 placeId로 상태 변경
            />
          );
        })}

        {selectedPlaceId && (
          <InfoWindow
            position={{
              lat: placesDetails
                .find((place) => place.place_id === selectedPlaceId)
                .geometry.location.lat(),
              lng: placesDetails
                .find((place) => place.place_id === selectedPlaceId)
                .geometry.location.lng(),
            }}
          >
            <div>
              <h3>
                {
                  placesDetails.find(
                    (place) => place.place_id === selectedPlaceId,
                  )?.name
                }
              </h3>
              <p>
                {
                  placesDetails.find(
                    (place) => place.place_id === selectedPlaceId,
                  )?.formatted_address
                }
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
