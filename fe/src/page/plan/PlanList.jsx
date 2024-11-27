import React, { useEffect, useState } from "react";
import { Badge, Box, Card, HStack } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PlanList(props) {
  const [planList, setPlanList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/plan/list")
      .then((res) => res.data)
      .then((data) => setPlanList(data));
  }, []);

  return (
    <div className={"body"}>
      <button className={"btn"} onClick={() => navigate(`/plan/add`)}>
        추가
      </button>

      {planList.map((plan) => (
        <div key={plan.id}>
          <Card.Root flexDirection="row" overflow="hidden" maxW="xl" my={5}>
            <Box>
              <Card.Body>
                <Card.Title mb="5">{plan.title}</Card.Title>
                <Card.Description>{plan.description}</Card.Description>
                <HStack mt="5">
                  <Badge>{plan.destination}</Badge>
                  <Badge>{plan.due}</Badge>
                </HStack>
              </Card.Body>

              <Card.Footer>
                <Button
                  onClick={() => {
                    navigate(`/plan/view/${plan.id}`);
                  }}
                >
                  여행 보기
                </Button>
              </Card.Footer>
            </Box>
          </Card.Root>
        </div>
      ))}
    </div>
  );
}

export default PlanList;
