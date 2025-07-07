function checkEmail() {
    const email = document.getElementById("email").value.trim();
    const errorText = document.getElementById("email-error");
    const checkBtn = document.getElementById("check-btn");

    if (!email.endsWith("@g.eulji.ac.kr")) {
        errorText.textContent = "잘못된 이메일 형식입니다.";
        checkBtn.textContent = "중복확인";
        checkBtn.style.color = "#303030";
        return false;
    }

    errorText.textContent = "";

    // 예시 하드코딩 중복체크(실제론 API로 확인해야 함)
    const usedEmails = [
        "aaa1111@g.eulji.ac.kr",
        "test123@g.eulji.ac.kr",
        "hello@g.eulji.ac.kr"
    ];

    if (usedEmails.includes(email)) {
        checkBtn.textContent = "사용불가";
        checkBtn.style.color = "red";
        return false;
    } else {
        checkBtn.textContent = "사용가능";
        checkBtn.style.color = "green";
        return true;
    }
}

function checkPasswords() {
    const pw1 = document.getElementById("password").value;
    const pw2 = document.getElementById("password2").value;

    if (pw1 !== pw2 || !pw1) {
        alert("비밀번호가 일치하지 않거나 비밀번호를 입력하지 않았습니다.");
        return false;
    }

    return true;
}

// 회원가입 요청 보내는 함수 (fetch API 사용)
async function signup() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const nickname = document.getElementById("nickname").value.trim();
    const department = document.getElementById("department").value;
    const role = "USER";  // 고정

    // 이메일 및 비밀번호 유효성 체크
    if (!checkEmail()) {
        alert("유효한 이메일을 입력하고 중복확인을 해주세요.");
        return;
    }
    if (!checkPasswords()) {
        return;
    }
    if (!nickname) {
        alert("닉네임을 입력해주세요.");
        return;
    }
    if (!department) {
        alert("학과를 선택해주세요.");
        return;
    }

    try {
        const response = await fetch("https://example.com/eushop/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                nickname,
                department,
                role
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`회원가입 실패: ${errorData.message || response.statusText}`);
            return;
        }

        const data = await response.json();

        alert(data.message || "회원가입 성공!");
        window.location.href = "../login/login.html";

    } catch (error) {
        alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        console.error(error);
    }
}
