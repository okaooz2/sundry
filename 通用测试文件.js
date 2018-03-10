let date = new Date();
date.setDate(date.getDate()+1);
console.log(date);

let cookie_tool = new CookieTool();
cookie_tool.set({name: "abc", value: "god", expires: date});
// cookie_tool.unset("abc");


console.log(document.cookie);
console.log(decodeURIComponent(document.cookie));
console.log(cookie_tool.get("大神名字"));