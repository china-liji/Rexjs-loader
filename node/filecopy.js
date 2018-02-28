let path = require("path"), libPath = path.resolve(__dirname, "../test");

new (
	require("rexjs-filecopy")
)({
	"rexjs-api/rex-browser-helper.min.js": libPath,
	"rexjs-api/rex.bundle.js": libPath
});