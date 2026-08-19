const data = window.PORTFOLIO_DATA || {};
const profile = data.profile || {};
const projects = Array.isArray(data.projects) ? data.projects : Array.isArray(data.works) ? data.works : [];
const videoBaseUrl = data.videoBaseUrl || "";

const nodes = {
  initials: document.querySelector("[data-initials]"),
  profileFields: document.querySelectorAll("[data-profile]"),
  heroLinks: document.querySelector("#heroLinks"),
  projectCount: document.querySelector("#projectCount"),
  mediaCount: document.querySelector("#mediaCount"),
  featuredMedia: document.querySelector("#featuredMedia"),
  featuredCategory: document.querySelector("#featuredCategory"),
  featuredTitle: document.querySelector("#featuredTitle"),
  featuredResult: document.querySelector("#featuredResult"),
  filters: document.querySelector("#filters"),
  projectList: document.querySelector("#projectList"),
  emptyState: document.querySelector("#emptyState"),
  skillList: document.querySelector("#skillList"),
  contactLinks: document.querySelector("#contactLinks"),
  footerName: document.querySelector("[data-footer-name]"),
  template: document.querySelector("#projectTemplate"),
  dialog: document.querySelector("#mediaDialog"),
  dialogClose: document.querySelector("#dialogClose"),
  dialogMedia: document.querySelector("#dialogMedia"),
  dialogCategory: document.querySelector("#dialogCategory"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogSummary: document.querySelector("#dialogSummary"),
  dialogTags: document.querySelector("#dialogTags"),
};

let activeCategory = "全部";

function getInitials(name = "") {
  const cleanName = name.trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (!parts.length) return "PF";
  if (/[\u4e00-\u9fa5]/.test(cleanName)) return cleanName.slice(-2);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function firstMedia(project) {
  return project?.media?.[0];
}

function mediaUrl(media) {
  if (!media?.src) return "";
  if (/^https?:\/\//i.test(media.src)) return media.src;
  if (media.type === "video" && videoBaseUrl) {
    return `${videoBaseUrl}${encodeURI(media.src)}`;
  }
  return media.src;
}

function createPlaceholder(label = "Portfolio") {
  const placeholder = document.createElement("div");
  placeholder.className = "placeholder-visual";
  const text = document.createElement("span");
  text.textContent = label;
  placeholder.append(text);
  return placeholder;
}

function createVideoPreview(media) {
  const preview = document.createElement("div");
  preview.className = "video-preview";

  if (media.poster) {
    const image = document.createElement("img");
    image.src = media.poster;
    image.alt = media.title || "视频封面";
    image.loading = "lazy";
    image.addEventListener("error", () => image.remove());
    preview.append(image);
  }

  const play = document.createElement("span");
  play.className = "play-badge";
  play.setAttribute("aria-hidden", "true");
  play.textContent = "▶";

  const label = document.createElement("strong");
  label.textContent = "播放视频";

  preview.append(play, label);
  return preview;
}

function createVideoFallback(media) {
  const fallback = document.createElement("a");
  fallback.className = "video-fallback";
  fallback.href = mediaUrl(media);
  fallback.target = "_blank";
  fallback.rel = "noreferrer";
  fallback.textContent = "新窗口打开视频";
  return fallback;
}

function createMedia(media, controls = false) {
  if (!media?.src) {
    return createPlaceholder(media?.title || "Media");
  }

  if (media.type === "video") {
    if (!controls) {
      return createVideoPreview(media);
    }

    const video = document.createElement("video");
    video.src = mediaUrl(media);
    video.poster = media.poster || "";
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.addEventListener("error", () => video.replaceWith(createVideoFallback(media)));
    return video;
  }

  const image = document.createElement("img");
  image.src = media.src;
  image.alt = media.title || "项目图片";
  image.loading = "lazy";
  image.addEventListener("error", () => image.replaceWith(createPlaceholder("Image")));
  return image;
}

function renderTags(container, tags = []) {
  container.innerHTML = "";
  tags.slice(0, 10).forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    container.append(item);
  });
}

function contactItems() {
  if (Array.isArray(profile.contacts) && profile.contacts.length) {
    return profile.contacts.filter((item) => item.label && item.value);
  }

  return [
    profile.email ? { label: "Email", value: profile.email } : null,
    profile.wechat ? { label: "WeChat", value: profile.wechat } : null,
    profile.phone ? { label: "Phone", value: profile.phone } : null,
  ].filter(Boolean);
}

function renderProfile() {
  document.title = `${profile.name || "Portfolio"} | 机器人作品集`;
  nodes.initials.textContent = getInitials(profile.name);
  nodes.footerName.textContent = profile.name || "Portfolio";

  nodes.profileFields.forEach((node) => {
    const key = node.dataset.profile;
    node.textContent = profile[key] || node.textContent;
  });

  nodes.projectCount.textContent = projects.length;
  nodes.mediaCount.textContent = projects.reduce((total, project) => total + (project.media?.length || 0), 0);

  nodes.heroLinks.innerHTML = "";
  contactItems().forEach((contact) => {
    const item = document.createElement("span");
    item.className = "contact-chip";
    const label = document.createElement("small");
    const value = document.createElement("strong");
    label.textContent = contact.label;
    value.textContent = contact.value;
    item.append(label, value);
    nodes.heroLinks.append(item);
  });

  nodes.skillList.innerHTML = "";
  (profile.skills || []).forEach((skill) => {
    const item = document.createElement("span");
    item.textContent = skill;
    nodes.skillList.append(item);
  });

  nodes.contactLinks.innerHTML = "";
  contactItems().forEach((contact) => {
    const item = document.createElement("span");
    item.className = "contact-card";
    const label = document.createElement("small");
    const value = document.createElement("strong");
    label.textContent = contact.label;
    value.textContent = contact.value;
    item.append(label, value);
    nodes.contactLinks.append(item);
  });
}

function renderFeatured() {
  const featured = projects.find((project) => project.featured) || projects[0];
  const media = firstMedia(featured);
  nodes.featuredMedia.innerHTML = "";

  if (!featured || !media) {
    nodes.featuredMedia.append(createPlaceholder("Portfolio"));
    return;
  }

  nodes.featuredMedia.append(createMedia(media));
  nodes.featuredCategory.textContent = featured.category || "Featured Project";
  nodes.featuredTitle.textContent = featured.title || media.title || "Selected Project";
  nodes.featuredResult.textContent = featured.result || "";
}

function categories() {
  return ["全部", ...new Set(projects.map((project) => project.category).filter(Boolean))];
}

function renderFilters() {
  nodes.filters.innerHTML = "";
  categories().forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.className = category === activeCategory ? "active" : "";
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderProjects();
    });
    nodes.filters.append(button);
  });
}

