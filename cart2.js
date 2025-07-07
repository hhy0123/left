    let currentButton = null;
    let currentAction = null; // '구매완료' 상태 저장

    document.addEventListener("DOMContentLoaded", async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("https://likelion.lefteushop.work/eushop/my-buy-products", {
        method: "GET",
        headers: {
            Authorization: accessToken,
        },
        credentials: "include",
        });

        if (!response.ok) {
        throw new Error("삽니다 상품 불러오기 실패");
        }

        const products = await response.json();
        renderBuyProducts(products);
    } catch (err) {
        console.error("삽니다 상품 오류:", err);
        alert("삽니다 상품을 불러오는 중 오류가 발생했습니다.");
    }
    });

    function renderBuyProducts(products) {
    const list = document.querySelector(".item-list");
    list.innerHTML = "";

    products.forEach((product) => {
        const { category, title, price } = product;

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

        const itemActions = document.createElement("div");
        itemActions.className = "item-actions";
        itemActions.innerHTML = `
        <button class="item-button active" onclick="markAsBought(this)">구매중</button>
        <button class="item-button" onclick="location.href='prod_modify.html'">게시글 수정</button>
        <button class="item-button">삭제하기</button>
        `;

        list.appendChild(itemCard);
        list.appendChild(itemActions);
    });
    }

    // 구매완료 버튼 클릭 시
    function markAsBought(button) {
    if (button.textContent.includes("구매완료")) return;

    currentButton = button;
    currentAction = "구매완료";
    document.getElementById("confirmText").textContent = "정말 구매완료로 변경하시겠습니까?";
    document.getElementById("confirmModal").style.display = "flex";
    }

    function confirmOk() {
    if (!currentButton) return;

    currentButton.textContent = currentAction;
    // 버튼 스타일 바꾸고 싶으면 아래 주석 해제
    // currentButton.classList.remove("active");
    // currentButton.classList.add("sold");

    closeModal();
    }

    function confirmCancel() {
    closeModal();
    }

    function closeModal() {
    document.getElementById("confirmModal").style.display = "none";
    currentButton = null;
    currentAction = null;
    }
