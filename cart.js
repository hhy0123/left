    let currentButton = null;
    let currentPostId = null;

    document.addEventListener("DOMContentLoaded", async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    const postType = "sell"; // '팝니다' 게시글만 불러오기

    try {
        const response = await fetch(`https://likelion.lefteushop.work/eushop/prorile/myposts/SELL`, {
        method: "GET",
        headers: {
            access: accessToken,
        },
        credentials: "include",
        });

        if (!response.ok) {
        throw new Error("상품 불러오기 실패");
        }

        const products = await response.json();
        renderProducts(products);
    } catch (err) {
        console.error("상품 불러오기 오류:", err);
        alert("등록한 상품을 불러오는 중 오류가 발생했습니다.");
    }
    });

    function renderProducts(products) {
    const list = document.querySelector(".item-list");
    list.innerHTML = "";

    products.forEach((product) => {
        const { id, category, title, price, status } = product;

        const isSelling = status === "SELLING";
        const statusText = isSelling ? "판매중" : "판매완료";

        // 카드 생성
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

        // 버튼 영역 생성
        const itemActions = document.createElement("div");
        itemActions.className = "item-actions";
        itemActions.innerHTML = `
        <button class="item-button ${isSelling ? "active" : "sold"}" onclick="markAsSold(this, ${id}, '${status}')">${statusText}</button>
        <button class="item-button" onclick="location.href='prod_modify.html?post_id=${id}'">게시글 수정</button>
        <button class="item-button" onclick="deletePost(${id})">삭제하기</button>
        `;

        list.appendChild(itemCard);
        list.appendChild(itemActions);
    });
    }

    function markAsSold(button, postId, currentStatus) {
    if (currentStatus !== "SELLING") return; // 이미 판매완료면 무시

    currentButton = button;
    currentPostId = postId;

    document.getElementById("confirmText").textContent = "정말 판매완료로 변경하시겠습니까?";
    document.getElementById("confirmModal").style.display = "flex";
    }

    async function confirmOk() {
    if (!currentButton || !currentPostId) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(
        `https://likelion.lefteushop.work/eushop/profile/myposts/${currentPostId}/toggle-status`,
        {
            method: "PATCH",
            headers: {
            access: accessToken,
            "Content-Type": "application/json",
            },
            credentials: "include",
        }
        );

        if (!response.ok) {
        const errorData = await response.json();
        alert("상태 변경 실패: " + (errorData.message || response.statusText));
        closeModal();
        return;
        }

        const data = await response.json();

        if (data.status === "SOLD") {
        currentButton.textContent = "판매완료";
        currentButton.classList.remove("active");
        currentButton.classList.add("sold");
        }

        closeModal();
    } catch (error) {
        console.error("상태 변경 에러:", error);
        alert("상태 변경 중 오류가 발생했습니다.");
        closeModal();
    }
    }

    async function deletePost(postId) {
    const confirmDelete = confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(
        `https://likelion.lefteushop.work/eushop/delete/${postId}`,
        {
            method: "DELETE",
            headers: {
            access: accessToken,
            },
            credentials: "include",
        }
        );

        if (!response.ok) {
        const errorData = await response.json();
        alert("삭제 실패: " + (errorData.message || response.statusText));
        return;
        }

        alert("게시글이 삭제되었습니다.");
        location.reload();
    } catch (error) {
        console.error("삭제 에러:", error);
        alert("삭제 중 오류가 발생했습니다.");
    }
    }

    function confirmCancel() {
    closeModal();
    }

    function closeModal() {
    document.getElementById("confirmModal").style.display = "none";
    currentButton = null;
    currentPostId = null;
    }
