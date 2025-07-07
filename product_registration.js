function backto() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleGroups = [
    { btns: document.querySelectorAll(".return-btn button"), name: "return" },
    {
      btns: document.querySelectorAll(".delivery-btn button"),
      name: "delivery",
    },
    { btns: document.querySelectorAll(".direct-btn button"), name: "direct" },
    {
      btns: document.querySelectorAll(".category-btn button"),
      name: "category",
    },
  ];

  // 버튼 토글
  toggleGroups.forEach(({ btns }) => {
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        btns.forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });
  });

  const imageInput = document.getElementById("imageInput");
  const mainImage = document.getElementById("mainImage");
  const subImages = document.getElementById("subImages");

  let imageURLs = [];

  mainImage.addEventListener("click", () => imageInput.click());

  const accessToken = localStorage.getItem("accessToken");

  imageInput.addEventListener("change", async () => {
    const selected = Array.from(imageInput.files);

    // 예: 이미지 5장 제한 등 체크
    if (selected.length > 5) {
      alert("이미지는 최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    // FormData에 파일 담기
    const formData = new FormData();
    selected.forEach((file) => formData.append("upload", file)); // 'upload'는 서버 요구 필드명

    try {
      const res = await fetch(
        "https://likelion.lefteushop.work/eushop/image/upload",
        {
          method: "POST",
          headers: {
            access: accessToken, // 서버가 요구하는 헤더명 (예: Authorization이 아닐 수도 있음)
            // Content-Type은 FormData 사용 시 직접 지정하지 않음!
          },
          body: formData,
          credentials: "include", // 필요시
        }
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        alert("이미지 업로드 실패: " + (errorBody.message || res.status));
        throw new Error(`HTTP ${res.status} - ${errorBody.code}`);
      }

      // 서버 응답 파싱
      imageURLs = result.imgUrls || [];
      window.introImgUrl = result.introImgUrl || null;

      // 미리보기 등 활용 예시
      if (introImgUrl) {
        document.getElementById("mainImage").src = introImgUrl;
      }
      // imgUrls 배열을 썸네일 등으로 활용
      updatePreview(imgUrls);

      alert("✅ 이미지 업로드 성공");
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 실패: " + err.message);
    }
  });

  // 이미지 삭제 함수 (서버로 DELETE 요청)
  async function deleteImageFromServer(url) {
    try {
      const res = await fetch("/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) return true;
      else throw new Error("삭제 실패");
    } catch (err) {
      console.error("서버 이미지 삭제 실패:", err);
      alert("이미지 삭제 실패");
      return false;
    }
  }

  function updatePreview() {
    mainImage.innerHTML = "";
    if (imageURLs.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";

      const img = document.createElement("img");
      img.src = imageURLs[0];
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.innerText = "X";
      removeBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const confirmed = await deleteImageFromServer(imageURLs[0]);
        if (confirmed) {
          imageURLs.splice(0, 1);
          updatePreview();
        }
      });

      wrapper.appendChild(img);
      wrapper.appendChild(removeBtn);
      mainImage.appendChild(wrapper);
    } else {
      mainImage.innerHTML = "+";
    }

    subImages.innerHTML = "";
    for (let i = 1; i < imageURLs.length; i++) {
      const wrapper = document.createElement("div");
      wrapper.className = "sub-image";
      wrapper.style.position = "relative";

      const img = document.createElement("img");
      img.src = imageURLs[i];
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.innerText = "X";
      removeBtn.addEventListener("click", async () => {
        const confirmed = await deleteImageFromServer(imageURLs[i]);
        if (confirmed) {
          imageURLs.splice(i, 1);
          updatePreview();
        }
      });

      wrapper.appendChild(img);
      wrapper.appendChild(removeBtn);
      subImages.appendChild(wrapper);
    }

    const remain = 5 - imageURLs.length;
    for (let i = 0; i < remain; i++) {
      const box = document.createElement("div");
      box.className = "sub-image";
      box.textContent = "+";
      box.style.display = "flex";
      box.style.alignItems = "center";
      box.style.justifyContent = "center";
      box.style.fontSize = "24px";
      box.style.cursor = "pointer";
      box.addEventListener("click", () => imageInput.click());
      subImages.appendChild(box);
    }
  }

  // 폼 제출
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // 폼 요소 값 불러오기
    const title = document.querySelector("#title").value;
    const info = document.querySelector("#info").value;
    const price = Number(document.querySelector("#price").value);
    const postType = document.querySelector("#buy-sell-select").value;
    const contactLink = document.querySelector("#link").value;
    const selectedCategory =
      document.querySelector(".category.selected")?.value || null;
    const isReturnable =
      document.querySelector(".return.selected")?.value === "true";
    const isDelivery =
      document.querySelector(".delivery.selected")?.value === "true";
    const isDirectTrade =
      document.querySelector(".direct.selected")?.value === "true";

    const postData = {
      title: title,
      content: info,
      price: price,
      category: selectedCategory,
      postType: postType,
      isReturnable: isReturnable,
      isDelivery: isDelivery,
      isDirectTrade: isDirectTrade,
      contactLink: contactLink,
      introImgUrl: window.introImgUrl || imageURLs[0] || null,
      imgUrls: imageURLs,
    };

    // 게시글 등록 요청
    fetch("https://likelion.lefteushop.work/eushop/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: accessToken, // 서버 요구 헤더명
      },
      body: JSON.stringify(postData),
      credentials: "include",
    })
      .then(async (res) => {
        // 응답의 Content-Type 확인
        const contentType = res.headers.get("Content-Type");
        let responseBody;

        if (contentType && contentType.includes("application/json")) {
          // ✅ JSON이면 json으로 파싱
          responseBody = await res.json();
        } else {
          // ❗ 텍스트(HTML 또는 일반 문자열)면 text로 파싱
          responseBody = await res.text();
        }

        if (!res.ok) {
          switch (res.status) {
            case 401:
              alert("⚠️ 접근 권한이 없습니다. 로그인 후 다시 시도하세요.");
              break;
            case 404:
              if (responseBody.code === "User not found") {
                alert("❌ 유저를 찾을 수 없습니다.");
              } else if (responseBody.code === "review not found") {
                alert("❌ 리뷰를 찾을 수 없습니다.");
              } else {
                alert("❌ 요청한 자원을 찾을 수 없습니다.");
              }
              break;
            case 500:
              alert("💥 서버 오류: DB 수정 실패");
              break;
            default:
              alert("⚠️ 알 수 없는 오류 발생");
          }
          throw new Error(`서버 응답 실패: ${res.status}`);
        }

        alert("✅ 게시글이 성공적으로 등록되었습니다!");
        window.location.href = "main.html";
      })
      .catch((err) => {
        alert("전송 실패: " + err.message);
        console.error("전송 실패:", err);
      });
  });
});
