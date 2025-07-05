    function markAsSold(button) {
    if (button.textContent.includes('구매완료')) return;

    const confirmPurchase = window.confirm("정말 구매완료 하시겠습니까?");
    if (!confirmPurchase) return; // 취소하면 아무 것도 하지 않음

    button.textContent = "구매완료";
    button.classList.remove('active');
    button.classList.add('sold');
    }
