//이전 페이지 버튼
function backto() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", () => {
  // === 거래 방식, 카테고리 버튼 선택 ===
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

  toggleGroups.forEach(({ btns }) => {
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        btns.forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });
  });

  // === 대표 이미지 업로드 ===
  const mainInput = document.getElementById("image-input");
  const mainPreview = document.getElementById("default1-icon");

  mainInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        mainPreview.src = e.target.result;
        mainPreview.style.objectFit = "cover";
        mainPreview.style.objectPosition = "center";
        mainPreview.style.width = "100%";
        mainPreview.style.height = "100%";
      };
      reader.readAsDataURL(file);
    }
  });

  // === 서브 이미지 업로드 ===
  const subInputs = document.querySelectorAll(".sub-image-input");
  const subUploadBoxes = document.querySelectorAll(".sub-upload-box");

  subInputs.forEach((input, index) => {
    const uploadBox = subUploadBoxes[index];

    input.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadBox.innerHTML = `
            <img 
              src="${e.target.result}" 
              alt="미리보기 이미지" 
              style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
            <input type="file" class="sub-image-input" accept="image/*" style="display: none;" />
          `;
          const newInput = uploadBox.querySelector(".sub-image-input");
          newInput.addEventListener("change", arguments.callee);
        };
        reader.readAsDataURL(file);
      }
    });

    uploadBox.addEventListener("click", () => {
      const currentInput = uploadBox.querySelector(".sub-image-input") || input;
      currentInput.click();
    });
  });

  // === form 제출 ===
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData();

    // 대표 이미지
    const mainImageFile = mainInput.files[0];
    if (mainImageFile) {
      formData.append("mainImage", mainImageFile);
    }

    // 서브 이미지들
    document.querySelectorAll(".sub-image-input").forEach((input, i) => {
      if (input.files[0]) {
        formData.append(`subImage${i + 1}`, input.files[0]);
      }
    });

    // 텍스트 입력값
    formData.append("title", document.getElementById("title").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("info", document.getElementById("info").value);
    formData.append("link", document.getElementById("link").value);

    // 버튼 선택값
    toggleGroups.forEach(({ btns, name }) => {
      const selected = Array.from(btns).find((btn) =>
        btn.classList.contains("selected")
      );
      formData.append(name, selected ? selected.textContent.trim() : "");
    });

    // 체크박스
    const priceCheck = document.querySelector("input[type='checkbox']");
    formData.append("priceSuggest", priceCheck.checked ? "yes" : "no");

    // 콘솔 확인
    for (let [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }
  });
});
