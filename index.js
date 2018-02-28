new function(Loader, { File, ECMAScriptParser, Base64 }, fs, path, colors, getOptions){

this.ParserConfig = function(Buffer, ready){
	return class ParserConfig {
		constructor(){
			// 暂不支持 sourcemap
			ready = true;

			if(ready){
				return;
			}

			ready = true;

			Base64.bindBtoa(function(string){
				return Buffer.from(string).toString("base64")
			});

			ECMAScriptParser.sourceMaps = true;
		};
	};
}(
	Buffer,
	// ready
	false
);

this.Loader = Loader = function(ParserConfig, url, first){
	return class Loader {
		/**
		 * Rexjs 于 webpack 中使用的加载器
		 * @param {String} source - 源码字符串
		 * @param {Webpack} webpack - webpack 对象
		 */
		constructor(source, webpack){
			var resultList = [], resourcePath = webpack.resourcePath, { root, unhelper } = getOptions(webpack) || {};

			// 如果不需要附带 rex-browser-helper.min.js 文件
			if(unhelper){
				first = false;
			}

			// 解析文件
			Loader.parse(resultList, resourcePath, source, root, unhelper)

			// 如果是首次加载模块
			if(first){
				// 添加 rex-browser-helper.min.js 文件
				resultList.unshift(
					fs.readFileSync(
						require.resolve("rexjs-api/rex-browser-helper.min.js"),
						"utf8"
					)
				);

				first = false;
			}

			// 设置结果
			this.result = resultList.join("\n");
		};

		/**
		 * 解析源码
		 * @param {Array} resultList - 结果收集列表
		 * @param {String} resourcePath - 源码文件路径
		 * @param {String} source - 源码字符串
		 * @param {String} root - 根目录
		 * @param {Boolean} unhelper - 是否不需要合并 rex-browser-helper.min.js 文件
		 */
		static parse(resultList, resourcePath, source, root, unhelper){
			var parser = new ECMAScriptParser();

			// 如果不是 js 文件
			if(path.parse(resourcePath).ext !== ".js"){
				// 添加模块初始化代码
				resultList.push(
					`new Rexjs.Module("${path.relative(root || "", resourcePath)}","${source.split('"').join('\\"').split("\n").join("\\n")}");`
				);
				return;
			}

			// new ParserConfig();

			// 解析文件
			parser.parse(
				// 初始化文件
				new File(
					unhelper ? "" : path.relative(root || "", resourcePath),
					source
				)
			);

			// 遍历依赖
			parser.deps.forEach((dep) => {
				var rpath = url.resolve(resourcePath, dep);

				// 添加依赖解析结果
				resultList.push(
					// 解析依赖
					this.parse(
						resultList,
						rpath,
						fs.readFileSync(rpath, "utf8"),
						root,
						false
					)
				);
			});

			// 添加编译结果
			resultList.push(
				parser.build()
			);
		};
	};
}(
	this.ParserConfig,
	// url
	require("url"),
	// first
	true
);

module.exports = function(source){
	try {
		return (
			new Loader(source, this).result
		);
	}
	catch(e){
		console.log(
			colors.red("Rexjs 解析发现错误：") +
			colors.yellow(e)
		);

		this.async();
	}
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
	// colors
	require("colors/safe"),
	// getOptions
	require("loader-utils").getOptions
);