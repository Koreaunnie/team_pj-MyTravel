import { Box, Image } from "@chakra-ui/react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function ImageSwipeView({ files }) {
  return (
    <Box>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={50}
        slidesPerView={1}
      >
        {files.map((file) => (
          <SwiperSlide key={file.name}>
            <Image src={file.src} alt={file.name} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
