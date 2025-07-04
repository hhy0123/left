document.addEventListener("DOMContentLoaded", () => {
  const btnDiv = document.querySelector(".registration-btn-div");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      // 아래로 스크롤하면 버튼 숨김
      btnDiv.classList.add("hidden");
    } else {
      // 위로 스크롤하면 버튼 보임
      btnDiv.classList.remove("hidden");
    }

    lastScrollY = currentScrollY;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".buyORsell");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active")); // 모두 비활성화
      btn.classList.add("active"); // 현재 선택된 버튼만 활성화
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
});
