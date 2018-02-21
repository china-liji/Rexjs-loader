import html from "./c.html";
import css from "./d.css";
import json from "./e.json";

if(html.indexOf("<div>") === -1){
	throw "html 加载失败";
}

if(json.a !== 1){
	throw "json 加载失败!";
}

class b {};

export default css;