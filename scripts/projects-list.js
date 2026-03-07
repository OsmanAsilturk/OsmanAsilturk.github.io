const STORAGE_KEY = "asilturk_lang";

function getLang() {
  try {
    const stored = (localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
    if (stored === "tr" || stored === "en") return stored;
  } catch {
    // ignore
  }
  const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
  if (htmlLang === "tr" || htmlLang === "en") return htmlLang;
  return "tr";
}

function renderProjects(lang) {
  const grid = document.getElementById("projectsGrid");
  if (!grid || !Array.isArray(window.PROJECTS)) return;

  const safeLang = lang === "en" ? "en" : "tr";

  grid.innerHTML = "";

  window.PROJECTS.forEach((project) => {
    const a = document.createElement("a");
    a.className = "gallery-item";
    a.href = `proje.html?p=${encodeURIComponent(project.slug)}`;

    const titleText = project.title?.[safeLang] || project.title?.tr || project.slug;
    const subText = project.sub?.[safeLang] || project.sub?.tr || "";

    a.setAttribute("aria-label", titleText);

    const img = document.createElement("img");
    img.src = project.cover;
    img.alt = titleText;
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "gallery-overlay";

    const spanTitle = document.createElement("span");
    spanTitle.textContent = titleText;

    const small = document.createElement("small");
    small.textContent = subText;

    overlay.appendChild(spanTitle);
    overlay.appendChild(small);

    a.appendChild(img);
    a.appendChild(overlay);

    grid.appendChild(a);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects(getLang());
});

window.addEventListener("site:lang-changed", (e) => {
  const lang = e?.detail?.lang || getLang();
  renderProjects(lang);
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".lang-btn")) {
    setTimeout(() => {
      renderProjects(getLang());
    }, 0);
  }
});

