const DEFAULT_TEMPLATES = [
  { name: "Open in Stremio", template: "stremio:///detail/{stremio_type}/{imdb_id}/{imdb_id}" },
  { name: "Example: My Site", template: "https://example.com/movie/{imdb_id}" }
];

const tbody = document.getElementById("templates-body");
const statusEl = document.getElementById("status");

function addRow(tpl = { name: "", template: "" }) {
  const tr = document.createElement("tr");

  const nameTd = document.createElement("td");
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "e.g. My Streaming Site";
  nameInput.value = tpl.name || "";
  nameInput.className = "icl-name";
  nameTd.appendChild(nameInput);

  const urlTd = document.createElement("td");
  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.placeholder = "https://example.com/search?q={title}&year={year}";
  urlInput.value = tpl.template || "";
  urlInput.className = "icl-template";
  urlTd.appendChild(urlInput);

  const actionsTd = document.createElement("td");
  actionsTd.className = "row-actions";
  const removeBtn = document.createElement("button");
  removeBtn.className = "btn-remove";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => tr.remove());
  actionsTd.appendChild(removeBtn);

  tr.appendChild(nameTd);
  tr.appendChild(urlTd);
  tr.appendChild(actionsTd);
  tbody.appendChild(tr);
}

function collectTemplates() {
  const rows = tbody.querySelectorAll("tr");
  const templates = [];
  rows.forEach((row) => {
    const name = row.querySelector(".icl-name").value.trim();
    const template = row.querySelector(".icl-template").value.trim();
    if (template) {
      templates.push({ name, template });
    }
  });
  return templates;
}

function load() {
  chrome.storage.sync.get({ templates: DEFAULT_TEMPLATES }, (result) => {
    const templates = result.templates && result.templates.length ? result.templates : DEFAULT_TEMPLATES;
    templates.forEach((tpl) => addRow(tpl));
    if (templates.length === 0) addRow();
  });
}

document.getElementById("add-row").addEventListener("click", () => addRow());

document.getElementById("save").addEventListener("click", () => {
  const templates = collectTemplates();
  chrome.storage.sync.set({ templates }, () => {
    statusEl.textContent = "Saved!";
    setTimeout(() => (statusEl.textContent = ""), 1500);
  });
});

load();
