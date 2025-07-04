const categoryModal = document.getElementById("category-modal");
const categoryClose = document.getElementById("category-close");
const menuIcon = document.querySelector(".menu-icon");

// 모달 열기
menuIcon.addEventListener("click", () => {
  categoryModal.classList.remove("hidden2");
  requestAnimationFrame(() => {
    categoryModal.classList.add("show");
  });
});

// 모달 닫기 (버튼)
categoryClose.addEventListener("click", () => {
  categoryModal.classList.remove("show");
  setTimeout(() => {
    categoryModal.classList.add("hidden2");
  }, 300);
});

// 모달 닫기 (배경 클릭)
// 배경 클릭 시 닫기, 단 panel 내부 클릭은 제외
document.querySelector(".category-backdrop").addEventListener("click", (e) => {
  const panel = document.querySelector(".category-panel");
  if (!panel.contains(e.target)) {
    categoryModal.classList.remove("show");
    setTimeout(() => {
      categoryModal.classList.add("hidden2");
    }, 300);
  }
});

// 라디오 선택 값 저장
document.querySelectorAll('input[name="category"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    category = e.target.value;
  });
});

// 전역 status 변수는 prod_modify.js에서 폼 제출 시 사용됨
window.getStatusValue = () => category;
