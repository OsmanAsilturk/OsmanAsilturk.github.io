const MAX_TRY = 60;
const MAX_CONSECUTIVE_MISSES = 6;
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

function getProjectBySlug(slug) {
  if (!Array.isArray(window.PROJECTS)) return null;
  return window.PROJECTS.find((p) => p.slug === slug) || null;
}

function openImageModal(src, alt) {
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("imgModalContent");
  if (!modal || !img) return;

  img.src = src;
  img.alt = alt || "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeImageModal() {
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("imgModalContent");
  if (!modal || !img) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  img.src = "";
}

async function buildGallery(project) {
  const gallery = document.getElementById("pGallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  const paddedCover = String(project.coverIndex || 0).padStart(2, "0");
  let consecutiveMisses = 0;

  for (let i = 1; i <= MAX_TRY; i += 1) {
    const num = String(i).padStart(2, "0");
    if (num === paddedCover) continue;

    const src = `images/projects/${project.slug}/${num}.webp`;
    const img = document.createElement("img");
    img.className = "gallery-img";
    img.src = src;
    img.alt = `${project.title?.tr || project.slug} fotoğraf ${num}`;
    img.loading = "lazy";

    const wrapper = document.createElement("button");
    wrapper.type = "button";
    wrapper.className = "gallery-img-wrapper";
    wrapper.appendChild(img);

    gallery.appendChild(wrapper);

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      img.onload = () => {
        consecutiveMisses = 0;
        wrapper.addEventListener("click", () => openImageModal(src, img.alt));
        resolve();
      };
      img.onerror = () => {
        consecutiveMisses += 1;
        wrapper.remove();
        resolve();
      };
    });

    if (consecutiveMisses >= MAX_CONSECUTIVE_MISSES) {
      break;
    }
  }
}

function renderDetail(project, lang) {
  const safeLang = lang === "en" ? "en" : "tr";

  const titleEl = document.getElementById("pTitle");
  const metaEl = document.getElementById("pMeta");
  const descEl = document.getElementById("pDesc");
  const tagsEl = document.getElementById("pTags");

  const titleText = project.title?.[safeLang] || project.title?.tr || project.slug;
  const locationText = project.location?.[safeLang] || project.location?.tr || "";
  const descText = project.description?.[safeLang] || project.description?.tr || "";
  const tags = project.tags?.[safeLang] || project.tags?.tr || [];

  if (titleEl) titleEl.textContent = titleText;
  if (metaEl) metaEl.textContent = `${locationText} • ${project.year}`;
  if (descEl) descEl.textContent = descText;

  if (tagsEl) {
    tagsEl.innerHTML = "";
    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag-pill";
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("p");

  const project = getProjectBySlug(slug) || (Array.isArray(window.PROJECTS) ? window.PROJECTS[0] : null);
  if (!project) return;

  const initialLang = getLang();
  renderDetail(project, initialLang);
  buildGallery(project);

  // Modal interactions
  const modal = document.getElementById("imgModal");
  const closeBtn = document.getElementById("imgClose");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeImageModal();
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeImageModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeImageModal();
    }
  });

  window.addEventListener("site:lang-changed", (e) => {
    const lang = e?.detail?.lang || getLang();
    renderDetail(project, lang);
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".lang-btn")) {
      setTimeout(() => {
        renderDetail(project, getLang());
      }, 0);
    }
  });
});

