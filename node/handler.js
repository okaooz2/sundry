const fs = require("fs");
const mime = require("mime");


//首页处理函数
function index(req, res) {
    requireFile(req, res, `${__dirname}/index.html`);
}

//地址错误处理函数
function error(req, res, other) {
    res.writeHead(404, {"content-type": "text/plain; charset=utf-8;"})
    res.write(`404 你迷路了`);
    if(typeof other === "string") {
        res.write(other);
    }
    res.end();
}

//返回请求的文件
function requireFile(req, res, path) {
    //文件路径
    if(typeof path === "string") {
        ;
    }
    else {
        path = `${__dirname}${decodeURIComponent(req.url)}`;
    }
    fs.readFile(path, function(err, data) {
        if(!!err) {
            error(req, res, err.message);
            console.log(err.message);
        }
        else {
            const content_type = mime.getType(path);
            res.writeHead(200, {"content-type": content_type});
            res.write(data);
            res.end();
        }
    });
}

exports.index = index;
exports.error = error;
exports.requireFile = requireFile;