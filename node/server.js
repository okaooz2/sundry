const http = require("http");
const router = require("./router");

let server = http.createServer();
server.on("request", function(req, res) {
    let post_data = "";
    req.on("data", function(data_chunk) {
        post_data += data_chunk;
    });
    req.on("end", function() {
        if(post_data !== "") {
            post_data = decodeURIComponent(post_data);
        }
        router.router(req, res, post_data);
    });
});
server.listen(666);
console.log(`服务器已开启`);