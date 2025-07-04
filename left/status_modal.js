const statusModal = document.getElementById("status-modal");
const statusClose = document.getElementById("status-close");
const statusToggleBtn = document.querySelector(".status-toggle-btn");

// 모달 열기
statusToggleBtn.addEventListener("click", () => {
  statusModal.classList.remove("hidden");
  requestAnimationFrame(() => {
    statusModal.classList.add("show");
  });
});

// 모달 닫기 (버튼)
statusClose.addEventListener("click", () => {
  statusModal.classList.remove("show");
  setTimeout(() => {
    statusModal.classList.add("hidden");
  }, 300);
});

// 모달 닫기 (배경 클릭)
document.querySelector(".status-backdrop").addEventListener("click", () => {
  statusModal.classList.remove("show");
  setTimeout(() => {
    statusModal.classList.add("hidden");
  }, 300);
});

// 라디오 선택 값 저장
document.querySelectorAll('input[name="status"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    status = e.target.value;
  });
});

// 전역 status 변수는 prod_modify.js에서 폼 제출 시 사용됨
window.getStatusValue = () => status;
