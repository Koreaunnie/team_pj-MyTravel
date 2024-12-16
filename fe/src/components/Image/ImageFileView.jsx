import { Box, Image } from "@chakra-ui/react";
import React from "react";

export function ImageFileView({ files }) {
  return (
    <Box>
      {files.map((file) => (
        <Image key={file.name} src={file.src} />
      ))}
    </Box>
  );
}
