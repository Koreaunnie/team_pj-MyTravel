import React from "react";
import {Box, Flex} from "@chakra-ui/react";

function TourList(props) {
  return (
    <div>
      <Flex justify="space-between" align="center" wrap="wrap">
        <Box onClick={}>서울</Box>
        <Box>부산</Box>
        <Box>제주</Box>
        <Box>강원</Box>
        <Box>경기</Box>
        <Box>인천</Box>
        <Box>경상</Box>
        <Box>충청</Box>
        <Box>전라</Box>
      </Flex>
    </div>
  );
}

export default TourList;
