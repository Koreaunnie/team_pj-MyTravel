import React, { useContext, useEffect, useState } from "react";
import { Box, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { ProfileImageView } from "../../components/Image/ProfileImageView.jsx";
import Access from "../../components/context/Access.jsx";
import "/src/page/member/Member.css";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";

function AdminMemberView(props) {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { email } = useParams();
  const navigate = useNavigate();
  const { logout, isAdmin, isPartner } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/member/${email}`).then((res) => setMember(res.data));
  }, []);

  console.log(email);

  if (!member) {
    return <Access />;
  }

  function handleDeleteClick() {
    axios
      .delete(`/api/member/remove`, {
        data: { email, password },
      })
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        if (isAdmin) {
          navigate("/admin");
        } else {
          logout();
          navigate(`/member/signup`);
        }
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setOpen(false);
        setPassword("");
      });
  }

  return (
    <div className={"member-info"}>
      <Breadcrumb
        depth1={"관리자 모드"}
        navigateToDepth1={() => navigate(`/admin`)}
        depth2={member.nickname + "의 프로필"}
        navigateToDepth2={() => {}}
      />
      <h1>회원 정보</h1>

      <ProfileImageView files={member.profile} />

      <div className={"form-wrap"}>
        <fieldset>
          <ul>
            <li>
              <label htmlFor="email">이메일</label>
              <input type={"text"} id={email} readOnly value={member.email} />
            </li>

            <li>
              <label htmlFor="nickname">닉네임</label>
              <input
                type={"text"}
                id={"nickname"}
                readOnly
                value={member.nickname}
              />
            </li>

            {member.kakao || (
              <li>
                <label htmlFor="password">비밀번호</label>
                <input
                  type={"password"}
                  id={"password"}
                  readOnly
                  value={member.password}
                />
              </li>
            )}

            <li>
              <label htmlFor="name">이름</label>
              <input type={"text"} id={"name"} readOnly value={member.name} />
            </li>

            <li>
              <label htmlFor="phone">전화번호</label>
              <input
                type={"number"}
                id={"phone"}
                readOnly
                value={member.phone}
              />
            </li>

            <li>
              <label htmlFor="inserted">가입 일시</label>
              <input
                type={"datetime-local"}
                id={"inserted"}
                readOnly
                value={member.inserted}
              />
            </li>

            {member.kakao && (
              <li>
                <label htmlFor="kakao">연동 계정</label>
                <input type={"text"} readonly value={"카카오톡"} />
              </li>
            )}
          </ul>
        </fieldset>

        <Box>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => {
              navigate(`/admin`);
            }}
          >
            관리자 창으로
          </button>
          <button
            className={"btn btn-dark"}
            onClick={() => navigate(`/member/edit/${email}`)}
          >
            수정
          </button>
          {member.kakao || (
            <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
              <DialogTrigger>
                <button className={"btn btn-warning"}>탈퇴</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>탈퇴 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <Stack>
                    <Field label={"비밀번호"}>
                      <Input
                        placeholder={"비밀번호 입력"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </Field>
                  </Stack>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button onClick={handleDeleteClick}>탈퇴</Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          )}{" "}
          {member.kakao && (
            <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
              <DialogTrigger>
                <button className={"btn btn-warning"}>탈퇴</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>탈퇴 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <Stack>
                    <p>
                      회원 정보 삭제를 확인하려면 텍스트 입력 필드에{" "}
                      {member.password}을 따라 입력해 주십시오
                    </p>
                    <Field>
                      <Input
                        placeholder={member.password}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </Field>
                  </Stack>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button onClick={handleDeleteClick}>탈퇴</Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          )}
        </Box>
      </div>
    </div>
  );
}

export default AdminMemberView;
