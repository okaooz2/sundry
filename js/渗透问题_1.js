$("form").on("submit", function(event) {
    // 阻止发送事件发生
    event.preventDefault();
    // 使发送按钮不可选
    $(this).find("button")
    .prop("disabled", true);

    // 根据输入数据创建表格
    var length = $("#length", this).val(); length = parseInt(length);
    var width = $("#width", this).val(); width = parseInt(width);
    var $table = $("<table border='1'></table>");

    for(var i=0; i<width; ++i) {
        var $tr = $table.append("<tr></tr>");
        for(var j=0; j<length; ++j) {
            $tr.append("<td></td>");
        }
    }
    $("div.table").append($table);

    //创建渗透区域对象
    var connection = new Connection();
    connection.initial({
        width: width,
        length: length,
        element: $table.get(0),
        class_name: "is-permeated",
        path_name: "is-path",
        timeout: 300
    });
    connection.work();
});

//创建渗透区域对象
var connection = new Connection();
connection.initial({
    width
});