import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import "./GoogleMaps.css";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const libraries = ["places"];

export function GoogleMapsView({ placeIds }) {
  const [placesDetails, setPlacesDetails] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const mapInstanceRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    version: "weekly",
  });

  // useRef로 이전 placeIds를 추적하여 중복 호출을 방지
  const prevPlaceIdsRef = useRef();

  useEffect(() => {
    // placeIds가 변경될 때만 실행되도록
    if (prevPlaceIdsRef.current !== placeIds) {
      // console.log("google maps view placeids", placeIds);

      if (placeIds && isLoaded && mapInstanceRef.current) {
        const service = new google.maps.places.PlacesService(
          mapInstanceRef.current,
        );

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

        // Promise.all 부분을 다음과 같이 수정하세요
        Promise.all(promises).then((details) => {
          const validDetails = details.filter(Boolean); // null 값 제외
          setPlacesDetails(validDetails);

          // 모든 마커를 포함하는 bounds 계산
          if (validDetails.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            validDetails.forEach((place) => {
              bounds.extend(place.geometry.location);
            });
            setMapBounds(bounds);

            // 지도가 로드된 상태라면 바로 bounds 적용
            if (mapInstanceRef.current) {
              mapInstanceRef.current.fitBounds(bounds);
              // 마커가 하나일 경우 적절한 줌 레벨 설정
              if (validDetails.length === 1) {
                mapInstanceRef.current.setZoom(15);
              }
            }
          }
        });
      }

      // 이전 placeIds를 현재 placeIds로 업데이트
      prevPlaceIdsRef.current = placeIds;
    }
  }, [placeIds, isLoaded]); // placeIds와 isLoaded 값이 변경될 때마다 실행

  const handleMapLoad = (map) => {
    mapInstanceRef.current = map;
    // 초기 로드 시 저장된 bounds가 있다면 적용
    if (mapBounds) {
      map.fitBounds(mapBounds);
      if (placesDetails.length === 1) {
        map.setZoom(15);
      }
    }
  };

  if (!isLoaded) return <Spinner />;

  const center =
    placesDetails.length > 0
      ? {
          lat: placesDetails[0].geometry.location.lat(),
          lng: placesDetails[0].geometry.location.lng(),
        }
      : { lat: 37.5665, lng: 126.978 }; // 기본 서울 위치

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

          return (
            <MarkerF
              key={index}
              position={position}
              onClick={() => {
                setSelectedPlaceId(place.place_id);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.panTo(position);
                }
              }}
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
            onCloseClick={() => setSelectedPlaceId(null)}
            options={{
              maxWidth: 300,
              disableAutoPan: false,
              pixelOffset: new google.maps.Size(0, -30), // 창을 약간 위로 이동
            }}
          >
            <div style={{ padding: "10px" }}>
              <h3 style={{ margin: "0", fontWeight: "bold" }}>
                {
                  placesDetails.find(
                    (place) => place.place_id === selectedPlaceId,
                  )?.name
                }
              </h3>
              <p style={{ margin: "5px 0", color: "#757575" }}>
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
