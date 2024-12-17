import { Box, Image } from "@chakra-ui/react";
import React from "react";

export function ReviewImageEdit({ files }) {
  const displayedFiles = files;

  return (
    <Box display="flex" alignItems="center">
      {displayedFiles.map((file) => (
        <Image
          key={file.name}
          src={file.src}
          boxSize="100px"
          objectFit="cover"
          border="1px solid black"
          m={3}
        />
      ))}
    </Box>
  );
}
