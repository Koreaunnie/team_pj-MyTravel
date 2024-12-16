export function formatNumberWithCommas(number) {
  // 3자리마다 쉼표 추가
  if (isNaN(number)) {
    return "0";
  }
  return number.toLocaleString();
}
