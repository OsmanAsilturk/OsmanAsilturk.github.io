document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("projectsGrid");
  if (!grid || !Array.isArray(window.PROJECTS)) return;

  grid.innerHTML = "";

  window.PROJECTS.forEach((project) => {
    const { slug, title, cardTitle, cardSub, cover } = project;
    const a = document.createElement("a");
    a.className = "gallery-item";
    a.href = `proje.html?p=${encodeURIComponent(slug)}`;
    a.setAttribute("aria-label", title || slug);

    const img = document.createElement("img");
    img.src = cover;
    img.alt = title || cardTitle || slug;
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "gallery-overlay";

    const spanTitle = document.createElement("span");
    spanTitle.textContent = cardTitle || title || slug;

    const small = document.createElement("small");
    small.textContent = cardSub || "";

    overlay.appendChild(spanTitle);
    overlay.appendChild(small);

    a.appendChild(img);
    a.appendChild(overlay);

    grid.appendChild(a);
  });
});

