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
        // 삽니다 게시글 목록 불러오기 (postType 자리에 'buying' 같은 게 들어가겠지)
        const response = await fetch("https://likelion.lefteushop.work/eushop/profile/myposts/${BUY}", {
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

        // 삽니다 상태 버튼 - 구매중/구매완료 (너가 구매완료 따로 처리한다고 했으니 여기선 그냥 구매중 버튼만)
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

    // 구매중 → 구매완료 버튼 클릭 (모달 띄움)
    function markAsBought(button, postId) {
    if (button.textContent.includes("구매완료")) return;

    currentButton = button;
    currentPostId = postId;

    document.getElementById("confirmText").textContent = "정말 구매완료로 변경하시겠습니까?";
    document.getElementById("confirmModal").style.display = "flex";
    }

    // 모달 확인 클릭 시 구매완료 상태 변경 PATCH 호출
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

    // 모달 취소 클릭
    function confirmCancel() {
    closeModal();
    }

    // 모달 닫기
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

        const itemActions = button.parentElement;
        const itemCard = itemActions.previousElementSibling;
        itemCard.remove();
        itemActions.remove();
    } catch (error) {
        console.error("삭제 오류:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
    }
    }
