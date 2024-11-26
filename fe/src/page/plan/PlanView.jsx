import React from "react";
import { Fieldset, Stack } from "@chakra-ui/react";

function PlanView(props) {
  return (
    <div>
      <h1>일정 보기</h1>

      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.HelperText>id</Fieldset.HelperText>
          <Fieldset.Legend>title</Fieldset.Legend>
          <Fieldset.HelperText>description</Fieldset.HelperText>
          <Fieldset.HelperText>date</Fieldset.HelperText>
          <Fieldset.HelperText>destination</Fieldset.HelperText>
        </Stack>

        <Fieldset.Content></Fieldset.Content>
      </Fieldset.Root>
    </div>
  );
}

export default PlanView;
