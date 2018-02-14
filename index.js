new function(Rexjs, fs){

this.Loader = function(File, parser, first){
	return class Loader {
		constructor(source){
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
				new File(null, source)
			);

			console.log(123)

			debugger

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

module.exports = (source) => {
	return new this.Loader(source).result;
};

}(
	// Rexjs
	require("rexjs-api"),
	// fs
	require("fs")
);