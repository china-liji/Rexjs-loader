module.exports = {
	entry: [
		"./test/a.js"
	],
	output: {
		path: __dirname,
		filename: "a.min.js"
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				loader: "./index.js"
			}
		]
	}
};