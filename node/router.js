const handler = require("./handler");


let handle = {};
handle["/"] = handler.index;

function router(req, res, post_data) {
    const url = decodeURIComponent(req.url);

    if(typeof handle[url] === "function") {
        handle[url](req, res);
    }
    else if(url.search(/\.[A-z|\d]+$/) !== -1) {
        handler.requireFile(req, res);
    }
    else {
        handler.error(req, res);
    }
}


exports.router = router;