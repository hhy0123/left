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

  // 대표 이미지 미리보기
  const mainInput = document.getElementById("image-input");

  mainInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadBox = document.querySelector(".image-upload-box");
        uploadBox.innerHTML = "";

        const preview = document.createElement("img");
        preview.src = e.target.result;
        preview.style =
          "width:100%; height:100%; object-fit:cover; object-position:center;";

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "×";
        removeBtn.classList.add("remove-image-btn");

        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          uploadBox.innerHTML = `
            <img src="svg_file/plus.svg" alt="사진 첨부 아이콘" id="default1-icon" class="default-icon"/>
            <input type="file" id="image-input" accept="image/*"><br/>
          `;
          document
            .getElementById("image-input")
            .addEventListener("change", arguments.callee);
        });

        uploadBox.appendChild(preview);
        uploadBox.appendChild(removeBtn);
      };
      reader.readAsDataURL(file);
    }
  });

  // 서브 이미지 미리보기
  const subInputs = document.querySelectorAll(".sub-image-input");
  const subUploadBoxes = document.querySelectorAll(".sub-upload-box");

  subInputs.forEach((input, index) => {
    const uploadBox = subUploadBoxes[index];

    input.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadBox.innerHTML = "";

          const preview = document.createElement("img");
          preview.src = e.target.result;
          preview.style =
            "width:100%; height:100%; object-fit:cover; object-position:center;";

          const removeBtn = document.createElement("button");
          removeBtn.textContent = "×";
          removeBtn.classList.add("remove-image-btn");

          removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            uploadBox.innerHTML = `
              <img src="svg_file/plus.svg" class="sub-preview default-sub-icon" alt="추가 이미지 ${
                index + 1
              }" />
              <input type="file" class="sub-image-input" accept="image/*" style="display: none;" />
            `;
            const newInput = uploadBox.querySelector(".sub-image-input");
            newInput.addEventListener("change", arguments.callee);
          });

          uploadBox.appendChild(preview);
          uploadBox.appendChild(removeBtn);
        };
        reader.readAsDataURL(file);
      }
    });

    uploadBox.addEventListener("click", () => {
      const currentInput = uploadBox.querySelector(".sub-image-input") || input;
      currentInput.click();
    });
  });

  // 폼 제출
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData();

    // 텍스트 값 수집
    formData.append("title", document.getElementById("title").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("info", document.getElementById("info").value);
    formData.append("link", document.getElementById("link").value);
    formData.append("formID", "sell");
    formData.append("status", window.getStatusValue());

    toggleGroups.forEach(({ btns, name }) => {
      const selected = Array.from(btns).find((btn) =>
        btn.classList.contains("selected")
      );
      formData.append(name, selected ? selected.textContent.trim() : "");
    });

    const priceCheck = document.querySelector("input[type='checkbox']");
    formData.append("priceSuggest", priceCheck.checked ? "yes" : "no");

    // === 콘솔에 확인 ===
    console.log("✅ [폼 내용]");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // === 로컬스토리지 저장 (key: sell1, sell2...) ===
    let i = 1;
    while (localStorage.getItem(`sell${i}`)) {
      i++;
    }

    const storeData = {};
    for (let [key, value] of formData.entries()) {
      storeData[key] = value;
    }

    localStorage.setItem(`sell${i}`, JSON.stringify(storeData));
    alert(`✅ 폼 데이터가 로컬스토리지에 저장되었습니다 (키: sell${i})`);

    form.reset();
    location.reload();
  });

  // 서버용 fetch 예시 (비활성화)
  /*
  fetch("http://서버주소/upload", {
    method: "POST",
    body: formData
  });
  */
});
