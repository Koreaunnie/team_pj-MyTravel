import { Box, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import React from "react";

export function RootLayout() {
  return (
    <Stack>
      <Box bgColor={"blue.50"} mb={10} px={{ md: 20, lg: 40 }}></Box>
      <Box mx={{ md: 20, lg: 40 }}>
        <Outlet />
      </Box>
    </Stack>
  );
}
