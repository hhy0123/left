async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) {
        alert("아이디와 비밀번호를 모두 입력해주세요.");
        return;
    }
    try {
        const response = await fetch("https://example.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        const token = data.token; // 백엔드에서 어떤 키로 주는지 확인 필요 (예: data.accessToken)
        if (!token) {
            throw new Error("토큰이 응답에 없습니다.");
        }
        localStorage.setItem("accessToken", token); // sessionStorage도 가능
        alert("로그인 성공!");
        window.location.href = "/main.html"; // 로그인 후 이동할 페이지
    } catch (error) {
        alert("로그인 실패: " + error.message);
        console.error("로그인 에러:", error);
    }
}
