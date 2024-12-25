# 实验报告：地球古地理三维可视化

## 一、实验背景

随着科学技术的不断发展，地球科学的研究逐渐向可视化方向发展。通过三维可视化技术，用户可以更直观地理解地球的演变过程，尤其是古地理的变化。本实验旨在利用Three.js库实现一个地球古地理的三维可视化模型，展示不同地质时期的地球形态及其演变。

## 二、创新功能点

1. **动态时间选择**：用户可以通过下拉菜单选择不同的地质时期，模型会自动更新显示相应时期的地球纹理。
2. **自动旋转与手动控制**：用户可以选择自动旋转地球模型，或通过鼠标拖拽手动控制视角。
3. **云层显示**：用户可以选择显示或隐藏地球表面的云层，增强视觉效果。
4. **信息提示**：在不同时间点，用户可以查看该时期的地质信息，帮助理解地球的演变。

## 三、代码实现细节

### 1. 主要库函数引用

本实验主要使用了以下库：

- **Three.js**：用于创建和渲染3D图形。
- **OrbitControls.js**：用于实现相机的控制，使用户能够通过鼠标拖拽来旋转、缩放和移动视角。

### 2. 代码实现

以下是代码的主要实现部分，包含了初始化、纹理加载、时间切换等功能。

```javascript
let scene, camera, renderer, earth, controls, clouds;

// 初始化场景
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
    const timePoints = [0, 20, 35, 50, 66, 90, 105, 120, 170, 200, 220, 240, 260, 280, 300, 340, 370, 400, 430, 450, 470, 540, 600, 750];
    let currentTimeIndex = 0;

    // 加载纹理
    timePoints.forEach(time => {
        const fileName = time === 0 ? '0.jpg' : `${time}.jpg`;
        textureLoader.load(`./static-other/World_Texture/${fileName}`, function (texture) {
            textures[time] = texture;
            if (time === 0) {
                const material = new THREE.MeshPhongMaterial({ map: texture });
                earth = new THREE.Mesh(geometry, material);
                scene.add(earth);
            }
        });
    });

    // 添加控制器
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;

    camera.position.z = 15;
    animate();
}

// 切换时间索引
function switchToTimeIndex(index) {
    if (index >= 0 && index < timePoints.length) {
        currentTimeIndex = index;
        const time = timePoints[index];
        if (earth && textures[time]) {
            earth.material.map = textures[time];
            earth.material.needsUpdate = true;
        }
    }
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
```

### 3. 关键算法描述

- **纹理加载**：使用`THREE.TextureLoader`异步加载不同时间点的地球纹理。通过`forEach`遍历时间点数组，加载对应的纹理文件，并在加载完成后更新地球模型的材质。
- **时间切换功能**：通过`switchToTimeIndex`函数实现时间的切换，更新地球的纹理和相关信息。
- **相机控制**：使用`OrbitControls`实现相机的平滑控制，允许用户通过鼠标操作来旋转和缩放视角。

### 4. 代码实现细节

- **地球模型创建**：使用`THREE.SphereGeometry`创建一个球体作为地球模型，并使用`THREE.MeshPhongMaterial`为其添加纹理。
- **光源设置**：添加环境光和方向光，以增强模型的立体感和真实感。
- **事件监听**：通过`addEventListener`监听用户的操作，如选择时间、鼠标点击等，动态更新模型状态。

## 四、总结

本实验通过Three.js实现了一个动态的地球古地理三维可视化模型，用户可以通过简单的交互操作，直观地了解地球的演变过程。该项目不仅展示了现代Web技术在科学教育中的应用潜力，也为未来的地理科学研究提供了新的思路和工具。通过不断优化和扩展功能，可以进一步提升用户体验和教育效果。
