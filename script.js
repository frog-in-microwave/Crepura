document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("menu-container");
  const navLinks = document.getElementById("nav-links");
  const modal = document.getElementById("item-modal");
  const closeBtn = document.querySelector(".close-btn");

  fetch("items.json")
    .then((res) => res.json())
    .then((data) => renderMenu(data))
    .catch((err) => console.error("Error loading menu:", err));

  function renderMenu(items) {
    const categories = {};

    items.forEach((item) => {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });

    for (const [catName, catItems] of Object.entries(categories)) {
      const safeID = catName.replace(/\s+/g, "-").toLowerCase();

      // 1. Create Nav Link
      const link = document.createElement("a");
      link.className = "nav-link";
      link.href = `#${safeID}`;
      link.textContent = catName;

      link.addEventListener("click", (e) => {
        document
          .querySelectorAll(".nav-link")
          .forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });

      navLinks.appendChild(link);

      // 2. Create Section
      const section = document.createElement("section");
      section.className = "category-section";
      section.id = safeID;

      const title = document.createElement("h2");
      title.className = "category-title";
      title.textContent = catName;
      section.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "grid";

      catItems.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
                    <div class="card-img-container"><img src="${item.image}" alt="${item.name}"></div>
                    <div class="card-info">
                        <h3 class="card-title">${item.name}</h3>
                        <p class="card-price">${item.price}</p>
                    </div>
                `;
        card.onclick = () => openModal(item);
        grid.appendChild(card);
      });
      section.appendChild(grid);
      container.appendChild(section);
    }
  }

  function openModal(item) {
    document.getElementById("modal-img").src = item.image;
    document.getElementById("modal-title").textContent = item.name;
    document.getElementById("modal-price").textContent = item.price;
    document.getElementById("modal-desc").textContent =
      item.description || "Indulge in our signature CrepUra treats.";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeBtn.onclick = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  window.onclick = (e) => {
    if (e.target == modal) closeBtn.onclick();
  };
});
