import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useCombobox } from "downshift";

export function GoogleMapsPlaceAutocomplete({ setSelected, setMapCenter }) {
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
        handleSelect(selectedItem.description);
        setValue(selectedItem.structured_formatting.main_text); // 장소명만 input에 표시
      }
    },
    itemToString: (item) => (item ? item.description : ""),
  });

  const handleSelect = async (description) => {
    try {
      // 검색 결과 항목을 선택했을 때 실행
      setValue(description, false);
      clearSuggestions();

      // Geocoding을 통해 Lat/Lng 좌표 얻기
      const result = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(result[0]);
      const latLng = { lat, lng };

      // 선택된 위치를 setSelected로 설정하여 마커 위치 업데이트
      setSelected(latLng);
      setMapCenter(latLng);
      console.log(latLng);
    } catch (e) {
      console.error("Error getting geocode or setting marker:", e);
    }
  };

  return (
    <div>
      <input
        type="text"
        className="input"
        {...getInputProps({
          value,
          onChange: (e) => setValue(e.target.value),
          disabled: !ready,
          placeholder: "장소를 입력해주세요.",
        })}
      />

      <ul {...getMenuProps()} className="combobox-menu">
        {isOpen &&
          status === "OK" &&
          data.map((suggestion, index) => {
            const { placeId, description, structured_formatting } = suggestion;
            const { main_text, secondary_text } = structured_formatting;

            return (
              <li
                key={placeId}
                {...getItemProps({
                  item: suggestion,
                  index,
                  className: highlightedIndex === index ? "highlighted" : "",
                })}
              >
                <b>{main_text}</b>
                <div>{secondary_text}</div>
              </li>
            );
          })}
        {isOpen && status !== "OK" && <li>No results found</li>}
      </ul>
    </div>
  );
}
