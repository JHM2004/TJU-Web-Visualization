# 实验报告：旋转卡片展示网页

## 一、实验目的

本实验旨在创建一个动态的旋转卡片展示网页，用户可以通过点击卡片进入不同的页面。该网页结合了现代网页设计的美学和交互性，旨在提升用户体验。

## 二、创新功能点

1. **动态卡片效果**：通过鼠标移动实现3D旋转效果，增强了用户的交互体验。
2. **响应式设计**：使用CSS Grid布局，使得卡片在不同屏幕尺寸下自适应排列。
3. **渐变背景**：使用CSS渐变背景，提升视觉吸引力。
4. **卡片翻转效果**：卡片的正面和背面展示不同内容，增加了信息的展示方式。

## 三、代码实现细节

### 1. HTML结构

HTML部分定义了网页的基本结构，包括头部信息、样式链接和主体内容。主要的内容是一个包含多个卡片的容器。

```html
<div class="container">
    <!-- 卡片内容通过JavaScript动态生成 -->
</div>
```

### 2. CSS样式

CSS部分负责网页的视觉效果，包括布局、颜色、阴影等。以下是关键样式的实现：

```css
body {
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 40px;
    padding: 40px;
    max-width: 1800px;
    margin: 0 auto;
}

.card-wrapper {
    position: relative;
    width: 400px;
    height: 400px;
    transition: transform 0.3s ease;
}

.card {
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    cursor: pointer;
    transition: transform 0.3s ease;
}
```

### 3. JavaScript动态生成卡片

JavaScript部分负责动态生成卡片内容。通过`document.write`方法，将每个卡片的HTML结构插入到页面中。

```javascript
const images = [
    'biological-classification-sunburst-2D',
    'biological-evolution-force-2D',
    // 其他图片...
];

images.forEach(img => {
    document.write(`
        <div class="card-wrapper">
            <a href="./${img}.html">
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
```

### 4. 鼠标移动3D效果

通过监听鼠标移动事件，实现卡片的3D旋转效果。根据鼠标相对于卡片的位置计算旋转角度。

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

在实现3D效果时，使用了简单的几何计算。通过获取鼠标在卡片上的位置，计算出相对于卡片中心的偏移量，从而得出旋转角度。该算法的复杂度为O(n)，其中n为卡片的数量。

## 五、库函数引用

在本实验中，虽然没有直接使用D3.js和Three.js库，但可以考虑在未来的扩展中引入这些库以增强功能：

- **D3.js**：用于数据可视化，可以将卡片内容与数据绑定，动态更新卡片信息。
- **Three.js**：用于更复杂的3D效果和动画，可以实现更高级的3D场景和交互。

## 六、总结

本实验成功实现了一个动态的旋转卡片展示网页，结合了现代网页设计的多种技术。通过CSS和JavaScript的结合，创造了良好的用户体验。未来可以考虑引入更多的库和功能，以进一步提升网页的交互性和视觉效果。
