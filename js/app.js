const $ = id => document.getElementById(id);

const projectInput = $("projectInput");
const openProjectBtn = $("openProjectBtn");
const runBtn = $("runBtn");
const promptInput = $("promptInput");
const fileList = $("fileList");
const resultCard = $("resultCard");
const resultContent = $("resultContent");
const applyBtn = $("applyBtn");
const clearResultBtn = $("clearResultBtn");
const projectName = $("projectName");
const projectStatus = $("projectStatus");
const fileCount = $("fileCount");
const statusText = $("statusText");
const settingsModal = $("settingsModal");

openProjectBtn.addEventListener("click", () => projectInput.click());

projectInput.addEventListener("change", event => {
  const files = ProjectManager.load(event.target.files);
  const summary = ProjectManager.getSummary();

  projectName.textContent = files[0]?.path.split("/")[0] || "Proyecto";
  fileCount.textContent = `${summary.count} archivo${summary.count === 1 ? "" : "s"}`;
  projectStatus.textContent = "Proyecto cargado localmente. Todavía no se ha enviado a ninguna IA.";
  statusText.textContent = "Proyecto cargado · Modo local";

  fileList.innerHTML = files.length
    ? files.map(file => `
      <div class="file-item">
        <span class="file-icon">${iconFor(file.name)}</span>
        <span class="file-path">${escapeHtml(file.path)}</span>
      </div>
    `).join("")
    : `<div class="empty">No se encontraron archivos.</div>`;
});

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    promptInput.value = chip.dataset.prompt;
    promptInput.focus();
  });
});

runBtn.addEventListener("click", async () => {
  runBtn.disabled = true;
  runBtn.textContent = "⏳ Analizando...";
  statusText.textContent = "Analizando proyecto...";

  const result = await AIEngine.analyze(promptInput.value, ProjectManager.getSummary());

  runBtn.disabled = false;
  runBtn.textContent = "✨ Analizar tarea";

  if (!result.ok) {
    showResult(`<p class="muted">${escapeHtml(result.message)}</p>`, "Atención", false);
    return;
  }

  const changesHtml = result.changes.map(change => `
    <div class="change">
      <strong>📝 ${escapeHtml(change.file)}</strong>
      <span>${escapeHtml(change.detail)}</span>
    </div>
  `).join("");

  showResult(`
    <p>${escapeHtml(result.message)}</p>
    ${changesHtml}
  `, "Propuesta", true);

  statusText.textContent = "Propuesta lista · Sin cambios aplicados";
});

function showResult(html, badge, canApply) {
  resultCard.classList.remove("hidden");
  $("resultBadge").textContent = badge;
  resultContent.className = "result-content";
  resultContent.innerHTML = html;
  applyBtn.disabled = !canApply;
  resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

clearResultBtn.addEventListener("click", () => {
  resultCard.classList.add("hidden");
  applyBtn.disabled = true;
});

applyBtn.addEventListener("click", () => {
  showResult(`
    <p>La V1 todavía no escribe archivos automáticamente.</p>
    <p class="muted">El siguiente paso será añadir el sistema de edición + backup antes de conectar la IA real.</p>
  `, "V1", false);
  statusText.textContent = "Modo seguro · No se modificaron archivos";
});

$("settingsBtn").addEventListener("click", () => settingsModal.classList.remove("hidden"));
$("closeSettingsBtn").addEventListener("click", () => settingsModal.classList.add("hidden"));
$("closeSettingsBtn2").addEventListener("click", () => settingsModal.classList.add("hidden"));

function iconFor(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".html")) return "🌐";
  if (lower.endsWith(".css")) return "🎨";
  if (lower.endsWith(".js")) return "⚙️";
  if (lower.endsWith(".json")) return "📋";
  return "📄";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}
