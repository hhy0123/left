    function markAsSold(button) {
    if (button.textContent.includes('판매완료')) return;

    const confirmPurchase = window.confirm("정말 판매완료로 변경하시겠습니까?");
    if (!confirmPurchase) return;

    button.textContent = "판매완료";
    button.classList.remove('active');
    button.classList.add('sold');
    }
