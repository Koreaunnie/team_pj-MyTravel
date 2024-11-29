import { Box, HStack, Image } from "@chakra-ui/react";
import React from "react";
import { Checkbox } from "../components/ui/checkbox.jsx";

export function ImageView({ files, onRemoveCheckClick }) {
  return (
    <Box>
      {files.map((file) => (
        <HStack key={file.name}>
          <Checkbox
            onCheckedChange={(e) => onRemoveCheckClick(e.checked, file.name)}
          />
          <Image src={file.src} m={5}></Image>
        </HStack>
      ))}
    </Box>
  );
}
