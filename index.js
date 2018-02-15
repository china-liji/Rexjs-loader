new function(Loader, Rexjs, fs, path, getOptions){

this.Loader = Loader =function(File, parser, first){
	return class Loader {
		constructor(source, resourcePath){
			var result = "";

			if(first){
				result += fs.readFileSync(
					require.resolve("rexjs-api/rex-browser-helper.min.js"),
					"utf8"
				);

				result += "\n";

				first = false;
			}

			parser.parse(
				// 初始化文件
				new File(resourcePath, source)
			);

			result += parser.build();
			this.result = result;
		};
	};
}(
	Rexjs.File,
	// parser
	new Rexjs.ECMAScriptParser(),
	// first
	true
);

module.exports = function(source, a, b){
	var root = (getOptions(this) || {}).root;

	return (
		new Loader(
			source,
			path.relative(root || "", this.resourcePath)
		)
		.result
	);
};

}(
	// Loader
	null,
	// Rexjs
	require("rexjs-api"),
	// fs
	require("fs"),
	// path
	require("path"),
	// getOptions
	require("loader-utils").getOptions
);