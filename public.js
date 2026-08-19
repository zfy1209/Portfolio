const data = window.PORTFOLIO_DATA || {};
const profile = data.profile || {};
const projects = Array.isArray(data.projects) ? data.projects : Array.isArray(data.works) ? data.works : [];

const nodes = {
  initials: document.querySelector("[data-initials]"),
  profileFields: document.querySelectorAll("[data-profile]"),
  heroLinks: document.querySelector("#heroLinks"),
  featuredMedia: document.querySelector("#featuredMedia"),
  featuredCategory: document.querySelector("#featuredCategory"),
  featuredTitle: document.querySelector("#featuredTitle"),
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
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "PF";
  if (/[\u4e00-\u9fa5]/.test(name)) return name.trim().slice(-2);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function firstMedia(project) {
  return project?.media?.[0];
}

function createPlaceholder(label = "Portfolio") {
  const placeholder = document.createElement("div");
  placeholder.className = "placeholder-visual";
  const text = document.createElement("span");
  text.textContent = label;
  placeholder.append(text);
  return placeholder;
}

function createMedia(media, controls = false) {
  if (!media?.src) {
    return createPlaceholder(media?.title || "Media");
  }

  if (media.type === "video") {
    const video = document.createElement("video");
    video.src = media.src;
    video.poster = media.poster || "";
    video.controls = controls;
    video.muted = !controls;
    video.playsInline = true;
    video.preload = controls ? "metadata" : "metadata";
    video.addEventListener("error", () => video.replaceWith(createPlaceholder("Video")));
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

function renderProfile() {
  document.title = `${profile.name || "Portfolio"} | 个人作品集`;
  nodes.initials.textContent = getInitials(profile.name);
  nodes.footerName.textContent = profile.name || "Portfolio";

  nodes.profileFields.forEach((node) => {
    const key = node.dataset.profile;
    node.textContent = profile[key] || node.textContent;
  });

  nodes.heroLinks.innerHTML = "";
  (profile.links || []).slice(0, 3).forEach((link, index) => {
    if (!link.href || !link.label) return;
    const anchor = document.createElement("a");
    anchor.className = index === 0 ? "button primary" : "button subtle";
    anchor.href = link.href;
    anchor.textContent = link.label;
    if (!link.href.startsWith("mailto:") && !link.href.startsWith("#")) {
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
    }
    nodes.heroLinks.append(anchor);
  });

  nodes.skillList.innerHTML = "";
  (profile.skills || []).forEach((skill) => {
    const item = document.createElement("span");
    item.textContent = skill;
    nodes.skillList.append(item);
  });

  nodes.contactLinks.innerHTML = "";
  const contactItems = [...(profile.links || [])];
  if (profile.email && !contactItems.some((item) => item.href === `mailto:${profile.email}`)) {
    contactItems.unshift({ label: "Email", href: `mailto:${profile.email}` });
  }
  contactItems.forEach((link) => {
    if (!link.href || !link.label) return;
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.textContent = link.label;
    if (!link.href.startsWith("mailto:") && !link.href.startsWith("#")) {
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
    }
    nodes.contactLinks.append(anchor);
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
    item.type = "button";
    item.append(createMedia(media));

    const caption = document.createElement("span");
    caption.textContent = media.title || "项目媒体";
    item.append(caption);
    item.addEventListener("click", () => openDialog(project, media));
    container.append(item);
  });
}

function renderProjects() {
  const list = visibleProjects();
  nodes.projectList.innerHTML = "";
  nodes.emptyState.hidden = projects.length > 0;

  list.forEach((project, index) => {
    const card = nodes.template.content.firstElementChild.cloneNode(true);
    const category = card.querySelector(".category");
    const year = card.querySelector(".year");
    const title = card.querySelector("h3");
    const summary = card.querySelector("p");
    const highlights = card.querySelector(".highlight-list");
    const tags = card.querySelector(".tag-row");
    const mediaList = card.querySelector(".project-media-list");

    card.id = project.id || `project-${index + 1}`;
    category.textContent = project.category || "Project";
    year.textContent = project.year || "";
    title.textContent = project.title || "Untitled";
    summary.textContent = project.summary || "";
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
