# Video Markdown for Joplin

Render remote videos with normal Markdown image syntax:

```md
![clip](https://cdn.example.com/clip.mp4)
```

The Markdown viewer turns that into an inline `<video controls>` player. Normal images keep working.

## Install

1. Build the plugin (`npm run build`) or grab the `.jpl` from `publish/`.
2. Joplin → Settings → Plugins → **Install from file**.
3. Restart Joplin if prompted.

## Development

`dist/` is the plugin root. There is no webpack step; `dist/videoMd.js` is loaded directly as a Markdown-It content script.

```bash
npm install
npm test
npm run build
```

`npm run build` writes `publish/io.github.kamasylvia.video-md.jpl`.

For live development, point Settings → Plugins → Advanced Settings → **Development plugins** at this repo's `dist/` directory.

## Details

- Matches `.mp4`, `.webm`, `.ogv`, `.mov` URLs, including `?query` and `#fragment`.
- Emits `preload="metadata"` and `style="max-width:100%"`.
- Markdown viewer only; the rich text editor does not use Markdown-It.
- The URL must be a direct media URL. Share pages and iframe embeds do not work.
- Codec support follows Joplin's Chromium: H.264/AAC MP4 and WebM; HEVC/MKV often fail.
