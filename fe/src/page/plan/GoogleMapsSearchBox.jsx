import "./GoogleMaps.css";
import { useContext, useMemo, useState } from "react";
import { useCombobox } from "downshift";
import { PlaceIdContext } from "./GoogleMapsPlaceIdContext.jsx";

export function GoogleMapsSearchBox(props) {
  const [placeId, setPlaceId] = useContext(PlaceIdContext);

  const [searchResult, setSearchResult] = useState({
    autocompleteSuggestions: [], // 구글맵이 제안하는 정보들을 배열로 저장
    status: "", // 구글맵의 status 저장
  });

  const google = window.google;
  const service = new google.maps.places.AutocompleteService();

  // 구글 비용 발생 줄이는 세션 토큰 (1 clicks 0.017 USD)
  const sessionToken = useMemo(
    () => new google.maps.places.AutocompleteSessionToken(),
    [google.maps.places.AutocompleteSessionToken],
  );

  const { getInputProps, getItemProps, getMenuProps } = useCombobox({
    items: searchResult.autocompleteSuggestions,
    onInputValueChange: ({ inputValue }) => {
      // 검색창에 내역 지우면 아래 주소 사라지게
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

  return (
    <div>
      <input type="search" {...getInputProps()} />

      <ul {...getMenuProps()}>
        {searchResult.autocompleteSuggestions.length > 0
          ? searchResult.autocompleteSuggestions.map((item, index) => (
              <li
                key={item.id}
                {...getItemProps({
                  item,
                  index,
                  onClick: (event) => {
                    setPlaceId(item.id);
                    console.log(item.id);
                    console.log(setPlaceId());
                  },
                })}
              >
                <p
                  dangerouslySetInnerHTML={{ __html: boldUserText(item.name) }}
                ></p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: boldUserText(item.address),
                  }}
                ></p>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
