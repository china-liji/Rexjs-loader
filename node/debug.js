let unhelper = process.argv.indexOf("--unhelper") > -1, path = require("path"), testPath = path.resolve(__dirname, "../test");

require("webpack")(
	{
		entry: [
			testPath + "/a.js"
		],
		output: {
			path: testPath,
			filename: unhelper ? "a-unhelper.min.js" : "a.min.js"
		},
		module: {
			rules: [
				require("../index").getRule({
					root: testPath,
					unhelper
				}
			)]
		}
	},
	(err, stats) => {
		if(err || stats.hasErrors()){
			throw err || stats.toJson().errors;
		}

		console.log("webpack ok...")
	}
);