# 实验报告：旋转卡片展示网页

## 一、引言

本实验旨在创建一个具有交互性和视觉吸引力的旋转卡片展示网页。该网页使用HTML、CSS和JavaScript构建，旨在展示生物分类相关的图像。用户可以通过点击卡片进入不同的页面，增强了用户体验。本文将详细介绍该网页的创新功能、代码实现细节、算法描述以及所使用的库函数。

## 二、创新功能点

1. **旋转卡片效果**：通过CSS和JavaScript实现卡片的3D旋转效果，提升了视觉体验。
2. **移动端适配**：使用媒体查询确保在不同屏幕尺寸下的良好展示，增强了移动端用户体验。
3. **消息弹窗**：当用户点击特定卡片时，弹出提示信息，告知用户该页面仅在PC端可用。
4. **禁用滑动翻页**：在移动端禁用左右滑动翻页行为，避免用户误操作。

## 三、代码实现细节

### 1. HTML结构

HTML部分定义了网页的基本结构，包括头部信息、样式和主体内容。主要的内容是一个包含多个卡片的容器。

```html
<div class="container">
    <!-- 卡片内容通过JavaScript动态生成 -->
</div>
```

### 2. CSS样式

CSS部分负责网页的布局和样式设计。使用了Flexbox和Grid布局来实现响应式设计。

```css
body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
    perspective: 1000px; /* 3D效果 */
}

.card-wrapper {
    position: relative;
    width: 160px;
    height: 160px;
    transition: transform 0.3s ease; /* 动画效果 */
}
```

### 3. JavaScript逻辑

JavaScript部分负责动态生成卡片和实现交互效果。

#### 3.1 动态生成卡片

使用`document.write`方法动态生成卡片，第一张卡片有特殊处理，其他卡片则链接到不同的页面。

```javascript
const images = [
    'biological-classification-sunburst-2D',
    'biological-evolution-force-2D',
    // 其他图像
];

images.forEach((img, index) => {
    if (index === 0) {
        // 第一张卡片的特殊处理
        document.write(`
            <div class="card-wrapper">
                <div class="card" onclick="showPCOnlyMessage()">
                    <div class="card-face card-front">
                        <img src="./select-cards/${img}.png" alt="${img}">
                    </div>
                    <div class="card-face card-back">
                        <span>点击查看详情</span>
                    </div>
                </div>
            </div>
        `);
    } else {
        // 其他卡片保持不变
        document.write(`
            <div class="card-wrapper">
                <a href="./mobile-${img}.html">
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
    }
});
```

#### 3.2 3D效果实现

通过监听鼠标移动事件，计算鼠标相对于卡片中心的坐标，动态调整卡片的旋转角度。

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

### 4. 消息弹窗实现

当用户点击特定卡片时，创建一个消息弹窗，提示用户该页面仅在PC端可用。

```javascript
function showPCOnlyMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-popup';
    messageDiv.innerHTML = '在pc端才能访问<br>生物分类-太阳爆发图-2D页面<br>请尝试其他页面~';
    document.body.appendChild(messageDiv);

    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
        document.body.removeChild(messageDiv);
    }, 2500);
}
```

## 四、算法描述

本实验的核心算法主要集中在卡片的动态生成和3D效果的实现。通过监听鼠标事件，实时计算卡片的旋转角度，提供了良好的用户交互体验。

## 五、库函数引用

在本实验中，虽然没有直接使用D3.js和Three.js库，但可以考虑在未来的扩展中引入这些库来增强数据可视化和3D效果。例如，D3.js可以用于处理复杂的数据集，而Three.js可以用于创建更复杂的3D场景。

## 六、结论

本实验成功实现了一个具有交互性和视觉吸引力的旋转卡片展示网页。通过使用现代Web技术，提升了用户体验。未来可以考虑引入更多的功能和库，以进一步增强网页的功能性和美观性。
