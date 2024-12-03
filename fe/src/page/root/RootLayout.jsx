import Navbar from "../../components/root/Navbar.jsx";
import { Outlet } from "react-router-dom";
import { Stack } from "@chakra-ui/react";

export function RootLayout() {
  return (
    <Stack>
      <Navbar />
      <Stack marginTop="180px">
        <Outlet />
      </Stack>
    </Stack>
  );
}
