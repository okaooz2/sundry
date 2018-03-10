let date = new Date();
date.setDate(date.getDate()+1);

let cookie_tool = new CookieTool();
cookie_tool.set({name: "大神", value: "dashen", expires: date});
// cookie_tool.unset("无敌大神");


console.log(document.cookie);
console.log(decodeURIComponent(document.cookie));
console.log(cookie_tool.get("大神"));
console.log(cookie_tool.get("无敌大神"));