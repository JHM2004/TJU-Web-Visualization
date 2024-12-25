# 实验报告：旋转卡片展示页面

## 一、引言

本实验旨在创建一个动态的旋转卡片展示页面，用户可以通过点击卡片选择最多四张卡片，并在选择完成后跳转到新的页面以查看详细信息。该页面采用现代网页设计技术，结合了CSS动画、JavaScript交互和响应式布局，提供了良好的用户体验。

## 二、创新功能点

1. **动态卡片选择**：用户可以通过点击卡片进行选择，最多选择四张卡片。选中的卡片会有明显的视觉反馈，提升用户的交互体验。
2. **3D效果**：通过鼠标移动，卡片会呈现出3D旋转效果，增加了页面的趣味性和互动性。
3. **流动边框效果**：选中卡片时，卡片周围会出现动态流动的边框，增强了视觉吸引力。
4. **响应式设计**：页面布局采用CSS Grid，使其在不同屏幕尺寸下都能良好展示。

## 三、代码实现细节

### 1. HTML结构

页面的基本结构由HTML构成，包含了头部信息、样式定义和主要内容区域。以下是关键部分的代码：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>旋转卡片展示</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <style>
        /* CSS样式定义 */
    </style>
</head>
<body>
    <div class="container">
        <!-- 卡片内容将通过JavaScript动态生成 -->
    </div>
    <script>
        // JavaScript代码
    </script>
</body>
</html>
```

### 2. CSS样式

CSS部分定义了页面的整体布局和卡片的样式。使用了CSS Grid布局来实现响应式设计，并通过CSS动画实现卡片的动态效果。

```css
body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
    perspective: 1000px;
}

.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 40px;
    padding: 40px;
    max-width: 1800px;
    margin: 0 auto;
}

.card {
    transition: transform 0.3s ease;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.card.selected {
    border: 4px solid #4CAF50;
    background-color: rgba(76, 175, 80, 0.1);
}
```

### 3. JavaScript交互

JavaScript部分负责动态生成卡片、处理用户的点击事件以及实现3D效果。以下是关键代码片段：

```javascript
const images = [
    'biological-classification-sunburst-2D',
    'biological-evolution-force-2D',
    // 其他图片
];

let selectedCards = [];

images.forEach(img => {
    document.write(`
        <div class="card-wrapper" data-img="${img}">
            <a href="javascript:void(0);" class="select-card">
                <div class="card">
                    <div class="card-face card-front">
                        <img src="./select-cards/${img}.png" alt="${img}">
                    </div>
                    <div class="card-face card-back">
                        <span>点击查看详情</span>
                    </div>
                </div>
            </a>
        </div>
    `);
});

document.querySelectorAll('.select-card').forEach(card => {
    card.addEventListener('click', () => {
        // 处理卡片选择逻辑
    });
});
```

### 4. 3D效果实现

通过监听鼠标移动事件，计算鼠标相对于卡片的位置，从而实现3D旋转效果。以下是实现代码：

```javascript
document.querySelectorAll('.card-wrapper').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = -(x - centerX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});
```

## 四、算法描述

在本实验中，主要的算法逻辑包括：

1. **卡片选择算法**：通过维护一个数组`selectedCards`来存储用户选择的卡片。当用户点击卡片时，检查该卡片是否已被选择。如果已选择，则从数组中移除；如果未选择且当前选择数量少于4，则将其添加到数组中。
2. **页面跳转算法**：当用户选择的卡片数量达到4时，构建新的页面URL并进行跳转。

## 五、库函数引用

本实验未使用外部库如D3.js或Three.js，但可以考虑在未来的扩展中引入这些库以实现更复杂的可视化效果。例如，D3.js可以用于数据可视化，而Three.js可以用于更高级的3D效果。

## 六、结论

本实验成功实现了一个动态的旋转卡片展示页面，用户可以通过简单的交互选择卡片并查看详细信息。通过使用现代的网页技术，提升了用户体验和页面的视觉效果。未来可以考虑引入更多的功能和效果，以进一步增强页面的互动性和美观性。
