$(function() {
    //创建渗透区域对象
    var connection = new Connection();

    $("form").on("submit", function(event) {
        stop();

        // 阻止发送事件发生
        event.preventDefault();

        // 根据输入数据创建表格
        var length = $("#length", this).val(); length = parseInt(length);
        var width = $("#width", this).val(); width = parseInt(width);
        var speed = $("#speed", this).val(); speed = parseInt(speed);
        var $table = $("<table border='3'></table>");

        for(var i=width-1; i>=0; --i) {
            var $tr = $table.append("<tr></tr>");
            for(var j=length-1; j>=0; --j) {
                $tr.append("<td></td>");
            }
        }
        $("div.table").append($table);

        //初始化对象
        connection.initial({
            width: width,
            length: length,
            element: $table.get(0),
            permeated_class: "is-permeated",
            per_topoint_class: "permeated-endpoint",
            path_class: "is-path",
            timeout: speed
        });
        connection.work();
    })
    .on("reset", function(event) {
        stop();
    });

    function stop() {
        document.querySelector("div.table").innerHTML = "";
        connection.stop();
    }
});