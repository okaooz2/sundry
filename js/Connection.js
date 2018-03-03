//单个节点对象
function Node() {
    this.id = -1;       //节点自身id
    this.next_id = -1;  //本节点所指向节点的id
    this.size = -1;     //下属节点大数量（包含本身）
    this.is_permeated = false;  //是否已被渗透
}
Node.prototype = {
    //初始化对象的方法
    initial: function(id) {
        this.next_id = this.id = id;  //节点指向自身
        this.size = 1;
        this.is_permeated = false;
    }
};

//渗透结构的对象
function Connection() {
    this.nodes = [];    //节点集合
    this.to_permeated_id = [];  //待渗透节点的id集合
    this.width = -1;    //区域宽度
    this.length = -1;   //区域长度
    
    this.element = null;    //表格元素
    this.class_name = "";   //被渗透节点的类名的类名
    this.path_name = "";    //路径节点的类名
    this.timeout = -1;      //渗透节点的时间间隔，单位毫秒
}
Connection.prototype = {
    //初始化对象的方法
    initial: function(obj) {
        this.width = obj.width;
        this.length = obj.length;
        this.element = obj.element;
        this.class_name = obj.class_name;
        this.path_name = obj.path_name;
        this.timeout = obj.timeout;

        //创建节点集合
        var id = 0;
        for(var i=0; i<this.width; ++i) {
            for(var j=0; j<this.length; ++j, ++id) {
                var node = new Node();
                node.initial(id);
                this.nodes.push(node);
                this.to_permeated_id.push(id);
            }
        }
        //添加上下两个辅助节点
        for(var j=0; j<2; ++j, ++id) {
            var node = new Node();
            node.initial(id);
            var last_id = this.nodes.push(node) - 1;
            this.nodes[last_id].is_permeated = true;
        }
        //连通辅助节点与顶部、底部
        var button_id = this.nodes.length - 1;
        var top_id = button_id - 1;
        var last_col_id = this.length*(this.width-1);
        for(var i=0; i<this.length; ++i) {
            this.letConnected(this.nodes[top_id], this.nodes[i]);
            this.letConnected(this.nodes[button_id], this.nodes[last_col_id+i]);
        }
    },
    //使单个节点渗透的方法
    letPermeated: function(id) {
        this.nodes[id].is_permeated = true;
        switch(parseInt(id/this.length)) {  
            case 0:     //节点在第一行
                //判断节点与下方节点是否应该连通
                if(this.nodes[id+this.length].is_permeated) {
                    this.letConnected(this.nodes[id], this.nodes[id+this.length]);
                }
                break;
            case this.width-1:  //节点在最后一行
                //判断节点与上方节点是否应该连通
                if(this.nodes[id-this.length].is_permeated) {
                    this.letConnected(this.nodes[id], this.nodes[id-this.length]);
                }
                break;
            default :   //节点在中间
                //判断节点与上下方节点是够应该连通
                if(this.nodes[id+this.length].is_permeated) {
                    this.letConnected(this.nodes[id], this.nodes[id+this.length]);
                }
                if(this.nodes[id-this.length].is_permeated) {
                    this.letConnected(this.nodes[id], this.nodes[id-this.length]);
                }
                break;
        }
        switch(id%this.length) {
            case 0:     //节点在第一列
                //判断节点与右方节点是否应该连通
                if(this.nodes[id+1].is_permeated) {
                    this.letConnected(this.nodes[id], this.nodes[id+1]);
                }
                break;
            case this.length-1: //节点在最后一列
                //判断节点与左方节点是否应该连通
                if(this.nodes[id-1].is_permeated) {
                    this.letConnected(this.nodes[id], this.nodes[id-1]);
                }
                break;
            default :   //节点在中间
                //判断节点与左右方节点是否应该连通
                if(this.nodes[id+1].is_permeated) {
                    this.letConnected(this.nodes[id], this.nodes[id+1]);
                }
                if(this.nodes[id-1].is_permeated) {
                    this.letConnected(this.nodes[id], this.nodes[id-1]);
                }
                break;
        }
    },
    //判断两节点是否连通的方法
    isConnected: function(node_1, node_2) {
        var root_node_1 = this.findRootNode(node_1);
        var root_node_2 = this.findRootNode(node_2);
        if(root_node_1.id === root_node_2.id) {
            return true;
        }
        else {
            return false;
        }
    },
    //使两节点连通的方法
    letConnected: function(node_1, node_2) {
        if(this.isConnected(node_1, node_2)) {
            return false;
        }

        var id_1 = this.findRootNode(node_1).id;
        var id_2 = this.findRootNode(node_2).id;
        //把小的块连到大的块上，若大小相等则把后者连到前者上
        if(this.nodes[id_1].size < this.nodes[id_2].size) {
            this.nodes[id_1].next_id = id_2;
            this.nodes[id_2].size += this.nodes[id_1].size;
        }
        else {
            this.nodes[id_2].next_id = id_1;
            this.nodes[id_1].size += this.nodes[id_2].size;
        }
    },
    //查询某节点根节点的方法
    findRootNode: function(node) {
        var root_node = node;
        while(root_node.id !== root_node.next_id) {
            root_node = this.nodes[root_node.next_id];
        }
        return root_node;
    },
    //随机使区域中的节点渗透，知道渗透结束（顶部与底部连通）
    work: function() {
        // /*****************************************************************************/
        // //这里先有序渗透以测试效果（以调试完成）
        // var button_id = this.nodes.length - 1;
        // var top_id = button_id - 1;
        // while(this.to_permeated_id.length !== 0) {
        //     var id = this.to_permeated_id.pop();
        //     this.letPermeated(id);
        //     this.element.querySelector("td:nth-of-type(" + (id + 1) + ")")
        //         .className += " " + this.class_name;
        // }
        // console.log(this.nodes);

        var that = this;
        var button_id = this.nodes.length - 1;
        var top_id = button_id - 1;
        (function() {
            //生成随机整数，取值范围为[min, max)
            var random = Math.floor(Math.random()*that.to_permeated_id.length);
            //剔除随机选中的元素，并在dom元素中添加类名
            var del_id = that.to_permeated_id.splice(random, 1)[0];
            that.letPermeated(del_id);
            that.element.querySelector("td:nth-of-type(" + (del_id + 1) + ")")
                .className += " " + that.class_name;

            //直到两端连通为止，都要继续执行本函数
            if(!that.isConnected(that.nodes[button_id], that.nodes[top_id])) {
                window.setTimeout(arguments.callee, that.timeout);
            }
            else {  //画出连通的路线
                var path_id = -1;
                if(that.findRootNode(that.nodes[top_id]).id === button_id) {    //底部在树结构的上层
                    path_id = button_id;
                }
                else {  //底部在树结构的下层
                    path_id = top_id;
                }

                for(var i=that.width*that.length-1; i>=0; --i) {
                    if(that.isConnected(that.nodes[i], that.nodes[path_id])) {
                        that.element.querySelector("td:nth-of-type(" + (i + 1) + ")")
                            .className += " " + that.path_name;
                    }
                }
            }
        })();
    }
};