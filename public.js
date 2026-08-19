const data = window.PORTFOLIO_DATA || {};
const profile = data.profile || {};
const works = Array.isArray(data.works) ? data.works : [];

const nodes = {
  initials: document.querySelector("[data-initials]"),
  profileFields: document.querySelectorAll("[data-profile]"),
  heroLinks: document.querySelector("#heroLinks"),
  featuredMedia: document.querySelector("#featuredMedia"),
  featuredCategory: document.querySelector("#featuredCategory"),
  featuredTitle: document.querySelector("#featuredTitle"),
  filters: document.querySelector("#filters"),
  workGrid: document.querySelector("#workGrid"),
  emptyState: document.querySelector("#emptyState"),
  skillList: document.querySelector("#skillList"),
  contactLinks: document.querySelector("#contactLinks"),
  footerName: document.querySelector("[data-footer-name]"),
  template: document.querySelector("#workTemplate"),
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
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function createPlaceholder(label = "Portfolio") {
  const placeholder = document.createElement("div");
  placeholder.className = "placeholder-visual";
  const text = document.createElement("span");
  text.textContent = label;
  placeholder.append(text);
  return placeholder;
}

function createMedia(work, controls = false) {
  if (!work.media) {
    return createPlaceholder(work.category || "Work");
  }

  if (work.mediaType === "video") {
    const video = document.createElement("video");
    video.src = work.media;
    video.poster = work.poster || "";
    video.controls = controls;
    video.muted = !controls;
    video.playsInline = true;
    video.preload = controls ? "metadata" : "none";
    video.addEventListener("error", () => video.replaceWith(createPlaceholder("Video")));
    return video;
  }

  const image = document.createElement("img");
  image.src = work.media;
  image.alt = work.title || "作品图片";
  image.loading = "lazy";
  image.addEventListener("error", () => image.replaceWith(createPlaceholder("Image")));
  return image;
}

function renderTags(container, tags = []) {
  container.innerHTML = "";
  tags.slice(0, 8).forEach((tag) => {
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
  const featured = works.find((work) => work.featured) || works[0];
  nodes.featuredMedia.innerHTML = "";

  if (!featured) {
    nodes.featuredMedia.append(createPlaceholder("Portfolio"));
    return;
  }

  nodes.featuredMedia.append(createMedia(featured));
  nodes.featuredCategory.textContent = featured.category || "Featured";
  nodes.featuredTitle.textContent = featured.title || "Selected Work";
}

function categories() {
  return ["全部", ...new Set(works.map((work) => work.category).filter(Boolean))];
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
      renderWorks();
    });
    nodes.filters.append(button);
  });
}

function visibleWorks() {
  if (activeCategory === "全部") return works;
  return works.filter((work) => work.category === activeCategory);
}

function openDialog(work) {
  nodes.dialogMedia.innerHTML = "";
  nodes.dialogMedia.append(createMedia(work, true));
  nodes.dialogCategory.textContent = work.category || "Work";
  nodes.dialogTitle.textContent = work.title || "Untitled";
  nodes.dialogSummary.textContent = work.summary || "";
  renderTags(nodes.dialogTags, work.tags || []);
  nodes.dialog.showModal();
}

function renderWorks() {
  const list = visibleWorks();
  nodes.workGrid.innerHTML = "";
  nodes.emptyState.hidden = works.length > 0;

  list.forEach((work) => {
    const card = nodes.template.content.firstElementChild.cloneNode(true);
    const mediaButton = card.querySelector(".work-media");
    const category = card.querySelector(".category");
    const year = card.querySelector(".year");
    const title = card.querySelector("h3");
    const summary = card.querySelector("p");
    const tags = card.querySelector(".tag-row");
    const action = card.querySelector(".card-actions a");

    mediaButton.append(createMedia(work));
    mediaButton.addEventListener("click", () => openDialog(work));
    category.textContent = work.category || "Work";
    year.textContent = work.year || "";
    title.textContent = work.title || "Untitled";
    summary.textContent = work.summary || "";
    renderTags(tags, work.tags || []);

    if (work.link) {
      action.href = work.link;
    } else {
      action.hidden = true;
    }

    nodes.workGrid.append(card);
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
renderWorks();
bindDialog();
