import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TourList() {
  const [tourList, setTourList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/tour/list`).then((res) => {
      setTourList(res.data);
    });
  }, []);

  function handleRowClick(id) {
    navigate(`/tour/view/${id}`);
  }

  return (
    <Box>
      <h1>Tour 목록</h1>

      {tourList.length === 0 ? (
        <p>찾으시는 상품이 존재하지 않습니다.</p>
      ) : (
        <SimpleGrid
          columns={{ base: 2, md: 4, lg: 6, xl: 7, "2xl": 8 }}
          spacing={6}
        >
          {tourList.map((tour) => (
            <Box
              key={tour.id}
              borderWidth={"1px"}
              borderRadius={"1g"}
              overflow={"hidden"}
              p={4}
              m={1}
              _hover={{ boxShadow: "1g" }}
              onClick={() => handleRowClick(tour.id)}
            >
              <Text>{tour.title}</Text>
              <Text>{tour.location}</Text>
              <Text>{tour.product}</Text>
              <Text>{tour.price}</Text>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default TourList;
