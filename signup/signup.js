    function checkEmail() {
    const email = document.getElementById("email").value.trim();
    const errorText = document.getElementById("email-error");
    const checkBtn = document.getElementById("check-btn");

    // g.eulji.ac.kr 도메인 검사
    if (!email.endsWith("@g.eulji.ac.kr")) {
        errorText.textContent = "잘못된 이메일 형식입니다.";
        checkBtn.textContent = "중복확인";
        checkBtn.style.color = "#303030";
        return;
    }

    errorText.textContent = ""; // 이메일 형식이 올바르면 에러문구 삭제

    // 예제: 이미 사용 중인 이메일 목록으로 중복체크
    const usedEmails = [
        "aaa1111@g.eulji.ac.kr",
        "test123@g.eulji.ac.kr",
        "hello@g.eulji.ac.kr"
    ];

    if (usedEmails.includes(email)) {
        checkBtn.textContent = "사용불가";
        checkBtn.style.color = "red";
    } else {
        checkBtn.textContent = "사용가능";
        checkBtn.style.color = "green";
    }
    }

    function checkPasswords() {
    const pw1 = document.getElementById("password").value;
    const pw2 = document.getElementById("password2");
    if (pw1 !== pw2.value || !pw1) {
        pw2.classList.add("error");
    } else {
        pw2.classList.remove("error");
    }
    }
