const DB_NAME = "portfolio-studio-db";
const DB_VERSION = 1;
const WORK_STORE = "works";
const PROFILE_STORE = "profile";
const PROFILE_KEY = "main";

const defaultProfile = {
  name: "Your Name",
  headline: "Portfolio Studio",
  bio: "整理你的代表项目、图片、视频和作品说明。",
  email: "",
  links: "",
};

const elements = {
  displayName: document.querySelector("#displayName"),
  totalWorks: document.querySelector("#totalWorks"),
  imageCount: document.querySelector("#imageCount"),
  videoCount: document.querySelector("#videoCount"),
  storageEstimate: document.querySelector("#storageEstimate"),
  form: document.querySelector("#workForm"),
  dropZone: document.querySelector("#dropZone"),
  mediaInput: document.querySelector("#mediaInput"),
  pendingList: document.querySelector("#pendingList"),
  titleInput: document.querySelector("#titleInput"),
  categoryInput: document.querySelector("#categoryInput"),
  summaryInput: document.querySelector("#summaryInput"),
  roleInput: document.querySelector("#roleInput"),
  linkInput: document.querySelector("#linkInput"),
  tagsInput: document.querySelector("#tagsInput"),
  workGrid: document.querySelector("#workGrid"),
  emptyState: document.querySelector("#emptyState"),
  filterInput: document.querySelector("#filterInput"),
  searchInput: document.querySelector("#searchInput"),
  clearButton: document.querySelector("#clearButton"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  saveProfileButton: document.querySelector("#saveProfileButton"),
  nameInput: document.querySelector("#nameInput"),
  headlineInput: document.querySelector("#headlineInput"),
  bioInput: document.querySelector("#bioInput"),
  emailInput: document.querySelector("#emailInput"),
  linksInput: document.querySelector("#linksInput"),
  mediaDialog: document.querySelector("#mediaDialog"),
  dialogClose: document.querySelector("#dialogClose"),
  dialogMedia: document.querySelector("#dialogMedia"),
  dialogCategory: document.querySelector("#dialogCategory"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogSummary: document.querySelector("#dialogSummary"),
  dialogTags: document.querySelector("#dialogTags"),
  previewModeButton: document.querySelector("#previewModeButton"),
  previewDialog: document.querySelector("#previewDialog"),
  previewClose: document.querySelector("#previewClose"),
  publicPreview: document.querySelector("#publicPreview"),
  cardTemplate: document.querySelector("#workCardTemplate"),
};

let db;
let works = [];
let profile = { ...defaultProfile };
let pendingFiles = [];

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(WORK_STORE)) {
        database.createObjectStore(WORK_STORE, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(PROFILE_STORE)) {
        database.createObjectStore(PROFILE_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transaction(storeName, mode = "readonly") {
  return db.transaction(storeName, mode).objectStore(storeName);
}

function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function saveWork(work) {
  return promisifyRequest(transaction(WORK_STORE, "readwrite").put(work));
}

function deleteWork(id) {
  return promisifyRequest(transaction(WORK_STORE, "readwrite").delete(id));
}

function getAllWorks() {
  return promisifyRequest(transaction(WORK_STORE).getAll());
}

function saveProfile(profileData) {
  return promisifyRequest(transaction(PROFILE_STORE, "readwrite").put({ id: PROFILE_KEY, ...profileData }));
}

function getProfile() {
  return promisifyRequest(transaction(PROFILE_STORE).get(PROFILE_KEY));
}

function formatBytes(bytes = 0) {
  if (!bytes) return "本地保存";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function tagsFromText(value) {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function extensionFromFile(file) {
  return file.name.includes(".") ? file.name.split(".").pop() : "bin";
}

function uniqueId() {
  const randomPart = crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `${Date.now()}-${randomPart}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function renderPendingFiles() {
  elements.pendingList.innerHTML = "";

  pendingFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "pending-item";
    const name = document.createElement("strong");
    const size = document.createElement("span");
    name.textContent = file.name;
    size.textContent = formatBytes(file.size);
    item.append(name, size);
    item.addEventListener("click", () => {
      pendingFiles.splice(index, 1);
      renderPendingFiles();
    });
    elements.pendingList.append(item);
  });
}

function addPendingFiles(fileList) {
  const validFiles = [...fileList].filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));
  pendingFiles = [...pendingFiles, ...validFiles];
  renderPendingFiles();
}

function createMediaNode(work, controls = false) {
  if (work.type.startsWith("image/")) {
    const image = document.createElement("img");
    image.src = work.dataUrl;
    image.alt = work.title;
    return image;
  }

  if (work.type.startsWith("video/")) {
    const video = document.createElement("video");
    video.src = work.dataUrl;
    video.muted = !controls;
    video.controls = controls;
    video.playsInline = true;
    if (!controls) {
      video.preload = "metadata";
    }
    return video;
  }

  const fallback = document.createElement("div");
  fallback.className = "file-fallback";
  fallback.textContent = work.fileName || "作品素材";
  return fallback;
}

function renderTagRow(container, tags) {
  container.innerHTML = "";
  tags.slice(0, 6).forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    container.append(item);
  });
}

function matchesCurrentFilters(work) {
  const filter = elements.filterInput.value;
  const query = elements.searchInput.value.trim().toLowerCase();
  const haystack = [work.title, work.category, work.summary, work.role, ...(work.tags || [])].join(" ").toLowerCase();
  return (filter === "all" || work.category === filter) && (!query || haystack.includes(query));
}

function renderCategoryFilter() {
  const selected = elements.filterInput.value;
  const categories = [...new Set(works.map((work) => work.category).filter(Boolean))].sort();
  elements.filterInput.innerHTML = `<option value="all">全部分类</option>`;

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    elements.filterInput.append(option);
  });

  elements.filterInput.value = categories.includes(selected) ? selected : "all";
}

function renderStats() {
  const totalBytes = works.reduce((sum, work) => sum + (work.size || 0), 0);
  elements.totalWorks.textContent = works.length;
  elements.imageCount.textContent = works.filter((work) => work.type.startsWith("image/")).length;
  elements.videoCount.textContent = works.filter((work) => work.type.startsWith("video/")).length;
  elements.storageEstimate.textContent = formatBytes(totalBytes);
}

function renderWorks() {
  renderCategoryFilter();
  renderStats();

  elements.workGrid.innerHTML = "";
  const visibleWorks = works.filter(matchesCurrentFilters);
  elements.emptyState.hidden = visibleWorks.length > 0;

  visibleWorks.forEach((work) => {
    const card = elements.cardTemplate.content.firstElementChild.cloneNode(true);
    const mediaButton = card.querySelector(".media-button");
    const title = card.querySelector("h3");
    const summary = card.querySelector("p");
    const category = card.querySelector(".category-pill");
    const date = card.querySelector(".date-text");
    const tags = card.querySelector(".tag-row");
    const link = card.querySelector("a");

    mediaButton.append(createMediaNode(work));
    mediaButton.addEventListener("click", () => openMediaDialog(work));
    title.textContent = work.title;
    summary.textContent = work.summary || "未填写简介";
    category.textContent = work.category;
    date.textContent = new Date(work.createdAt).toLocaleDateString("zh-CN");
    renderTagRow(tags, work.tags || []);

    if (work.link) {
      link.href = work.link;
    } else {
      link.hidden = true;
    }

    card.querySelector('[data-action="edit"]').addEventListener("click", () => fillFormForEdit(work));
    card.querySelector('[data-action="download"]').addEventListener("click", () => downloadWorkMedia(work));
    card.querySelector('[data-action="delete"]').addEventListener("click", async () => {
      const confirmed = confirm(`删除作品“${work.title}”？`);
      if (!confirmed) return;
      await deleteWork(work.id);
      await refreshWorks();
    });

    elements.workGrid.append(card);
  });
}

function fillFormForEdit(work) {
  elements.titleInput.value = work.title;
  elements.categoryInput.value = work.category;
  elements.summaryInput.value = work.summary || "";
  elements.roleInput.value = work.role || "";
  elements.linkInput.value = work.link || "";
  elements.tagsInput.value = (work.tags || []).join(", ");
  elements.form.dataset.editingId = work.id;
  pendingFiles = [];
  renderPendingFiles();
  location.hash = "#upload";
}

function openMediaDialog(work) {
  elements.dialogMedia.innerHTML = "";
  elements.dialogMedia.append(createMediaNode(work, true));
  elements.dialogCategory.textContent = work.category;
  elements.dialogTitle.textContent = work.title;
  elements.dialogSummary.textContent = work.summary || "未填写简介";
  renderTagRow(elements.dialogTags, work.tags || []);
  elements.mediaDialog.showModal();
}

function downloadWorkMedia(work) {
  const anchor = document.createElement("a");
  anchor.href = work.dataUrl;
  anchor.download = work.fileName || `${work.title}.${work.extension || "bin"}`;
  anchor.click();
}

async function refreshWorks() {
  works = (await getAllWorks()).sort((a, b) => b.createdAt - a.createdAt);
  renderWorks();
}

function hydrateProfileForm() {
  elements.displayName.textContent = profile.name || defaultProfile.name;
  elements.nameInput.value = profile.name || "";
  elements.headlineInput.value = profile.headline || "";
  elements.bioInput.value = profile.bio || "";
  elements.emailInput.value = profile.email || "";
  elements.linksInput.value = profile.links || "";
}

function readProfileForm() {
  return {
    name: elements.nameInput.value.trim() || defaultProfile.name,
    headline: elements.headlineInput.value.trim() || defaultProfile.headline,
    bio: elements.bioInput.value.trim() || defaultProfile.bio,
    email: elements.emailInput.value.trim(),
    links: elements.linksInput.value.trim(),
  };
}

function resetWorkForm() {
  elements.form.reset();
  delete elements.form.dataset.editingId;
  pendingFiles = [];
  renderPendingFiles();
}

async function handleWorkSubmit(event) {
  event.preventDefault();

  const editingId = elements.form.dataset.editingId;
  const existingWork = editingId ? works.find((work) => work.id === editingId) : null;
  const files = pendingFiles.length ? pendingFiles : existingWork ? [] : [];

  if (!existingWork && files.length === 0) {
    elements.mediaInput.click();
    return;
  }

  const baseData = {
    title: elements.titleInput.value.trim(),
    category: elements.categoryInput.value,
    summary: elements.summaryInput.value.trim(),
    role: elements.roleInput.value.trim(),
    link: elements.linkInput.value.trim(),
    tags: tagsFromText(elements.tagsInput.value),
    updatedAt: Date.now(),
  };

  if (existingWork && files.length === 0) {
    await saveWork({ ...existingWork, ...baseData, title: baseData.title || existingWork.title });
  } else {
    for (const file of files) {
      const dataUrl = await fileToDataUrl(file);
      await saveWork({
        id: uniqueId(),
        ...baseData,
        title: baseData.title || file.name.replace(/\.[^/.]+$/, ""),
        fileName: file.name,
        type: file.type,
        size: file.size,
        extension: extensionFromFile(file),
        dataUrl,
        createdAt: Date.now(),
      });
    }
  }

  resetWorkForm();
  await refreshWorks();
  location.hash = "#works";
}

function exportBackup() {
  const payload = {
    exportedAt: new Date().toISOString(),
    profile,
    works,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

async function importBackup(file) {
  const text = await file.text();
  const payload = JSON.parse(text);
  const importedWorks = Array.isArray(payload.works) ? payload.works : [];
  const importedProfile = payload.profile ? { ...defaultProfile, ...payload.profile } : defaultProfile;

  await saveProfile(importedProfile);
  for (const work of importedWorks) {
    if (work.id && work.dataUrl) {
      await saveWork(work);
    }
  }

  profile = importedProfile;
  hydrateProfileForm();
  await refreshWorks();
}

function renderPublicPreview() {
  const links = profile.links
    ? profile.links
        .split(/[,，]/)
        .map((link) => link.trim())
        .filter(Boolean)
    : [];

  elements.publicPreview.innerHTML = "";

  const header = document.createElement("header");
  const kicker = document.createElement("span");
  const name = document.createElement("h2");
  const bio = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = profile.headline || defaultProfile.headline;
  name.textContent = profile.name || defaultProfile.name;
  bio.textContent = profile.bio || defaultProfile.bio;
  header.append(kicker, name, bio);

  const contactTags = document.createElement("div");
  contactTags.className = "tag-row";
  [profile.email, ...links].filter(Boolean).forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    contactTags.append(span);
  });
  header.append(contactTags);

  const grid = document.createElement("div");
  grid.className = "preview-grid";

  works.slice(0, 8).forEach((work) => {
    const card = document.createElement("article");
    card.className = "preview-card";
    card.append(createMediaNode(work));

    const body = document.createElement("div");
    const category = document.createElement("span");
    const title = document.createElement("h3");
    const summary = document.createElement("p");
    category.className = "category-pill";
    category.textContent = work.category;
    title.textContent = work.title;
    summary.textContent = work.summary || "";
    body.append(category, title, summary);
    card.append(body);
    grid.append(card);
  });

  elements.publicPreview.append(header, grid);
  elements.previewDialog.showModal();
}

function bindEvents() {
  elements.mediaInput.addEventListener("change", (event) => addPendingFiles(event.target.files));
  elements.form.addEventListener("submit", handleWorkSubmit);
  elements.form.addEventListener("reset", () => setTimeout(resetWorkForm));
  elements.filterInput.addEventListener("change", renderWorks);
  elements.searchInput.addEventListener("input", renderWorks);
  elements.exportButton.addEventListener("click", exportBackup);
  elements.importInput.addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (file) await importBackup(file);
    event.target.value = "";
  });

  elements.clearButton.addEventListener("click", async () => {
    if (!works.length) return;
    const confirmed = confirm("清空所有作品？个人资料会保留。");
    if (!confirmed) return;
    await Promise.all(works.map((work) => deleteWork(work.id)));
    await refreshWorks();
  });

  elements.saveProfileButton.addEventListener("click", async () => {
    profile = readProfileForm();
    await saveProfile(profile);
    hydrateProfileForm();
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.add("is-over");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, () => elements.dropZone.classList.remove("is-over"));
  });

  elements.dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    addPendingFiles(event.dataTransfer.files);
  });

  elements.dialogClose.addEventListener("click", () => elements.mediaDialog.close());
  elements.previewClose.addEventListener("click", () => elements.previewDialog.close());
  elements.previewModeButton.addEventListener("click", renderPublicPreview);

  [elements.mediaDialog, elements.previewDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

async function init() {
  db = await openDatabase();
  profile = { ...defaultProfile, ...(await getProfile()) };
  hydrateProfileForm();
  bindEvents();
  await refreshWorks();
}

init().catch((error) => {
  console.error(error);
  alert("作品集初始化失败，请确认浏览器支持 IndexedDB。");
});
