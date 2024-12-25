# 实验报告：生物演化史-力导向-2D可视化

## 一、引言

本实验旨在通过力导向图的方式展示生物演化史，利用D3.js库实现数据的可视化。该项目不仅展示了生物演化的时间线，还通过交互功能增强了用户体验。本文将详细介绍该项目的创新功能、算法描述、代码实现及所用库函数的具体细节。

## 二、创新功能点

1. **交互式节点信息展示**：用户可以通过鼠标悬停在节点上查看详细信息，节点信息包括名称、时间和描述等。
2. **节点拖拽功能**：用户可以通过拖拽节点来重新排列图形，增强了可视化的灵活性。
3. **全屏显示功能**：用户可以选择全屏模式以更好地查看图形。
4. **动态缩放和平移**：用户可以通过鼠标滚轮进行缩放，按住鼠标左键进行平移，提升了图形的可操作性。
5. **实时更新的力导向模拟**：节点之间的关系通过力导向算法动态更新，提供了更真实的视觉效果。

## 三、算法描述

### 3.1 力导向算法

力导向算法是一种基于物理模型的图形布局算法。每个节点被视为一个带有电荷的粒子，节点之间的连接线被视为弹簧。算法通过计算节点之间的斥力和吸引力来调整节点的位置，最终达到一种平衡状态。

- **斥力**：节点之间的斥力使得节点尽量远离，避免重叠。
- **吸引力**：连接线的吸引力使得相连的节点靠近，形成合理的结构。

### 3.2 D3.js库的使用

D3.js是一个强大的数据可视化库，提供了丰富的功能来处理数据和生成图形。以下是本项目中使用的主要D3.js功能：

- **选择和操作DOM元素**：使用`d3.select()`选择SVG元素并进行操作。
- **数据绑定**：使用`data()`方法将数据绑定到DOM元素。
- **力导向模拟**：使用`d3.forceSimulation()`创建力导向图，并通过`force()`方法添加不同的力。

## 四、代码实现

### 4.1 HTML结构

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>生物演化史-力导向-2D</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="biological-evolution-data.js"></script>
    <style>
        /* CSS样式省略 */
    </style>
</head>
<body>
    <div id="background-container" class="background-image-container"></div>
    <div class="controls">
        <!-- 控制按钮 -->
    </div>
    <div id="container">
        <div id="graph"></div>
        <div id="magnifier"></div>
    </div>
    <script>
        // JavaScript代码省略
    </script>
</body>
</html>
```

### 4.2 JavaScript实现细节

#### 4.2.1 初始化SVG容器

```javascript
let width = window.innerWidth;
let height = window.innerHeight;

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
```

#### 4.2.2 力导向模拟

```javascript
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(100)) // 弹簧力
    .force("charge", d3.forceManyBody().strength(-300)) // 节点间的斥力
    .force("collide", d3.forceCollide().radius(50)) // 防止节点重叠的碰撞
    .force("center", d3.forceCenter(0, 0).strength(0.1)); // 添加中心力
```

#### 4.2.3 更新函数

```javascript
function update(source) {
    // 计算新的树布局
    tree(root);

    const nodes = root.descendants();
    const links = root.links();

    // 更新力导向模拟
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    // 更新节点和连接线
    // 省略具体实现
}
```

### 4.3 交互功能实现

#### 4.3.1 鼠标悬停事件

```javascript
nodeEnter.on("mouseover", showNodeInfo)
    .on("mouseout", hideNodeInfo);
```

#### 4.3.2 拖拽功能

```javascript
const dragHandler = d3.drag()
    .subject(function (event, d) {
        return { x: d.x, y: d.y };
    })
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

nodeUpdate.call(dragHandler);
```

## 五、总结

本实验通过D3.js实现了生物演化史的力导向可视化，展示了生物演化的复杂关系。通过交互功能的设计，用户可以更直观地理解生物演化的过程。未来可以考虑引入Three.js库，进一步增强3D可视化效果，提升用户体验。

## 六、参考文献

1. D3.js官方文档: [https://d3js.org/](https://d3js.org/)
2. 力导向图相关文献与研究

以上是本实验的详细报告，涵盖了创新功能、算法描述、代码实现及库函数的具体细节。希望对读者理解该项目有所帮助。
