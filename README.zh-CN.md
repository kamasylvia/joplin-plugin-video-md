# Video Markdown for Joplin

[English](README.md) | 简体中文

用普通 Markdown 图片语法写远程视频：

```md
![clip](https://cdn.example.com/clip.mp4)
```

Joplin 的 Markdown 预览会渲染成内联 `<video controls>` 播放器。笔记里不用写 HTML，普通图片不受影响。

本插件尚未进入 Joplin 插件库，需手动安装 `.jpl`（见下文）。

## 功能

- 纯 Markdown 语法：`![alt](url.mp4)`
- 远程直链视频内联播放
- 匹配 `.mp4`、`.webm`、`.ogv`、`.mov`，不区分大小写
- 保留 query 字符串和 `#t=start,end` 片段
- `preload="metadata"`、`max-width:100%`
- 其余情况回退到 Joplin 原生图片渲染

## 安装

### 从 `.jpl` 安装

```bash
npm ci
npm run dist
```

然后 Joplin → 设置 → 插件 → **Install from file** → `publish/io.github.kamasylvia.video-md.jpl`。按提示重启 Joplin。

### 开发模式

先构建一次，然后把 `dist/` 加到 设置 → 插件 → Advanced Settings → **Development plugins**。

## 用法

```md
![demo](https://cdn.example.com/demo.mp4)
![demo](https://cdn.example.com/demo.webm#t=30,60)
![demo](https://cdn.example.com/demo.mp4?token=abc)
```

alt 文本会成为 `<video>` 的 fallback 内容。不会自动播放，用户点播放才开始。

## 实现方式

插件注册一个 Markdown-It content script（`ContentScriptType.MarkdownItPlugin`），覆盖 `image` 渲染规则。URL 扩展名匹配视频时输出：

```html
<video controls preload="metadata" style="max-width:100%" src="...">alt</video>
```

否则调用 Joplin 原来的图片规则，资源图片和远程图片行为不变。

## 限制

- **仅 Markdown 预览。** 富文本编辑器不走 Markdown-It。
- **只支持直链。** 分享页、iframe 嵌入不是媒体直链，不能播放。
- **编码由 Joplin 的 Chromium 决定。** H.264/AAC MP4、WebM 可用；HEVC、MKV 通常不行。
- **按扩展名识别。** URL 必须在 `?` 或 `#` 前以 `.mp4`、`.webm`、`.ogv`、`.mov` 结尾。
- **不带 Cookie 鉴权。** 图床必须允许无浏览器 Cookie 的热链访问。
- **仅桌面端。** `platforms` 为 `["desktop"]`，移动端未测试。
- 不支持自动播放、播放列表、HLS。

## 开发

```bash
npm ci
npm test
npm run dist
```

产物：

- `dist/` — Joplin 开发插件路径使用的插件根目录
- `publish/io.github.kamasylvia.video-md.jpl`
- `publish/io.github.kamasylvia.video-md.json`

目录：

```text
src/          插件源码与 manifest
scripts/      发布构建
test/         渲染与注册测试
```

`npm run dist` 会把 `src/` 复制到 `dist/`，生成 plain-tar `.jpl`，并写出带 `_publish_hash`、`_publish_commit` 的 manifest JSON。

## 发布

已准备但未提交。检查表与 issue payload 见 [SUBMISSION.md](SUBMISSION.md)。

## License

MIT
