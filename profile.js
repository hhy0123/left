// 페이지 로딩 시 사용자 정보 불러오기
document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    alert("로그인이 필요합니다.");
    location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("https://likelion.lefteushop.work/eushop/profile", {
      method: "GET",
      headers: {
        access: accessToken,
      },
      credentials: "include", // refresh token 쿠키 자동 포함
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        location.href = "login.html";
        return;
      }
      throw new Error("사용자 정보 불러오기 실패");
    }

    const data = await response.json();

    // 사용자 정보 반영
    document.querySelector(".username").textContent = data.nickname;
    document.querySelector(".department").textContent = data.department;
    document.querySelector(".email").textContent = data.email;

    // 수정 모달에도 정보 채워넣기
    document.getElementById("nickname").value = data.nickname;
    document.getElementById("department").value = data.department;
  } catch (error) {
    console.error("프로필 정보 불러오기 에러:", error);
    alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
  }
});

// 모달 열기
function openModal() {
  document.getElementById("editModal").style.display = "flex";
}

// 모달 닫기
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// 정보 수정 요청
async function submitEdit() {
  const nickname = document.getElementById("nickname").value.trim();
  const department = document.getElementById("department").value;

  if (!nickname && !department) {
    document.getElementById("editError").style.display = "block";
    return;
  } else {
    document.getElementById("editError").style.display = "none";
  }

  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      window.location.href = "login.html";
      return;
    }

    const response = await fetch("https://likelion.lefteushop.work/eushop/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        access: accessToken,
      },
      body: JSON.stringify({ nickname, department }),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("권한이 없습니다. 다시 로그인 해주세요.");
        window.location.href = "login.html";
        return;
      }
      const errorData = await response.json();
      alert("정보 수정 실패: " + (errorData.message || response.statusText));
      return;
    }

    const data = await response.json();

    alert(data.message || "정보가 수정되었습니다!");
    closeModal();

    // 수정된 정보 화면에 반영
    document.querySelector(".username").textContent = data.nickname;
    document.querySelector(".department").textContent = data.department;
  } catch (error) {
    console.error("정보 수정 에러:", error);
    alert("서버와 통신 중 오류가 발생했습니다.");
  }
}

// 로그아웃
function logout() {
  localStorage.removeItem("accessToken");

  fetch("https://likelion.lefteushop.work/eushop/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => {
      if (res.ok) {
        alert("로그아웃 완료되었습니다.");
        window.location.href = "login.html";
      } else {
        alert("로그아웃 실패: 서버 응답 에러");
      }
    })
    .catch((err) => {
      console.error("로그아웃 에러:", err);
      alert("로그아웃 중 오류 발생");
    });
}
