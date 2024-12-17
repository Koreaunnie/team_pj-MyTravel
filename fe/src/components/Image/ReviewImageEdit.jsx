import { Box, IconButton, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export function ReviewImageEdit({ files }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayedFiles = files;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayedFiles.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === displayedFiles.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <Box display="flex" alignItems="center" overflow={"hidden"}>
      <IconButton onClick={handlePrev} zIndex={1} aria-label="Previous">
        <FaAngleLeft />
      </IconButton>
      <Box
        display={"flex"}
        transition="transform 0.3s ease"
        transform={`translateX(-${currentIndex * 50}px)`}
      >
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
      <IconButton onClick={handleNext}>
        <FaAngleRight />
      </IconButton>
    </Box>
  );
}
