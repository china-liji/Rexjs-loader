new function(Loader, { File, ECMAScriptParser, Base64, URL, MODULE_CODE_STRING }, fs, path, colors, first){

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

this.Loader = Loader = function(ParserConfig, url, pathList){
	return class Loader {
		/**
		 * Rexjs 于 webpack 中使用的加载器
		 * @param {String} source - 源码字符串
		 * @param {WebpackLoader} webpackLoader - webpack loader 对象
		 */
		constructor(source, webpackLoader){
			let resultList = [], { resourcePath, data: { first } } = webpackLoader, { root, unhelper } = webpackLoader.query || {};

			// 如果不需要附带 rex-browser-helper.min.js 文件
			if(unhelper){
				first = false;
			}

			// 如果是首次加载模块
			if(first){
				console.log(
					`${colors.yellow("现在打包")}：${colors.green("rexjs-api/dist/rex-browser-helper.min.js")}`
				);

				// 添加 rex-browser-helper.min.js 文件
				resultList.push(
					fs.readFileSync(
						require.resolve("rexjs-api/dist/rex-browser-helper.min.js"),
						"utf8"
					)
					// 替换 module.exports 部分，防止 webpack 打包增加 module 模块
					.replace(
						MODULE_CODE_STRING,
						"({})"
					)
				);

				first = false;
			}

			// 解析文件
			Loader.parse(resultList, resourcePath, source, root, unhelper);

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
			let parser = new ECMAScriptParser();

			if(pathList.indexOf(resourcePath) > -1){
				return;
			}

			pathList.push(resourcePath);

			console.log(
				`${colors.yellow("现在打包")}：${colors.green(resourcePath)}`
			);

			// 如果不是 js 文件
			if(path.parse(resourcePath).ext !== ".js"){
				// 添加模块初始化代码
				resultList.push(
					`new Rexjs.Module("${
						path.relative(root || "", resourcePath)}","${source.replace(/("|\n|\\)/g, "\\$1")
					}");`
				);
				return;
			}

			// new ParserConfig();

			// 解析文件
			parser.parse(
				// 初始化文件
				new File(
					new URL(
						path.relative(root || "", resourcePath)
					),
					source
				)
			);

			// 遍历依赖
			parser.deps.forEach((dep) => {
				let rpath, u = new URL(
					url.resolve(resourcePath, dep)
				);

				// 如果文件名不存在
				if(u.filename === ""){
					let pathname = u.pathname;

					u = new URL(u.origin + (pathname ? pathname : "/index") + ".js" + u.search + u.hash);
				}

				rpath = u.href;

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
				parser.build(null, unhelper)
			);
		};
	};
}(
	this.ParserConfig,
	// url
	require("url"),
	// pathList
	[]
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
			colors.yellow(e.stack || e)
		);

		this.async();
	}
};

module.exports.getConfig = function(options){
	return {
		test: /\.js$/,
		loader: __filename,
		exclude: /node_modules/,
		options
	};
};

module.exports.getRule = function(options){
	return {
		test: /\.js?$/,
		exclude: /node_modules/,
		use: {
			loader: __filename,
			options
		}
	};
};

module.exports.pitch = function(remainingRequest, precedingRequest, data){
	data.first = first;
	first = false;
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
	// first
	true
);