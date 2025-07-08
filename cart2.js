    // 현재 클릭한 버튼과 게시글 id 저장용
    let currentButton = null;
    let currentPostId = null;

    document.addEventListener("DOMContentLoaded", async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    try {
        // 삽니다 게시글 목록 불러오기
        const response = await fetch("https://likelion.lefteushop.work/eushop/prorile/myposts/BUY", {
        method: "GET",
        headers: {
            access: accessToken,
        },
        credentials: "include",
        });

        if (!response.ok) throw new Error("삽니다 상품 불러오기 실패");

        const products = await response.json();
        renderBuyProducts(products);
    } catch (err) {
        console.error("삽니다 상품 오류:", err);
        alert("삽니다 상품을 불러오는 중 오류가 발생했습니다.");
    }
    });

    // 삽니다 상품 렌더링 함수
    function renderBuyProducts(products) {
    const list = document.querySelector(".item-list");
    list.innerHTML = "";

    products.forEach((product) => {
        const { post_id, category, title, price, status } = product;

        const itemCard = document.createElement("div");
        itemCard.className = "item-card";
        itemCard.innerHTML = `
        <div class="item-info">
            <div class="item-description">
            <p class="item-category">${category}</p>
            <p class="item-title">${title}</p>
            <p class="item-price">${price.toLocaleString()}원</p>
            </div>
        </div>
        `;

        const itemActions = document.createElement("div");
        itemActions.className = "item-actions";

        const buyingBtnText = status === "BOUGHT" ? "구매완료" : "구매중";
        const buyingBtnClass = status === "BOUGHT" ? "item-button sold" : "item-button active";

        itemActions.innerHTML = `
        <button class="${buyingBtnClass}" onclick="markAsBought(this, ${post_id})">${buyingBtnText}</button>
        <button class="item-button" onclick="modifyPost(${post_id})">게시글 수정</button>
        <button class="item-button" onclick="deletePost(${post_id}, this)">삭제하기</button>
        `;

        list.appendChild(itemCard);
        list.appendChild(itemActions);
    });
    }

    function markAsBought(button, postId) {
    if (button.textContent.includes("구매완료")) return;

    currentButton = button;
    currentPostId = postId;

    document.getElementById("confirmText").textContent = "정말 구매완료로 변경하시겠습니까?";
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
        const response = await fetch(`https://likelion.lefteushop.work/eushop/profile/myposts/${currentPostId}/toggle-status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            access: accessToken,
        },
        credentials: "include",
        });

        if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "상태 변경 실패");
        }

        currentButton.textContent = "구매완료";
        currentButton.classList.remove("active");
        currentButton.classList.add("sold");

        alert("구매 상태가 구매완료로 변경되었습니다.");
    } catch (error) {
        console.error("상태 변경 오류:", error);
        alert("구매 상태 변경 중 오류가 발생했습니다.");
    } finally {
        closeModal();
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

    // 게시글 수정 페이지 이동
    function modifyPost(postId) {
    location.href = `prod_modify.html?post_id=${postId}`;
    }

    // 게시글 삭제 API 호출 후 UI 제거
    async function deletePost(postId, button) {
    if (!confirm("정말 삭제하시겠습니까? 삭제한 게시글은 복구할 수 없습니다.")) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`https://likelion.lefteushop.work/eushop/delete/${postId}`, {
        method: "DELETE",
        headers: {
            access: accessToken,
        },
        credentials: "include",
        });

        if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "삭제 실패");
        }

        alert("게시글이 삭제되었습니다.");

        // UI에서 제거
        const itemActions = button.parentElement;
        const itemCard = itemActions.previousElementSibling;
        itemCard.remove();
        itemActions.remove();
    } catch (error) {
        console.error("삭제 오류:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
    }
    }

    // 여기부터 추가: 게시글 수정 API 호출 함수
    // updatedData는 수정할 필드들을 담은 객체
    async function editPost(postId, updatedData) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`https://likelion.lefteushop.work/eushop/edit/${postId}`, {
        method: "PUT",
        headers: {
            access: accessToken,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
        const errData = await response.json();
        alert("게시글 수정 실패: " + (errData.message || response.statusText));
        return;
        }

        alert("게시글이 성공적으로 수정되었습니다.");
        location.href = "main.html"; // 수정 완료 후 이동할 페이지
    } catch (error) {
        console.error("게시글 수정 오류:", error);
        alert("게시글 수정 중 오류가 발생했습니다.");
    }
    }
