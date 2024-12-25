# 实验报告：生物演化树可视化

## 一、引言

本实验旨在通过可视化技术展示生物演化树，帮助用户更直观地理解生物的演化过程。我们使用了 D3.js 库来构建树形结构，并通过交互式功能增强用户体验。该项目的创新点在于结合了多种可视化方式，并实现了动态过滤和搜索功能。

## 二、创新功能点

1. **动态过滤**：用户可以通过下拉框选择不同的地质时代，实时更新树形结构，展示特定时期的生物演化情况。
2. **搜索功能**：用户可以输入生物名称进行搜索，系统会高亮显示匹配的节点，并自动滚动到该节点位置。
3. **工具提示**：鼠标悬停在节点上时，显示详细信息，包括生物名称、图片和描述，增强了信息的可读性。
4. **懒加载图片**：为了提高性能，使用懒加载技术，仅在节点进入视口时加载相关图片。
5. **全屏显示**：用户可以选择全屏模式，提供更好的视觉体验。

## 三、算法描述

### 1. 数据结构

我们使用 D3.js 提供的层次结构（hierarchy）来构建树形数据。每个节点包含以下属性：
- `name`: 生物名称
- `src`: 图片链接
- `description`: 生物描述
- `children`: 子节点数组

### 2. 树形布局

使用 D3.js 的 `d3.tree()` 方法创建树形布局。根据节点数量动态计算 SVG 高度，以确保所有节点都能在视口内显示。

### 3. 事件处理

- **鼠标事件**：通过 `mouseover` 和 `mouseout` 事件处理工具提示的显示与隐藏。
- **搜索事件**：监听输入框的 `input` 事件，实时过滤并显示搜索结果。

## 四、代码实现

### 1. HTML 结构

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>生物演化史-Tree-2D</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        /* 样式定义 */
    </style>
</head>
<body>
    <div class="control-buttons">
        <!-- 控制按钮 -->
    </div>
    <div class="time-filter">
        <div class="filter-title">Tidy Tree</div>
        <select id="era-select">
            <option value="all">全部时期</option>
            <!-- 其他选项 -->
        </select>
    </div>
    <div class="search-container">
        <input type="text" id="search-input" placeholder="搜索节点...">
        <div id="search-results"></div>
    </div>
    <div id="tree"></div>
    <div class="tooltip"></div>
    <script src="biological-evolution-data.js"></script>
    <script>
        // JavaScript 代码
    </script>
</body>
</html>
```

### 2. JavaScript 代码

```javascript
// 设置画布尺寸
const width = window.innerWidth - 50;
let height = 800; // 初始高度
const margin = {top: 20, right: 90, bottom: 20, left: 90};

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

// 加载数据并渲染树
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
    
    // 计算需要的高度
    const nodeCount = root.descendants().length;
    const minHeightPerNode = 40; // 每个节点的最小高度
    const calculatedHeight = nodeCount * minHeightPerNode;
    
    // 更新高度
    let svgHeight = Math.max(height, calculatedHeight);
    
    // 更新树形布局
    const treeLayout = d3.tree()
        .size([svgHeight - margin.top - margin.bottom, 
            filter === 'all' ? 
                width - margin.left - margin.right : 
                (width - margin.left - margin.right) * 0.6
        ]);
    
    // 调整 SVG 容器高度
    d3.select("#tree svg")
        .attr("height", svgHeight);
    
    // 计算节点位置
    treeLayout(root);

    // 绘制连接线
    const links = svg.selectAll(".link")
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

    // 添加图片
    nodes.append("image")
        .attr("data-src", d => d.data.src)
        .attr("class", "node-image")
        .attr("x", -15)
        .attr("y", -15)
        .attr("width", 30)
        .attr("height", 30);

    // 添加文本标签
    nodes.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -40 : 40)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name);
}

// 加下拉框事件监听
d3.select("#era-select").on("change", function() {
    const selectedEra = this.value;
    renderTree(treeData, selectedEra);
});

// 初始渲染
renderTree(treeData);
```

### 3. D3.js 库函数引用

- `d3.select()`: 用于选择 DOM 元素。
- `d3.hierarchy()`: 将数据转换为层次结构。
- `d3.tree()`: 创建树形布局。
- `d3.linkHorizontal()`: 生成连接线的路径。

## 五、总结

本实验通过 D3.js 实现了生物演化树的可视化，提供了动态过滤、搜索和工具提示等功能，增强了用户的交互体验。通过使用懒加载技术，优化了性能，确保了在处理大量数据时的流畅性。未来可以考虑引入 Three.js 实现三维可视化，进一步提升展示效果。
