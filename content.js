(function () {
  const DEFAULT_TEMPLATES = [];

  function getImdbId() {
    const match = window.location.pathname.match(/\/title\/(tt\d+)/);
    return match ? match[1] : "";
  }

  function getTitleAndYear() {
    // Try the on-page heading first.
    let title = "";
    const h1 = document.querySelector('h1[data-testid="hero__pageTitle"], h1');
    if (h1) {
      title = h1.textContent.trim();
    }

    // Fall back to / cross-check with document.title, which is usually
    // "Movie Name (2020) - IMDb"
    const docTitle = document.title || "";
    let year = "";
    const yearMatch = docTitle.match(/\((\d{4})\)/);
    if (yearMatch) {
      year = yearMatch[1];
    }
    if (!title) {
      title = docTitle.replace(/\s*\(\d{4}\).*$/, "").replace(/\s*-\s*IMDb.*$/, "").trim();
    }

    return { title, year };
  }

  function fillTemplate(template, data) {
    return template
      .replace(/\{imdb_id\}/g, encodeURIComponent(data.imdb_id))
      .replace(/\{title\}/g, encodeURIComponent(data.title))
      .replace(/\{year\}/g, encodeURIComponent(data.year))
      .replace(/\{url\}/g, encodeURIComponent(data.url));
  }

  function buildPanel(templates, data) {
    const existing = document.getElementById("icl-panel");
    if (existing) existing.remove();

    const panel = document.createElement("div");
    panel.id = "icl-panel";

    const closeBtn = document.createElement("span");
    closeBtn.className = "icl-close";
    closeBtn.textContent = "\u2715";
    closeBtn.title = "Hide";
    closeBtn.addEventListener("click", () => panel.remove());
    panel.appendChild(closeBtn);

    const heading = document.createElement("div");
    heading.className = "icl-title";
    heading.textContent = "Custom Links";
    panel.appendChild(heading);

    const linksWrap = document.createElement("div");
    linksWrap.className = "icl-links";

    if (!templates || templates.length === 0) {
      const empty = document.createElement("div");
      empty.className = "icl-empty";
      empty.textContent = "No links configured. Right-click the extension icon \u2192 Options to add some.";
      linksWrap.appendChild(empty);
    } else {
      templates.forEach((tpl) => {
        if (!tpl.template) return;
        let href;
        try {
          href = fillTemplate(tpl.template, data);
          // fillTemplate encodes everything, but we don't want to encode the
          // scheme/slashes of the template itself, only the placeholder values,
          // which is already handled since only placeholders get replaced.
        } catch (e) {
          return;
        }
        const a = document.createElement("a");
        a.className = "icl-link";
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = tpl.name || href;
        linksWrap.appendChild(a);
      });
    }

    panel.appendChild(linksWrap);
    document.body.appendChild(panel);
  }

  function init() {
    const imdb_id = getImdbId();
    if (!imdb_id) return;

    const { title, year } = getTitleAndYear();
    const data = { imdb_id, title, year, url: window.location.href };

    chrome.storage.sync.get({ templates: DEFAULT_TEMPLATES }, (result) => {
      buildPanel(result.templates, data);
    });
  }

  // IMDb pages are mostly server-rendered but the title heading can load
  // slightly after initial paint, so give it a brief moment.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 300));
  } else {
    setTimeout(init, 300);
  }

  // Re-render if the user updates templates in the options page while this
  // tab is open.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.templates) {
      init();
    }
  });
})();
