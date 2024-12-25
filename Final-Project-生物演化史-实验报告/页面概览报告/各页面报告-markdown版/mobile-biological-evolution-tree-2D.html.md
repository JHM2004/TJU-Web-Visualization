# 实验报告：生物演化史-Tree-2D 可视化项目

## 一、项目概述

本项目旨在通过可视化技术展示生物演化的历史，采用D3.js库构建一个交互式的树形图。用户可以通过选择不同的时间段来过滤展示的生物演化信息，并通过搜索功能快速定位特定节点。该项目不仅展示了生物演化的复杂性，还提供了用户友好的交互体验。

## 二、创新功能点

1. **动态树形布局**：根据用户选择的时间段动态调整树形图的高度和宽度，确保信息的清晰展示。
2. **交互式工具提示**：当用户悬停或点击节点时，显示详细信息，包括生物名称、时间和描述，增强用户体验。
3. **搜索功能**：用户可以通过输入关键字快速搜索节点，系统会实时更新搜索结果并高亮显示路径。
4. **设备检测**：在移动设备上，提供特定的提示信息，确保用户体验的一致性。
5. **高亮路径**：用户点击搜索结果后，系统会高亮显示从目标节点到根节点的路径，帮助用户理解生物演化的关系。

## 三、算法描述

### 1. 数据结构

使用D3.js的层次结构（hierarchy）来表示生物演化数据。每个节点包含以下属性：
- `name`: 生物名称
- `src`: 图片链接
- `description`: 生物描述
- `time`: 生物出现的时间

### 2. 树形布局算法

使用D3.js的树形布局算法，计算节点的位置和连接线的路径。根据节点数量动态调整SVG的高度，确保所有节点都能在视口内显示。

### 3. 事件处理

- **鼠标事件**：通过`mouseover`和`mouseout`事件处理工具提示的显示与隐藏。
- **搜索事件**：监听输入框的变化，实时过滤和显示匹配的节点。

## 四、代码实现

### 1. HTML结构

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>生物演化史-Tree-2D</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        /* CSS样式省略 */
    </style>
</head>
<body>
    <div id="alertMessage" class="alert-message"></div>
    <div class="control-buttons">
        <!-- 控制按钮省略 -->
    </div>
    <div class="time-filter">
        <!-- 时间过滤器省略 -->
    </div>
    <div class="search-container">
        <input type="text" id="search-input" placeholder="搜索节点...">
        <div id="search-results"></div>
    </div>
    <div id="tree"></div>
    <div class="tooltip"></div>
    <script src="./biological-evolution-data.js"></script>
    <script>
        // JavaScript代码省略
    </script>
</body>
</html>
```

### 2. D3.js树形布局实现

```javascript
// 创建SVG容器
const svg = d3.select("#tree")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// 创建树布局
const tree = d3.tree()
    .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

// 渲染树形图
function renderTree(data, filter = 'all') {
    // 清除现有内容
    svg.selectAll("*").remove();

    // 过滤数据
    let filteredData = JSON.parse(JSON.stringify(data));
    if (filter !== 'all') {
        filteredData.children = filteredData.children.filter(d => d.name === filter);
    }

    // 创建层次结构
    const root = d3.hierarchy(filteredData);
    tree(root);

    // 绘制连接线
    svg.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // 绘制节点
    const nodes = svg.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    // 添加节点圆圈
    nodes.append("circle")
        .attr("r", 5);

    // 添加文本标签
    nodes.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -40 : 40)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name);
}
```

### 3. 交互功能实现

```javascript
// 添加鼠标事件
nodes.on("mouseover", function(event, d) {
    tooltip.style("display", "block")
        .html(`
            <strong>${d.data.name}</strong>
            ${d.data.src ? `<img src="${d.data.src}" alt="${d.data.name}">` : ''}
            <div class="tooltip-text">
                ${d.data.name ? '<br>时间: ' + d.data.name : ''}
                ${d.data.description ? '<br>描述: ' + d.data.description : ''}
            </div>
        `)
        .style("left", "50%")
        .style("top", "50%");
})
.on("mouseout", function() {
    tooltip.style("display", "none");
});
```

### 4. 搜索功能实现

```javascript
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (!searchTerm) {
        searchResults.innerHTML = '';
        return;
    }

    const matches = allNodes.filter(node => 
        node.data.name && node.data.name.toLowerCase().includes(searchTerm)
    );

    searchResults.innerHTML = matches
        .map(node => `
            <div class="search-result-item" data-node-id="${node.data.name}">
                ${node.data.name}
            </div>
        `).join('');
});
```

## 五、库函数引用

### D3.js

- **d3.hierarchy**: 用于创建层次结构，便于后续的树形布局计算。
- **d3.tree**: 创建树形布局，计算节点的位置。
- **d3.linkHorizontal**: 生成连接线的路径。

### Three.js

本项目未使用Three.js，但可以考虑在未来版本中结合Three.js实现3D可视化效果。

## 六、总结

本项目通过D3.js实现了生物演化史的可视化，提供了动态交互功能，增强了用户体验。未来可以考虑引入更多的可视化库，如Three.js，进一步提升展示效果。通过不断优化和扩展功能，项目将更好地服务于生物学研究和教育。
