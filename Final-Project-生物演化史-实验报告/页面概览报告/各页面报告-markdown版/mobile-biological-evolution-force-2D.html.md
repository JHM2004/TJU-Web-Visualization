# 实验报告：生物演化史-力导向-2D可视化

## 一、引言

本实验旨在通过可视化技术展示生物演化的历史，利用D3.js库实现力导向图的交互式展示。该项目不仅展示了生物演化的时间线，还通过创新的功能点提升了用户体验，使得复杂的生物演化信息更加直观易懂。

## 二、创新功能点

1. **力导向布局**：使用D3.js的力导向图算法，动态展示节点之间的关系，用户可以通过拖拽和缩放操作自由探索图形。
2. **节点信息展示**：当用户悬停在节点上时，显示该节点的详细信息，包括名称、时间和描述，增强了信息的可获取性。
3. **背景图像切换**：根据用户选择的节点，动态更换背景图像，提供更丰富的视觉体验。
4. **交互式控制**：提供展开/收起所有节点的功能，用户可以快速查看或隐藏信息，提升了交互性。
5. **移动设备适配**：针对移动设备优化了触摸事件处理，确保在不同设备上均能流畅使用。

## 三、算法描述

### 3.1 力导向图算法

力导向图算法通过模拟物理力的作用来布局节点。每个节点之间的关系通过“弹簧力”和“斥力”来实现：

- **弹簧力**：通过`d3.forceLink()`实现，控制节点之间的距离。
- **斥力**：通过`d3.forceManyBody()`实现，防止节点重叠。
- **中心力**：通过`d3.forceCenter()`实现，确保节点向中心聚集。

### 3.2 D3.js库的使用

D3.js是一个强大的数据可视化库，提供了丰富的功能来处理数据和生成图形。以下是本项目中使用的主要D3.js功能：

- **SVG元素创建**：使用`d3.select()`和`append()`方法创建SVG容器和图形元素。
- **数据绑定**：通过`.data()`方法将数据绑定到DOM元素，实现动态更新。
- **力导向模拟**：使用`d3.forceSimulation()`创建力导向模拟，并通过`.on("tick", ...)`方法更新节点和链接的位置。

## 四、代码实现

以下是项目的关键代码实现细节：

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
    <script>
        // JavaScript代码
    </script>
</body>
</html>
```

### 4.2 SVG容器创建

```javascript
const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
```

### 4.3 力导向模拟设置

```javascript
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(100)) // 弹簧力
    .force("charge", d3.forceManyBody().strength(-300)) // 节点间的斥力
    .force("center", d3.forceCenter(width / 2, height / 2)); // 中心力
```

### 4.4 节点和链接的更新

```javascript
function update(source) {
    const nodes = root.descendants();
    const links = root.links();

    // 更新力导向模拟
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    // 更新节点位置
    g.selectAll(".node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // 更新链接路径
    g.selectAll(".link")
        .attr("d", d => `M${d.source.x},${d.source.y} C${(d.source.x + d.target.x) / 2},${d.source.y} ${(d.source.x + d.target.x) / 2},${d.target.y} ${d.target.x},${d.target.y}`);
}
```

### 4.5 事件处理

```javascript
svg.on("mousedown", (event) => {
    isDragging = true;
    startPoint = { x: event.clientX - currentTranslate.x, y: event.clientY - currentTranslate.y };
});
```

## 五、库函数引用

### 5.1 D3.js

- **选择器**：`d3.select()`用于选择DOM元素。
- **数据绑定**：`data()`方法用于将数据绑定到元素。
- **力导向模拟**：`forceSimulation()`用于创建力导向图。

### 5.2 Three.js（如有使用）

在本项目中未使用Three.js，但可以通过类似的方式实现3D可视化。

## 六、结论

本实验通过D3.js实现了生物演化史的力导向可视化，展示了生物演化的复杂关系。通过创新的功能点和良好的用户体验，提升了信息的可获取性和可视化效果。未来可以考虑引入更多的交互功能和数据分析，以进一步丰富用户体验。

## 七、参考文献

- D3.js官方文档：[D3.js](https://d3js.org/)
- 力导向图算法相关文献
- 生物演化相关资料

---

以上是本实验的详细报告，涵盖了创新功能、算法描述、代码实现及库函数引用等方面。希望对您有所帮助！
