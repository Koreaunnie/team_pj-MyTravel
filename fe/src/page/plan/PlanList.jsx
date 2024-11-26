import React, { useEffect, useState } from "react";
import { Badge, Box, Card, HStack } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";

function PlanList(props) {
  const [planList, setPlanList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/plan/list")
      .then((res) => res.data)
      .then((data) => setPlanList(data));
  }, []);

  return (
    <div className={"body"}>
      <table className="table-list">
        <thead>
          <tr>
            <th className="th-id">#</th>
            <th className="th-title">여행명</th>
            <th className="th-destination">여행지</th>
            <th className="th-date">여행일</th>
            <th className="th-inserted">작성일</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>s</td>
            <td>s</td>
            <td>s</td>
            <th>작성일</th>
            <td>s</td>
          </tr>
        </tbody>
      </table>

      <Card.Root flexDirection="row" overflow="hidden" maxW="xl">
        {/*<Image*/}
        {/*  objectFit="cover"*/}
        {/*  maxW="200px"*/}
        {/*  src=""*/}
        {/*  alt="Caffe Latte"*/}
        {/*/>*/}
        {planList.map((plan) => (
          <Box>
            <Card.Body>
              <Card.Title mb="2">{plan.title}</Card.Title>
              <Card.Description>
                Caffè latte is a coffee beverage of Italian origin made with
                espresso and steamed milk.
              </Card.Description>
              <HStack mt="4">
                <Badge>{plan.inserted}</Badge>
                <Badge>Caffeine</Badge>
              </HStack>
            </Card.Body>

            <Card.Footer>
              <Button>Buy Latte</Button>
            </Card.Footer>
          </Box>
        ))}
      </Card.Root>
    </div>
  );
}

export default PlanList;
