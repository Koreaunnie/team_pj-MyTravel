import { createContext, useState } from "react";

export const PlaceIdContext = createContext([null, () => {}]);

export function PlaceIdProvider({ props }) {
  const [placeId, setPlaceId] = useState("");
  const value = [placeId, setPlaceId];

  return (
    <PlaceIdContext.Provider value={value}>{props}</PlaceIdContext.Provider>
  );
}
