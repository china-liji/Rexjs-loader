let unrex = process.argv.indexOf("unrex") > -1;

module.exports = {
	entry: [
		"./test/a.js"
	],
	output: {
		path: __dirname,
		filename: (unrex ? "unrex." : "") + "a.min.js"
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				loader: "./index.js",
				options: {
					root: __dirname,
					unrex
				}
			}
		]
	}
};