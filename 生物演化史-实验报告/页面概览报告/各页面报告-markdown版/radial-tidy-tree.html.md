# 生物演化史放射状树形图实验报告

## 1. 引言

本实验旨在创建一个交互式的生物演化史放射状树形图，利用D3.js库实现数据可视化。该项目不仅展示了生物演化的历程，还提供了丰富的交互功能，使用户能够深入探索生物演化的细节。

## 2. 创新功能点

### 2.1 放射状树形图布局
采用D3.js的树形布局算法，创建了一个放射状的树形图，直观地展示了生物演化的层次结构。

### 2.2 时间轴过滤
实现了一个时间轴滑块，允许用户根据时间筛选显示的生物节点，动态展示不同时期的生物演化状况。

### 2.3 搜索功能
集成了实时搜索功能，用户可以快速定位特定的生物节点。

### 2.4 路径高亮
在搜索结果中点击节点时，会高亮显示从根节点到该节点的完整路径。

### 2.5 详细信息面板
点击节点后，会显示包含图片、名称、时间和描述的详细信息面板。

### 2.6 图片放大功能
支持点击图片查看大图，增强了用户体验。

### 2.7 旋转控制
通过键盘控制（'Q'和'E'键），用户可以旋转整个树形图，以不同角度查看数据。

### 2.8 全屏显示
提供全屏查看选项，让用户获得更沉浸式的体验。

## 3. 技术实现

### 3.1 D3.js库的使用

#### 3.1.1 树形布局创建
```javascript
const tree = d3.tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => {
        return (a.parent == b.parent ? 2 : 3) / a.depth;
    });
```
这段代码创建了一个放射状的树形布局。`size([2 * Math.PI, radius])`设置了布局的大小，使其形成一个完整的圆。`separation`函数定义了节点之间的间隔。

#### 3.1.2 数据绑定与元素创建
```javascript
const node = g.selectAll(".node")
    .data(treeData2.descendants())
    .join("g")
    .attr("class", "node")
    .attr("transform", d => `
        translate(${d3.pointRadial(d.x, d.y)})
    `);
```
这段代码将数据绑定到DOM元素，创建节点组，并设置它们的位置。`d3.pointRadial`函数用于计算极坐标系中的点位置。

#### 3.1.3 缩放与平移
```javascript
const zoom = d3.zoom()
    .scaleExtent([0.2, 5])
    .on("zoom", (event) => {
        g.attr("transform", `${event.transform} rotate(${currentRotation})`);
    });
```
这段代码实现了缩放和平移功能。`scaleExtent`设置了缩放的范围，`on("zoom")`定义了缩放时的行为。

### 3.2 时间轴过滤实现

```javascript
function updateView(threshold) {
    const visibleNodes = new Set();
    
    root.descendants().forEach(d => {
        const time = parseTime(d.data.time);
        if (time === 0 || time <= threshold) {
            visibleNodes.add(d.id);
            let ancestor = d.parent;
            while (ancestor) {
                visibleNodes.add(ancestor.id);
                ancestor = ancestor.parent;
            }
        }
    });

    g.selectAll(".link")
        .style("display", d => {
            return (visibleNodes.has(d.source.id) && visibleNodes.has(d.target.id)) ? "block" : "none";
        });

    g.selectAll(".node")
        .style("display", d => {
            return visibleNodes.has(d.id) ? "block" : "none";
        });
}
```

这个函数实现了基于时间阈值的节点过滤。它首先遍历所有节点，找出时间小于阈值的节点及其所有祖先节点，然后更新连接线和节点的显示状态。

### 3.3 搜索功能实现

```javascript
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
    searchResult.style.display = 'block';
}
```

这个函数实现了节点搜索功能。它遍历所有节点，检查节点的名称、描述和时间是否包含查询字符串，并返回匹配的结果。

### 3.4 路径高亮

```javascript
function highlightPath(node) {
    g.selectAll('.link').classed('highlight-path', false);
    
    const path = [];
    let current = node;
    while (current.parent) {
        path.push([current.parent, current]);
        current = current.parent;
    }

    g.selectAll('.link')
        .classed('highlight-path', d => {
            return path.some(p => 
                (p[0].id === d.source.id && p[1].id === d.target.id)
            );
        });
}
```

这个函数实现了路径高亮功能。它首先清除之前的高亮，然后找出从根节点到目标节点的路径，最后将路径上的连接线添加高亮类。

### 3.5 旋转控制

```javascript
document.addEventListener('keydown', (event) => {
    if (event.key === 'q') {
        currentRotation -= rotationStep;
        g.attr("transform", `${d3.zoomTransform(svg.node())} rotate(${currentRotation})`);
    } else if (event.key === 'e') {
        currentRotation += rotationStep;
        g.attr("transform", `${d3.zoomTransform(svg.node())} rotate(${currentRotation})`);
    }
});
```

这段代码实现了键盘控制旋转功能。当按下'Q'或'E'键时，会更新旋转角度并应用到SVG元素上。

## 4. 性能优化

### 4.1 虚拟DOM
使用D3.js的`join`方法进行高效的DOM更新，减少不必要的DOM操作。

### 4.2 事件委托
利用事件冒泡，将事件监听器添加到父元素上，而不是每个子元素，减少了事件监听器的数量。

### 4.3 防抖
在搜索功能中可以考虑添加防抖，减少频繁的搜索操作，提高性能。

## 5. 用户界面设计

### 5.1 响应式布局
使用相对单位和弹性布局，确保在不同屏幕尺寸下都能正常显示。

### 5.2 交互式元素
添加悬停效果、点击反馈等，提升用户体验。

### 5.3 信息展示
使用工具提示和详情面板，在不影响整体布局的情况下展示更多信息。

## 6. 未来改进方向

### 6.1 数据加载优化
考虑实现数据的异步加载和分片加载，以支持更大规模的数据集。

### 6.2 交互增强
可以添加更多的交互方式，如拖拽重组、节点折叠等。

### 6.3 移动端适配
优化移动设备上的用户体验，如触摸控制、手势操作等。

### 6.4 数据分析功能
集成数据分析工具，如统计图表、时间线等，深入挖掘数据价值。

## 7. 结论

本实验成功创建了一个功能丰富、交互性强的生物演化史放射状树形图。通过D3.js库的强大功能，实现了复杂的数据可视化和交互效果。该项目不仅直观地展示了生物演化的过程，还提供了多种方式让用户探索和理解数据。未来，我们将继续优化性能，增强功能，以提供更好的用户体验和更深入的数据洞察。