import React from "react";

function GoogleMapsNotUse(props) {
  // let map;
  // async function initMap() {
  //   // The location of Uluru
  //   const position = { lat: -25.344, lng: 131.031 };
  //   // Request needed libraries.
  //   //@ts-ignore
  //   const { Map } = await google.maps.importLibrary("maps");
  //   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  //
  //   // The map, centered at Uluru
  //   map = new Map(document.getElementById("map"), {
  //     zoom: 4,
  //     center: position,
  //     mapId: "DEMO_MAP_ID",
  //   });
  //
  //   // The marker, positioned at Uluru
  //   const marker = new AdvancedMarkerElement({
  //     map: map,
  //     position: position,
  //     title: "Uluru",
  //   });
  // }
  // initMap();

  // const autoCompleteHandler = () => {
  //   // data는 검색결과에 대한 간략한 정보
  //   // details는 검색결과에 대한 자세한 값 예) 평점, 사진, 주소 등등
  //   // 실행할 함수
  //   // ex) setPlace(data.블라블라)
  // };

  // service.getPlacePredictions(
  //   {
  //     input: "pizza near Syd",
  //     sessionToken: sessionToken,
  //   },
  //   handlePredictions,
  // );

  // window.initAutocomplete = initAutocomplete;

  return (
    <div>
      {/*<GooglePlacesAutocomplete*/}
      {/*  minLength={2} //최소 검색 글자 수*/}
      {/*  placeholder="장소를 입력해주세요." // input 표시 값*/}
      {/*  query={{*/}
      {/*    // key, 언어, 검색 범위*/}
      {/*    key: apiKey,*/}
      {/*    language: "ko",*/}
      {/*  }}*/}
      {/*  keyboardShouldPersistTaps={"handled"}*/}
      {/*  fetchDetails={true} // 디테일 검색*/}
      {/*  onPress={autoCompleteHandler} // 검색 버튼 클릭 시*/}
      {/*  onFail={(error) => console.log(error)} // 실패 시*/}
      {/*  onNotFound={() => console.log("no results")} // 검색 결과 없을 시*/}
      {/*  keepResultsAfterBlur={true} // 검색 후 검색 목록*/}
      {/*  enablePoweredByContainer={false} // 밑에 google 표시*/}
      {/*  styles={styles.search} // 스타일*/}
      {/*/>*/}
      {/*<APIProvider apiKey={apiKey}>*/}
      {/*  <Map*/}
      {/*    onLoad={(mapInstance) => setMap(mapInstance)}*/}
      {/*    style={{ width: "500px", height: "250px" }}*/}
      {/*    initialCenter={{ lat: 37, lng: 128 }}*/}
      {/*  ></Map>*/}
      {/*  <gmp-map center="40.749933,-73.98633" zoom="13" map-id="DEMO_MAP_ID">*/}
      {/*    <div*/}
      {/*      slot="control-block-start-inline-start"*/}
      {/*      className="place-picker-container"*/}
      {/*    >*/}
      {/*      <gmpx-place-picker*/}
      {/*        placeholder="장소를 입력하세요."*/}
      {/*        value={field.place}*/}
      {/*        onPlaceChanged={() => {*/}
      {/*          const place = document*/}
      {/*            .querySelector("gmpx-place-picker")*/}
      {/*            .getPlace();*/}
      {/*          if (place && place.formatted_address) {*/}
      {/*            handleFieldChange(index, "place", place.formatted_address);*/}
      {/*          }*/}
      {/*        }}*/}
      {/*      ></gmpx-place-picker>*/}
      {/*    </div>*/}
      {/*    <gmp-advanced-marker></gmp-advanced-marker>*/}
      {/*  </gmp-map>*/}
      {/*</APIProvider>*/}
    </div>
  );
}

export default GoogleMapsNotUse;
