let Rexjs = require("rexjs-api");

module.exports = function(source){
	var parser = new Rexjs.ECMAScriptParser();

	parser.parse(
		// 初始化文件
		new Rexjs.File(null, source)
	);

	return parser.build();
};