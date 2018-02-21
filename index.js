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
		constructor(source, webpack){
			var resultList = [], resourcePath = webpack.resourcePath, { root, unhelper } = getOptions(webpack) || {};

			// 如果不需要附带 rex-browser-helper.min.js 文件
			if(unhelper){
				first = false;
			}

			Loader.parse(resultList, resourcePath, source, root, unhelper)

			// 如果是首次加载模块
			if(first){
				resultList.unshift(
					fs.readFileSync(
						require.resolve("rexjs-api/rex-browser-helper.min.js"),
						"utf8"
					)
				);

				first = false;
			}

			this.result = resultList.join("\n");
		};

		static parse(resultList, resourcePath, source, root, unhelper){
			var parser = new ECMAScriptParser();

			if(path.parse(resourcePath).ext !== ".js"){
				resultList.push(
					`new Rexjs.Module("${path.relative(root || "", resourcePath)}","${source.split('"').join('\\"').split("\n").join("\\n")}");`
				);
				return;
			}

			switch(path.parse(resourcePath).ext){
				case ".js":
					break;

				// 如果是 css
				case ".css":
					// 设置模块解析结果
					result = new CSSCompiler(content, name.href);
					// 获取依赖
					deps = result.imports;
					break;
				
				// 如果是 json
				case ".json":
					// 设置模块解析结果
					result = parse(content);
					break;
			}

			new ParserConfig();

			// 解析文件
			parser.parse(
				// 初始化文件
				new File(
					unhelper ? null : path.relative(root || "", resourcePath),
					source
				)
			);

			parser.deps.forEach((dep) => {
				var rpath = url.resolve(resourcePath, dep);

				resultList.push(
					this.parse(
						resultList,
						rpath,
						fs.readFileSync(rpath, "utf8"),
						root,
						unhelper
					)
				);
			});

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