'use strict';

function videoMarkdown(context) {
	return {
		plugin: function(markdownIt) {
			const defaultImage = markdownIt.renderer.rules.image;

			markdownIt.renderer.rules.image = function(tokens, idx, options, env, self) {
				const token = tokens[idx];
				const src = token.attrGet('src') || '';

				if (/\.(mp4|webm|ogv|mov)([?#].*)?$/i.test(src)) {
					const alt = self.renderInlineAsText(token.children || [], options, env);
					const esc = markdownIt.utils.escapeHtml;
					return `<video controls preload="metadata" style="max-width:100%" src="${esc(src)}">${esc(alt)}</video>`;
				}

				return defaultImage
					? defaultImage(tokens, idx, options, env, self)
					: self.renderToken(tokens, idx, options);
			};
		},
		assets: function() {
			return [];
		},
	};
}

module.exports = { default: videoMarkdown };
