const MAX_TRY = 60;
const MAX_CONSECUTIVE_MISSES = 6;

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
    img.alt = `${project.title} fotoğraf ${num}`;
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

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("p");

  const project = getProjectBySlug(slug) || (Array.isArray(window.PROJECTS) ? window.PROJECTS[0] : null);
  if (!project) return;

  const titleEl = document.getElementById("pTitle");
  const metaEl = document.getElementById("pMeta");
  const descEl = document.getElementById("pDesc");
  const tagsEl = document.getElementById("pTags");

  if (titleEl) titleEl.textContent = project.title;
  if (metaEl) metaEl.textContent = `${project.location} • ${project.year}`;
  if (descEl) descEl.textContent = project.description;

  if (tagsEl) {
    tagsEl.innerHTML = "";
    if (Array.isArray(project.tags)) {
      project.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag-pill";
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }
  }

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
});

