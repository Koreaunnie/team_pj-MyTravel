import React, { useEffect, useState } from "react";
import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

function TourView(props) {
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    axios.get(`/api/tour/view/${id}`).then((res) => setTour(res.data));
  }, []);

  if (tour === null) {
    return <p>존재하지 않는 상품 정보입니다.</p>;
  }

  return (
    <Box>
      <h1>Title</h1>
      <Stack>
        <Field label={"상품"} readOnly>
          <Input value={tour.product} />
        </Field>
        <Field label={"가격"} readOnly>
          <Input value={tour.price} />
        </Field>
        <Field label={"내용"} readOnly>
          <Textarea value={tour.content} />
        </Field>
        <Field label={"제공사"} readOnly>
          <Input value={tour.writer} />
        </Field>
      </Stack>
    </Box>
  );
}

export default TourView;
