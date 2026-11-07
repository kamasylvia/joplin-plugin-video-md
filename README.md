# Video Markdown for Joplin

Write remote videos in notes with ordinary Markdown image syntax:

```md
![clip](https://cdn.example.com/clip.mp4)
```

Joplin's Markdown viewer renders that as an inline `<video controls>` player. No raw HTML in the note, and normal images keep working.

This plugin is not yet in the Joplin plugin registry. Install the `.jpl` manually (see below).

## Features

- Markdown-only syntax: `![alt](url.mp4)`
- Inline playback for direct remote video URLs
- Matches `.mp4`, `.webm`, `.ogv`, and `.mov`, case-insensitively
- Keeps query strings and `#t=start,end` fragments
- `preload="metadata"` and `max-width:100%`
- Falls back to Joplin's original image renderer for everything else

## Install

### From a `.jpl`

```bash
npm ci
npm run dist
```

Then Joplin → Settings → Plugins → **Install from file** → `publish/io.github.kamasylvia.video-md.jpl`. Restart Joplin if prompted.

### Development

Build once, then add `dist/` under Settings → Plugins → Advanced Settings → **Development plugins**.

## Usage

```md
![demo](https://cdn.example.com/demo.mp4)
![demo](https://cdn.example.com/demo.webm#t=30,60)
![demo](https://cdn.example.com/demo.mp4?token=abc)
```

The alt text becomes the `<video>` fallback text. Videos do not autoplay; playback starts when the user presses play.

## How it works

The plugin registers a Markdown-It content script (`ContentScriptType.MarkdownItPlugin`) and overrides the `image` renderer rule. If the image URL has a supported video extension, it emits:

```html
<video controls preload="metadata" style="max-width:100%" src="...">alt</video>
```

Otherwise it calls Joplin's original image rule, so resource images and remote images behave as before.

## Limitations

- **Markdown viewer only.** The rich text editor does not use Markdown-It.
- **Direct media URLs only.** A share page or an iframe embed is not a media URL and will not play.
- **Codecs follow Joplin's Chromium.** H.264/AAC MP4 and WebM work; HEVC and MKV usually do not.
- **Extension-based detection.** The URL must end with `.mp4`, `.webm`, `.ogv`, or `.mov` before any `?` or `#`.
- **No cookie auth.** The remote host must allow hotlinking without the user's browser cookies.
- **Desktop only.** `platforms` is `["desktop"]`; mobile is untested.
- No autoplay, no playlist, no HLS.

## Development

```bash
npm ci
npm test
npm run dist
```

Outputs:

- `dist/` — plugin root used by Joplin's development plugin path
- `publish/io.github.kamasylvia.video-md.jpl`
- `publish/io.github.kamasylvia.video-md.json`

Layout:

```text
src/          plugin source and manifest
scripts/      release build
test/         renderer and registration tests
```

`npm run dist` copies `src/` to `dist/`, creates a plain-tar `.jpl`, and writes the manifest JSON with `_publish_hash` and `_publish_commit`.

## Publishing

Prepared but not submitted. See [SUBMISSION.md](SUBMISSION.md) for the pre-flight checklist and submission payload.

## License

MIT
