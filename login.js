// 로그인 함수 (1번)
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }

  try {
    const response = await fetch("https://example.com/eushop/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // refreshToken 쿠키 저장을 위해 꼭 필요
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("응답 실패: " + response.status);
    }

    const data = await response.json();

    // 백엔드에서 accessToken 키명 확인 필요
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

// 로그아웃 함수 (2번)
function logout() {
  // accessToken 삭제
  localStorage.removeItem("accessToken");

  // refreshToken 쿠키 삭제 (httpOnly 쿠키라 JS로 직접 삭제 불가능하니, 로그아웃 API 호출)
  fetch("https://example.com/eushop/logout", {
    method: "POST",
    credentials: "include",
  }).finally(() => {
    // 강제로 쿠키 삭제가 안된다면 백엔드가 쿠키 만료 처리하도록 로그아웃 API 구현 필요
    alert("로그아웃 되었습니다.");
    window.location.href = "login.html";
  });
}

// accessToken 붙여서 API 요청하는 함수 (3번)
async function fetchWithAccessToken(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  // 헤더 없으면 만들고, 있으면 복사
  const headers = new Headers(options.headers || {});
  if (accessToken) {
    // Bearer 접두사 없이 그대로 accessToken만 사용 (요구사항)
    headers.set("Authorization", accessToken);
  }
  options.headers = headers;
  options.credentials = "include"; // 쿠키 필요시 포함

  let response = await fetch(url, options);

  if (response.status === 401) {
    // accessToken 만료 예상 → refreshToken으로 재발급 시도 (4번)
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      // 재발급 성공 → 재요청
      headers.set("Authorization", newAccessToken);
      options.headers = headers;
      response = await fetch(url, options);
    } else {
      // 재발급 실패 → 로그아웃 처리
      logout();
      throw new Error("로그인이 만료되어 다시 로그인해야 합니다.");
    }
  }

  return response;
}

// refreshToken으로 accessToken 재발급 함수 (4번)
async function refreshAccessToken() {
  try {
    const response = await fetch("https://example.com/eushop/token/refresh", {
      method: "POST",
      credentials: "include", // refreshToken 쿠키 포함해서 보내야 함
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.accessToken || data.token;
    if (!newAccessToken) {
      return null;
    }

    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (e) {
    console.error("토큰 재발급 실패:", e);
    return null;
  }
}
