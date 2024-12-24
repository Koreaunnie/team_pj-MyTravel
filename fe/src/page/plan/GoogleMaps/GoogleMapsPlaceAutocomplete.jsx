import React, { useEffect, useRef } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useCombobox } from "downshift";

export function GoogleMapsPlaceAutocomplete({
  setSelected,
  setMapCenter,
  initialPlace,
}) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  // 초기 값 설정 여부
  const hasInitialSet = useRef(false);

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

  // 초기 장소 설정 (컴포넌트 마운트 시 한 번만 실행)
  useEffect(() => {
    if (initialPlace && !hasInitialSet.current) {
      setValue(initialPlace.address);
      setMapCenter({
        lat: initialPlace.lat,
        lng: initialPlace.lng,
      });
      // 한 번만 실행
      hasInitialSet.current = true;
    }
  }, [initialPlace, setValue, setMapCenter]);

  const handleSelect = async (description) => {
    try {
      clearSuggestions();
      setValue(description, false); // 새로운 input 값 즉시 반영

      const result = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(result[0]);

      const location = {
        placeId: result[0].place_id,
        address: description,
        lat,
        lng,
      };

      setSelected(location); // 선택된 장소를 부모 컴포넌트에 전달
      setMapCenter({ lat, lng }); // 지도 중심 업데이트
      hasInitialSet.current = true; // 초기 장소가 아닌 선택된 장소로 고정
      // console.log(setValue);
      // console.log(setSelected);
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

      <ul {...getMenuProps()} className="autocomplete-container">
        {isOpen &&
          status === "OK" &&
          data.map((suggestion, index) => {
            const { placeId, structured_formatting } = suggestion;
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
                <p>{secondary_text}</p>
              </li>
            );
          })}
        {isOpen && status !== "OK" && <li>No results found</li>}
      </ul>
    </div>
  );
}
