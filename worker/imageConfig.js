let imageConfig = {
	thumbSuffix: '_thumb',

	extMappings: {
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/gif': 'gif'
	},

	thumbSizes: {
		w: 176,
		h: 100
	},

	minSizes: {
		w: 200,
		h: 200
	},

	basePath: 'images/'
};

module.exports = imageConfig;
