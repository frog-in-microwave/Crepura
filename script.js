async function loadMenu() {
  try {
    const response = await fetch("items.json");
    const items = await response.json();
    const container = document.getElementById("menu-container");
    const navLinks = document.getElementById("nav-links");

    // Extract unique categories
    const categories = [...new Set(items.map((item) => item.category))];

    categories.forEach((cat, index) => {
      const safeID = cat.replace(/\s+/g, "-").toLowerCase();

      // 1. Create Nav Buttons
      const btn = document.createElement("a");
      btn.className = "nav-link" + (index === 0 ? " active" : "");
      btn.href = `#${safeID}`;
      btn.innerText = cat;
      btn.onclick = () => {
        document
          .querySelectorAll(".nav-link")
          .forEach((l) => l.classList.remove("active"));
        btn.classList.add("active");
      };
      navLinks.appendChild(btn);

      // 2. Create Category Sections
      const section = document.createElement("section");
      section.id = safeID;
      section.style.scrollMarginTop = "100px";
      section.innerHTML = `
      <hr style="margin: 10px 0px; border: 1px solid #ff6b81; border-radius: 10%;" />
      <h2 class="category-title">${cat}</h2><div class="grid" id="grid-${safeID}"></div>`;
      container.appendChild(section);

      // 3. Populate Items
      const grid = document.getElementById(`grid-${safeID}`);
      items
        .filter((i) => i.category === cat)
        .forEach((item) => {
          const card = document.createElement("div");
          card.className = "card";

          // Skeleton Container
          const imgCont = document.createElement("div");
          imgCont.className = "card-img-container";
          const img = document.createElement("img");
          img.src = item.image;
          img.onload = () => imgCont.classList.add("loaded");
          img.onerror = () => {
            imgCont.classList.add("loaded");
            img.src = "https://placehold.co/400x400?text=Food";
          };
          imgCont.appendChild(img);

          const info = document.createElement("div");
          info.className = "card-info";
          info.innerHTML = `<div class="card-title">${item.name}</div><div class="card-price">${item.price}</div>`;

          card.appendChild(imgCont);
          card.appendChild(info);
          card.onclick = () => showModal(item);
          grid.appendChild(card);
        });
    });
  } catch (e) {
    console.error("Menu failed to load", e);
  }
}

function showModal(item) {
  const modal = document.getElementById("item-modal");
  document.getElementById("modal-img").src = item.image;
  document.getElementById("modal-title").innerText = item.name;
  document.getElementById("modal-price").innerText = item.price;
  document.getElementById("modal-desc").innerText =
    item.description || "Indulge in our premium CrepUra specialty.";
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

document.querySelector(".close-btn").onclick = closeModal;
window.onclick = (e) => {
  if (e.target.classList.contains("modal")) closeModal();
};

function closeModal() {
  document.getElementById("item-modal").classList.remove("active");
  document.body.style.overflow = "auto";
}

loadMenu();
