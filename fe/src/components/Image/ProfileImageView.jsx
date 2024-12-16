import { Box, Image } from "@chakra-ui/react";
import React from "react";

export function ProfileImageView({ files }) {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      {files.map((file) => (
        <Image
          key={file.name}
          src={file.src} // 프로필 이미지는 배열로 가정
          alt="프로필 이미지"
          borderRadius="50%" // 원형으로 표시
          boxSize="150px" // 이미지 크기 제한
          objectFit="cover" //이미지 비율
        />
      ))}
    </Box>
  );
}
