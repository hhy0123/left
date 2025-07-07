    let currentButton = null;  // 클릭한 버튼 저장용

    function markAsSold(button) {
    if(button.textContent.includes('판매완료')) return;

    currentButton = button;
    document.getElementById('confirmModal').style.display = 'flex';
    }

    function confirmOk() {
    if(!currentButton) return;
    currentButton.textContent = '판매완료';
    currentButton.classList.remove('active');
    currentButton.classList.add('sold');

    closeModal();
    }

    function confirmCancel() {
    closeModal();
    }

    function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
    currentButton = null;
    }
