// window.onload = function () {
//   // ✅ 1. Access 토큰을 재발급받는 함수
//   async function reissueAccessToken() {
//     try {
//       const res = await fetch(
//         "https://likelion.lefteushop.work/eushop/reissue",
//         {
//           method: "POST",
//           credentials: "include", // 🔐 refresh 토큰은 HttpOnly 쿠키로 서버에 자동 포함됨
//         }
//       );

//       if (res.status === 200) {
//         const newAccess = res.headers.get("access"); // 📥 응답 헤더에서 새 access 토큰 추출
//         if (newAccess) {
//           localStorage.setItem("access", newAccess); // 💾 새 access 토큰 저장
//           console.log("✅ Access 토큰 재발급 성공:", newAccess);
//         } else {
//           console.warn("⚠️ 응답에 access 토큰이 없음");
//         }
//       } else {
//         console.warn("❌ Access 토큰 재발급 실패:", res.status);
//       }
//     } catch (err) {
//       console.error("❌ 재발급 요청 중 에러 발생:", err);
//     }
//   }

//   // ✅ 2. 로그인 성공 시 access 토큰 저장 (예시)
//   function onLoginSuccess(issuedAccessToken) {
//     localStorage.setItem("access", issuedAccessToken);
//     console.log("🔐 로그인 성공: access 토큰 저장 완료");

//     // ⏱️ 앱 최초 실행 시 또는 로그인 성공 시 재발급 스케줄 등록
//     startAccessTokenAutoRefresh();
//   }

//   // ✅ 3. 토큰 재발급을 주기적으로 실행하는 타이머 등록
//   let tokenRefreshIntervalId = null;

//   function startAccessTokenAutoRefresh() {
//     // 이미 실행 중이면 중복 등록 방지
//     if (tokenRefreshIntervalId !== null) return;

//     // 9분마다 재발급 시도 (Access 토큰이 10분짜리라고 가정)
//     tokenRefreshIntervalId = setInterval(() => {
//       console.log("🔄 Access 토큰 자동 재발급 시도...");
//       reissueAccessToken();
//     }, 540000); // 540,000ms = 9분
//   }

//   // ✅ 4. 보호된 API 호출 시 access 토큰을 헤더에 첨부
//   async function fetchProtectedAPI(url, options = {}) {
//     const access = localStorage.getItem("access");
//     const headers = {
//       ...(options.headers || {}),
//       access, // 🪪 access 토큰을 헤더에 첨부
//     };

//     try {
//       const res = await fetch(url, {
//         ...options,
//         headers,
//         credentials: "include", // 쿠키가 필요한 경우 (예: refresh 토큰)
//       });

//       // ✅ 응답 핸들링
//       if (res.status === 401) {
//         console.warn("⚠️ access 토큰 만료. 재발급 시도 필요.");
//         // 필요 시 바로 재발급 시도 가능
//       }

//       return res;
//     } catch (err) {
//       console.error("❌ API 호출 중 오류 발생:", err);
//       throw err;
//     }
//   }

//   // ✅ 5. 예시: 페이지 로드시 재발급 스케줄 시작 (로그인 상태일 경우)
//   document.addEventListener("DOMContentLoaded", () => {
//     const existingAccess = localStorage.getItem("access");
//     if (existingAccess) {
//       console.log("📌 기존 access 토큰 확인됨. 자동 재발급 스케줄 시작");
//       startAccessTokenAutoRefresh();
//     }
//   });
// };

export async function reissueAccessToken() {
  const response = await fetch(
    "https://likelion.lefteushop.work/eushop/reissue",
    {
      method: "POST",
      credentials: "include", // refreshToken 쿠키 자동 포함
    }
  );

  if (!response.ok) {
    throw new Error("토큰 재발급 실패");
  }

  const newAccessToken = response.headers.get("access");
  if (!newAccessToken) {
    throw new Error("새 accessToken이 없습니다.");
  }
  localStorage.setItem("accessToken", newAccessToken);
  return newAccessToken;
}

export async function fetchWithAuth(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");
  if (!options.headers) options.headers = {};
  options.headers.access = accessToken;
  options.credentials = "include";

  let response = await fetch(url, options);

  if (response.status === 401) {
    try {
      accessToken = await reissueAccessToken();
      options.headers.access = accessToken;
      response = await fetch(url, options);
    } catch (err) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 하거라 허허.");
      window.location.href = "login.html";
      throw err;
    }
  }
  return response;
}