function visibleProjects() {
  if (activeCategory === "全部") return projects;
  return projects.filter((project) => project.category === activeCategory);
}

function openDialog(project, media) {
  nodes.dialogMedia.innerHTML = "";
  nodes.dialogMedia.append(createMedia(media, true));
  nodes.dialogCategory.textContent = project.category || "Project";
  nodes.dialogTitle.textContent = media.title || project.title || "Untitled";
  nodes.dialogSummary.textContent = media.description || project.summary || "";
  renderTags(nodes.dialogTags, project.tags || []);
  nodes.dialog.showModal();
}

function renderHighlights(container, highlights = []) {
  container.innerHTML = "";
  highlights.forEach((highlight) => {
    const item = document.createElement("li");
    item.textContent = highlight;
    container.append(item);
  });
}

function variantLabel(variant) {
  if (variant === "without") return "Without SDF";
  if (variant === "with") return "With SDF";
  return "";
}

function renderProjectMedia(container, project) {
  container.innerHTML = "";

  if (!project.media?.length) {
    const empty = document.createElement("div");
    empty.className = "media-empty";
    empty.textContent = "该项目的图片/视频素材可继续补充。";
    container.append(empty);
    return;
  }

  project.media.forEach((media) => {
    const item = document.createElement("button");
    item.className = "project-media-item";
    if (media.variant) item.classList.add(`variant-${media.variant}`);
    item.type = "button";
    item.append(createMedia(media));

    const caption = document.createElement("span");
    caption.className = "media-caption";
    caption.textContent = media.title || "项目媒体";
    item.append(caption);

    const label = variantLabel(media.variant);
    if (label) {
      const badge = document.createElement("em");
      badge.className = "variant-badge";
      badge.textContent = label;
      item.append(badge);
    }

    item.addEventListener("click", () => openDialog(project, media));
    container.append(item);
  });
}

function renderProjects() {
  const list = visibleProjects();
  nodes.projectList.innerHTML = "";
  nodes.emptyState.hidden = list.length > 0;

  list.forEach((project, index) => {
    const card = nodes.template.content.firstElementChild.cloneNode(true);
    const number = card.querySelector(".project-number");
    const category = card.querySelector(".category");
    const year = card.querySelector(".year");
    const title = card.querySelector("h3");
    const summary = card.querySelector(".project-summary");
    const result = card.querySelector(".result-line");
    const highlights = card.querySelector(".highlight-list");
    const tags = card.querySelector(".tag-row");
    const mediaList = card.querySelector(".project-media-list");

    card.id = project.id || `project-${index + 1}`;
    number.textContent = String(projects.indexOf(project) + 1).padStart(2, "0");
    category.textContent = project.category || "Project";
    year.textContent = project.year || "";
    title.textContent = project.title || "Untitled";
    summary.textContent = project.summary || "";
    result.textContent = project.result || "";
    result.hidden = !project.result;
    renderHighlights(highlights, project.highlights || []);
    renderTags(tags, project.tags || []);
    renderProjectMedia(mediaList, project);
    nodes.projectList.append(card);
  });
}

function bindDialog() {
  nodes.dialogClose.addEventListener("click", () => nodes.dialog.close());
  nodes.dialog.addEventListener("click", (event) => {
    if (event.target === nodes.dialog) {
      nodes.dialog.close();
    }
  });
}

renderProfile();
renderFeatured();
renderFilters();
renderProjects();
bindDialog();
