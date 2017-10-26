(function (d3) {
    // d3相关初始化
    var svg = d3.select("#main").select('svg'),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var subsvg = d3.select("#subChart").select('svg'),
        subWidth = +subsvg.attr("width"),
        subHeight = +subsvg.attr("height"),
        padding = {
            top: 40,
            right: 40,
            bottom: 30,
            left: 40
        },
        subg = subsvg.append("g").attr("transform", "translate(" + padding.top + "," + padding.left + ")");

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
        // data --> survival --> sex --> pclass
        // 按照上述结构构件多级层次树

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
        var upper_male_survival = createNodeStruct("头等舱男性生还组");
        var upper_female_survival = createNodeStruct("头等舱女性生还组");
        var upper_male_dead = createNodeStruct("头等舱男性死亡组");
        var upper_female_dead = createNodeStruct("头等舱女性死亡组");
        // 增加到父组
        survival_male.children.push(upper_male_survival);
        survival_female.children.push(upper_female_survival);
        dead_male.children.push(upper_male_dead);
        dead_female.children.push(upper_female_dead);

        // 中等
        var middle_male_survival = createNodeStruct("中等舱男性生还组");
        var middle_female_survival = createNodeStruct("中等舱女性生还组");
        var middle_male_dead = createNodeStruct("中等舱男性死亡组");
        var middle_female_dead = createNodeStruct("中等舱女性死亡组");
        // 增加到父组
        survival_male.children.push(middle_male_survival);
        survival_female.children.push(middle_female_survival);
        dead_male.children.push(middle_male_dead);
        dead_female.children.push(middle_female_dead);

        // 低等
        var lower_male_survival = createNodeStruct("下等舱男性生还组");
        var lower_female_survival = createNodeStruct("下等舱女性生还组");
        var lower_male_dead = createNodeStruct("下等舱男性死亡组");
        var lower_female_dead = createNodeStruct("下等舱女性死亡组");
        // 增加到父组
        survival_male.children.push(lower_male_survival);
        survival_female.children.push(lower_female_survival);
        dead_male.children.push(lower_male_dead);
        dead_female.children.push(lower_female_dead);

        /**
         * 对原始数据每个乘客一条数据的结构按照上述的几个分组进行再组织
         * 通过乘客信息数据的生还特征、性别特征、票类型特征划分为三个层次
         */
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
                            break;
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
                            break;
                        default:
                            console.log('不明确的数据项: ' + d);
                    }
                } else {
                    console.log('生还组中："性别"不明确的数据项: ' + d);
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
                            break;
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
                            break;
                        default:
                            console.log('不明确的数据项: ' + d);
                    }
                } else {
                    console.log('死亡组中: 性别不明确的数据项: ' + d);
                }
            } else {
                console.log('生还与否不明确的数据项: ' + d);
            }
        });

        // 更新各个node的value值，从下向上开始
        // 票类型
        // 头等
        upper_male_survival.value = upper_male_survival.children.length;
        upper_female_survival.value = upper_female_survival.children.length;
        upper_male_dead.value = upper_male_dead.children.length;
        upper_female_dead.value = upper_female_dead.children.length;

        // 中等
        middle_male_survival.value = middle_male_survival.children.length;
        middle_female_survival.value = middle_female_survival.children.length;
        middle_male_dead.value = middle_male_dead.children.length;
        middle_female_dead.value = middle_female_dead.children.length;

        // 下等
        lower_male_survival.value = lower_male_survival.children.length;
        lower_female_survival.value = lower_female_survival.children.length;
        lower_male_dead.value = lower_male_dead.children.length;
        lower_female_dead.value = lower_female_dead.children.length;

        // 性别
        survival_male.value = survival_male.children.reduce(function (prev, item) {
            return prev + item.value
        }, 0);
        survival_female.value = survival_female.children.reduce(function (prev, item) {
            return prev + item.value
        }, 0);
        dead_male.value = dead_male.children.reduce(function (prev, item) {
            return prev + item.value
        }, 0);
        dead_female.value = dead_female.children.reduce(function (prev, item) {
            return prev + item.value
        }, 0);

        // 生还
        survival.value = survival.children.reduce(function (prev, item) {
            return prev + item.value
        }, 0);
        dead.value = dead.children.reduce(function (prev, item) {
            return prev + item.value
        }, 0);

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
                    d.isCluster = true;
                    return 8;
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
                } else if (d.isCluster) {
                    return 'cluster';
                }
            });

        node.append('text')
            .attr('dy', 10)
            .attr('x', -20)
            .text(function (d) {
                return d.name
            });

        // 绑定事件处理
        bindEvent();
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

    /**
     * 绑定事件处理
     * 
     * @param {any} node 
     */
    function bindEvent() {
        var tip = document.getElementById('tip');
        var dom = document.getElementById('subChart');
        var cluster = svg.selectAll('.cluster')
            .on('mouseover', function (d) {
                tip.style.display = 'block';
            }).on('mouseout', function (d) {
                tip.style.display = 'none';
            }).on('click', function (d, i) {
                // 清空上次图形
                subg.selectAll('*').remove();
                // 显示图形
                dom.style.display = 'block';
                // 根据层级深度显示不同的图形
                createChart(d);
            });
        var close = document.getElementById('close');
        close.addEventListener('click', function () {
            dom.style.display = 'none';
        });
    }

    // 根据depth值生产不同的图表控制区
    function createChart(d) {
        var x = [],
            y = [],
            data = [];
        d.children.map(function (c) {
            x.push(c['name']);
            y.push(+c['value']);
            data.push({
                x,
                y
            });
        });
        // 定义x轴的比例尺
        // 定义y轴的比例尺(线性比例尺)
        var xScale = d3.scale.ordinal()
            .domain(x)
            .rangeBands([0, subWidth - padding.left - padding.right], 0.5);
        var yScale = d3.scale.linear()
            .domain([0, d3.max(y)])
            .range([subHeight - padding.bottom - padding.top, 0]);

        // 定义x轴和y轴
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');
        // 添加坐标轴元素
        subg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + (subHeight - padding.bottom - padding.top) + ')')
            .call(xAxis);
        subg.append('g')
            .attr('class', 'axis')
            .call(yAxis);

        // 增加title
        subg.append('text')
            .attr('class', 'chart_title')
            .attr('x', '20')
            .attr('y', '0')
            .text(d.name);
        // 柱形图之间的距离
        var rectPadding = 20 * x.length;
        // 增加rect柱状图
        subg.selectAll('.bar')
            .data(y)
            .enter()
            .append('rect')
            .attr("class", "bar")
            .attr("x", function (d, i) {
                return xScale(x[i]);
            })
            .attr("y", function (d) {
                return yScale(d);
            })
            .attr('width', function (d) {
                return xScale.rangeBand();
            })
            .attr('height', function (d) {
                return subHeight - padding.top - padding.bottom - yScale(d);
            });
    }
})(d3);