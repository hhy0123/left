    function openModal() {
    document.getElementById('editModal').style.display = 'flex';
    }

    function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    }

    function submitEdit() {
    const nickname = document.getElementById('nickname').value.trim();
    const department = document.getElementById('department').value;
    if (!nickname && !department) {
        document.getElementById('editError').style.display = 'block';
    } else {
        document.getElementById('editError').style.display = 'none';
        alert("정보가 수정되었습니다!");
        closeModal();
    }
    }
