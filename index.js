new function(Loader, Rexjs, fs, path, getOptions){

this.Loader = Loader = function(File, parser, first){
	return class Loader {
		constructor(source, webpack){
			var result = "", options = getOptions(webpack) || {}, unrex = options.unrex;

			// 如果不需要附带 rex-browser-helper.min.js 文件
			if(unrex){
				first = false;
			}

			// 如果是首次加载模块
			if(first){
				// 读取 rex-browser-helper.min.js
				result += fs.readFileSync(
					require.resolve("rexjs-api/rex-browser-helper.min.js"),
					"utf8"
				);

				// 加上换行
				result += "\n";
				first = false;
			}

			// 解析文件
			parser.parse(
				// 初始化文件
				new File(
					unrex ? null : path.relative(options.root || "", webpack.resourcePath),
					source
				)
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

module.exports = function(source){
	return (
		new Loader(source, this).result
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