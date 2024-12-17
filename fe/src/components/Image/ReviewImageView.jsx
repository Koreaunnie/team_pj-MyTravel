import { Box, Image } from "@chakra-ui/react";
import React, { useState } from "react";

export function ReviewImageView({ files }) {
  const [showAll, setShowAll] = useState(false); // 모든 이미지를 표시할지 여부
  const MAX_IMAGES = 4; // 최대 표시할 이미지 수
  const displayedFiles = showAll ? files : files?.slice(0, MAX_IMAGES) || [];
  const remainingCount =
    files?.length > MAX_IMAGES ? files.length - MAX_IMAGES : 0;

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {displayedFiles.map((file, index) => (
        <Box key={file.name} position="relative" m={2}>
          <Image
            src={file.src}
            boxSize="100px"
            objectFit="cover"
            border="1px solid black"
          />
          {/* +N 회색 상자 */}
          {index === MAX_IMAGES - 1 && remainingCount > 0 && !showAll && (
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100px"
              height="100px"
              bg="rgba(0, 0, 0, 0.6)"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="lg"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => setShowAll(true)} // 모든 이미지 보기
            >
              +{remainingCount}
            </Box>
          )}
        </Box>
      ))}

      {/* 줄이기 버튼 */}
      {showAll && files?.length > MAX_IMAGES && (
        <button
          className={"btn btn-dark-outline"}
          style={{ cursor: "pointer" }}
          mt={2}
          onClick={() => setShowAll(false)}
        >
          줄이기
        </button>
      )}
    </Box>
  );
}
