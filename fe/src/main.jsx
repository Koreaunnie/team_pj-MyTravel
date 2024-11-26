import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "./components/ui/provider.jsx";
import TourList from "./components/tour/TourList.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <TourList />
    </Provider>
  </StrictMode>,
);
