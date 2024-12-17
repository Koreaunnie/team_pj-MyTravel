import "./GoogleMaps.css";
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { Spinner } from "@chakra-ui/react";
import { GoogleMapsPlaceAutocomplete } from "./GoogleMapsPlaceAutocomplete.jsx";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const libraries = ["places"];

export function GoogleMapsEdit({ initialPlaceIds, onPlaceSelected }) {
  const [placesDetails, setPlacesDetails] = useState([]);
  const [initialPlace, setInitialPlace] = useState(null);
  const mapInstanceRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    version: "weekly",
  });

  // // useRef로 이전 placeIds를 추적하여 중복 호출을 방지
  // const prevPlaceIdsRef = useRef();

  const hasInitialSet = useRef(false);

  // 기존 장소
  useEffect(() => {
    console.log("기존 장소", initialPlaceIds);

    if (initialPlaceIds && isLoaded && mapInstanceRef.current) {
      const service = new google.maps.places.PlacesService(
        mapInstanceRef.current,
      );

      const promises = initialPlaceIds.map(
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

      Promise.all(promises).then((details) => {
        const validDetails = details.filter(Boolean);
        setPlacesDetails(validDetails);

        if (validDetails.length > 0) {
          const firstPlace = validDetails[0];
          setInitialPlace({
            placeId: firstPlace.place_id,
            address: firstPlace.formatted_address,
            lat: firstPlace.geometry.location.lat(),
            lng: firstPlace.geometry.location.lng(),
          });
        }
      });
    }
  }, [initialPlaceIds, isLoaded]);

  // 지도 인스턴스 저장
  const handleMapLoad = (map) => {
    mapInstanceRef.current = map;
  };

  // 장소 선택
  const handlePlaceSelected = (place) => {
    console.log("바뀐 장소", onPlaceSelected(place));

    if (!place || !mapInstanceRef.current) return;

    const newPlace = {
      ...place,
      geometry: {
        location: {
          lat: () => place.lat,
          lng: () => place.lng,
        },
      },
    };

    setPlacesDetails([newPlace]); // 마커 업데이트
    onPlaceSelected(place);

    const position = { lat: place.lat, lng: place.lng };
    mapInstanceRef.current.panTo(position);
  };

  const center =
    placesDetails.length > 0
      ? {
          lat: placesDetails[0].geometry.location.lat(),
          lng: placesDetails[0].geometry.location.lng(),
        }
      : { lat: 37.5665, lng: 126.978 }; // 기본 서울 위치

  if (!isLoaded) return <Spinner />;

  return (
    <div>
      <div className="places-container">
        <GoogleMapsPlaceAutocomplete
          initialPlace={initialPlace}
          setSelected={(location) => handlePlaceSelected(location)}
          setMapCenter={(latLng) => mapInstanceRef.current.panTo(latLng)}
        />
      </div>

      <GoogleMap
        zoom={15}
        center={center}
        mapContainerClassName="map-container"
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
                mapInstanceRef.current.panTo(position);
              }}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}
