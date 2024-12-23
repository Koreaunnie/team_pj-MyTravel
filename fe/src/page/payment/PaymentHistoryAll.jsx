import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { IoIosRefresh } from "react-icons/io";
import { Center, HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

function PaymentHistory(props) {
  const [paidList, setPaidList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const { email } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/payment/list`, {
        params: {
          menu: "paymentAll",
          type: searchParams.get("type") || "all", // use URL params directly
          key: searchParams.get("key") || "", // use URL params directly
          page: searchParams.get("page") || "1",
        },
      })
      .then((res) => {
        setPaidList(res.data.paidList);
        setCount(res.data.count);
      });
  }, [searchParams]);

  useEffect(() => {
    const nextSearch = { ...search };

    if (searchParams.get("type")) {
      nextSearch.type = searchParams.get("type");
    } else {
      nextSearch.type = "all";
    }

    if (searchParams.get("key")) {
      nextSearch.keyword = searchParams.get("key");
    } else {
      nextSearch.keyword = "";
    }

    setSearch(nextSearch);
  }, [searchParams]);

  function handleSearchClick() {
    const nextSearchParam = new URLSearchParams(searchParams);

    if (search.keyword.trim().length > 0) {
      nextSearchParam.set("type", search.type);
      nextSearchParam.set("key", search.keyword);
      nextSearchParam.set("page", "1");
    } else {
      nextSearchParam.delete("type");
      nextSearchParam.delete("key");
    }

    setSearchParams(nextSearchParam);
  }

  //pagination
  const pageParam = searchParams.get("page") ?? "1";
  const page = Number(pageParam);

  // 페이지 번호 변경 시 URL 의 쿼리 파라미터를 업데이트
  function handlePageChange(e) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  }

  return (
    <div>
      <h1>총 결제 내역</h1>

      {/* 검색 */}
      <div className={"search-form"}>
        <button
          onClick={() => {
            // 1. 검색 상태 초기화
            setSearch({ type: "all", keyword: "" });

            // 2. URL 검색 파라미터 초기화
            const nextSearchParam = new URLSearchParams();
            nextSearchParam.set("menu", "paymentAll");
            nextSearchParam.set("type", "all");
            nextSearchParam.set("key", "");

            setSearchParams(nextSearchParam);
          }}
          style={{ marginRight: "10px", cursor: "pointer" }}
        >
          <IoIosRefresh />
        </button>

        <select
          onChange={(e) => setSearch({ ...search, type: e.target.value })}
        >
          <option value="all">전체</option>
          <option value="buyerEmail">구매자</option>
          <option value="paymentId">결제번호</option>
          <option value="product">상품</option>
        </select>

        <div className={"search-form-input"}>
          <input
            type="search"
            value={search.keyword}
            onChange={(e) =>
              setSearch({ ...search, keyword: e.target.value.trim() })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
          />
          <button className={"btn-search btn-dark"} onClick={handleSearchClick}>
            검색
          </button>
        </div>
      </div>

      <table className={"table-list"}>
        <thead>
          <tr>
            <th>결제일</th>
            <th>구매자 email</th>
            <th>결제 번호</th>
            <th>상품</th>
            <th>가격</th>
            <th>통화</th>
          </tr>
        </thead>
        <tbody>
          {paidList.map((tour, index) => (
            <React.Fragment key={index}>
              <tr key={tour.id}>
                <td>{tour.paidAt}</td>
                <td>{tour.buyerEmail}</td>
                <td>{tour.paymentId}</td>
                <td>{tour.product}</td>
                <td>{tour.price}</td>
                <td>{tour.currency}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      <div className="pagination">
        <Center>
          <PaginationRoot
            onPageChange={handlePageChange}
            count={count}
            pageSize={10}
            page={page}
            variant="solid"
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </Center>
      </div>
    </div>
  );
}

export default PaymentHistory;
