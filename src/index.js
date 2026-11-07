joplin.plugins.register({
	onStart: async function() {
		await joplin.contentScripts.register(
			'markdownItPlugin',
			'video-md',
			'./videoMd.js'
		);
	},
});
