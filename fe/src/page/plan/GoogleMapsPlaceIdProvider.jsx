import { createContext, useState } from "react";

const PlaceIdContext = createContext();

function GoogleMapsPlaceIdProvider({ ...props }) {
  const [placeId, setPlaceId] = useState("");
  const value = [placeId, setPlaceId];

  return (
    <div>
      <PlaceIdContext.Provider value={value} {...props} />
    </div>
  );
}
