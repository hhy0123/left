document.addEventListener("DOMContentLoaded", () => {
  const buyContainer = document.querySelector(".buy-container");
  const sellContainer = document.querySelector(".sell-container");
  const buySellButtons = document.querySelectorAll(".buyORsell");
  const categoryRadios = document.querySelectorAll(".category-radio");
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

  // ✅ 하단 네비게이션 active 전환
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // ✅ 상품 HTML 생성 함수
  function createProductHTML(data) {
    return `
      <div class="product-container">
        <div class="product-image">
          <img id="introImagId" src="${data.introImgUrl}" alt="상품 이미지" />
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
    `.trim();
  }

  // ✅ 서버에서 데이터 fetch 후 렌더링
  async function fetchAndRender(url, targetContainer) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      const productList = await res.json();
      targetContainer.innerHTML = "";
      productList.forEach((data) => {
        targetContainer.insertAdjacentHTML(
          "beforeend",
          createProductHTML(data)
        );
      });
    } catch (err) {
      console.error("데이터 불러오기 실패:", err.message);
    }
  }

  // ✅ 현재 상태 기준으로 서버 fetch
  function fetchEushopList() {
    const activeBtn = document.querySelector(".buyORsell.active");
    const selectedCategory = document.querySelector(
      ".category-radio:checked"
    )?.value;

    if (!activeBtn && (!selectedCategory || selectedCategory === "none")) {
      console.log("선택된 거래유형과 카테고리가 없음");
      return;
    }

    const postType = activeBtn?.value.toUpperCase();
    const category = selectedCategory;

    if (category && category !== "none") {
      const url = `https://likelion.lefteushop.work/eushop/list/category/${category}`;
      sellContainer.style.display = "block";
      buyContainer.style.display = "none";
      fetchAndRender(url, sellContainer);
    } else if (postType) {
      const url = `https://likelion.lefteushop.work/eushop/list/type/${postType}`;
      if (postType === "SELL") {
        sellContainer.style.display = "block";
        buyContainer.style.display = "none";
        fetchAndRender(url, sellContainer);
      } else {
        sellContainer.style.display = "none";
        buyContainer.style.display = "block";
        fetchAndRender(url, buyContainer);
      }
    }
  }

  // ✅ 거래유형 버튼 클릭 처리
  buySellButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buySellButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // 카테고리 선택 해제
      categoryRadios.forEach((r) => {
        r.checked = r.value === "none";
      });

      fetchEushopList();
    });
  });

  // ✅ 카테고리 라디오 클릭 처리
  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      buySellButtons.forEach((btn) => btn.classList.remove("active"));
      fetchEushopList();
    });
  });

  // ✅ 초기 로딩 상태
  const defaultBtn = document.querySelector('.buyORsell[value="SELL"]');
  if (defaultBtn) defaultBtn.classList.add("active");

  const defaultCategory = document.querySelector(
    '.category-radio[value="none"]'
  );
  if (defaultCategory) defaultCategory.checked = true;

  fetchEushopList();

  // ✅ 외부에서 category 클릭 시 호출하는 함수
  window.categoryClick = function () {
    buySellButtons.forEach((btn) => btn.classList.remove("active"));
    console.log("카테고리 클릭됨: active 제거 완료");
  };

  // ✅ 외부에서 카테고리 none으로 초기화하는 함수
  window.radioNone = function () {
    const radio = document.querySelector('input.category-radio[value="none"]');
    if (radio) {
      radio.checked = true;
      console.log("value='none' 라디오 체크");
      fetchEushopList();
    }
  };
});
