# Portfolio

这是一个可部署的静态个人作品集，用于简历投递阶段展示项目经历、图片和视频。

## 当前结构

```text
portfolio/
  index.html                 公开展示页，部署后别人访问这个页面
  public.css                 公开展示页样式
  public.js                  公开展示页逻辑
  data/
    portfolio-data.js        个人资料、项目描述和媒体列表
  assets/
    works/                   放图片、视频、视频封面
  studio.html                本地整理工具
  styles.css                 本地整理工具样式
  script.js                  本地整理工具逻辑
  .nojekyll                  GitHub Pages 兼容文件
```

## 公开链接怎样生效

本地路径不能直接发给别人。需要把整个 `portfolio` 文件夹部署到 GitHub Pages、Vercel、Netlify 或自己的服务器。

部署后，别人访问类似这样的地址即可查看：

```text
https://yourname.github.io/portfolio/
```

## 当前页面结构

公开页按照“项目”划分，而不是按照单个素材划分：

```text
项目 1
  项目描述
  项目亮点
  对应视频 / 图片

项目 2
  项目描述
  项目亮点
  对应视频 / 图片

项目 3
  项目描述
  项目亮点
  对应视频 / 图片
```

## 添加或修改项目

编辑 `data/portfolio-data.js` 中的 `projects` 数组。

项目格式：

```js
{
  id: "project-id",
  title: "项目名称",
  category: "项目分类",
  year: "2025-2026",
  featured: true,
  summary: "项目的简短描述。",
  highlights: [
    "项目亮点 1。",
    "项目亮点 2。"
  ],
  tags: ["Diffusion Policy", "ROS", "Real Robot"],
  media: [
    {
      title: "演示视频",
      type: "video",
      src: "assets/works/demo.mp4",
      description: "视频说明。"
    },
    {
      title: "实验截图",
      type: "image",
      src: "assets/works/result.jpg",
      description: "图片说明。"
    }
  ]
}
```

## 修改联系方式

公开页不会把邮箱和微信渲染成链接按钮，而是直接展示具体文本。编辑 `data/portfolio-data.js` 中的 `contacts`：

```js
contacts: [
  {
    label: "Email",
    value: "zengfeiyang1209@163.com"
  },
  {
    label: "WeChat",
    value: "zfyzfyzfy2002"
  }
]
```

## 添加图片或视频

1. 把素材文件放入 `assets/works/`。
2. 在 `data/portfolio-data.js` 对应项目的 `media` 数组里添加一条记录。
3. `src` 要写成相对路径，例如：

```js
src: "assets/works/demo.mp4"
```

视频建议使用 `.mp4`，图片建议使用 `.jpg`、`.png` 或 `.webp`。

## GitHub Pages 与视频播放

如果视频使用 Git LFS，GitHub Pages 下的相对路径可能只返回 LFS 指针文件，导致网页里 `<video>` 无法播放。

当前页面已改为使用压缩后的网页播放版本：

```text
assets/works_web/*.web.mp4
```

这些压缩视频体积较小，可以由 GitHub Pages 直接托管。`data/portfolio-data.js` 中的：

```js
videoBaseUrl: ""
```

表示不再使用 GitHub LFS media 地址。

原始大视频仍可保留在 `assets/works/` 并使用 Git LFS 管理；网页展示优先使用 `assets/works_web/` 中的压缩视频。

## 当前三个项目

页面已按简历内容整理为三个项目：

- 基于 Diffusion Policy 的机械臂视觉模仿学习与实时推理优化
- 双臂协同搬运反应式规划与任务优先级控制系统
- 双臂机器人 VR 遥操作与具身智能数据采集系统

已有视频已经挂到对应项目下。第二个项目目前没有对应图片/视频素材，后续可继续补充到它的 `media` 数组里。

## Git 提交

修改完成后，在 `portfolio` 目录执行：

```powershell
git status
git add .
git commit -m "Group portfolio by resume projects"
git push
```

如果当前 PowerShell 提示找不到 `git`，请关闭 PowerShell 后重新打开，或在 Git Bash 中执行上述命令。
