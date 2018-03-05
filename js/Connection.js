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
    this.is_permeated_id = [];  //已渗透节点的id集合
    this.topoint_id = [];       //已渗透，并连通端节点的id集合
    this.width = -1;    //区域宽度
    this.length = -1;   //区域长度
    this.top_id = -1;   //顶节点的id
    this.button_id = -1;    //底节点的id
    
    this.element = null;    //表格元素
    this.permeated_class = "";   //被渗透节点的类名的类名
    this.per_topoint_class = "";    //被渗透且连到端节点的类名
    this.path_class = "";    //路径节点的类名
    this.timeout = -1;      //渗透节点的时间间隔，单位毫秒
    this.setTime = null;    //放事件延迟执行函数的指针
    this.is_line = false;   //判断区域是否为单行或单列
}
Connection.prototype = {
    //初始化对象的方法
    initial: function(obj) {
        this.width = obj.width;
        this.length = obj.length;
        this.element = obj.element;
        this.permeated_class = obj.permeated_class;
        this.per_topoint_class = obj.per_topoint_class;
        this.path_class = obj.path_class;
        this.timeout = obj.timeout;
        
        this.top_id = this.width*this.length;
        this.button_id = this.top_id + 1;
        this.is_line = (this.width===1 || this.length===1) ? true : false;

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
        var nodes = this.nodes;
        nodes[id].is_permeated = true;
        //当行或列为1时
        if(this.is_line) {
            switch(id) {
                case 0:     //为首节点（只有一个节点时也执行这一项）
                    //判断节点与下一节点是否应该连通
                    if(nodes[id+1].is_permeated) {
                        this.letConnected(nodes[id], nodes[id+1]);
                    }
                    break;
                case this.width*this.length - 1:     //为尾节点
                    //判断节点与上一节点是否应该连通
                    if(nodes[id-1].is_permeated) {
                        this.letConnected(nodes[id], nodes[id-1]);
                    }
                    break;
                default :   //节点在中间
                    //判断节点与前后节点是否应该连通
                    if(nodes[id+1].is_permeated) {
                        this.letConnected(nodes[id], nodes[id+1]);
                    }
                    if(nodes[id-1].is_permeated) {
                        this.letConnected(nodes[id], nodes[id-1]);
                    }
                    break;
            }
            return ;
        }
        //当行或列不为1时
        switch(parseInt(id/this.length)) {  
            case 0:     //节点在第一行
                //判断节点与下方节点是否应该连通
                if(nodes[id+this.length].is_permeated) {
                    this.letConnected(nodes[id], nodes[id+this.length]);
                }
                break;
            case this.width-1:  //节点在最后一行
                //判断节点与上方节点是否应该连通
                if(nodes[id-this.length].is_permeated) {
                    this.letConnected(nodes[id], nodes[id-this.length]);
                }
                break;
            default :   //节点在中间
                //判断节点与上下方节点是够应该连通
                if(nodes[id+this.length].is_permeated) {
                    this.letConnected(nodes[id], nodes[id+this.length]);
                }
                if(nodes[id-this.length].is_permeated) {
                    this.letConnected(nodes[id], nodes[id-this.length]);
                }
                break;
        }
        switch(id%this.length) {
            case 0:     //节点在第一列
                //判断节点与右方节点是否应该连通
                if(nodes[id+1].is_permeated) {
                    this.letConnected(nodes[id], nodes[id+1]);
                }
                break;
            case this.length-1: //节点在最后一列
                //判断节点与左方节点是否应该连通
                if(nodes[id-1].is_permeated) {
                    this.letConnected(nodes[id], nodes[id-1]);
                }
                break;
            default :   //节点在中间
                //判断节点与左右方节点是否应该连通
                if(nodes[id+1].is_permeated) {
                    this.letConnected(nodes[id], nodes[id+1]);
                }
                if(nodes[id-1].is_permeated) {
                    this.letConnected(nodes[id], nodes[id-1]);
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
    //将输入的节点集合重新划分连通块，输入需要重新分连通块的节点id集合数组，返回对象
    classify: function() {
        var topoint_id = this.topoint_id;
        var new_blocks = {};    //存放重新分类好的节点块，其内元素应为数组
        //重新初始化节点的某些属性
        for(var i=topoint_id.length-1; i>=0; --i) {
            var id = topoint_id[i];
            var node = this.nodes[id];
            node.next_id = node.id;
            node.size = 1;
            node.is_permeated = false;
        }
        //重新划分连通块
        //让节点渗透，该过程会自动分块
        for(var i=topoint_id.length-1; i>=0; --i) {
            this.letPermeated(topoint_id[i]);
        }
        //记录各分块都有哪些节点
        for(var i=topoint_id.length-1; i>=0; --i) {
            var id = topoint_id[i];
            var root_id = this.findRootNode(this.nodes[id]).id;
            if(typeof new_blocks[root_id] === "undefined") {
                new_blocks[root_id] = [];
            }
            new_blocks[root_id].push(id);
        }

        return new_blocks;
    },
    //做渗透块图
    draw: function() {
        var width = this.width;
        var length = this.length;

        var resual = this.classify();
        for(var key in resual) {
            var arr = resual[key];
            if(arr.length>=width 
            && isOk(Math.min.apply(null, arr)) 
            && isOk(Math.max.apply(null, arr))) {
                for(var i=arr.length-1; i>=0; --i) {
                    this.element.querySelector("td:nth-of-type(" + (arr[i] + 1) + ")")
                    .classList.add(this.path_class);
                }
                break;
            }
        }

        function isOk(id) {
            if(id>=0 && id<length) {
                return true;
            }
            else if(id<length*width && id>=length*(width-1)) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    //随机使区域中的节点渗透，知道渗透结束（顶部与底部连通）
    work: function() {
        var to_permeated_id = this.to_permeated_id;
        var is_permeated_id = this.is_permeated_id;
        var topoint_id = this.topoint_id;
        var nodes = this.nodes;
        var top_id = this.top_id;
        var button_id = this.button_id;
        var element = this.element;
        var per_topoint_class = this.per_topoint_class;

        //生成随机整数，取值范围为[min, max)
        var random = Math.floor(Math.random()*to_permeated_id.length);
        //剔除随机选中的元素，并在dom元素中添加类名
        var del_id =to_permeated_id.splice(random, 1)[0];
        is_permeated_id.push(del_id);
        this.letPermeated(del_id);
        //标示出与两端相连的渗透的节点
        if(this.isConnected(nodes[del_id],nodes[top_id]) || this.isConnected(nodes[del_id],nodes[button_id])) {
            for(var i=is_permeated_id.length-1; i>=0; --i) {
                var id = is_permeated_id[i];
                if(this.isConnected(nodes[id],nodes[top_id]) 
                || this.isConnected(nodes[id],nodes[button_id])) {
                    is_permeated_id.splice(i, 1)[0];
                    topoint_id.push(id);
                    element.querySelector("td:nth-of-type(" + (id + 1) + ")")
                    .classList.add(per_topoint_class);
                }
            }
        }
        //标示出被渗透但不与两端相连节点
        else {
            element.querySelector("td:nth-of-type(" + (del_id + 1) + ")")
            .classList.add(this.permeated_class);
        }

        //直到两端连通为止，都要继续执行本函数

        if(!this.isConnected(nodes[button_id], nodes[top_id])) {
            this.setTime = window.setTimeout(arguments.callee.bind(this), this.timeout);
        }
        else {  //画出连通的路线
            this.draw();
            this.stop();
        }
    },
    //终止执行
    stop: function() {
        clearTimeout(this.setTime);

        this.nodes = [];    //节点集合
        this.to_permeated_id = [];  //待渗透节点的id集合
        this.is_permeated_id = [];  //已渗透节点的id集合
        this.topoint_id = [];       //已渗透，并连通端节点的id集合
        this.width = -1;    //区域宽度
        this.length = -1;   //区域长度
        this.top_id = -1;   //顶节点的id
        this.button_id = -1;    //底节点的id
        
        this.element = null;    //表格元素
        this.permeated_class = "";   //被渗透节点的类名的类名
        this.per_topoint_class = "";    //被渗透且连到端节点的类名
        this.path_class = "";    //路径节点的类名
        this.timeout = -1;      //渗透节点的时间间隔，单位毫秒
        this.setTime = null;      //放事件延迟执行函数的指针
    }
};