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
  document.querySelector('.buyORsell[value="sell"]')?.classList.add("active");
  fetchEushopList();

  function sellClick() {}

  async function loadProducts(type) {
    const url = `https://likelion.lefteushop.work/eushop/list/type/${type.toUpperCase()}`;

    // 컨테이너 가져오기
    const sellContainer = document.querySelector(".sell-container");
    const buyContainer = document.querySelector(".buy-container");

    // 컨테이너 표시/숨김 처리
    if (type === "sell") {
      sellContainer.style.display = "block";
      buyContainer.style.display = "none";
    } else if (type === "buy") {
      sellContainer.style.display = "none";
      buyContainer.style.display = "block";
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      const productList = await res.json();

      // 출력할 대상 컨테이너 선택
      const container = type === "sell" ? sellContainer : buyContainer;
      container.innerHTML = ""; // 기존 내용 제거

      // 상품 카드 렌더링
      productList.forEach((data) => {
        const productHTML = `
          <div class="product-container">
            <div class="product-image">
              <img id="introImagId" src="${data.intro_img_url}" alt="상품 이미지" />
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
        container.insertAdjacentHTML("beforeend", productHTML);
      });
    } catch (err) {
      console.error("불러오기 실패:", err.message);
    }
  }

  // 초기엔 둘 다 안 보이게 하고 싶다면 아래 추가
  window.addEventListener("DOMContentLoaded", () => {
    // document.querySelector(".sell-container").style.display = "none";
    document.querySelector(".buy-container").style.display = "none";
  });

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
