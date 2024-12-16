import React, { useEffect } from "react";
import { GoogleMapsSearchBox } from "./GoogleMapsSearchBox.jsx";
import { Loader } from "@googlemaps/js-api-loader";
import { GoogleMapsSearchedPlace } from "./GoogleMapsSearchedPlace.jsx";

// google personal api key
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

function GoogleMapsContainer(props) {
  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .importLibrary("maps")
      .then(({ Map }) => {
        new Map(document.getElementById("map"), mapObject);
        console.log("Map JS API Loaded!");
      })
      .catch((e) => {
        console.log("Failed to load Google Maps:", e);
      });
  });

  let mapObject;
  mapObject = {
    center: {
      lat: 37,
      lng: 128,
    },
    zoom: 7,
  };

  return (
    <div>
      <GoogleMapsSearchBox />
      <div id="map" className={"google-maps"} />
      <GoogleMapsSearchedPlace value={mapObject} />
    </div>
  );
}

export default GoogleMapsContainer;
