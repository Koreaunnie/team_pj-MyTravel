import React, { useEffect, useState } from "react";
import { Badge, Box, Card, HStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import { FaRegQuestionCircle } from "react-icons/fa";
import "./Plan.css";
import Calendar from "react-calendar";

function PlanList(props) {
  const [planList, setPlanList] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]); // 필터링된 일정
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/plan/calendar", {}).then((res) => setPlanList(res.data));
  }, []);

  // 선택된 날짜가 변경될 때 필터링
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // yyyy-MM-dd 형식
      const filtered = planList.filter(
        (plan) =>
          formattedDate >= plan.startDate && formattedDate <= plan.endDate,
      );
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans(planList); // 날짜 선택 안 하면 전체 일정 표시
    }
  }, [selectedDate, planList]);

  const handleDateChange = (date) => {
    setSelectedDate(date); // 선택된 날짜 업데이트
  };

  // modal
  const closeModal = () => {
    setAddModalOpen(false);
  };

  return (
    <div className={"body"}>
      <aside className={"calendar"}>
        <Calendar
          formatDay={(locale, date) =>
            date.toLocaleString("en", { day: "numeric" })
          }
          showNeighboringMonth={false}
          onChange={handleDateChange} // 날짜 선택 이벤트 핸들러
          value={selectedDate} // 선택된 날짜 상태와 동기화
          // 여행이 있는 날짜에 스타일 적용
          tileContent={({ date }) => {
            const formattedDate = date.toISOString().split("T")[0];
            return planList.some(
              (plan) =>
                formattedDate >= plan.startDate &&
                formattedDate <= plan.endDate,
            ) ? (
              <div className={"calendar-badge"}>여행</div>
            ) : null;
          }}
        />
      </aside>

      <button className="btn btn-dark" onClick={() => setAddModalOpen(true)}>
        새로운 여행 작성하기
      </button>

      {filteredPlans.length === 0 ? (
        <div className={"empty-container"}>
          <p>
            <FaRegQuestionCircle className={"empty-container-icon"} />
          </p>
          <p className={"empty-container-title"}>검색 결과가 없습니다.</p>
          <p className={"empty-container-description"}>
            다른 날짜를 선택해주세요.
          </p>
        </div>
      ) : (
        filteredPlans.map((plan) => (
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
                  <button
                    className="btn btn-dark"
                    onClick={() => {
                      navigate(`/plan/view/${plan.id}`);
                    }}
                  >
                    여행 보기
                  </button>
                </Card.Footer>
              </Box>
            </Card.Root>
          </div>
        ))
      )}

      {/* 새 여행 modal */}
      {addModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <button
                className="close"
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                &times;
              </button>
            </div>

            <div className={"modal-body"}>
              <p>새로운 여행을 작성하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button
                className={"btn btn-dark"}
                onClick={() => navigate(`/plan/add`)}
              >
                작성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanList;
