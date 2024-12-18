import Navbar from "../../components/root/Navbar.jsx";
import { Outlet } from "react-router-dom";
import { Stack } from "@chakra-ui/react";
import { Footer } from "../../components/root/Footer.jsx";
import React from "react";

export function RootLayout() {
  return (
    <Stack>
      <Navbar />
      <Stack marginTop="65px">
        <Outlet />
      </Stack>
      <Footer />
    </Stack>
  );
}
