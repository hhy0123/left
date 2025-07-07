    let currentButton = null;
    let currentAction = null;  // '판매완료' 또는 '구매완료'

    function markAsBought(button) {
    if(button.textContent.includes('구매완료')) return;

    currentButton = button;
    currentAction = '구매완료';
    document.getElementById('confirmText').textContent = '정말 구매완료로 변경하시겠습니까?';
    document.getElementById('confirmModal').style.display = 'flex';
    }

    function confirmOk() {
    if(!currentButton) return;

    currentButton.textContent = currentAction;
    //currentButton.classList.remove('active');
    // 스타일 변화 원치 않으면 아래 줄 주석 유지
    // currentButton.classList.add('sold');

    closeModal();
    }

    function confirmCancel() {
    closeModal();
    }

    function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
    currentButton = null;
    currentAction = null;
    }
