# Portfolio

这是一个可部署的静态个人作品集，用于简历投递阶段展示图片、视频和项目案例。

## 文件结构

```text
portfolio/
  index.html                 公开展示页，部署后别人访问这个页面
  public.css                 公开展示页样式
  public.js                  公开展示页逻辑
  data/
    portfolio-data.js        个人资料和作品数据
  assets/
    works/                   放图片、视频、封面图
  studio.html                本地整理工具
  styles.css                 本地整理工具样式
  script.js                  本地整理工具逻辑
```

## 公开链接怎样生效

本地路径不能直接发给别人。需要把整个 `portfolio` 文件夹部署到 GitHub Pages、Vercel、Netlify 或自己的服务器。

部署后，别人访问类似这样的地址即可查看：

```text
https://yourname.github.io/portfolio/
```

## 添加图片或视频

1. 把素材放入 `assets/works/`。
2. 打开 `data/portfolio-data.js`。
3. 在 `works` 数组里添加作品信息。

图片作品示例：

```js
{
  title: "校园服务小程序 UI",
  category: "产品设计",
  year: "2026",
  summary: "负责信息架构、交互流程和高保真界面设计，提升任务入口的可发现性。",
  mediaType: "image",
  media: "assets/works/campus-app-cover.jpg",
  link: "https://example.com",
  tags: ["Figma", "UI", "Prototype"]
}
```

视频作品示例：

```js
{
  title: "项目演示视频",
  category: "视频演示",
  year: "2026",
  summary: "展示项目核心流程、交互细节和最终效果。",
  mediaType: "video",
  media: "assets/works/demo.mp4",
  poster: "assets/works/demo-poster.jpg",
  tags: ["Demo", "Editing"]
}
```

## 修改个人信息

编辑 `data/portfolio-data.js` 中的 `profile`：

- `name`: 姓名
- `headline`: 求职方向或作品集标题
- `bio`: 首页简介
- `about`: 关于我
- `email`: 邮箱
- `skills`: 技能标签
- `links`: 邮箱、GitHub、简历、视频主页等链接

## 本地整理工具

`studio.html` 是之前实现的本地上传管理工具，数据存在浏览器 IndexedDB 里，适合临时整理素材和文案。

注意：`studio.html` 里上传的数据不会自动进入公开展示页。要让别人看到作品，需要把素材文件放到 `assets/works/`，并在 `data/portfolio-data.js` 中登记。

## 部署建议

- 图片建议使用 `.jpg` / `.png` / `.webp`。
- 视频建议压缩为 `.mp4`，单个视频尽量控制体积。
- 如果视频很大，建议上传到 B 站、YouTube、网盘或对象存储，再在作品 `link` 中放外链。
