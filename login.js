async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }

  try {
    const response = await fetch("https://likelion.lefteushop.work/eushop/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // refreshToken 쿠키 저장용
      body: JSON.stringify({ email, password }),
    });

    // 1. accessToken을 응답 헤더에서 꺼내기
    const accessToken = response.headers.get("access-token"); // 헤더 이름은 정확히 확인!

    if (!response.ok) {
      // 실패 응답 처리
      const errorText = await response.text();
      console.error("로그인 실패", errorText);
      throw new Error("응답 실패: " + response.status);
    }

    if (!accessToken) {
      throw new Error("accessToken이 응답 헤더에 없습니다.");
    }

    // 2. accessToken을 localStorage에 저장
    localStorage.setItem("accessToken", accessToken);

    alert("로그인 성공!");
    window.location.href = "main.html";

  } catch (error) {
    alert("로그인 실패: " + error.message);
    console.error("로그인 에러:", error);
  }
}
