function backto() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", () => {
  const contactBtn = document.getElementById("contact-btn");
  const contactModal = document.querySelector(".contact-window-div");
  const closeBtn = document.querySelector(".window-close-span");

  contactBtn.addEventListener("click", () => {
    contactModal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    contactModal.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const postId = new URLSearchParams(window.location.search).get("id");

  if (!postId) {
    alert("❗ [400] 잘못된 접근입니다. 상품 ID가 없습니다.");
    return;
  }

  try {
    const response = await fetch(`/eushop/content/${post_id}`);
    const data = await response.json();

    // 에러 응답 처리
    if (!response.ok) {
      let message = "";

      switch (data.code) {
        case "User not found":
          message = "❌ [404] 유저를 찾을 수 없습니다.";
          break;
        case "review not found":
          message = "❌ [404] 리뷰를 찾을 수 없습니다.";
          break;
        case "unauthorized":
          message = "⚠️ [401] 리소스에 대한 액세스 권한이 없습니다.";
          break;
        case "DB error":
          message = "⚠️ [500] DB 수정에 실패했습니다.";
          break;
        default:
          message = `❗ [${response.status}] 알 수 없는 오류가 발생했습니다.`;
      }

      alert(message);
      return;
    }

    // ✅ 성공 응답 처리

    // 1. 텍스트 정보 삽입
    document.getElementById("name-p").textContent = data.nick_name;
    document.getElementById("title-p").textContent = data.title;
    document.getElementById(
      "price-p"
    ).textContent = `${data.price.toLocaleString()}원`;
    document.querySelector(".detail-content-p").textContent = data.content;

    // 2. 거래 조건 표시
    document.getElementById("return-c-p").textContent = data.returnable
      ? "가능"
      : "불가능";
    document.getElementById("delivery-c-p").textContent = data.delivery
      ? "가능"
      : "불가능";
    document.getElementById("direct-c-p").textContent = data.direct_trade
      ? "가능"
      : "불가능";

    // 3. 이미지 처리
    const imageDiv = document.querySelector(".image-div");
    imageDiv.innerHTML = ""; // 기존 이미지 제거

    // (1) 대표 이미지
    const mainImg = document.createElement("img");
    mainImg.src = data.intro_img_url;
    mainImg.alt = "대표 이미지";
    mainImg.classList.add("detail-image"); // 스타일 필요 시 CSS에 정의
    imageDiv.appendChild(mainImg);

    // (2) 서브 이미지
    const subImages = data.img_urls.filter((url) => url !== data.intro_img_url);
    subImages.forEach((url) => {
      const subImgContainer = document.createElement("div");
      subImgContainer.classList.add("sub-image-box"); // 스타일 필요 시 CSS에 정의

      const img = document.createElement("img");
      img.src = url;
      img.alt = "서브 이미지";
      img.classList.add("sub-image");

      subImgContainer.appendChild(img);
      imageDiv.appendChild(subImgContainer);
    });

    // 4. 연락하기 버튼 동작
    const contactBtn = document.querySelector(".real-contact-btn");
    contactBtn.addEventListener("click", () => {
      window.open(data.contact_link, "_blank");
    });
  } catch (err) {
    console.error("네트워크 오류:", err);
    alert("❗ [NETWORK] 네트워크 오류가 발생했습니다.");
  }
});
