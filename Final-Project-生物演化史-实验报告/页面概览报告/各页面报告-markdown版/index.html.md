# 实验报告：生物演化史导航页

## 一、引言

本实验旨在开发一个生物演化史的导航页面，提供用户友好的界面以便于访问不同设备上的内容。该页面通过检测用户的设备类型（移动端或PC端）来实现自动跳转，并提供手动选择的功能。页面设计简洁明了，旨在提升用户体验。

## 二、创新功能点

1. **设备自动检测与跳转**：通过JavaScript检测用户的设备类型，自动跳转到相应的页面（移动端或PC端），提高了用户的访问效率。
2. **手动选择功能**：在自动跳转的同时，提供手动选择按钮，确保用户在特殊情况下仍能访问所需内容。
3. **响应式设计**：页面设计考虑了不同设备的屏幕尺寸，确保在各种设备上都能良好显示。

## 三、代码实现细节

### 1. HTML结构

页面的基本结构使用HTML5标准，包含头部和主体部分。头部定义了页面的元数据、样式和脚本，主体部分则包含了标题和手动选择的按钮。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>生物演化史导航页</title>
    ...
</head>
<body>
    <h1 class="title">生物演化史 - EvoViz</h1>
    <div id="manual-selection" style="display: none;">
        ...
    </div>
</body>
</html>
```

### 2. JavaScript实现

#### 设备检测与跳转

使用`navigator.userAgent`来检测用户的设备类型。根据检测结果，页面会自动跳转到相应的内容页面。

```javascript
window.onload = function() {
    // 显示手动选择按钮
    document.getElementById('manual-selection').style.display = 'block';

    // 检测设备类型
    let target = '';
    if (/Mobi|Android/i.test(navigator.userAgent) && !/Windows NT/i.test(navigator.userAgent)) {
        target = '<span class="highlight">移动端</span>';
        // 缩小标题字体
        document.querySelector('.title').style.fontSize = '30px';
        // 立即跳转
        window.location.href = './mobile-index.html';
    } else {
        target = '<span class="highlight">PC端</span>';
        // 立即跳转
        window.location.href = './pc-index.html';
    }
}
```

### 3. CSS样式

页面的样式使用CSS进行定义，确保页面在不同设备上的美观性和可读性。

```css
.title {
    color: #FF0000;
    font-size: 48px;
    font-family: "Microsoft YaHei";
    text-align: center;
    margin-top: 20px;
    padding: 20px;
}
#manual-selection button {
    width: 300px;
    height: 80px;
    margin: 10px auto;
    padding: 0;
    font-size: 24px;
    display: block;
}
```

## 四、算法描述

本实验的核心算法是设备类型检测算法。该算法通过正则表达式匹配用户代理字符串，判断用户的设备类型。具体步骤如下：

1. 获取用户的`userAgent`字符串。
2. 使用正则表达式检查是否包含“Mobile”或“Android”。
3. 如果匹配成功，认为用户使用的是移动设备，进行相应的跳转；否则，跳转到PC端页面。

## 五、库函数引用

在本实验中，虽然没有直接使用D3.js和Three.js库，但可以考虑在后续版本中引入这些库以增强页面的交互性和可视化效果。

- **D3.js**：用于数据驱动的文档操作，可以在生物演化史的可视化展示中使用。
- **Three.js**：用于3D图形的渲染，可以在未来的版本中实现生物演化的三维模型展示。

## 六、总结

本实验成功实现了一个生物演化史的导航页面，具备设备自动检测、手动选择和响应式设计等功能。通过JavaScript和CSS的结合，页面在不同设备上均能良好展示。未来可以考虑引入更多的可视化库，以进一步提升用户体验和页面的交互性。
