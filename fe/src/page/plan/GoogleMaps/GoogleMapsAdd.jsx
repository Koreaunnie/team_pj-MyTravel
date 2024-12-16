// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// import React, { useRef, useState } from "react";
// import { Spinner } from "@chakra-ui/react";
// import "./GoogleMaps.css";
// import { GoogleMapsPlaceAutocomplete } from "./GoogleMapsPlaceAutocomplete.jsx";
//
// const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
// const libraries = ["places"];
//
// export function GoogleMapsAdd({ onPlaceSelected }) {
//   const [selected, setSelected] = useState(null);
//   const mapInstanceRef = useRef(null);
//
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: apiKey,
//     libraries,
//     version: "weekly",
//   });
//
//   if (!isLoaded) return <Spinner />;
//
//   const center = {
//     lat: 37.5665, // 위도
//     lng: 126.978, // 경도
//   };
//
//   // 지도 인스턴스 저장
//   const handleMapLoad = (map) => {
//     mapInstanceRef.current = map;
//   };
//
//   // 마커 클릭 시 장소 이동
//   const handleMarkerClick = (latLng) => {
//     if (mapInstanceRef.current) {
//       mapInstanceRef.current.panTo(latLng);
//     }
//   };
//
//   // 장소 선택
//   const handlePlaceSelected = (location) => {
//     // 이미 선택된 장소와 다를 때
//     if (location !== selected) {
//       setSelected(location);
//       if (mapInstanceRef.current) {
//         // 지도 중심 이동
//         mapInstanceRef.current.panTo(location);
//       }
//       onPlaceSelected(location);
//     }
//   };
//
//   return (
//     <div>
//       <div className="places-container">
//         <GoogleMapsPlaceAutocomplete
//           setSelected={(location) => handlePlaceSelected(location)}
//           setMapCenter={(latLng) => {
//             if (mapInstanceRef.current) {
//               mapInstanceRef.current.panTo(latLng);
//             }
//           }}
//         />
//       </div>
//
//       <GoogleMap
//         zoom={15}
//         center={selected || center}
//         mapContainerClassName="map-container"
//         onLoad={handleMapLoad}
//       >
//         {selected && (
//           <Marker
//             position={selected}
//             onClick={() => handleMarkerClick(selected)}
//           />
//         )}
//       </GoogleMap>
//     </div>
//   );
// }
