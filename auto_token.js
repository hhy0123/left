// 1. access 토큰 재발급 함수
async function reissueAccessToken() {
  try {
    const res = await fetch("https://your-server-domain/eushop/reissue", {
      method: "POST",
      credentials: "include", // refresh 토큰 쿠키 포함
    });

    if (res.status === 200) {
      const newAccess = res.headers.get("access");
      if (newAccess) {
        localStorage.setItem("access", newAccess);
        console.log("✅ Access 토큰 재발급 성공:", newAccess);
      }
    } else {
      console.warn("❌ Access 재발급 실패", res.status);
    }
  } catch (err) {
    console.error("❌ 재발급 요청 중 에러 발생", err);
  }
}

// 10분(600,000ms) 마다 토큰 재발급 시도
setInterval(() => {
  reissueAccessToken();
}, 600000);

// 로그인 후 토큰 저장 시점 (예시)
localStorage.setItem("access", 받은토큰);

// 앱 초기 실행 시 자동 재발급 스케줄 등록
setInterval(reissueAccessToken, 540000); // 9분 주기로 자동 재발급

// 이후 API 호출할 때
fetch("/some/protected/api", {
  method: "GET",
  headers: {
    access: localStorage.getItem("access"),
  },
  credentials: "include",
});
