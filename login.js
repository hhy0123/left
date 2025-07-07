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

    // authorization 헤더에서 토큰 추출
    let accessToken = response.headers.get("authorization");
    if (accessToken && accessToken.startsWith("Bearer ")) {
      accessToken = accessToken.slice(7); // "Bearer " 제거
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("응답 실패: " + response.status + "\n" + errorText);
    }

    if (!accessToken) {
      throw new Error("authorization 헤더에 accessToken이 없습니다.");
    }

    localStorage.setItem("accessToken", accessToken);

    alert("로그인 성공!");
    window.location.href = "main.html";

  } catch (error) {
    alert("로그인 실패: " + error.message);
    console.error("로그인 에러:", error);
  }
}
