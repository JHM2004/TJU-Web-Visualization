# 实验报告：四象限展示网页

## 一、引言

本实验旨在开发一个四象限展示网页，用户可以通过 URL 参数选择四个不同的卡片内容，并在网页的四个象限中展示这些内容。该网页采用 HTML、CSS 和 JavaScript 技术实现，具有良好的用户体验和交互性。通过使用 iframe 技术，能够动态加载不同的子页面内容，提升了页面的灵活性和可扩展性。

## 二、创新功能点

1. **动态内容加载**：用户可以通过 URL 参数选择不同的卡片，网页会根据选择动态加载相应的内容，避免了页面的重复加载。
2. **响应式设计**：使用 CSS Flexbox 布局，使得网页在不同屏幕尺寸下都能保持良好的展示效果。
3. **消息传递机制**：通过 `postMessage` API 实现父页面与子页面之间的通信，能够实时更新象限内容。
4. **用户友好的错误提示**：当用户未选择四个卡片时，网页会显示明确的错误信息，提升用户体验。

## 三、代码实现

### 1. HTML 结构

网页的基本结构使用 HTML5 标准，包含了文档类型声明、头部信息和主体内容。以下是主要的 HTML 结构：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <title>四象限展示</title>
    <style>
        /* CSS 样式 */
    </style>
</head>
<body>
    <div class="quadrant" id="top-left"></div>
    <div class="quadrant" id="top-right"></div>
    <div class="quadrant" id="bottom-left"></div>
    <div class="quadrant" id="bottom-right"></div>
    <script>
        // JavaScript 逻辑
    </script>
</body>
</html>
```

### 2. CSS 样式

使用 CSS Flexbox 布局来实现四个象限的排列，确保在不同设备上都能自适应。以下是主要的 CSS 样式：

```css
body {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
    margin: 0;
    box-sizing: border-box; /* 包含边框在内的计算 */
}
.quadrant {
    width: calc(50% - 2px); /* 减去边框宽度 */
    height: calc(50% - 2px); /* 减去边框宽度 */
    position: relative;
    overflow: hidden;
    border: 1px solid #ccc; /* 边框样式 */
    box-sizing: border-box; /* 包含边框在内的计算 */
    margin: 1px; /* 添加间隔 */
}
```

### 3. JavaScript 逻辑

JavaScript 部分负责获取 URL 参数、加载内容、处理消息传递等功能。以下是主要的 JavaScript 逻辑：

```javascript
// 获取 URL 中的参数
const urlParams = new URLSearchParams(window.location.search);
const cards = urlParams.get('cards').split(',');

// 确保有四个选中的卡片
if (cards.length === 4) {
    loadContent('top-left', cards[0]);
    loadContent('top-right', cards[1]);
    loadContent('bottom-left', cards[2]);
    loadContent('bottom-right', cards[3]);
} else {
    document.body.innerHTML = '<h1>错误: 请选择四个选项卡。</h1>';
}

// 加载子页面内容的函数
function loadContent(quadrantId, cardName) {
    const iframe = document.createElement('iframe');
    iframe.src = `./4-screen-${cardName}.html`; // 设置 iframe 的源
    document.getElementById(quadrantId).appendChild(iframe); // 将 iframe 添加到对应的象限
}

// 添加事件监听器以接收来自 iframe 的消息
window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin) {
        const { quadrantId, data } = event.data;
        updateQuadrant(quadrantId, data);
    }
});

// 更新象限内容的函数
function updateQuadrant(quadrantId, data) {
    const quadrant = document.getElementById(quadrantId);
    quadrant.innerHTML = `<h2>选中数据: ${data}</h2>`; // 更新显示内容
}
```

### 4. 代码细节分析

- **URL 参数解析**：使用 `URLSearchParams` 对象解析 URL 中的参数，确保用户选择的卡片数量为四个。
- **动态加载 iframe**：通过创建 `iframe` 元素并设置其 `src` 属性，动态加载不同的子页面内容。
- **消息传递**：使用 `window.addEventListener` 监听来自子页面的消息，确保消息来源的安全性，并根据接收到的数据更新对应的象限内容。

## 四、库函数引用

在本实验中，虽然没有直接使用 D3.js 和 Three.js，但可以考虑在未来的扩展中引入这些库来增强数据可视化和三维效果。

- **D3.js**：可以用于创建动态数据可视化图表，增强用户交互体验。
- **Three.js**：可以用于在网页中创建三维场景，提供更丰富的视觉效果。

## 五、结论

本实验成功实现了一个四象限展示网页，具备动态内容加载、响应式设计和用户友好的错误提示等功能。通过使用现代前端技术，提升了用户体验和页面的灵活性。未来可以考虑引入更多的库和功能，以进一步增强网页的交互性和可视化效果。
