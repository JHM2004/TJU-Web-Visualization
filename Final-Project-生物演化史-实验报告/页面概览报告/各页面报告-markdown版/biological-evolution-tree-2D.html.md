# 实验报告：生物演化树可视化

## 引言

本实验旨在通过使用 D3.js 库构建一个生物演化树的可视化界面。该界面不仅展示了生物的演化关系，还提供了交互功能，如搜索、过滤和全屏显示等。通过这些功能，用户可以更直观地理解生物演化的复杂性。

## 创新功能点

1. **动态树布局**：根据用户选择的时间段动态调整树的高度和宽度，以便更好地展示不同时间段的生物演化情况。
2. **懒加载图片**：在节点中使用懒加载技术，只有当节点进入视口时才加载相关图片，从而提高页面性能。
3. **交互式工具提示**：当用户悬停在节点上时，显示详细信息，包括生物名称、时间和描述，增强用户体验。
4. **搜索功能**：用户可以通过输入生物名称快速定位到相应节点，并高亮显示路径。
5. **全屏显示**：提供全屏按钮，用户可以在全屏模式下更好地查看生物演化树。

## 算法描述

### 1. 数据结构

使用 D3.js 的层次结构（hierarchy）来表示生物演化树的数据。每个节点包含以下属性：
- `name`：生物名称
- `src`：生物图片的 URL
- `description`：生物的描述
- `time`：生物出现的时间

### 2. 树布局

使用 D3.js 的 `d3.tree()` 方法创建树布局。树的高度和宽度根据用户选择的时间段动态计算，以确保信息的清晰展示。

### 3. 懒加载实现

使用 `IntersectionObserver` API 监测节点图片的可见性，只有当图片进入视口时才加载，从而减少初始加载时间。

### 4. 交互功能

- **鼠标悬停事件**：当用户将鼠标悬停在节点上时，显示工具提示，包含生物的详细信息。
- **搜索功能**：通过监听输入框的变化，实时过滤并显示匹配的节点。

## 代码实现

以下是关键代码片段的实现细节：

### 1. 创建 SVG 容器

```javascript
const svg = d3.select("#tree")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
```

### 2. 动态树布局

```javascript
function getTreeLayout(filter) {
    let dynamicHeight;
    switch(filter) {
        case 'all':
            dynamicHeight = height * 8;
            break;
        case '显生宙':
            dynamicHeight = height * 3;
            break;
        case '新生代':
        case '中生代':
            dynamicHeight = height * 2;
            break;
        default:
            dynamicHeight = height;
    }
    
    const dynamicWidth = filter === 'all' ? 
        width - margin.left - margin.right : 
        (width - margin.left - margin.right) * 0.6;
    
    return d3.tree()
        .size([dynamicHeight - margin.top - margin.bottom, dynamicWidth]);
}
```

### 3. 懒加载图片

```javascript
function lazyLoadImages() {
    const images = document.querySelectorAll('image.node-image');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.setAttribute('href', src);
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    images.forEach(image => {
        observer.observe(image);
    });
}
```

### 4. 交互式工具提示

```javascript
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
        .style("left", tooltipX + "px")
        .style("top", tooltipY + "px");
})
.on("mouseout", function() {
    tooltip.style("display", "none");
});
```

### 5. 搜索功能实现

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

## 库函数引用

### D3.js

- **d3.tree()**：用于创建树布局，支持动态调整节点位置。
- **d3.hierarchy()**：将数据转换为层次结构，便于树形布局的计算。
- **d3.select()**：用于选择 DOM 元素并进行操作。

### IntersectionObserver

- **IntersectionObserver**：用于实现懒加载功能，监测元素的可见性。

## 结论

本实验成功实现了一个生物演化树的可视化界面，结合 D3.js 的强大功能，提供了动态、交互式的用户体验。通过创新的功能点，如懒加载、搜索和全屏显示，用户能够更方便地探索生物演化的复杂关系。未来可以考虑进一步优化性能和增加更多的交互功能，以提升用户体验。
