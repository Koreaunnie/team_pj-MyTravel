import Navbar from "../../components/root/Navbar.jsx";
import { Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <Stack>
      <Navbar />
      <Outlet />
    </Stack>
  );
}
