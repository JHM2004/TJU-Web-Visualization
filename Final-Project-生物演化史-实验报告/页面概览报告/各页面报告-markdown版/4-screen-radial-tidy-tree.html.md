# 实验报告：生物演化史放射状树形图

## 一、引言

本实验旨在通过使用 D3.js 库构建一个生物演化史的放射状树形图，以可视化生物的演化过程。该图形不仅展示了生物的演化关系，还提供了交互功能，如搜索、缩放和详细信息展示，增强了用户体验。

## 二、创新功能点

1. **动态搜索功能**：用户可以通过输入关键字快速搜索节点，系统会实时更新搜索结果，提升了信息获取的效率。
   
2. **时间过滤器**：用户可以通过滑块调整时间范围，动态显示不同时间段的生物演化节点，帮助用户更好地理解生物演化的时间线。

3. **详细信息面板**：点击节点后，系统会展示该节点的详细信息，包括名称、时间和描述，增强了信息的可读性。

4. **高亮路径功能**：用户可以高亮显示从根节点到目标节点的路径，帮助用户更直观地理解生物之间的演化关系。

5. **模态框展示**：点击节点或工具提示中的图片时，能够放大查看，提升了用户的交互体验。

## 三、算法描述

### 3.1 数据结构

使用 D3.js 的 `hierarchy` 方法构建树形结构，节点包含以下属性：
- `id`: 节点唯一标识
- `data`: 包含生物的名称、时间、描述和图片链接等信息

### 3.2 布局算法

使用 D3.js 的 `tree` 布局算法，设置节点的角度和半径，以实现放射状的树形图。通过 `separation` 方法定义节点之间的间距。

### 3.3 事件处理

- **鼠标事件**：通过 `mouseover` 和 `mouseout` 事件展示和隐藏工具提示。
- **键盘事件**：监听 `Q` 和 `E` 键实现节点的旋转。
- **滑块事件**：通过滑块调整时间范围，动态更新可见节点。

## 四、代码实现

### 4.1 HTML 结构

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>生物演化史放射状树形图</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        /* 样式定义 */
    </style>
</head>
<body>
    <div class="header">
        <h1>生物演化史-Tree-2D</h1>
        <a href="./4-screen-biological-evolution-tree-2D.html" class="nav-link">Tidy Tree</a>         
    </div>
    <div class="control-buttons">
        <!-- 控制按钮 -->
    </div>
    <div class="bottom-time-filter">
        <input type="range" id="timeSlider" min="0" max="500000" value="500000">
        <span id="timeDisplay">显示所有时期</span>
    </div>
    <div class="keyboard-hint">
        使用 'Q' 键逆时针旋转，'E' 键顺时针旋转
    </div>
    <div class="search-container">
        <input type="text" class="search-input" placeholder="搜索节点...">
        <div class="search-result"></div>
    </div>
    <div class="detail-panel">
        <div class="content">
            <img src="" alt="">
            <h3></h3>
            <p class="time"></p>
            <p class="description"></p>
        </div>
    </div>
    <div id="imageModal" class="modal">
        <img class="modal-content" id="modalImage">
    </div>
    <script src="./biological-evolution-data.js"></script>
    <script>
        // JavaScript 代码实现
    </script>
</body>
</html>
```

### 4.2 JavaScript 代码实现

#### 4.2.1 SVG 创建与布局

```javascript
// 获取窗口尺寸
const width = window.innerWidth;
const height = window.innerHeight;

// 创建SVG容器
const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

// 添加一个专门用于缩放的组
const g = svg.append("g");

// 创建放射状树形图布局
const radius = Math.min(width, height) / 1;
const tree = d3.tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => {
        return (a.parent == b.parent ? 2 : 3) / a.depth;
    });
```

#### 4.2.2 事件处理

```javascript
// 添加键盘事件监听
document.addEventListener('keydown', (event) => {
    if (event.key === 'q') {
        // 逆时针旋转
        currentRotation -= rotationStep;
        g.attr("transform", `${d3.zoomTransform(svg.node())} rotate(${currentRotation})`);
    } else if (event.key === 'e') {
        // 顺时针旋转
        currentRotation += rotationStep;
        g.attr("transform", `${d3.zoomTransform(svg.node())} rotate(${currentRotation})`);
    }
});

// 修改滑块事件监听器
timeSlider.addEventListener('input', (event) => {
    const value = parseInt(event.target.value);
    updateView(value);
});
```

#### 4.2.3 搜索功能实现

```javascript
// 搜索函数
function searchNodes(query) {
    const results = [];
    root.descendants().forEach(node => {
        const name = node.data.name || '';
        const description = node.data.description || '';
        const time = node.data.time || '';
        
        if (!query || name.toLowerCase().includes(query.toLowerCase()) ||
            description.toLowerCase().includes(query.toLowerCase()) ||
            time.toLowerCase().includes(query.toLowerCase())) {
            results.push(node);
        }
    });

    displaySearchResults(results);
}

// 显示搜索结果
function displaySearchResults(results) {
    searchResult.innerHTML = '';
    
    if (results.length === 0) {
        searchResult.innerHTML = '<div class="search-result-item">未找到相关结果</div>';
        return;
    }

    results.forEach(node => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.textContent = `${node.data.name} ${node.data.time || ''}`;
        div.addEventListener('click', (event) => {
            event.stopPropagation();
            highlightPath(node);
        });
        searchResult.appendChild(div);
    });
}
```

### 4.4 D3.js 库函数引用

- **`d3.select`**: 用于选择 DOM 元素。
- **`d3.hierarchy`**: 用于构建层级数据结构。
- **`d3.tree`**: 用于创建树形布局。
- **`d3.zoom`**: 用于实现缩放功能。
- **`d3.linkRadial`**: 用于绘制放射状连接线。

## 五、结论

本实验通过 D3.js 库成功实现了生物演化史的放射状树形图，提供了丰富的交互功能，提升了用户体验。通过动态搜索、时间过滤和详细信息展示等功能，用户能够更直观地理解生物的演化过程。未来可以考虑引入 Three.js 库，进一步增强可视化效果，实现三维展示。
