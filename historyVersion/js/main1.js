(function (d3) {
    // d3相关初始化
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // 构建树形结构
    var tree = d3.layout.tree()
        .size([height / 3, width / 3]);

    // 绘制对角线生成器
    var diagonal = d3.svg.diagonal.radial().projection(function (d) {
        return [d.y, d.x / 180 * Math.PI];
    });

    // 新对象用于存储层次结构数据, 使用没有prototype的字典对象存储
    var treeData = createNodeStruct();
    d3.tsv("data/titanic_data.tsv", function (error, data) {

        if (error) throw error;

        // 数据处理转化为层级结构
        // data --> survival --> sex
        // data --> survival --> age
        // data --> survival --> pclass

        var survival = createNodeStruct();
        var dead = createNodeStruct();
        // 增加到treeData中
        treeData.children.push(survival);
        treeData.children.push(dead);
        // 性别类别
        var survival_male = createNodeStruct();
        var survival_female = createNodeStruct();
        var dead_male = createNodeStruct();
        var dead_female = createNodeStruct();

        // 增加到生还死亡组
        survival.children.push(survival_male);
        survival.children.push(survival_female);
        dead.children.push(dead_male);
        dead.children.push(dead_female);

        data.map(function (d) {
            d['value'] = 1;
            if (d.Survived === '1') {
                // 生还组
                if (d.Sex === 'male') {
                    survival_male.children.push(d);
                } else if (d.Sex === 'female') {
                    survival_female.children.push(d);
                } else {
                    console.log('不明确的数据项: ' + d);
                }
            } else if (d.Survived === '0') {
                // 死亡组
                if (d.Sex === 'male') {
                    dead_male.children.push(d);
                } else if (d.Sex === 'female') {
                    dead_female.children.push(d);
                } else {
                    console.log('不明确的数据项: ' + d);
                }
            } else {
                console.log('不明确的数据项: ' + d);
            }
        });

        console.log(treeData);
        // 绘制图形
        draw(treeData);
    });

    function createNodeStruct() {
        var node = Object.create(null);
        node['value'] = 1;
        node['children'] = [];
        return node;
    }

    /**
     * 根据层级数据，使用对角线生成器对tree对象进行绘图
     * 
     * @param {Object} data 
     */
    function draw(data) {

        // console.log(data);

        var nodes = tree.nodes(data),
            links = tree.links(nodes);

        var link = g.selectAll('.link')
            .data(links)
            .enter()
            .append("path")
            .attr('class', 'link')
            .attr('d', diagonal);

        var node = g.selectAll('.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', function (d) {
                return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")";
            });

        node.append('circle')
            .attr('r', 4.5);
    }
})(d3);