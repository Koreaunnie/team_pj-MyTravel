import { Box, IconButton, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";

export function ReviewImageEdit({ files, onRemove, onFileListChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  const handleDeleteFileClick = (file) => {
    onRemove(file.name); // 삭제된 파일명을 상위로 전달
    onFileListChange(files.filter((item) => item !== file)); // 업데이트된 파일 리스트를 전달
  };

  return (
    <Box display="flex" alignItems="center" overflow={"hidden"}>
      {files.length > 2 && (
        <IconButton onClick={handlePrev} zIndex={1} aria-label="Previous">
          <FaAngleLeft />
        </IconButton>
      )}
      <Box
        display={"flex"}
        transition="transform 0.3s ease"
        transform={`translateX(-${currentIndex * 50}px)`}
      >
        {files.map((file) => (
          <>
            <button onClick={() => handleDeleteFileClick(file)}>
              <GiCancel />
            </button>
            <Image
              key={file.name}
              src={file.src}
              boxSize="100px"
              objectFit="cover"
              border="1px solid black"
              m={1}
            />
          </>
        ))}
      </Box>
      {files.length > 2 && (
        <IconButton onClick={handleNext}>
          <FaAngleRight />
        </IconButton>
      )}
    </Box>
  );
}
