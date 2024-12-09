import React, { useContext, useEffect, useState } from "react";
import { Box, Center, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

function TourList() {
  const [tourList, setTourList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("box");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    type: searchParams.get("type") ?? "all",
    keyword: searchParams.get("key") ?? "",
  });
  const { isPartner, isAdmin } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`/api/tour/list`, {
        params: searchParams,
        signal: controller.signal,
      })
      .then((res) => {
        setTourList(res.data.tourList);
      })
      .catch((err) => {
        setTourList([]);
      });
    return () => {
      controller.abort();
    };
  }, [searchParams]);

  function handleRowClick(id) {
    navigate(`/tour/view/${id}`);
  }

  function handleSearchClick() {
    if (search.keyword.trim().length > 0) {
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.set("type", search.type);
      nextSearchParam.set("key", search.keyword);

      setSearchParams(nextSearchParam);
    } else {
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.delete("type");
      nextSearchParam.delete("key");

      setSearchParams(nextSearchParam);
    }
  }

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className={"tour"}>
      <Breadcrumb
        depth1={"Tour 목록"}
        navigateToDepth1={() => navigate(`/tour/list`)}
      />

      <div>
        {(isPartner || isAdmin) && (
          <button
            className={"btn btn-dark"}
            onClick={() => navigate(`/tour/add`)}
          >
            새 상품 등록
          </button>
        )}
        <h1>Tour 목록</h1>

        <Center>
          {/*검색*/}
          <div className={"search-form"}>
            <select
              value={search.type}
              onChange={(e) => setSearch({ ...search, type: e.target.value })}
            >
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="product">제품</option>
              <option value="location">위치</option>
              <option value="content">본문</option>
              <option value="partner">파트너사</option>
            </select>
            <div className={"search-form-input"}>
              <input
                type={"search"}
                value={search.keyword}
                onChange={(e) =>
                  setSearch({ ...search, keyword: e.target.value.trim() })
                }
              />
              <button
                className={"btn-search btn-dark"}
                onClick={handleSearchClick}
              >
                검색
              </button>
            </div>
          </div>
        </Center>

        {/* 보기 선택 */}
        <button
          className={"btn btn-dark-outline"}
          onClick={() => handleMenuClick("box")}
        >
          박스형
        </button>
        <button
          className={"btn btn-dark-outline"}
          onClick={() => handleMenuClick("list")}
        >
          목록형
        </button>

        {selectedMenu === "box" && (
          <div>
            {tourList.length === 0 ? (
              <p>찾으시는 상품이 존재하지 않습니다.</p>
            ) : (
              <SimpleGrid
                columns={{ base: 2, md: 3, lg: 4, xl: 5, "2xl": 6 }}
                spacing={6}
              >
                {tourList.map((tour) =>
                  tour.active ? (
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
                      <Image key={tour.image} src={tour.src} />
                      <Text>
                        <b>{tour.title}</b>
                      </Text>
                      <Text>{tour.location}</Text>
                      <Text>{tour.product}</Text>
                      <Text>{tour.price}</Text>
                    </Box>
                  ) : null,
                )}
              </SimpleGrid>
            )}
          </div>
        )}
        {selectedMenu === "list" && (
          <div>
            {tourList.length === 0 ? (
              <p>찾으시는 상품이 존재하지 않습니다.</p>
            ) : (
              <table className={"table-list"}>
                <tbody>
                  {tourList.map((tour) =>
                    tour.active ? (
                      <tr
                        key={tour.id}
                        _hover={{ boxShadow: "1g" }}
                        onClick={() => handleRowClick(tour.id)}
                      >
                        <td>
                          <Image key={tour.image} src={tour.src} />
                        </td>
                        <td>{tour.title}</td>
                        <td>{tour.location}</td>
                        <td>{tour.product}</td>
                        <td>{tour.price}</td>
                      </tr>
                    ) : null,
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TourList;
