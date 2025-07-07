    // 현재 클릭한 버튼 저장용
    let currentButton = null;

    // 페이지 로딩 시 상품 불러오기
    document.addEventListener("DOMContentLoaded", async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("https://likelion.lefteushop.work/eushop/my-products", {
        method: "GET",
        headers: {
            Authorization: accessToken,
        },
        credentials: "include",
        });

        if (!response.ok) {
        throw new Error("상품 불러오기 실패");
        }

        const products = await response.json(); // 배열로 가정
        renderProducts(products);
    } catch (err) {
        console.error("상품 불러오기 오류:", err);
        alert("등록한 상품을 불러오는 중 오류가 발생했습니다.");
    }
    });

    // 상품 리스트 렌더링 함수
    function renderProducts(products) {
    const list = document.querySelector(".item-list");
    list.innerHTML = ""; // 기존 하드코딩 제거

    products.forEach((product) => {
        const { category, title, price } = product;

        // 카드 HTML 생성
        const itemCard = document.createElement("div");
        itemCard.className = "item-card";
        itemCard.innerHTML = `
        <div class="item-info">
            <div class="item-image"></div>
            <div class="item-description">
            <p class="item-category">${category}</p>
            <p class="item-title">${title}</p>
            <p class="item-price">${price.toLocaleString()}원</p>
            </div>
        </div>
        `;

        // 액션 버튼 영역 생성
        const itemActions = document.createElement("div");
        itemActions.className = "item-actions";
        itemActions.innerHTML = `
        <button class="item-button active" onclick="markAsSold(this)">판매중</button>
        <button class="item-button" onclick="location.href='prod_modify.html'">게시글 수정</button>
        <button class="item-button">삭제하기</button>
        `;

        // DOM에 추가
        list.appendChild(itemCard);
        list.appendChild(itemActions);
    });
    }

    // 판매완료 버튼 클릭 시 확인창
    function markAsSold(button) {
    if (button.textContent.includes("판매완료")) return;
    currentButton = button;
    document.getElementById("confirmModal").style.display = "flex";
    }

    // 확인 클릭 시 상태 변경
    function confirmOk() {
    if (!currentButton) return;
    currentButton.textContent = "판매완료";
    currentButton.classList.remove("active");
    currentButton.classList.add("sold");
    closeModal();
    }

    // 취소 클릭
    function confirmCancel() {
    closeModal();
    }

    // 모달 닫기
    function closeModal() {
    document.getElementById("confirmModal").style.display = "none";
    currentButton = null;
    }
