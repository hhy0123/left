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
  const accessToken = localStorage.getItem("accessToken");

  let imageURLs = [];

  mainImage.addEventListener("click", () => imageInput.click());

  imageInput.addEventListener("change", async () => {
    const selected = Array.from(imageInput.files);

    if (imageURLs.length + selected.length > 5) {
      alert("이미지는 최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    const formData = new FormData();
    selected.forEach((file) => formData.append("upload", file)); // ← 여기!

    try {
      const res = await fetch(
        "https://leftlion.netlify.app//eushop/image/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: access,
            body: JSON.stringify(formData),
            credentials: "include",
          },
        }
      );

      if (!res.ok) {
        let errorBody = {};
        try {
          errorBody = await res.json();
        } catch {}
        if (res.status === 404 && errorBody.code === "User not found") {
          alert("유저를 찾을 수 없음");
        } else if (
          res.status === 404 &&
          errorBody.code === "review not found"
        ) {
          alert("리뷰를 찾을 수 없음");
        } else if (res.status === 401 && errorBody.code === "unauthorized") {
          alert("리소스에 대한 액세스 권한이 없음");
        } else if (res.status === 500 && errorBody.code === "DB error") {
          alert("DB 수정 실패");
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
        throw new Error(`HTTP ${res.status} - ${errorBody.code}`);
      }

      const result = await res.json(); // { urls: [...] }
      const newURLs = result.urls || [];

      imageURLs = imageURLs.concat(newURLs).slice(0, 5);
      updatePreview();
      alert("✅ [200 OK] 이미지 업로드 성공");
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 실패");
    }
  });

  // ✅ 이미지 삭제 함수 (서버로 DELETE 요청)
  async function deleteImageFromServer(url) {
    try {
      const res = await fetch("/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

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
    // 1. 단순한 input 값들
    const title = document.querySelector("#title").value;
    const info = document.querySelector("#info").value;
    const price = Number(document.querySelector("#price").value);
    const postType = document.querySelector("#buy-sell-select").value;
    const contactLink = document.querySelector("#link").value;

    // 2. category: 선택된 버튼 (class="category selected"로 가정)
    const selectedCategory =
      document.querySelector(".category.selected")?.value || null;

    // 3. 거래 방식 (class에 selected가 붙은 버튼 값 가져오기)
    const returnable =
      document.querySelector(".return.selected")?.value === "true";
    const delivery =
      document.querySelector(".delivery.selected")?.value === "true";
    const directTrade =
      document.querySelector(".direct.selected")?.value === "true";

    // 4. 이미지 URL 추가
    postData.introImgUrl = imageURLs[0] || null; // 대표 이미지 (없으면 null)
    postData.imgUrls = imageURLs; // 전체 이미지 배열

    const postData = {
      title: title,
      content: info,
      price: price,
      category: selectedCategory,
      postType: postType,
      returnable: returnable,
      delivery: delivery,
      directTrade: directTrade,
      contactLink: contactLink,
      // ✅ 이미지 추가
      introImgUrl: imageURLs[0] || null,
      imgUrls: imageURLs,
    };

    // 5. 콘솔 출력
    console.log(JSON.stringify(postData, null, 2));

    // 6. fetch로 서버 전송
    fetch("/eushop/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then(async (res) => {
        const responseBody = await res.json();

        if (!res.ok) {
          // HTTP 상태에 따라 에러 메시지 커스터마이징
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

        // 성공 처리
        alert("✅ 게시글이 성공적으로 등록되었습니다!");
        console.log("서버 응답:", responseBody);

        form.reset();
        location.reload();
      })
      .catch((err) => {
        console.error("전송 실패:", err);
      });
  });
});
