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

document.addEventListener("DOMContentLoaded", () => {
  const buyContainer = document.querySelector(".buy-container");
  const sellContainer = document.querySelector(".sell-container");
  const buttons = document.querySelectorAll(".buyORsell");

  function renderItems(type) {
    buyContainer.innerHTML = "";
    sellContainer.innerHTML = "";

    for (let i = 1; i <= localStorage.length; i++) {
      const key = `${type}${i}`;
      const item = localStorage.getItem(key);

      if (item) {
        try {
          const data = JSON.parse(item);

          const card = document.createElement("div");
          card.classList.add("product-card");
          card.innerHTML = `
          <div class="product-container">
            <div class="product-image">
              <img src="svg_file/Placeholder.svg" alt="상품 이미지" />
            </div>
            <div class="haggwa-div">
              <p class="haggwa">첨단학부</p>
              <img id="favorite-icon" src="svg_file/favorite_border.svg" alt="찜" />
            </div>
            <div class="product-info">
              <p class="title">${data.title}</p>
              <p class="price">${data.price}원</p>
            </div>
          </div>
          `;

          if (type === "buy") {
            buyContainer.appendChild(card);
          } else {
            sellContainer.appendChild(card);
          }
        } catch (err) {
          console.warn("JSON 파싱 오류:", key);
        }
      }
    }

    // 컨테이너 visibility toggle
    buyContainer.style.display = type === "buy" ? "flex" : "none";
    sellContainer.style.display = type === "sell" ? "flex" : "none";
  }

  // 초기 상태는 'sell'
  renderItems("sell");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderItems(btn.value);
    });
  });
});
