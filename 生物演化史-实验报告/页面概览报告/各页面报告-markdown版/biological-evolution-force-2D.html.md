# 实验报告：生物演化史-力导向-2D可视化

## 一、引言

本实验旨在通过力导向图的方式展示生物演化史，利用D3.js库实现动态交互式可视化。该项目不仅展示了生物演化的时间线，还通过创新的功能点提升了用户体验，使得复杂的生物演化信息更加直观易懂。

## 二、创新功能点

1. **动态交互**：用户可以通过鼠标拖拽、缩放和旋转来探索生物演化图，增强了交互性。
2. **节点信息展示**：当用户悬停在节点上时，能够显示详细的节点信息，包括名称、时间和描述。
3. **全屏显示**：提供全屏模式，用户可以更好地查看复杂的图形。
4. **背景图像动态切换**：根据用户选择的节点，背景图像会动态更新，提供更丰富的视觉体验。
5. **图例和帮助提示**：在界面中添加图例和操作提示，帮助用户理解不同节点的含义和操作方式。

## 三、算法描述

### 3.1 力导向算法

力导向算法是一种基于物理模型的布局算法，主要通过模拟节点之间的力来确定节点的位置。该算法包括以下几个主要力的计算：

- **弹簧力**：通过`d3.forceLink()`实现，模拟节点之间的连接，保持一定的距离。
- **斥力**：通过`d3.forceManyBody()`实现，防止节点重叠。
- **碰撞力**：通过`d3.forceCollide()`实现，确保节点之间有一定的间隔。
- **中心力**：通过`d3.forceCenter()`实现，将节点吸引到中心位置。
- **径向力**：通过`d3.forceRadial()`实现，模拟节点的层次结构。

### 3.2 更新函数

更新函数负责根据当前节点的状态重新计算节点的位置和连接线的路径。该函数的主要步骤包括：

1. 计算树的布局。
2. 更新节点和连接线的数据绑定。
3. 处理节点的进入、更新和退出动画。
4. 更新节点的颜色和文本位置。

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
        /* 样式定义 */
    </style>
</head>
<body>
    <div id="background-container" class="background-image-container"></div>
    <div class="controls">
        <button onclick="toggleFullscreen()">全屏显示</button>
        <!-- 其他控制按钮 -->
    </div>
    <div id="container">
        <div id="graph"></div>
        <div id="magnifier"></div>
    </div>
    <script>
        // JavaScript代码
    </script>
</body>
</html>
```

### 4.2 D3.js实现细节

#### 4.2.1 创建SVG容器

```javascript
const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
```

#### 4.2.2 力导向模拟

```javascript
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("collide", d3.forceCollide().radius(50))
    .force("center", d3.forceCenter(0, 0).strength(0.1))
    .force("radial", d3.forceRadial(d => d.depth * 180, 0, 0).strength(0.8));
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
    const node = g.selectAll(".node")
        .data(nodes, d => d.id || (d.id = ++i));

    // 处理节点的进入、更新和退出
    const nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${source.x0},${source.y0})`)
        .on("click", click)
        .on("mouseover", showNodeInfo)
        .on("mouseout", hideNodeInfo);

    nodeEnter.append("circle")
        .attr("r", 12)
        .style("fill", d => getNodeColor(d));

    nodeEnter.append("text")
        .attr("dy", ".31em")
        .attr("x", d => d._children ? -10 : 10)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name);
}
```

### 4.3 事件处理

#### 4.3.1 鼠标事件

```javascript
svg.on("mousedown", (event) => {
    if (event.target === svg.node()) {
        isDragging = true;
        startPoint = { x: event.clientX - currentTranslate.x, y: event.clientY - currentTranslate.y };
    }
});
```

#### 4.3.2 键盘事件

```javascript
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w') currentTranslate.y += MOVE_SPEED;
    if (key === 's') currentTranslate.y -= MOVE_SPEED;
    if (key === 'a') currentTranslate.x += MOVE_SPEED;
    if (key === 'd') currentTranslate.x -= MOVE_SPEED;
});
```

## 五、总结

本实验通过D3.js实现了生物演化史的力导向可视化，结合动态交互和丰富的用户体验，成功地将复杂的生物演化信息以直观的方式呈现给用户。通过力导向算法的应用，节点之间的关系得以清晰展示，同时创新的功能点提升了用户的参与感和探索欲望。未来可以考虑引入更多的交互方式和数据源，以进一步丰富可视化效果。
