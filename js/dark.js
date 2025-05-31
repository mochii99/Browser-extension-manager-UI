// تحديد العنصر الي هعمل علية فوكس بشرط يكون عليه خاصية بوينتر
document.addEventListener("focusin", function (event) {
  const element = event.target;
  const computedStyle = window.getComputedStyle(element);

  // الشرط بتاع البوينتر
  if (computedStyle.cursor === "pointer") {
    const originalBorder = computedStyle.border;
    element.dataset.originalBorder = originalBorder;

    // عمل الفوكس باللون دا
    element.focus();
    element.style.border = "2px solid hsl(227, 75%, 14%)";
    element.style.outline = "2px solid hsl(3, 77%, 44%)";
  }
});

// الغاء الفوكس
document.addEventListener("focusout", function (event) {
  const element = event.target;
  const computedStyle = window.getComputedStyle(element);

  // شرط انه يرجع البوردر الاصلي و يلغي الاوت لاين
  if (computedStyle.cursor === "pointer") {
    element.style.border = element.dataset.originalBorder || "";
    element.style.outline = "none";
  }
});

// تحديد العناصر الي على اساسها يظهرلي اهني عناصر
let exList = document.querySelector(".ex-list");
let liAll = document.querySelector(".li-all");
let liActive = document.querySelector(".li-active");
let liInactive = document.querySelector(".li-inactive");

// اهني عنصر هيكون عليه أكتيف
liAll.onclick = () => {
  liAll.id = "active";
  liActive.id = "";
  liInactive.id = "";
};
liActive.onclick = () => {
  liActive.id = "active";
  liAll.id = "";
  liInactive.id = "";
};
liInactive.onclick = () => {
  liInactive.id = "active";
  liAll.id = "";
  liActive.id = "";
};

// مسح البيانات القديمة وقت الضغط على زر قائمة تانيه
function clearList() {
  exList.innerHTML = "";
}

// فلترة العناصر الي المفروض تظهر
function displayEx(data, filter = null) {
  // النال عشان ميرجعش ايرور لما ميلاقيش أكتيف
  // في نفس الوقت هي زي الشرط عشان هحط بدل الفلتر دا الأكتيف والنال أكتيف

  clearList(); // تشغيل الفانكشن الي فاتت

  if (filter === "active") {
    data = data.filter((item) => item.isActive);
  } else if (filter === "inactive") {
    data = data.filter((item) => !item.isActive);
  }
  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "list-lis";
    div.innerHTML = `
    <div class="above-list">
    <img src="${item.logo}" alt="${item.name} logo" class="ex-logo">
    <div class="ex-details">
    <h3>${item.name}</h3>
    <p>${item.description}</p></div>
    </div>
    <div class="bottom-list">
    <button class="remove-btn" title="Remove">remove</button>
    <div class="toggle-parent">
    <button class="slider round ${
      item.isActive == true ? "true" : ""
    }" title='${item.isActive == true ? "Active" : "Inactive"}'>
    <span class="toggle" style="left:${
      item.isActive == true ? "20px;" : "0"
    }" ></span>
    </button></div>
    </div>
    `;
    exList.appendChild(div);
  });
}

// جلب البيانات من الجيسون

fetch("./data.json")
  .then((result) => result.json())
  .then((result) => {
    displayEx(result); // كوول باك الفانكشن الي فاتت في حالة كل العناصر
    liAll.addEventListener("click", () => {
      displayEx(result);
      liAll.classList.add("active");
      liActive.classList.remove("active");
      liInactive.classList.remove("active");
    });
    liActive.addEventListener("click", () => {
      displayEx(result, "active"); // كوول باك الفانكشن الي فاتت في حالة عناصر الأكتيف
      liActive.classList.add("active");
      liAll.classList.remove("active");
      liInactive.classList.remove("active");
    });
    liInactive.addEventListener("click", () => {
      displayEx(result, "inactive"); // كوول باك الفانكشن الي فاتت في حالة العناصر الأن أكتيف
      liInactive.classList.add("active");
      liAll.classList.remove("active");
      liActive.classList.remove("active");
    });
  })
  .catch((error) => console.error("Error Loading Json", error));
