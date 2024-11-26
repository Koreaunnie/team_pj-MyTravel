import React, { useState } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";

function TourList(props) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const regions = [
    "서울",
    "부산",
    "제주",
    "강원",
    "경기",
    "인천",
    "경상",
    "충청",
    "전라",
  ];

  return (
    <div>
      {/* 검색 기능 추가 */}
      <Flex direction="column" align="center" mb={4}>
        <Input
          placeholder="지역을 검색하세요..."
          value={search}
          onChange={handleSearchChange}
          mb={2}
          width="300px"
        />
        <Flex wrap="wrap" justify="center">
          {regions
            .filter((region) => region.includes(search)) // 검색 필터링
            .map((region, index) => (
              <Box key={index} p={2} border="1px" borderColor="gray.300" m={1}>
                <Text>{region}</Text>
                <Button mt={2} colorScheme="teal">
                  숙소 보기
                </Button>
              </Box>
            ))}
        </Flex>
      </Flex>
    </div>
  );
}

export default TourList;
