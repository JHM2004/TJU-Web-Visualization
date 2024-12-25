# 实验报告：生物演化史导航页

## 一、引言

本实验报告旨在详细介绍生物演化史导航页的设计与实现。该页面旨在为用户提供一个友好的界面，以便于在移动端和PC端之间进行切换。通过自动检测设备类型，用户可以在10秒内自动跳转到适合其设备的页面。此外，页面还提供了手动选择按钮，以便用户在需要时进行手动切换。

## 二、创新功能点

1. **设备自动检测**：通过分析用户的User-Agent信息，自动识别用户的设备类型（移动端或PC端），并根据设备类型调整页面内容和样式。
2. **倒计时跳转**：在页面加载后，用户会看到一个倒计时提示，告知他们将在10秒后自动跳转到相应的页面。这种设计增强了用户体验，使用户在等待时不会感到无聊。
3. **手动选择功能**：提供了手动选择按钮，允许用户在自动跳转前进行选择，增加了灵活性。

## 三、代码实现细节

### 1. HTML结构

页面的基本结构使用HTML5标准，包含头部和主体部分。头部定义了页面的元数据、样式和脚本，主体部分则包含了标题、提示信息和手动选择按钮。

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
    ...
</body>
</html>
```

### 2. JavaScript实现

#### 2.1 设备检测与跳转逻辑

在页面加载时，JavaScript会执行以下操作：

- 检测设备类型
- 显示手动选择按钮
- 启动倒计时并在倒计时结束后自动跳转

```javascript
window.onload = function() {
    // 显示手动选择按钮
    document.getElementById('manual-selection').style.display = 'block';

    // 检测设备类型
    let target = '';
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        target = '<span class="highlight">移动端</span>';
        document.querySelector('.title').style.fontSize = '30px';
    } else {
        target = '<span class="highlight">PC端</span>';
    }

    // 倒计时
    let countdown = 10;
    const countdownElement = document.getElementById('countdown');
    countdownElement.innerHTML = `根据自动检测，将在 ${countdown} 秒后自动跳转到${target}页面...`;
    const interval = setInterval(() => {
        countdown--;
        countdownElement.innerHTML = `根据自动检测，将在 ${countdown} 秒后自动跳转到${target}页面...`;
        if (countdown === 0) {
            clearInterval(interval);
            // 自动跳转
            if (target.includes('移动端')) {
                window.location.href = './mobile-index.html';
            } else {
                window.location.href = './pc-index.html';
            }
        }
    }, 1000);
}
```

### 3. CSS样式

页面的样式使用CSS进行定义，确保页面在不同设备上都能良好显示。主要样式包括标题、按钮和倒计时文本的样式设置。

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

本项目的核心算法是设备类型检测和倒计时逻辑。设备类型检测使用正则表达式匹配User-Agent字符串，以判断用户的设备类型。倒计时逻辑则使用`setInterval`函数，每秒更新一次倒计时，并在倒计时结束时执行页面跳转。

## 五、库函数引用

在本项目中，虽然没有直接使用D3.js和Three.js库，但可以考虑在未来的扩展中引入这些库来增强页面的交互性和可视化效果。例如，D3.js可以用于数据可视化，而Three.js可以用于3D图形的展示。

### 5.1 D3.js示例

```javascript
// 使用D3.js创建简单的柱状图
d3.select("body").append("svg")
    .attr("width", 500)
    .attr("height", 300)
    .selectAll("rect")
    .data([4, 8, 15, 16, 23, 42])
    .enter().append("rect")
    .attr("width", (d) => d * 10)
    .attr("height", 20)
    .attr("y", (d, i) => i * 25);
```

### 5.2 Three.js示例

```javascript
// 使用Three.js创建简单的3D立方体
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
```

## 六、结论

本实验成功实现了生物演化史导航页的设计与开发，具备设备自动检测、倒计时跳转和手动选择功能。通过合理的代码结构和清晰的逻辑，确保了页面的用户体验。未来可以考虑引入更多的交互性和可视化效果，以进一步提升用户体验。
