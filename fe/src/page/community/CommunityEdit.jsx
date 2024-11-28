import React, { useEffect, useState } from "react";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function CommunityEdit(props) {
  const [community, setCommunity] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/community/view/${id}`).then((res) => {
      setCommunity(res.data);
    });
  }, []);

  const handleSaveClick = () => {
    axios
      .put(`/api/community/edit`, {
        id: community.id,
        title: community.title,
        content: community.content,
      })
      .then(navigate(`/community/list`));
  };

  return (
    <div>
      <h1>게시글 수정</h1>
      <Box
        mx={"auto"}
        w={{
          md: "500px",
        }}
      >
        <Field label={"제목"}>
          <Input
            value={community.title}
            onChange={(e) =>
              setCommunity({ ...community, title: e.target.value })
            }
          />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={community.content}
            onChange={(e) =>
              setCommunity({ ...community, content: e.target.value })
            }
            h={300}
          />
        </Field>
        <br />
        <Box>
          <HStack>
            <Button>취소</Button>
            <Button onClick={handleSaveClick}>저장</Button>
          </HStack>
        </Box>
      </Box>
    </div>
  );
}

export default CommunityEdit;
