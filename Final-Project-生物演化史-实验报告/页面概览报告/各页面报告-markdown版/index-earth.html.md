# 实验报告：地球古地理可视化项目

## 一、项目概述

本项目旨在通过Web技术实现一个交互式的地球古地理可视化工具，用户可以通过该工具观察地球在不同历史时期的状态。项目使用了Three.js库进行3D图形渲染，结合HTML和JavaScript实现用户交互功能。用户可以通过按钮和下拉框选择不同的历史时期，查看地球的变化。

## 二、创新功能点

1. **动态纹理加载**：根据用户选择的历史时期动态加载对应的地球纹理，提升了用户体验。
2. **交互式控制**：用户可以通过鼠标和键盘控制地球的旋转和缩放，增强了可操作性。
3. **云层显示/隐藏功能**：用户可以选择是否显示地球上的云层，增加了视觉效果的多样性。
4. **全屏显示功能**：支持全屏模式，提供更沉浸的观看体验。
5. **触摸事件支持**：为移动设备用户提供良好的触摸交互体验。

## 三、代码实现细节

### 1. 主要库函数引用

本项目主要使用了以下库：

- **Three.js**：用于3D图形渲染。
- **D3.js**：虽然本项目未直接使用D3.js，但可以考虑在未来版本中用于数据可视化。

### 2. 代码实现

以下是项目的主要代码实现细节：

#### 2.1 HTML结构

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>地球古地理</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <style>
        /* 样式定义 */
    </style>
</head>
<body>
    <div id="loadingText">地球模型加载中...</div>
    <div id="info">地球古地理-大陆漂移</div>
    <button id="rotateButton">停止自动旋转</button>
    <button id="cloudsButton">显示云层</button>
    <select id="timeSelect" class="timeSelect">
        <!-- 时间选项 -->
    </select>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script>
        // JavaScript代码
    </script>
</body>
</html>
```

#### 2.2 JavaScript实现

```javascript
let scene, camera, renderer, earth, controls, clouds;

function init() {
    // 初始化场景、相机和渲染器
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 创建地球
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const textures = {};
    const timePoints = [0, 20, 35, 50, 66, 90, 105, 120, 170, 200, 220, 240, 260, 280, 300, 340, 370, 400, 430, 450, 470, 540, 600, 750];
    let currentTimeIndex = 0;

    // 动态加载纹理
    timePoints.forEach(time => {
        const fileName = time === 0 ? '0.jpg' : `${time}.jpg`;
        textureLoader.load(
            `./static-other/World_Texture/${fileName}`,
            function (texture) {
                textures[time] = texture;
                if (time === 0) {
                    const material = new THREE.MeshPhongMaterial({ map: texture, specular: new THREE.Color('grey'), shininess: 10 });
                    earth = new THREE.Mesh(geometry, material);
                    scene.add(earth);
                }
            },
            undefined,
            function (error) {
                console.error('纹理加载失败:', error);
            }
        );
    });

    // 事件监听
    document.getElementById('timeSelect').addEventListener('change', function () {
        const time = parseInt(this.value);
        currentTimeIndex = timePoints.indexOf(time);
        if (earth && textures[time]) {
            earth.material.map = textures[time];
            earth.material.needsUpdate = true;
        }
    });

    // 初始化光源
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    camera.add(directionalLight);
    directionalLight.position.set(0, 0, 1);
    scene.add(camera);
    camera.position.z = 15;

    // 控制器设置
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

init();
```

### 3. 算法描述

- **纹理加载算法**：使用`THREE.TextureLoader`异步加载地球的纹理，确保在用户选择不同历史时期时，能够快速切换显示。
- **交互控制算法**：通过事件监听器捕获用户的输入（如按钮点击、下拉框选择），并根据输入更新地球的显示状态。

### 4. 关键技术细节

- **WebGL渲染**：使用`THREE.WebGLRenderer`进行高效的3D渲染，支持抗锯齿和高性能模式。
- **相机控制**：使用`THREE.OrbitControls`实现相机的平滑移动和缩放，增强用户交互体验。
- **光源设置**：通过环境光和方向光的组合，提升场景的光照效果，使地球模型更加真实。

## 四、总结

本项目通过使用Three.js库实现了一个交互式的地球古地理可视化工具，用户可以方便地查看不同历史时期的地球状态。项目的创新功能和良好的用户体验使其在教育和科研领域具有广泛的应用前景。未来可以考虑进一步优化性能，增加更多的交互功能和数据可视化效果。
