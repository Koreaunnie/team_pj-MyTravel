import React, { useContext, useEffect, useRef, useState } from "react";
import { PlaceIdContext } from "./GoogleMapsPlaceIdContext.jsx";
import { GoogleMapsSearchBox } from "./GoogleMapsSearchBox.jsx";

export function GoogleMapsSearchedPlace({ mapObject }) {
  const [status, setStatus] = useState("closed");
  const [placeId, setPlaceId] = useContext(PlaceIdContext);
  const marker = useRef();

  useEffect(() => {
    if (!placeId) return;

    setStatus("loading");

    if (marker.current) {
      marker.current.setMap(null);
    }

    const google = window.google;
    const service = new google.maps.places.PlacesService(mapObject);
    const request = {
      placeId: placeId,
      fields: [
        "formatted_address", // 주소
        "geometry", // 위도, 경도
        "name", // 장소명
        "url", // 구글맵 url
      ],
    };

    service.getDetails(request, handleResponse);

    function handleResponse(place, placesServiceStatus) {
      if (placesServiceStatus === "OK") {
        const searchedPlace = {
          address: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          name: place.name,
          url: place.url,
        };
        const searchedPlaceMarker = {
          filePath: "/searched-place-mark.svg", // ADDED
          height: 37.876,
          width: 39.644,
        };
        marker.current = new google.maps.Marker({
          icon: {
            url: searchedPlaceMarker.filePath,
            anchor: new google.maps.Point(
              searchedPlaceMarker.width / 2,
              searchedPlaceMarker.height / 2,
            ),
          },
          position: searchedPlace.coordinates,
          title: "searchedPlace.name,",
        });
        marker.current.setMap(mapObject);
        mapObject.panTo(searchedPlace.coordinates);
      } else {
        console.error("Google Maps Place Details API call has failed.");
        setStatus("error");
      }
    }
  }, [mapObject, placeId]);

  if (status === "closed") {
    return null;
  } else if (status === "loading") {
    return (
      <div>
        <p aria-live="polite" role="status">
          Getting more information about this place...
        </p>
      </div>
    );
  } else if (status === "error") {
    return (
      <div
        role="alertdialog"
        aria-describedby="error-message"
        aria-labelledby="error-title"
      >
        <h2 id="error-title">Unable to get place detail</h2>
        <p id="error-message">
          Google Maps server is currently down.{" "}
          <a
            href="https://status.cloud.google.com/maps-platform/products/i3CZYPyLB1zevsm2AV6M/history"
            rel="noreferrer"
            target="_blank"
          >
            Please check its status
          </a>
          , and try again once they fix the problem (usually within a few
          hours).
        </p>
        <button onClick={() => setStatus("closed")} type="button">
          Got It
        </button>
      </div>
    );

    return (
      <div>
        <GoogleMapsSearchBox />
        <div id="map" className={"google-maps"} />
      </div>
    );
  }
}
