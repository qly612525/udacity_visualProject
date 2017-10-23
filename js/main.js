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
    var treeData = createNodeStruct("泰坦尼克号乘客数据集");
    d3.tsv("data/titanic_data.tsv", function (error, data) {

        if (error) throw error;

        // 数据处理转化为层级结构
        // data --> survival --> sex
        // data --> survival --> age
        // data --> survival --> pclass

        var survival = createNodeStruct("生还组");
        var dead = createNodeStruct("死亡组");
        // 增加到treeData中
        treeData.children.push(survival);
        treeData.children.push(dead);

        // 性别类别
        var survival_male = createNodeStruct("男性生还组");
        var survival_female = createNodeStruct("女性生还组");
        var dead_male = createNodeStruct("男性死亡组");
        var dead_female = createNodeStruct("女性死亡组");
        // 增加到生还死亡组
        survival.children.push(survival_male);
        survival.children.push(survival_female);
        dead.children.push(dead_male);
        dead.children.push(dead_female);

        // 票类型
        // 头等
        var upper_male_survival = createNodeStruct("头等仓男性生还组");
        var upper_female_survival = createNodeStruct("头等仓女性生还组");
        var upper_male_dead = createNodeStruct("头等仓男性死亡组");
        var upper_female_dead = createNodeStruct("头等仓女性死亡组");
        // 增加到父组
        survival_male.children.push(upper_male_survival);
        survival_female.children.push(upper_female_survival);
        dead_male.children.push(upper_male_dead);
        dead_female.children.push(upper_female_dead);

        // 中等
        var middle_male_survival = createNodeStruct("中等仓男性生还组");
        var middle_female_survival = createNodeStruct("中等仓女性生还组");
        var middle_male_dead = createNodeStruct("中等仓男性死亡组");
        var middle_female_dead = createNodeStruct("中等仓女性死亡组");
        // 增加到父组
        survival_male.children.push(middle_male_survival);
        survival_female.children.push(middle_female_survival);
        dead_male.children.push(middle_male_dead);
        dead_female.children.push(middle_female_dead);

        // 低等
        var lower_male_survival = createNodeStruct("下等仓男性生还组");
        var lower_female_survival = createNodeStruct("下等仓女性生还组");
        var lower_male_dead = createNodeStruct("下等仓男性死亡组");
        var lower_female_dead = createNodeStruct("下等仓女性死亡组");
        // 增加到父组
        survival_male.children.push(lower_male_survival);
        survival_female.children.push(lower_female_survival);
        dead_male.children.push(lower_male_dead);
        dead_female.children.push(lower_female_dead);

        data.map(function (d) {
            d['value'] = 1;
            if (d.Survived === '1') {
                // 生还组
                if (d.Sex === 'male') {
                    switch (d.Pclass) {
                        case "1":
                            upper_male_survival.children.push(d);
                            break;
                        case "2":
                            middle_male_survival.children.push(d);
                            break;
                        case "3":
                            lower_male_survival.children.push(d);
                        default:
                            console.log('不明确的数据项: ' + d);
                    }
                } else if (d.Sex === 'female') {
                    switch (d.Pclass) {
                        case "1":
                            upper_female_survival.children.push(d);
                            break;
                        case "2":
                            middle_female_survival.children.push(d);
                            break;
                        case "3":
                            lower_female_survival.children.push(d);
                        default:
                            console.log('不明确的数据项: ' + d);
                    }
                } else {
                    console.log('不明确的数据项: ' + d);
                }
            } else if (d.Survived === '0') {
                // 死亡组
                if (d.Sex === 'male') {
                    switch (d.Pclass) {
                        case "1":
                            upper_male_dead.children.push(d);
                            break;
                        case "2":
                            middle_male_dead.children.push(d);
                            break;
                        case "3":
                            lower_male_dead.children.push(d);
                        default:
                            console.log('不明确的数据项: ' + d);
                    }
                } else if (d.Sex === 'female') {
                    switch (d.Pclass) {
                        case "1":
                            upper_female_dead.children.push(d);
                            break;
                        case "2":
                            middle_female_dead.children.push(d);
                            break;
                        case "3":
                            lower_female_dead.children.push(d);
                        default:
                            console.log('不明确的数据项: ' + d);
                    }
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
        // 绘制图例
        drawLegend();
    });

    function createNodeStruct(name) {
        var node = Object.create(null);
        node['value'] = 1;
        node['children'] = [];
        node['name'] = name || "";
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
            .attr('class', function (d) {
                if (d.target.name) {
                    return 'link';
                }
                var className = 'link';
                var age = +d.target.Age;
                if (age < 5) {
                    className += ' link__less5';
                } else if (age < 40) {
                    className += ' link__less40';
                }
                return className;
            })
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
            .attr('r', function (d) {
                // 分组节点，直接放回2.5的半径
                if (d.name) {
                    return 2.5;
                }

                var sibsp = +d.SibSp;
                var parch = +d.Parch;
                var sum = sibsp + parch;

                if (sum === 0) {
                    d.isBachelor = true;
                    return 2.5;
                } else {
                    return 2.5;
                }
            })
            .attr('class', function (d) {
                if (d.isBachelor) {
                    return 'bachelor';
                }
            });

        node.append('text')
            .attr('dy', 10)
            .attr('x', -20)
            .text(function (d) {
                return d.name
            });
    }

    /**
     * 绘制图形图例
     * 
     */
    function drawLegend() {
        var legendSVG = d3.select('#legend');

        var legend = legendSVG.append('g')
            .attr('class', 'legend')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 150)
            .attr('height', 140);

        // 标题部分
        legend.append('text')
            .attr('class', 'legend_title')
            .attr('x', 25)
            .attr('y', 25)
            .text('图形');

        legend.append('text')
            .attr('class', 'legend_title')
            .attr('x', 90)
            .attr('y', 25)
            .text('名称');

        // 内容部分
        legend.append('rect')
            .attr('class', 'legend_rect age_less5')
            .attr('x', 10)
            .attr('y', 45)
            .attr('width', 55)
            .attr('height', 5);

        legend.append('text')
            .attr('class', 'legend_text')
            .attr('x', 85)
            .attr('y', 52)
            .text('年龄 < 5');

        legend.append('rect')
            .attr('class', 'legend_rect age_less40')
            .attr('x', 10)
            .attr('y', 65)
            .attr('width', 55)
            .attr('height', 5);

        legend.append('text')
            .attr('class', 'legend_text')
            .attr('x', 85)
            .attr('y', 72)
            .text('年龄 < 40');

        legend.append('rect')
            .attr('class', 'legend_rect age_more40')
            .attr('x', 10)
            .attr('y', 85)
            .attr('width', 55)
            .attr('height', 5);

        legend.append('text')
            .attr('class', 'legend_text')
            .attr('x', 85)
            .attr('y', 92)
            .text('年龄 > 40');

        legend.append('circle')
            .attr('class', 'legend_circle person_bachelor')
            .attr('cx', 40)
            .attr('cy', 105)
            .attr('r', 2.5);

        legend.append('text')
            .attr('class', 'legend_text')
            .attr('x', 85)
            .attr('y', 112)
            .text('单身');

        legend.append('circle')
            .attr('class', 'legend_circle person_family')
            .attr('cx', 40)
            .attr('cy', 125)
            .attr('r', 2.5);

        legend.append('text')
            .attr('class', 'legend_text')
            .attr('x', 85)
            .attr('y', 132)
            .text('配偶|家人');
    }
})(d3);