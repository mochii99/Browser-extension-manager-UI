document.addEventListener("focusin", function (event) {
  const element = event.target;
  const computedStyle = window.getComputedStyle(element);

  if (computedStyle.cursor === "pointer") {
    const originalBorder = computedStyle.border;
    element.dataset.originalBorder = originalBorder;

    element.focus();
    element.style.border = "2px solid hsl(200, 60%, 99%)";
    element.style.outline = "2px solid hsl(3, 77%, 44%)";
  }
});

document.addEventListener("focusout", function (event) {
  const element = event.target;
  const computedStyle = window.getComputedStyle(element);

  if (computedStyle.cursor === "pointer") {
    element.style.border = element.dataset.originalBorder || "";
    element.style.outline = "none";
  }
});

// جلب البيانات من الجيسون

let exList = document.querySelector(".ex-list");
let liAll = document.querySelector(".li-all");
let liActive = document.querySelector(".li-active");
let liInactive = document.querySelector(".li-inactive");

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

function clearList() {
  exList.innerHTML = "";
}

function displayEx(data, filter = null) {
  clearList();

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

fetch("./data.json")
  .then((result) => result.json())
  .then((result) => {
    displayEx(result);
    liAll.addEventListener("click", () => {
      displayEx(result);
      liAll.classList.add("active");
      liActive.classList.remove("active");
      liInactive.classList.remove("active");
    });
    liActive.addEventListener("click", () => {
      displayEx(result, "active");
      liActive.classList.add("active");
      liAll.classList.remove("active");
      liInactive.classList.remove("active");
    });
    liInactive.addEventListener("click", () => {
      displayEx(result, "inactive");
      liInactive.classList.add("active");
      liAll.classList.remove("active");
      liActive.classList.remove("active");
    });
  })
  .catch((error) => console.error("Error Loading Json", error));
