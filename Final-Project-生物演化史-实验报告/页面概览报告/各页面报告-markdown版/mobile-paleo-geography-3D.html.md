# 实验报告：地球古地理三维可视化系统

## 一、引言

本实验旨在开发一个基于Web的三维地球古地理可视化系统，利用Three.js库实现地球的三维模型展示，并通过D3.js库实现数据的动态交互。该系统不仅展示了地球在不同历史时期的地理变化，还提供了用户友好的交互功能，使用户能够直观地了解地球的演变过程。

## 二、创新功能点

1. **动态时间选择**：用户可以通过下拉菜单选择不同的地质时期，系统会自动更新地球的纹理和相关信息。
2. **自动旋转与手动控制**：用户可以选择自动旋转地球，或通过鼠标拖拽手动控制视角，增强了交互性。
3. **云层显示**：用户可以选择显示或隐藏地球表面的云层，增加了视觉效果的丰富性。
4. **加载提示**：在地球模型加载过程中，系统会显示加载提示，提升用户体验。
5. **全屏显示功能**：用户可以选择全屏模式，提供更沉浸式的体验。

## 三、算法描述

### 3.1 数据结构

- **时间点数组**：定义了不同地质时期的时间点，便于在用户选择时进行切换。
- **纹理映射对象**：使用对象存储不同时间点对应的地球纹理，便于快速访问和更新。

### 3.2 事件处理

- **键盘事件**：通过监听键盘的方向键，用户可以快速切换地质时期。
- **鼠标事件**：支持鼠标拖拽和双击操作，增强用户的交互体验。

## 四、代码实现

### 4.1 HTML结构

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>地球古地理</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <style>
        /* 样式定义 */
    </style>
</head>
<body>
    <script>
        // JavaScript代码
    </script>
</body>
</html>
```

### 4.2 CSS样式

```css
body {
    margin: 0;
}

canvas {
    display: block;
}

#info {
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    font-family: Arial;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 5px;
}

/* 其他样式定义 */
```

### 4.3 JavaScript实现

#### 4.3.1 初始化Three.js场景

```javascript
let scene, camera, renderer, earth, controls;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // 创建地球
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const textures = {};
    
    // 加载纹理
    loadTextures(textureLoader, textures);
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    camera.add(directionalLight);
    scene.add(camera);
    
    camera.position.z = 15;
    
    // 添加控制器
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    
    animate();
}
```

#### 4.3.2 纹理加载

```javascript
function loadTextures(loader, textures) {
    const timePoints = [0, 20, 35, 50, 66, 90, 105, 120, 170, 200, 220, 240, 260, 280, 300, 340, 370, 400, 430, 450, 470, 540, 600, 750];
    timePoints.forEach(time => {
        const fileName = time === 0 ? '0.jpg' : `${time}.jpg`;
        loader.load(`./static-other/World_Texture/${fileName}`, function (texture) {
            textures[time] = texture;
            if (time === 0) {
                const material = new THREE.MeshPhongMaterial({ map: texture });
                earth = new THREE.Mesh(geometry, material);
                scene.add(earth);
            }
        });
    });
}
```

#### 4.3.3 事件监听

```javascript
document.getElementById('timeSelect').addEventListener('change', function () {
    const time = parseInt(this.value);
    if (earth && textures[time]) {
        earth.material.map = textures[time];
        earth.material.needsUpdate = true;
    }
});
```

### 4.4 D3.js的使用

在本项目中，D3.js主要用于处理数据的动态交互和可视化。通过D3.js，我们可以轻松地绑定数据到DOM元素，并实现数据驱动的更新。

```javascript
d3.select("#timeSelect")
    .selectAll("option")
    .data(timePoints)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => `${d}年`);
```

## 五、总结

本实验成功实现了一个基于Three.js和D3.js的地球古地理三维可视化系统。通过动态交互和丰富的视觉效果，用户能够直观地了解地球的演变过程。未来的工作可以集中在进一步优化性能和增加更多的交互功能，以提升用户体验。
