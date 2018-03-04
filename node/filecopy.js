let path = require("path"), libPath = path.resolve(__dirname, "../test");

new (
	require("rexjs-filecopy")
)({
	"rexjs-api/dist/rex-browser-helper.min.js": libPath,
	"rexjs-api/dist/rex.bundle.js": libPath
});