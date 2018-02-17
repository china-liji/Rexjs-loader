let unhelper = process.argv.indexOf("unhelper") > -1;

module.exports = {
	entry: [
		"./test/a.js"
	],
	output: {
		path: __dirname,
		filename: unhelper ? "a-unhelper.min.js" : "a.min.js"
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				loader: "./index.js",
				options: {
					root: __dirname,
					unhelper
				}
			}
		]
	}
};