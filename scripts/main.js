(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

  // ---------------------------
  // Utilities
  // ---------------------------
  const STORAGE_KEY = "asilturk_lang";
  const SUPPORTED = new Set(["tr", "en"]);

  const t = (lang, key) => {
    const fromLang = I18N?.[lang]?.[key];
    if (fromLang !== undefined && fromLang !== null) return fromLang;
    const fallback = I18N?.tr?.[key];
    if (fallback !== undefined && fallback !== null) return fallback;
    return null;
  };

  const setActiveLangButtons = (lang) => {
    $$(".lang-btn").forEach((btn) => {
      const isActive = (btn.getAttribute("data-lang") || "").toLowerCase() === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  };

  const applyTranslations = (lang) => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);

    // textContent
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = t(lang, key);
      if (value === null) return;
      el.textContent = String(value);
    });

    // innerHTML
    $$("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      const value = t(lang, key);
      if (value === null) return;
      el.innerHTML = String(value);
    });

    // placeholder
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const value = t(lang, key);
      if (value === null) return;
      el.setAttribute("placeholder", String(value));
    });

    // aria-label
    $$("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      const value = t(lang, key);
      if (value === null) return;
      el.setAttribute("aria-label", String(value));
    });

    // alt
    $$("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (!key) return;
      const value = t(lang, key);
      if (value === null) return;
      el.setAttribute("alt", String(value));
    });

    // title
    $$("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      const value = t(lang, key);
      if (value === null) return;
      el.setAttribute("title", String(value));
    });

    // meta content (e.g., description)
    $$("[data-i18n-content]").forEach((el) => {
      const key = el.getAttribute("data-i18n-content");
      if (!key) return;
      const value = t(lang, key);
      if (value === null) return;
      el.setAttribute("content", String(value));
    });

    setActiveLangButtons(lang);
  };

  const setLang = (lang) => {
    const safeLang = SUPPORTED.has(lang) ? lang : "tr";
    try {
      localStorage.setItem(STORAGE_KEY, safeLang);
    } catch {
      // ignore
    }
    applyTranslations(safeLang);
  };

  const getInitialLang = () => {
    try {
      const stored = (localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
      if (SUPPORTED.has(stored)) return stored;
    } catch {
      // ignore
    }
    const nav = (navigator.language || "tr").toLowerCase();
    if (nav.startsWith("en")) return "en";
    return "tr";
  };

  // ---------------------------
  // Capture TR defaults from DOM
  // ---------------------------
  const TR = {};

  const capture = (key, value) => {
    if (!key) return;
    if (TR[key] !== undefined) return;
    TR[key] = value;
  };

  // Capture at load time (TR text is the default in HTML)
  $$("[data-i18n]").forEach((el) => capture(el.getAttribute("data-i18n"), (el.textContent || "").trim()));
  $$("[data-i18n-html]").forEach((el) => capture(el.getAttribute("data-i18n-html"), (el.innerHTML || "").trim()));
  $$("[data-i18n-placeholder]").forEach((el) => capture(el.getAttribute("data-i18n-placeholder"), el.getAttribute("placeholder") || ""));
  $$("[data-i18n-aria]").forEach((el) => capture(el.getAttribute("data-i18n-aria"), el.getAttribute("aria-label") || ""));
  $$("[data-i18n-alt]").forEach((el) => capture(el.getAttribute("data-i18n-alt"), el.getAttribute("alt") || ""));
  $$("[data-i18n-title]").forEach((el) => capture(el.getAttribute("data-i18n-title"), el.getAttribute("title") || ""));
  $$("[data-i18n-content]").forEach((el) => capture(el.getAttribute("data-i18n-content"), el.getAttribute("content") || ""));

  // ---------------------------
  // EN dictionary (fallback is TR)
  // ---------------------------
  const EN = {
    "meta.title": "Asiltürk Furniture | Interior Design & Custom Furniture",
    "meta.description": "Asiltürk Furniture: interior design, custom-made furniture and turnkey projects. Minimal modern design, quality craftsmanship, made-to-measure production.",
    "meta.titleCollection": "Asiltürk Furniture | Collection",
    "meta.descriptionCollection": "Asiltürk Furniture collection: made-to-measure furniture, L-shaped sofas, seating groups and interior design packages. Minimalist modern design.",
    "meta.titleProjects": "Asiltürk Furniture | Projects",
    "meta.descriptionProjects": "Asiltürk Furniture projects: made-to-measure furniture and interior design projects. Modern living rooms, minimal seating and turnkey solutions.",
    "meta.titleBlog": "Asiltürk Furniture | Blog",
    "meta.descriptionBlog": "Asiltürk Furniture blog: decoration tips, furniture selection guides and information about made-to-measure production process.",

    "brand.sub": "Furniture & Interior",

    "a11y.skip": "Skip to content",
    "a11y.brandHome": "Asiltürk Furniture home",
    "a11y.mainNav": "Main navigation",
    "a11y.languageSwitch": "Language selector",
    "a11y.search": "Search",
    "a11y.searchDialog": "Search dialog",
    "a11y.close": "Close",
    "a11y.getQuote": "Get a quote",
    "a11y.menuToggle": "Open/close menu",
    "a11y.menuClose": "Close menu",
    "a11y.highlights": "Highlights",
    "a11y.scrollDown": "Scroll down",
    "a11y.approach": "Service approach",
    "a11y.fiveStars": "5 stars",
    "a11y.whatsapp": "Chat on WhatsApp",

    "nav.home": "Home",
    "nav.about": "About",
    "nav.collection": "Collection",
    "nav.projects": "Projects",
    "nav.reviews": "Reviews",
    "nav.contact": "Contact",
    "nav.blog": "Blog",

    "mobile.menuTitle": "Menu",
    "mobile.ctaPrimary": "Free Visit / Get a Quote",
    "mobile.ctaSecondary": "View Projects",

    "search.title": "Search",
    "search.question": "What are you looking for?",
    "search.placeholder": "e.g., L-shaped sofa, TV unit, kitchen…",
    "search.hint": "This area is for demo purposes. We can wire real search results with JavaScript.",

    "hero.eyebrow": "Minimal • Modern • Made-to-measure",
    "hero.title": "Interior design and furniture with a <span>custom-made</span> touch.",
    "hero.lead": "With 8 years of international experience: made-to-measure furniture for homes and workplaces, turnkey interior solutions, and quality craftsmanship.",
    "hero.primary": "Free Visit / Get a Quote",
    "hero.secondary": "Explore the Collection",
    "hero.badges.0.title": "Made-to-measure",
    "hero.badges.0.sub": "Perfect fit for your space",
    "hero.badges.1.title": "Custom production",
    "hero.badges.1.sub": "Choose material & color",
    "hero.badges.2.title": "Delivery & installation",
    "hero.badges.2.sub": "Planned process",
    "hero.badges.3.title": "Warranty",
    "hero.badges.3.sub": "After-sales support",

    "about.title": "About Us",
    "about.imageAlt": "A minimalist living room interior",
    "about.text": "Asiltürk Furniture designs <strong>minimal and functional</strong> solutions for modern living spaces. We manage design, production and installation under one roof.",
    "about.list.0": "On-site visit & measurement",
    "about.list.1": "2D/3D design & approval",
    "about.list.2": "Production & quality control",
    "about.list.3": "Delivery & installation",
    "about.primary": "View Projects",
    "about.secondary": "Get in Touch",

    "products.title": "Collection",
    "products.text": "Popular categories. Everything can be made-to-measure. Fabric, color, legs and details are customizable.",
    "products.cards.0.alt": "L-shaped sectional sofa",
    "products.cards.0.title": "L-Shaped & Corner Sofas",
    "products.cards.0.text": "Modular setup, comfortable seating, sized for your layout.",
    "products.cards.1.alt": "Modern sofa concept",
    "products.cards.1.title": "Seating Sets",
    "products.cards.1.text": "Minimal lines, premium foam, long-lasting frame.",
    "products.cards.2.alt": "Living room decoration concept",
    "products.cards.2.title": "Interior Design Packages",
    "products.cards.2.text": "Turnkey solutions for living rooms, bedrooms, offices and commercial spaces.",
    "products.cards.quote": "Get a Quote",
    "products.cards.examples": "See Examples",
    "products.cards.survey": "Request a Visit",
    "products.cards.tips": "Tips",
    "products.viewAll": "View Full Collection",

    "process.0.title": "Visit",
    "process.0.text": "Measurements, needs and style alignment.",
    "process.1.title": "Design",
    "process.1.text": "Planning, sizing and detail approval.",
    "process.2.title": "Production",
    "process.2.text": "Craftsmanship & quality control.",
    "process.3.title": "Delivery",
    "process.3.text": "On-time installation and support.",

    "projects.title": "Projects",
    "projects.text": "Selected work. As your portfolio grows, this section scales automatically.",
    "projects.items.0.title": "Modern Living Room",
    "projects.items.0.sub": "Made-to-measure seating",
    "projects.items.1.title": "Minimal Seating",
    "projects.items.1.sub": "Concept & installation",
    "projects.items.2.title": "Bright Living",
    "projects.items.2.sub": "Interior package",
    "projects.items.3.title": "Corner Set",
    "projects.items.3.sub": "Modular L sofa",
    "projects.ctaTitle": "Let's plan your project together.",
    "projects.ctaText": "Free visit and quick quote — with made-to-measure options.",
    "projects.ctaButton": "Request a Quote",
    "projects.viewAll": "View All Projects",

    "reviews.title": "Reviews",
    "reviews.text": "Sample testimonials. Replace with real reviews anytime.",
    "reviews.items.0.quote": "“The made-to-measure production was exactly what I wanted. Installation was clean and fast.”",
    "reviews.items.1.quote": "“Every detail was discussed during the design phase. Fabric quality and comfort are great.”",
    "reviews.items.2.quote": "“We got a whole-home interior package. The result is bright and modern.”",

    "contact.title": "Contact",
    "contact.text": "Leave measurements / product type / city details and we’ll get back quickly.",
    "contact.form.name": "Full Name",
    "contact.form.namePh": "Your name",
    "contact.form.phone": "Phone",
    "contact.form.phonePh": "+234 xxx xxx xxxx",
    "contact.form.service": "Service",
    "contact.form.options.0": "Made-to-measure furniture",
    "contact.form.options.1": "Interior design",
    "contact.form.options.2": "Turnkey project",
    "contact.form.options.3": "Other",
    "contact.form.message": "Message",
    "contact.form.messagePh": "Product, measurements, city, and reference images (if any)…",
    "contact.form.submit": "Send",
    "contact.form.emailBtn": "Email us",
    "contact.form.hint": "Note: This form isn’t wired to a backend yet. We can add email sending / WhatsApp forwarding.",
    "contact.info.title": "Quick Contact",
    "contact.info.phone": "Phone",
    "contact.info.email": "Email",
    "contact.info.address": "53 Kumasi Crescent, Wuse 2, FCT Abuja, Nigeria",
    "contact.info.factory": "Factory",
    "contact.info.factoryAddress": "Mogadishu Cantonment, New Mumy Market Extension, Abuja",
    "contact.info.website": "Website",
    "contact.info.hours": "Mon–Sat: 09:00 – 19:00",
    "contact.mapTitle": "Map",

    "blog.title": "Blog",
    "blog.text": "Decor tips and material guides.",
    "blog.cards.0.alt": "Bright living room decoration",
    "blog.cards.0.meta": "Decor • 5 min",
    "blog.cards.0.title": "Minimal living room: 6 small touches",
    "blog.cards.0.text": "Practical ways to boost spaciousness with light, textures and right sizing.",
    "blog.cards.1.alt": "Corner sofa",
    "blog.cards.1.meta": "Furniture • 4 min",
    "blog.cards.1.title": "What to consider when choosing a corner sofa",
    "blog.cards.1.text": "Seating depth, fabric selection and modularity.",
    "blog.cards.2.alt": "Modern living room",
    "blog.cards.2.meta": "Guide • 6 min",
    "blog.cards.2.title": "How does made-to-measure production work?",
    "blog.cards.2.text": "Clear steps from visit to delivery — tips for speed and quality.",
    "blog.readMore": "Read more",
    "blog.viewAll": "View All Blog Posts",

    "footer.brandText": "Custom furniture and interior design solutions.",
    "footer.quickLinks": "Quick Links",
    "footer.contactTitle": "Contact",
    "footer.location": "53 Kumasi Crescent, Wuse 2, FCT Abuja, Nigeria",
    "blog.backToList": "Back to blog list",
    "footer.newsletterTitle": "Newsletter",
    "footer.newsletterText": "For new projects and offers.",
    "footer.newsletterPlaceholder": "Email address",
    "footer.newsletterBtn": "Sign up",
    "footer.rights": "All rights reserved.",
    "footer.backToTop": "Top",
  };

  // Build dictionary
  const I18N = {
    tr: TR,
    en: EN,
  };

  // ---------------------------
  // Bind language buttons
  // ---------------------------
  $$(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = (btn.getAttribute("data-lang") || "tr").toLowerCase();
      setLang(lang);
    });
  });

  // Initial language
  setLang(getInitialLang());

  // ---------------------------
  // Footer year
  // ---------------------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------------------------
  // Mobile menu
  // ---------------------------
  const menuBtn = $(".menu-btn");
  const closeBtn = $(".close-btn");
  const mobilePanel = $(".mobile-panel");

  const openMenu = () => {
    if (!mobilePanel) return;
    mobilePanel.classList.add("open");
    mobilePanel.setAttribute("aria-hidden", "false");
  };
  const closeMenu = () => {
    if (!mobilePanel) return;
    mobilePanel.classList.remove("open");
    mobilePanel.setAttribute("aria-hidden", "true");
  };

  menuBtn?.addEventListener("click", () => {
    if (!mobilePanel) return;
    const isOpen = mobilePanel.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });
  closeBtn?.addEventListener("click", closeMenu);
  $$(".mobile-links a").forEach((a) => a.addEventListener("click", closeMenu));

  // ---------------------------
  // Search overlay
  // ---------------------------
  const searchBtn = $(".search-btn");
  const overlay = $("#searchOverlay");
  const overlayClose = $(".overlay-close", overlay || document);

  const openOverlay = () => {
    if (!overlay) return;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    const input = $("input[type='search']", overlay);
    setTimeout(() => input?.focus(), 10);
  };
  const closeOverlay = () => {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  };

  searchBtn?.addEventListener("click", openOverlay);
  overlayClose?.addEventListener("click", closeOverlay);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeOverlay();
      closeMenu();
    }
  });

  // ---------------------------
  // Active nav link based on current page and hash
  // ---------------------------
  const navLinks = $$(".navbar a");
  const mobileLinks = $$(".mobile-links a");

  const setActiveByPage = () => {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const hash = window.location.hash.slice(1); // Remove #
    const pageMap = {
      "index.html": "index.html",
      "koleksiyon.html": "koleksiyon.html",
      "projeler.html": "projeler.html",
      "blog.html": "blog.html",
    };

    // If on index.html and hash exists, use hash-based active state initially
    // (scroll spy will update it as user scrolls)
    if (currentPage === "index.html" && hash) {
      navLinks.forEach((a) => {
        const href = a.getAttribute("href") || "";
        const isActive = href === `#${hash}`;
        a.classList.toggle("active", isActive);
      });

      mobileLinks.forEach((a) => {
        const href = a.getAttribute("href") || "";
        const isActive = href === `#${hash}`;
        a.classList.toggle("active", isActive);
      });
      return;
    }

    // Otherwise use page-based active state
    const activeHref = pageMap[currentPage] || "index.html";

    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const isActive = href === activeHref || (currentPage === "index.html" && !hash && href === "index.html");
      a.classList.toggle("active", isActive);
    });

    mobileLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const isActive = href === activeHref || (currentPage === "index.html" && !hash && href === "index.html");
      a.classList.toggle("active", isActive);
    });
  };

  // ---------------------------
  // Prevent scroll restoration on page load
  // ---------------------------
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // Scroll to top on initial load if no hash (wait for DOM to be ready)
  const scrollToTop = () => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  };

  // Try immediately, and also on DOMContentLoaded and load events
  scrollToTop();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scrollToTop);
  }
  window.addEventListener("load", scrollToTop);

  // Set active on page load
  setActiveByPage();

  // Listen for hash changes
  window.addEventListener("hashchange", () => {
    setActiveByPage();
    // Scroll to hash target after a brief delay to ensure DOM is ready
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const headerOffset = 100;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }, 100);
    }
  });

  // ---------------------------
  // Active nav link on scroll (only for index.html with sections)
  // ---------------------------
  // Note: products, projects, blog sections are now on separate pages
  const sections = ["home", "about", "reviews", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveByScroll = (id) => {
    // Clear all active classes first
    navLinks.forEach((a) => a.classList.remove("active"));
    mobileLinks.forEach((a) => a.classList.remove("active"));

    // Set active based on section id
    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      let isActive = false;
      
      if (id === "home") {
        isActive = href === "index.html" || href === "#home" || href === "index.html#home";
      } else {
        isActive = href === `#${id}`;
      }
      
      if (isActive) a.classList.add("active");
    });
    
    mobileLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      let isActive = false;
      
      if (id === "home") {
        isActive = href === "index.html" || href === "#home" || href === "index.html#home";
      } else {
        isActive = href === `#${id}`;
      }
      
      if (isActive) a.classList.add("active");
    });
  };

  // Enable scroll-based active state on index.html
  if ("IntersectionObserver" in window && sections.length && window.location.pathname.split("/").pop() === "index.html") {
    // Sticky header height (approximately 100px including padding)
    const headerOffset = 100;
    
    let isUserScrolling = false;
    let scrollTimeout = null;
    
    // Track when user is actively scrolling
    window.addEventListener("scroll", () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 200);
    }, { passive: true });
    
    const io = new IntersectionObserver(
      (entries) => {
        // If hash exists and user is not scrolling, let hash-based active state handle it
        if (window.location.hash && !isUserScrolling) {
          return;
        }
        
        // Find the section that is most visible in the viewport
        const visible = entries
          .filter((x) => x.isIntersecting && x.intersectionRatio > 0.1)
          .sort((a, b) => {
            // Primary sort: intersection ratio (higher is better)
            const ratioDiff = b.intersectionRatio - a.intersectionRatio;
            if (Math.abs(ratioDiff) > 0.2) {
              return ratioDiff;
            }
            // Secondary sort: distance from top (closer to top is better when ratios are similar)
            const topA = a.boundingClientRect.top;
            const topB = b.boundingClientRect.top;
            
            // Prefer section that is closer to the top of viewport (accounting for header)
            const adjustedTopA = Math.max(0, topA - headerOffset);
            const adjustedTopB = Math.max(0, topB - headerOffset);
            
            return adjustedTopA - adjustedTopB;
          })[0];
        
        if (visible?.target?.id) {
          setActiveByScroll(visible.target.id);
        }
      },
      { 
        root: null, 
        // Negative top margin accounts for sticky header
        // Negative bottom margin helps prioritize sections in upper viewport
        rootMargin: `-${headerOffset}px 0px -60% 0px`,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
      }
    );
    sections.forEach((s) => io.observe(s));
  }
})();
