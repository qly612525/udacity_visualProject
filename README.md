# 泰坦尼克号生还数据可视化

## 概要

使用D3.js进行“泰坦尼克号乘客特征与生还关系”的可视化表达。

## 设计

1. 讲故事方式让用户直观的发现数据的秘密

**主要故事线索**，通过树的父节点开始，根据用户的兴趣点查看不同特征分类的人群生还情况。例如：用户可以直观感受不同性别的生还比例情况，是否如电影所说的只救助老少妇孺。
2. 宏观与微观的结合

**树形图**，通过绘制每一个数据项，通过微观的积累体现出宏观的态势。用户可以通过观察到微观细节的信息，也可以通过叶子节点看到分组的统计信息，使用宏观+微观的模式给用户一种全方位体会并理解数据集的感受。
3. 多维信息的展示

**核心特征**，核心特征是能够明显区分生还与死亡分组的属性，这里把这些特征抽出来作为统计的叶节点来展示统计的宏观信息。（如：性别、年龄、船票类型（头等|中等|下等））
**辅助特征**，辅助特征主要是指一些不是很重要的属性（主要是太多叶节点，信息表达容易混乱），这里的可视化处理方法主要是通过不同的颜色或者图形就行区分。（如：出发港口|是否单身(sibsp === 0 and parch === 0)）
4. 图例说明

**图例说明**，核心特征，辅助特征都增加图例说明
5. 文字说明

**标题，文本说明**，讲述可视化的特征
6. 增加动画交互

**动画交互**，通过鼠标移动，弹出信息、高亮特征等方式给用户一个直观且细致的发现数据细节的功能
7. 增加交互功能，提供细节化展示

**交互**：
* 调整分组点的图形（园）大小，易于发现
* 增加聚合点的tip提示，让用户知道后面的操作
* 增加点击聚合点后弹出该聚合点的统计图表

## 反馈

总结几个人的意见，汇总如下：

* 节点应有文字说明，不能只有图形。(见histtoryVersion/index1.html)

如果径向图形细节数据太过密集不易于文字展示，可以在树节点部分展示文字，让用户能够看清楚各个树节点表示的分组类型

* 其他信息使用颜色或者特殊图形表示. (见historyVersion/index2.html)

树节点对数据集的生还特性、性别、票类型进行了分类展示；其他信息可以通过颜色、或者图案进行表示

* 增加图例表示不同颜色和形状的象征意义。(见historyVersion/index3.html)

可视化是设计者自己对数据的理解，需要通过像图例或者说明文字来带领用户明白你的可视化意义

* 增加标题说明，增加文字描述解释数据情况。(见historyVersion/index3.html)

配合标题以及说明介绍可视化的数据情况，帮助用户理解数据

===

### 评审修改说明

* 浏览器调试窗口打印的提示信息。(见historyVersion/index3.html)

这是原始数据处理的一个bug，代码中将原始数据按照生还状态、性别特征、票类型进行树形分组。其中，`switch`语句过滤时其中一种类型忘记`break`导致程序运行到了`default`的缺失值处理部分，导致控制台报出相关信息

* 可视化解释性

1. 先回答老师为什么选这样的图？在我看来数据可视化不应该拘束于传统的统计图表，传统统计图表是通过统计值来传达对数据集的理解。所以，统计图表更是从一种宏观的角度来传达数据的"形状"，但是，从**吸引性**上看不如这样的可视化图（通过全撒点）来的有震撼力

2. 如何提高其解释能力？确实我这个可视化作品，缺少数字的表达，让用户难以通过精准的数字去进行对比，所以，我打算通过交互的方式，结合“传统图表”的方式来详尽表达分组点的数据概况

3. 树形分组（性别、票类型），颜色（年龄），不同颜色的圆(单身)来表达这份数据集，已经基本上涵盖了数据集的各个维度，这是传统图表不太容易做到的。

* 文字描述不准确

1. 增加交互，通过交互增加传统图表，结合传统图表数据统计性表达来给出准确的数字特征
2. 通过统计图来重新对数据可视化情况进行解释

## 资源

1. [创建和分享gist](http://bl.ocks.org)
2. [可视化实例](https://bl.ocks.org/mbostock/4063530)
3. [和弦图](https://bl.ocks.org/mbostock/4062006)