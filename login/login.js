    function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("아이디와 비밀번호를 모두 입력해주세요.");
        return;
    }

    // 실제로는 여기서 서버에 로그인 요청
    console.log("로그인 시도:", email, password);
    alert("로그인 로직이 호출되었습니다.");
    }
