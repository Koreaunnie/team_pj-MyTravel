import "./GoogleMaps.css";
import { useEffect, useMemo, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useCombobox } from "downshift";

// google personal api key
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

export function GoogleMapsContainer() {
  const [searchResult, setSearchResult] = useState({
    autocompleteSuggestions: [], // 구글맵이 제안하는 정보들을 배열로 저장
    status: "", // 구글맵의 status 저장
  });

  const service = new google.maps.places.AutocompleteService();

  // 구글 비용 발생 줄이는 세션 토큰 (1 clicks 0.017 USD)
  const sessionToken = useMemo(
    () => new google.maps.places.AutocompleteSessionToken(),
    [google.maps.places.AutocompleteSessionToken],
  );

  const { getInputProps, getItemProps, getMenuProps } = useCombobox({
    items: searchResult.autocompleteSuggestions,
    onInputValueChange: ({ inputValue }) => {
      // 검색 중인 내역 한번에 지우기
      if (inputValue === "") {
        setSearchResult({
          autocompleteSuggestions: [],
          status: "",
        });
        return;
      }

      service.getPlacePredictions(
        {
          input: inputValue,
          sessionToken: sessionToken,
        },
        handlePredictions,
      );

      function handlePredictions(predictions, status) {
        if (status === "OK") {
          // handle autocomplete suggestions (성공)
          const autocompleteSuggestions = predictions.map((prediction) => {
            return {
              id: prediction.place_id,
              name: {
                string: prediction.structured_formatting.main_text,
                length:
                  prediction.structured_formatting
                    .main_text_matched_substrings[0]["length"],
                offset:
                  prediction.structured_formatting
                    .main_text_matched_substrings[0]["offset"],
              },
              address: {
                string: prediction.structured_formatting.secondary_text,
                // section 7.3
                // length:
                //   prediction.structured_formatting
                //     .secondary_text_matched_substrings[0]["length"],
                // offset:
                //   prediction.structured_formatting
                //     .secondary_text_matched_substrings[0]["offset"],
              },
            };
          });
          setSearchResult({
            // 구글맵이 제안하는 정보들
            autocompleteSuggestions: autocompleteSuggestions,
            // 구글맵의 status
            status: "OK",
          });
        } else {
          // handle error (실패)
          setSearchResult({
            autocompleteSuggestions: [],
            status: status,
          });
        }
      }
    },
  });

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .importLibrary("maps")
      .then(({ Map }) => {
        new Map(document.getElementById("map"), {
          center: {
            lat: 37,
            lng: 128,
          },
          zoom: 7,
        });
        console.log("Map JS API Loaded!");
      })
      .catch((e) => {
        console.log(e);
      });
  });

  // 검색 오류 메시지
  const SearchErrorMessage = ({ status }) => {
    return status === "" || status === "OK" ? null : (
      <div role="alert">
        {status === "ZERO_RESULTS" ||
        status === "INVALID_REQUEST" ||
        status === "NOT_FOUND" ? (
          // 장소가 없을 때
          <p>No place is found on the map. Try another search term.</p>
        ) : status === "OVER_QUERY_LIMIT" || status === "REQUEST_DENIED" ? (
          // 캐시 초과
          <p>
            My Ideal Map is currently unable to use Google Maps search. Please
            contact us so we can fix the problem.
          </p>
        ) : (
          // 구글맵 사용 불가
          <p>
            Google Maps server is down.{" "}
            <a
              href="https://status.cloud.google.com/maps-platform/products/i3CZYPyLB1zevsm2AV6M/history"
              target="_blank"
              rel="noreferrer"
            >
              Please check its status
            </a>
            , and try again once they fix the problem (usually within a few
            hours).
          </p>
        )}
      </div>
    );
  };

  // 검색어 bold
  function boldUserText({ length, offset, string }) {
    if (!string || length == null || offset == null) {
      return string || "";
    }
    const userText = string.substring(offset, offset + length);
    const stringBefore = string.substring(0, offset);
    const stringAfter = string.substring(offset + length);
    return `${stringBefore}<b>${userText}</b>${stringAfter}`;
  }

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
      <input type="search" {...getInputProps()} />

      <div {...getMenuProps()}>
        {searchResult.autocompleteSuggestions.length > 0
          ? searchResult.autocompleteSuggestions.map((item, index) => (
              <ul
                key={item.id}
                {...getItemProps({
                  item,
                  index,
                })}
              >
                <li
                  dangerouslySetInnerHTML={{ __html: boldUserText(item.name) }}
                />
                <li
                  dangerouslySetInnerHTML={{
                    __html: boldUserText(item.address),
                  }}
                />
                <SearchErrorMessage status={searchResult.status} />
              </ul>
            ))
          : null}
      </div>

      <div id="map" className={"google-maps"} />

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
