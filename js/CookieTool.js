//定义了操作cookie的对象
function CookieTool() {

}
CookieTool.prototype = {
    //根据键名查找键值的函数，返回键值；若查找不到键名则返回null
    get: function(name) {
        //编码查询的键名
        let cookie = document.cookie;
        name = encodeURIComponent(name) + "=";
        let start_index = cookie.indexOf(name) + name.length;     //此为值的起始索引
        let value = null;
        //当查找到内容时，进一步获取内容
        if(start_index > -1) {
            let end_index = cookie.indexOf(";", start_index);
            if(end_index === -1) {     //此时说明键值对在最后
                value = cookie.slice(start_index, cookie.length);
            }
            else {  //此时说明键值对在最后
                value = cookie.slice(start_index, end_index);
            }
            value = decodeURIComponent(value);
        }

        return value;
    },
    //设置cookie
    set: function({name, value, domain, path, expires, secure}) {
        //若连最基本的cookie名都不输入，则终止创建cookie
        if(!name) {
            return false;
        }

        //设置名和值
        let cookie_text = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        //设置域名
        if(!!domain) {
            cookie_text = `${cookie_text}; domain=${domain}`;
        }
        //设置路径
        if(!!path) {
            cookie_text = `${cookie_text}; path=${path}`;
        }
        //设置失效日期
        if(expires instanceof Date) {
            cookie_text = `${cookie_text}; expires=${expires.toGMTString()}`;
        }
        //设置安全信息
        if(!!secure) {
            cookie_text = `${cookie_text}; secure=${secure}`;
        }
        document.cookie = cookie_text;  //这里不会把之前所有cookie覆盖掉，而是会添加现有cookie
    },
    //删除cookie
    unset: function(name) {
        this.set({name: name, expires: new Date(0)});
    }
};