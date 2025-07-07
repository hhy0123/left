document.addEventListener("DOMContentLoaded", () => {
  const buyContainer = document.querySelector(".buy-container");
  const sellContainer = document.querySelector(".sell-container");
  const buttons = document.querySelectorAll(".buyORsell");
  const navItems = document.querySelectorAll(".nav-item");
  const btnDiv = document.querySelector(".registration-btn-div");
  let lastScrollY = window.scrollY;

  // ✅ 스크롤 시 등록 버튼 숨김/보임
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      btnDiv.classList.add("hidden");
    } else {
      btnDiv.classList.remove("hidden");
    }
    lastScrollY = currentScrollY;
  });

  // ✅ 상단 네비게이션 active 토글
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // ✅ 거래유형 버튼 클릭 시 active 갱신 + 상품 렌더링
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      fetchEushopList();
    });
  });

  // ✅ 카테고리 라디오 클릭 시 자동 fetch
  document.querySelectorAll(".category-radio").forEach((radio) => {
    radio.addEventListener("change", () => {
      fetchEushopList();
    });
  });

  // ✅ 초기 로딩 시 SELL 기준 렌더링
  // document.querySelector('.buyORsell[value="sell"]')?.classList.add("active");
  fetchEushopList();

  // ✅ 서버에서 상품 불러와서 렌더링
  async function fetchEushopList() {
    buyContainer.innerHTML = "";
    sellContainer.innerHTML = "";

    const activeBtn = document.querySelector(".buyORsell.active");
    const checkedRadio = document.querySelector(".category-radio:checked");

    let endpoint = "https://likelion.lefteushop.work/eushop/list"; // 기본 경로

    if (checkedRadio) {
      const value = checkedRadio.value;
      if (value === "MAJOR") {
        endpoint = `https://likelion.lefteushop.work/category/MAJOR`;
      } else if (value === "GENERAL") {
        endpoint = `https://likelion.lefteushop.work/category/GENERAL`;
      } else if (value === "MISC") {
        endpoint = `https://likelion.lefteushop.work/category/MISC`;
      } else if (value === "none") {
        endpoint = endpoint;
      }
    } else if (activeBtn) {
      const value = activeBtn.value;
      if (value === "sell") {
        endpoint = "https://likelion.lefteushop.work/eushop/list/type/SELL";
      } else if (value === "buy") {
        endpoint = "https://likelion.lefteushop.work/eushop/list/type/BUY";
      }
    }

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        switch (res.status) {
          case 404: {
            const errData = await res.json();
            if (errData.code === "User not found") {
              alert("❌ 유저를 찾을 수 없습니다.");
            } else if (errData.code === "review not found") {
              alert("❌ 리뷰를 찾을 수 없습니다.");
            } else {
              alert("❌ 리소스를 찾을 수 없습니다.");
            }
            throw new Error("404 Not Found");
          }
          case 401:
            alert("🔒 리소스에 대한 액세스 권한이 없습니다.");
            throw new Error("401 Unauthorized");
          case 500:
            alert("💥 DB 수정 실패");
            throw new Error("500 DB Error");
          default:
            alert(`❗ 알 수 없는 오류 (${res.status})`);
            throw new Error(`Unknown error: ${res.status}`);
        }
      }

      const responseData = await res.json();

      if (!Array.isArray(responseData)) {
        console.warn("데이터 형식 오류: 배열이 아님", responseData);
        return;
      }

      responseData.forEach((data) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
          <div class="product-container">
            <div class="product-image">
              <img id='introImagId' src="${data.introImgUrl}" alt="상품 이미지" />
            </div>
            <div class="haggwa-div">
              <p class="haggwa">${data.category}</p>
              <img id="favorite-icon" src="svg_file/favorite_border.svg" alt="찜" />
            </div>
            <div class="product-info">
              <p class="title">${data.title}</p>
              <p class="price">${data.price}원</p>
            </div>
          </div>
        `;

        if (activeBtn && activeBtn.value === "buy") {
          buyContainer.appendChild(card);
        } else {
          sellContainer.appendChild(card);
        }
      });

      buyContainer.style.display =
        activeBtn && activeBtn.value === "buy" ? "flex" : "none";
      sellContainer.style.display =
        activeBtn && activeBtn.value === "sell" ? "flex" : "none";
    } catch (err) {
      console.error("에러 발생:", err);
    }
  }

  // ✅ 카테고리 클릭 시 버튼 active 해제
  window.categoryClick = function () {
    document.querySelectorAll(".buyORsell").forEach((btn) => {
      btn.classList.remove("active");
    });
    console.log("카테고리 클릭됨: active 제거 완료");
  };

  // ✅ 'none' 라디오 선택 함수
  window.radioNone = function () {
    const radio = document.querySelector('input.category-radio[value="none"]');
    if (radio) {
      radio.checked = true;
      console.log("value='none'인 라디오가 체크됨");
      fetchEushopList();
    }
  };
});
