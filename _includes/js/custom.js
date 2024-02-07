document.addEventListener("DOMContentLoaded", function() {
  var summary = document.getElementById("mySummary");
  var additionalText = " (Opened)";

  // details 요소가 열려 있는지 확인하고 추가적인 텍스트를 추가
  var details = summary.parentElement;
  if (details.open) {
    summary.textContent += additionalText;
  }

  // details 요소의 상태 변화를 감지하여 열림/닫힘에 따라 텍스트를 추가하거나 제거
  details.addEventListener("toggle", function() {
    if (details.open) {
      summary.textContent = "Details" + additionalText;
    } else {
      summary.textContent = "Details";
    }
  });
});