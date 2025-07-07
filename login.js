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
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error("로그인 실패", rawText);
      throw new Error("응답 실패: " + response.status);
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("JSON 파싱 실패: ", rawText);
      throw new Error("서버 응답이 올바른 JSON이 아닙니다.");
    }

    const accessToken = data.accessToken || data.token;
    if (!accessToken) {
      throw new Error("accessToken이 응답에 없습니다.");
    }

    localStorage.setItem("accessToken", accessToken);

    alert("로그인 성공!");
    window.location.href = "main.html";
  } catch (error) {
    alert("로그인 실패: " + error.message);
    console.error("로그인 에러:", error);
  }
}
