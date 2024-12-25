# 实验报告：生物分类可视化系统

## 一、引言

随着生物科学的不断发展，生物分类学作为一门重要的学科，越来越受到重视。为了帮助用户更好地理解生物分类的复杂性，我们开发了一个基于Web的生物分类可视化系统。该系统利用D3.js库实现了生物分类的交互式可视化，用户可以通过旋转、缩放等操作深入探索生物分类的层次结构。

## 二、创新功能点

1. **交互式可视化**：用户可以通过鼠标拖拽、键盘操作等方式与可视化图形进行交互，增强了用户体验。
2. **放大镜功能**：用户可以在图形上方使用放大镜查看细节，提升了信息的可读性。
3. **搜索功能**：用户可以通过输入生物名称快速定位到相应的分类节点，方便快捷。
4. **信息面板**：当用户悬停在某个节点上时，右侧信息面板会显示该节点的详细信息，包括图片、描述等。

## 三、算法描述

### 3.1 数据结构

系统使用树形结构来表示生物分类数据。每个节点包含以下属性：
- `name`：生物名称
- `src`：生物图片链接
- `description`：生物描述
- `children`：子节点数组

### 3.2 可视化算法

使用D3.js库的分区布局（partition layout）算法来生成生物分类的可视化图形。该算法将数据转换为层次结构，并根据节点的深度和权重计算每个节点的角度和半径。

### 3.3 交互功能

- **拖拽旋转**：通过监听鼠标事件，计算当前鼠标位置与中心点的角度差，更新当前旋转角度。
- **键盘控制**：使用WASD和方向键控制同层节点的移动，增强了用户的操作灵活性。
- **搜索功能**：通过遍历树形结构，查找匹配的节点并高亮显示。

## 四、代码实现

### 4.1 HTML结构

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>生物分类可视化</title>
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

#### 4.2.1 数据处理

使用D3.js的`hierarchy`函数将数据转换为层次结构，并使用`partition`函数生成分区布局。

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

#### 4.2.2 弧生成器

使用D3.js的`arc`函数生成每个节点的弧形路径。

```javascript
const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(0.005)
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1;
```

#### 4.2.3 交互功能

通过监听鼠标和键盘事件，实现节点的拖拽和旋转。

```javascript
d3.select("body")
    .style("cursor", "move")
    .on("mousedown", dragstarted)
    .on("mousemove", dragged)
    .on("mouseup", dragended);

function dragstarted(event) {
    isDragging = true;
    dragStartAngle = Math.atan2(event.pageY - height / 2, event.pageX - width / 2) * 180 / Math.PI;
    dragStartRotation = currentRotation;
}
```

### 4.3 放大镜功能实现

使用Canvas元素实现放大镜效果，通过鼠标移动事件更新放大镜内容。

```javascript
function updateMagnifier(e) {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;

    // 获取SVG的位置和尺寸
    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    // 清除离屏canvas
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // 创建圆形裁剪区域
    offscreenCtx.save();
    offscreenCtx.beginPath();
    offscreenCtx.arc(offscreenCanvas.width / 2, offscreenCanvas.height / 2, offscreenCanvas.width / 2, 0, Math.PI * 2);
    offscreenCtx.clip();

    // 将SVG转换为图片
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);

    img.onload = () => {
        // 计算缩放和位置
        const scale = ZOOM;
        const dx = offscreenCanvas.width / 2 - mouseX * scale;
        const dy = offscreenCanvas.height / 2 - mouseY * scale;

        // 在离屏canvas上绘制
        offscreenCtx.drawImage(img, dx, dy, svgRect.width * scale, svgRect.height * scale);
        offscreenCtx.restore();

        // 将离屏canvas的内容复制到显示canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvas, 0, 0);

        URL.revokeObjectURL(url);
    };

    img.src = url;
}
```

## 五、总结

本实验通过D3.js库实现了一个生物分类可视化系统，提供了丰富的交互功能和用户体验。系统不仅能够有效地展示生物分类的层次结构，还通过放大镜和搜索功能提升了信息的可读性和可访问性。未来，我们计划进一步优化系统性能，并增加更多的生物分类数据，以便用户能够更全面地了解生物分类学的知识。
