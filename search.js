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
  const searchInput = document.getElementById("search-s");
  const searchedDiv = document.querySelector(".searched-div");

  // ⌨️ Enter 키 입력 시 검색 실행
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      request();
    }
  });

  // 검색 요청 함수
  async function request() {
    const keyword = searchInput.value.trim();

    if (keyword === "") {
      alert("검색어를 입력하세요.");
      return;
    }

    saveSearchKeyword(keyword);
    renderSearchHistory();

    try {
      const res = await fetch(`/eushop/list?keyword=${keyword}`);

      if (!res.ok) {
        const errorResponse = await res.json().catch(() => ({}));

        switch (res.status) {
          case 404:
            if (errorResponse.code === "User not found") {
              alert("유저를 찾을 수 없음");
            } else if (errorResponse.code === "review not found") {
              alert("리뷰를 찾을 수 없음");
            } else {
              alert("요청한 리소스를 찾을 수 없습니다");
            }
            break;
          case 401:
            alert("리소스에 대한 액세스 권한이 없음");
            break;
          case 500:
            alert("DB 수정 실패");
            break;
          default:
            alert(`알 수 없는 오류가 발생했습니다. 상태코드: ${res.status}`);
        }

        throw new Error(`에러 상태 코드: ${res.status}`);
      }

      const data = await res.json();

      searchedDiv.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        searchedDiv.innerHTML = "<p>검색 결과가 없습니다.</p>";
        return;
      }

      data.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
          <div class="product-container">
            <div class="product-image">
              <img src="${item.introImgUrl}" alt="상품 이미지" />
            </div>
            <div class="haggwa-div">
              <p class="haggwa">${item.category}</p>
              <img id="favorite-icon" src="svg_file/favorite_border.svg" alt="찜" />
            </div>
            <div class="product-info">
              <p class="title">${item.title}</p>
              <p class="price">${item.price}원</p>
            </div>
          </div>
        `;
        searchedDiv.appendChild(card);
      });
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }

  // ✅ 중복 없이 검색어 저장
  function saveSearchKeyword(keyword) {
    for (let i = 1; i <= localStorage.length; i++) {
      if (localStorage.getItem(`searched${i}`) === keyword) return;
    }

    let index = 1;
    while (localStorage.getItem(`searched${index}`)) {
      index++;
    }
    localStorage.setItem(`searched${index}`, keyword);
  }

  // 검색 기록 렌더링
  function renderSearchHistory() {
    const historyContainer = document.querySelector(".search-log-div");
    historyContainer.innerHTML = "";

    let index = 1;
    while (true) {
      const key = `searched${index}`;
      const keyword = localStorage.getItem(key);
      if (!keyword) break;

      const item = document.createElement("div");
      item.classList.add("search-history-item");

      const keywordSpan = document.createElement("span");
      keywordSpan.textContent = keyword;
      keywordSpan.classList.add("search-keyword");
      keywordSpan.addEventListener("click", () => {
        searchInput.value = keyword;
        request(); // 해당 키워드로 재검색
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✕";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => {
        deleteSearchKeyword(key); // 정확한 key 넘기기
        renderSearchHistory();
      });

      item.appendChild(keywordSpan);
      item.appendChild(deleteBtn);
      historyContainer.appendChild(item);

      index++;
    }
  }

  // 검색어 삭제 및 재정렬
  function deleteSearchKeyword(keyToDelete) {
    const temp = [];

    let index = 1;
    while (true) {
      const key = `searched${index}`;
      const value = localStorage.getItem(key);
      if (!value) break;

      if (key !== keyToDelete) {
        temp.push(value);
      }
      index++;
    }

    // 초기화
    for (let i = 1; i < index; i++) {
      localStorage.removeItem(`searched${i}`);
    }

    // 다시 저장
    temp.forEach((value, idx) => {
      localStorage.setItem(`searched${idx + 1}`, value);
    });
  }

  // 페이지 로드시 검색 기록 표시
  renderSearchHistory();
});

function deleteIcon() {
  let index = 1;
  while (true) {
    const key = `searched${index}`;
    if (!localStorage.getItem(key)) break;

    localStorage.removeItem(key);
    index++;

    window.location.reload(); // 페이지 새로고침
  }

  // 기록 다시 렌더링
  renderSearchHistory();
}
