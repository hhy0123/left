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

  document.addEventListener("DOMContentLoaded", () => {
    const buySellButtons = document.querySelectorAll(".buyORsell");
    const categoryRadios = document.querySelectorAll(".category-radio");

    const sellContainer = document.querySelector(".sell-container");
    const buyContainer = document.querySelector(".buy-container");

    // 초기엔 둘 다 숨김
    sellContainer.style.display = "none";
    buyContainer.style.display = "none";

    // 상품 HTML 생성 함수
    function createProductHTML(data) {
      return `
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
    }

    // fetch 후 렌더링 함수
    async function fetchAndRender(url, targetContainer) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const productList = await res.json();

        targetContainer.innerHTML = "";
        productList.forEach((data) => {
          const html = createProductHTML(data);
          targetContainer.insertAdjacentHTML("beforeend", html);
        });
      } catch (err) {
        console.error("데이터 불러오기 실패:", err.message);
      }
    }

    // postType 기반 버튼 클릭 처리
    buySellButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const postType = btn.value.toUpperCase(); // SELL or BUY
        const url = `https://likelion.lefteushop.work/eushop/list/type/${postType}`;

        // 컨테이너 토글
        if (postType === "SELL") {
          sellContainer.style.display = "block";
          buyContainer.style.display = "none";
          fetchAndRender(url, sellContainer);
        } else {
          sellContainer.style.display = "none";
          buyContainer.style.display = "block";
          fetchAndRender(url, buyContainer);
        }
      });
    });

    // category-radio 클릭 시 처리
    categoryRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const category = radio.value;
        if (category === "none") return;

        const url = `https://likelion.lefteushop.work/eushop/list/category/${category}`;
        // 기본적으로 sellContainer에 출력 (필요 시 조건 분기 가능)
        sellContainer.style.display = "block";
        buyContainer.style.display = "none";
        fetchAndRender(url, sellContainer);
      });
    });
  });

  // 초기엔 둘 다 안 보이게 하고 싶다면 아래 추가
  window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".sell-container").style.display = "none";
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
