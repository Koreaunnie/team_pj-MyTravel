export const formattedDateTime = (props) => {
  // 날짜와 시간 포맷팅
  const date = new Date(props);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줘야 함
  const day = String(date.getDate()).padStart(2, "0"); // 두 자릿수로 맞추기 위해 padStart 사용

  const hours = String(date.getHours()).padStart(2, "0"); // 두 자릿수로 맞추기
  const minutes = String(date.getMinutes()).padStart(2, "0"); // 두 자릿수로 맞추기

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
