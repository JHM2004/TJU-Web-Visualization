# 实验报告：生物分类可视化系统

## 一、引言

随着生物科学的不断发展，生物分类学作为一门重要的学科，越来越受到重视。为了更好地理解生物的分类关系，我开发了一款基于Web的生物分类可视化系统。该系统利用D3.js库实现了生物分类的交互式可视化，用户可以通过旋转、缩放等操作深入探索生物分类的层次结构。

## 二、创新功能点

1. **交互式可视化**：用户可以通过鼠标拖拽、键盘操作等方式与可视化图形进行交互，增强了用户体验。
2. **放大镜功能**：用户可以在图形上方显示放大镜，实时查看细节，适合观察复杂的生物分类结构。
3. **搜索功能**：用户可以通过输入生物名称快速定位到相应的分类节点，提升了查找效率。
4. **信息面板**：当用户悬停在某个节点上时，右侧信息面板会显示该生物的详细信息，包括图片、描述等。
5. **全屏模式**：用户可以选择进入全屏模式，以便更好地查看可视化效果。

## 三、算法描述

### 3.1 数据结构

系统使用树形结构来表示生物分类数据。每个节点包含以下信息：
- `name`：生物名称
- `src`：生物图片链接
- `description`：生物描述
- `children`：子节点数组

### 3.2 可视化算法

使用D3.js库的分区布局（partition layout）和弧生成器（arc generator）来创建生物分类的可视化图形。具体步骤如下：

1. **数据处理**：将原始数据转换为D3.js可以处理的层次结构。
2. **创建SVG元素**：使用D3.js创建SVG元素，并设置其宽高和中心点。
3. **生成弧形**：使用弧生成器根据节点的深度和宽度生成相应的弧形路径。
4. **绘制路径**：将生成的路径添加到SVG中，并根据节点的深度设置不同的颜色。
5. **添加文本标签**：在每个节点的中心位置添加文本标签，显示生物名称。

### 3.3 交互功能

- **拖拽旋转**：通过监听鼠标事件，计算当前鼠标位置与中心点的角度差，更新当前旋转角度。
- **键盘控制**：使用WASD和方向键控制同层节点的移动和旋转。
- **搜索功能**：通过输入框实时过滤节点，并高亮显示匹配的节点。

## 四、代码实现

### 4.1 主要代码片段

以下是实现生物分类可视化的关键代码片段：

```javascript
// 创建SVG元素
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

// 创建分区布局
const partition = data => {
    const root = d3.hierarchy(data)
        .sum(d => 1)
        .sort((a, b) => b.value - a.value);
    return d3.partition()
        .size([2 * Math.PI, radius])
        .padding(0.005)(root);
};

// 创建弧生成器
const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(0.005)
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1;

// 处理数据并绘制路径
const root = partition(data);
const path = svg.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", d => color(d))
    .attr("d", d => arc(d.current));
```

### 4.2 关键库函数引用

- **D3.js**：用于数据驱动的文档操作，提供了强大的数据可视化功能。
  - `d3.hierarchy(data)`：将数据转换为层次结构。
  - `d3.partition()`：创建分区布局。
  - `d3.arc()`：生成弧形路径。

- **HTML2Canvas**：用于将HTML元素转换为Canvas图像，便于后续处理和下载。

### 4.3 事件处理

以下是处理用户交互的代码示例：

```javascript
// 添加拖拽功能
d3.select("body")
    .style("cursor", "move")
    .on("mousedown", dragstarted)
    .on("mousemove", dragged)
    .on("mouseup", dragended);

function dragstarted(event) {
    isDragging = true;
    dragStartAngle = Math.atan2(event.pageY - height/2, event.pageX - width/2) * 180 / Math.PI;
    dragStartRotation = currentRotation;
}

function dragged(event) {
    if (!isDragging) return;
    const currentAngle = Math.atan2(event.pageY - height/2, event.pageX - width/2) * 180 / Math.PI;
    const deltaAngle = currentAngle - dragStartAngle;
    currentRotation = dragStartRotation + deltaAngle;
    svg.attr("transform", `translate(${width/2},${height/2}) rotate(${currentRotation})`);
}

function dragended() {
    isDragging = false;
}
```

## 五、总结

本实验通过D3.js库实现了一个生物分类可视化系统，提供了丰富的交互功能和用户体验。系统不仅能够直观地展示生物分类的层次结构，还通过搜索和放大镜功能增强了用户的探索能力。未来，我们计划进一步优化系统性能，增加更多生物分类数据，并探索使用Three.js实现3D可视化效果，以提升用户体验。

## 六、参考文献

1. D3.js官方文档：[https://d3js.org/](https://d3js.org/)
2. HTML2Canvas文档：[https://html2canvas.hertzen.com/](https://html2canvas.hertzen.com/)
3. 生物分类学相关文献和资料。
