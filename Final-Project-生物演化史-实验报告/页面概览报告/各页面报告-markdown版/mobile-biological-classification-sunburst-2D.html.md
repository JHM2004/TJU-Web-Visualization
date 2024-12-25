# 实验报告：生物分类可视化系统

## 一、引言

本实验旨在开发一个基于Web的生物分类可视化系统，利用D3.js库实现生物分类数据的动态展示。该系统通过交互式的方式，帮助用户更好地理解生物分类的层次结构和相关信息。系统的创新功能包括放大镜效果、搜索功能、全屏显示等，提升了用户体验和数据可视化效果。

## 二、创新功能点

1. **动态交互**：用户可以通过鼠标拖拽和键盘操作（WASD和方向键）来旋转和移动生物分类图，增强了交互性。
2. **放大镜效果**：用户可以通过点击按钮显示放大镜，实时查看生物分类图的细节，提升了可视化效果。
3. **搜索功能**：用户可以通过输入生物名称进行搜索，系统会高亮显示匹配的节点，并更新信息面板。
4. **全屏显示**：用户可以选择进入全屏模式，提供更大的视图空间以便于观察复杂的生物分类结构。

## 三、算法描述

### 3.1 数据结构

系统使用树形结构来表示生物分类数据。每个节点包含以下信息：
- `name`: 生物名称
- `src`: 生物图像链接
- `time`: 生物出现的时期
- `description`: 生物的简要描述
- `description_more`: 生物的详细描述
- `children`: 子节点数组

### 3.2 颜色生成算法

根据节点的深度和所属分支，使用线性插值生成不同的颜色，以便于区分不同的生物分类。例如，动物界使用橙色系，植物界使用绿色系等。

```javascript
const color = d => {
    let node = d;
    while (node.parent) {
        if (node.data.name === "动物界") {
            return d3.scaleLinear()
                .domain([0, 5])
                .range(["#FFA500", "#FF8C00"])(d.depth);
        }
        // 其他分支的颜色处理...
        node = node.parent;
    }
    return d3.scaleLinear()
        .domain([0, 5])
        .range(["#FF8C00", "#FF4500"])(d.depth);
};
```

### 3.3 SVG生成与交互

使用D3.js库生成SVG元素，并通过事件监听实现用户交互。用户可以通过鼠标拖拽来旋转图形，使用键盘控制移动。

```javascript
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

d3.select("body")
    .on("mousedown", dragstarted)
    .on("mousemove", dragged)
    .on("mouseup", dragended);
```

## 四、代码实现

### 4.1 HTML结构

HTML文件的基本结构包括头部信息、样式、脚本和主体内容。使用了D3.js和html2canvas等库。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>简简单的生物分类</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="./biological-classification-data.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <style>
        /* 样式定义 */
    </style>
</head>
<body>
    <div class="control-tips">...</div>
    <div class="content-container">
        <svg width="1000" height="1000"></svg>
        <div class="info-panel">...</div>
    </div>
    <div class="control-buttons">...</div>
    <div class="search-container">...</div>
    <div id="magnifier">...</div>
    <script>
        // JavaScript代码
    </script>
</body>
</html>
```

### 4.2 D3.js实现细节

#### 4.2.1 创建分区布局

使用D3.js的分区布局来处理数据并生成SVG路径。

```javascript
const partition = data => {
    const root = d3.hierarchy(data)
        .sum(d => 1)
        .sort((a, b) => b.value - a.value);
    return d3.partition()
        .size([2 * Math.PI, radius])
        .padding(0.005)(root);
};
```

#### 4.2.2 创建弧生成器

使用D3.js的弧生成器来绘制每个节点的弧形。

```javascript
const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(0.005)
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1;
```

### 4.3 事件处理

实现鼠标悬停、点击等事件处理，更新信息面板。

```javascript
path.on("mouseover", function(event, d) {
    // 更新信息面板
})
.on("mouseout", function() {
    // 恢复初始状态
});
```

## 五、总结

本实验成功实现了一个基于D3.js的生物分类可视化系统，具备动态交互、放大镜效果、搜索功能和全屏显示等创新功能。通过合理的数据结构和算法设计，用户能够直观地理解生物分类的层次关系。未来可以进一步优化性能，增加更多的生物分类数据，以提升系统的实用性和可扩展性。
