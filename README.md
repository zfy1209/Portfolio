# Portfolio

这是一个可部署的静态个人作品集，用于简历投递阶段展示项目经历、图片、视频和联系方式。

## 当前结构

```text
portfolio/
  index.html                 公开展示页
  public.css                 公开展示页样式
  public.js                  公开展示页逻辑
  data/
    portfolio-data.js        个人资料、项目描述和媒体列表
  assets/
    works/                   原始大视频，建议使用 Git LFS 管理
    works_web/               压缩后的视频，用于 GitHub Pages 直接播放
    posters/                 视频封面图
  studio.html                本地整理工具，不在公开导航中显示
  styles.css                 本地整理工具样式
  script.js                  本地整理工具逻辑
  .nojekyll                  GitHub Pages 兼容文件
```

## 页面结构

公开页按“项目”划分，而不是按单个素材划分：

```text
项目 1
  项目描述
  关键成果
  项目亮点
  对应视频 / 图片

项目 2
  项目描述
  关键成果
  项目亮点
  SDF 前后对比视频

项目 3
  项目描述
  关键成果
  项目亮点
  对应视频 / 图片
```

## 修改项目内容

编辑 `data/portfolio-data.js` 中的 `projects` 数组。

项目格式：

```js
{
  id: "project-id",
  title: "项目名称",
  category: "项目分类",
  year: "2025-2026",
  featured: true,
  result: "关键成果摘要。",
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
      src: "assets/works_web/demo.web.mp4",
      poster: "assets/posters/demo.web.jpg",
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

`result` 会显示为项目卡片中的成果高亮。视频建议补充 `poster`，这样页面加载时会先显示封面图，而不是黑色播放器区域。

项目二的对比视频可以添加 `variant` 字段：

```js
{
  title: "未引入 SDF 全身避障任务",
  variant: "without",
  type: "video",
  src: "assets/works_web/项目二-无sdf.mp4",
  poster: "assets/posters/项目二-无sdf.jpg"
}
```

```js
{
  title: "引入 SDF 全身距离感知与梯度避障任务",
  variant: "with",
  type: "video",
  src: "assets/works_web/项目二-有sdf.mp4",
  poster: "assets/posters/项目二-有sdf.jpg"
}
```

## 修改联系方式

公开页不会把邮箱、微信、手机号渲染成链接按钮，而是直接显示具体文本。编辑 `data/portfolio-data.js` 中的 `contacts`：

```js
contacts: [
  {
    label: "Email",
    value: "zengfeiyang1209@163.com"
  },
  {
    label: "WeChat",
    value: "zfyzfyzfy2002"
  },
  {
    label: "Phone",
    value: "18161316315"
  }
]
```

## 视频与 GitHub Pages

如果视频使用 Git LFS，GitHub Pages 下的相对路径可能只返回 LFS 指针文件，导致网页里的 `<video>` 无法播放。

当前页面使用压缩后的视频：

```text
assets/works_web/*.mp4
```

这些视频体积较小，可以由 GitHub Pages 直接托管。`data/portfolio-data.js` 中的：

```js
videoBaseUrl: ""
```

表示不再使用 Git LFS media 地址。原始大视频仍可保留在 `assets/works/` 并用 Git LFS 管理，网页展示优先使用 `assets/works_web/`。

## 生成视频封面

本机 FFmpeg 路径示例：

```powershell
$ffmpeg = "C:\Users\PC\Tools\ffmpeg\ffmpeg-9.0.1-essentials_build\bin\ffmpeg.exe"
```

为单个视频生成封面：

```powershell
& $ffmpeg -y -ss 00:00:01 -i ".\assets\works_web\单臂同步推理.web.mp4" -frames:v 1 -q:v 3 ".\assets\posters\单臂同步推理.web.jpg"
```

## 当前三个项目

- 基于 Diffusion Policy 的机械臂视觉模仿学习与实时推理优化
- 双臂协同搬运反应式规划与任务优先级控制系统
- 双臂机器人 VR 遥操作与具身智能数据采集系统

## Git 提交

修改完成后，在 `portfolio` 目录执行：

```powershell
git status
git add index.html public.css public.js data/portfolio-data.js README.md assets/posters
git commit -m "Polish portfolio visual presentation"
git push origin main
```

如果当前 PowerShell 提示找不到 `git`，请关闭 PowerShell 后重新打开，或在 Git Bash 中执行上述命令。
