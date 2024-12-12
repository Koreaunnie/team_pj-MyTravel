import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import React, { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { useCombobox } from "downshift";
import "./GoogleMaps.css";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

export function GoogleMaps() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <Spinner />;
  }

  function Map() {
    const [selected, setSelected] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    const center = {
      lat: 7.2905715, // default latitude
      lng: 80.6337262, // default longitude
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
      <>
        <div className={"places-container"}>
          <PlacesAutocomplete
            setSelected={setSelected}
            handleMarkerClick={handleMarkerClick}
            setMapCenter={(latLng) => {
              if (mapInstance) {
                mapInstance.panTo(latLng);
              }
            }}
          />
        </div>

        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName={"map-container"}
          onLoad={handleMapLoad}
        >
          {selected && (
            <Marker
              position={selected}
              onClick={() => handleMarkerClick(selected)}
            />
          )}
        </GoogleMap>
      </>
    );
  }

  const PlacesAutocomplete = ({ setSelected }) => {
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete();

    // Downshift hooks
    const {
      isOpen,
      getInputProps,
      getItemProps,
      getMenuProps,
      highlightedIndex,
    } = useCombobox({
      items: data,
      onSelectedItemChange: ({ selectedItem }) => {
        if (selectedItem) {
          // 선택된 항목에 대한 처리 (예: 지도 위치 업데이트)
          setSelected({ lat: selectedItem.lat, lng: selectedItem.lng });
          setValue(selectedItem.structured_formatting.main_text); // 장소명만 input에 표시
        }
      },
      itemToString: (item) => (item ? item.description : ""),
    });

    const handleSelect = async (description) => {
      // 검색 결과 항목을 선택했을 때 실행
      setValue(description, false);
      clearSuggestions();

      // Geocoding을 통해 Lat/Lng 좌표 얻기
      const result = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(result[0]);

      // 선택된 위치를 setSelected로 설정하여 마커 위치 업데이트
      setSelected({ lat, lng });
      console.log(setSelected(lat, lng));
    };

    return (
      <div>
        <input
          {...getInputProps({
            value,
            onChange: (e) => setValue(e.target.value),
            disabled: !ready,
            className: "combobox-input",
            placeholder: "장소를 입력해주세요.",
          })}
        />
        <div {...getMenuProps()} className="combobox-menu">
          {isOpen && status === "OK" && data.length > 0 ? (
            data.map(
              ({ placeId, description, structured_formatting }, index) => {
                const placeName = structured_formatting.main_text; // 장소 이름
                const address = structured_formatting.secondary_text; // 주소
                return (
                  <ul
                    key={placeId}
                    {...getItemProps({
                      item: { placeId, description },
                      index,
                      className:
                        highlightedIndex === index ? "highlighted" : "",
                      onClick: () => handleSelect(description),
                    })}
                  >
                    <li>
                      <b>{placeName}</b>
                    </li>
                    <li>{address}</li>
                  </ul>
                );
              },
            )
          ) : (
            <li>No results found</li>
          )}
        </div>
      </div>
    );
  };

  return <Map />;
}
