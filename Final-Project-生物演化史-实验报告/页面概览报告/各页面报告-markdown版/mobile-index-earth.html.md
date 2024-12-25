# 实验报告：地球古地理可视化项目

## 一、项目概述

本项目旨在通过Web技术实现一个交互式的地球古地理可视化工具，用户可以通过该工具查看不同历史时期的地球状态。项目使用了Three.js库进行3D图形渲染，并结合HTML和JavaScript实现用户交互功能。该工具不仅展示了地球的历史演变，还提供了丰富的用户交互体验。

## 二、创新功能点

1. **多时间点切换**：用户可以通过下拉菜单选择不同的历史时期，系统会自动加载对应的地球纹理。
2. **自动旋转与手动控制**：用户可以选择让地球模型自动旋转，或通过鼠标和键盘手动控制视角。
3. **云层显示/隐藏功能**：用户可以通过按钮控制云层的显示与隐藏，增强视觉效果。
4. **全屏显示功能**：用户可以选择全屏模式，提供更沉浸的体验。
5. **触摸控制**：针对移动端用户，提供触摸控制功能，支持单指旋转和双指缩放。

## 三、代码实现细节

### 1. HTML结构

HTML部分主要负责页面的基本结构和用户界面元素的布局。以下是关键部分的代码示例：

```html
<div id="info">
    地球古地理-大陆漂移
    <div style="color: red; font-size: 14px; margin-top: 5px;">若移动端加载缓慢/失败,请转到pc端进行操作</div>
</div>
<button id="rotateButton">停止自动旋转</button>
<button id="cloudsButton">显示云层</button>
<select id="timeSelect" class="timeSelect">
    <option value="0">现代地球(第四纪-全新世)</option>
    <option value="20">2千万年前(渐新世结束-新近纪开始-中新世开始)</option>
    <!-- 省略其他选项 -->
</select>
```

### 2. JavaScript实现

JavaScript部分是项目的核心，负责3D场景的创建、用户交互的处理以及纹理的加载。

#### 2.1 初始化场景

使用Three.js库创建3D场景、相机和渲染器：

```javascript
let scene, camera, renderer;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}
```

#### 2.2 纹理加载

通过`THREE.TextureLoader`加载不同历史时期的地球纹理：

```javascript
const textureLoader = new THREE.TextureLoader();
const textures = {};
const timePoints = [0, 20, 35, 50, 66, 90, 105, 120, 170, 200, 220, 240, 260, 280, 300, 340, 370, 400, 430, 450, 470, 540, 600, 750];

timePoints.forEach(time => {
    const fileName = time === 0 ? '0.jpg' : `${time}.jpg`;
    textureLoader.load(`./static-other/World_Texture/${fileName}`, function (texture) {
        textures[time] = texture;
        // 处理纹理加载完成后的逻辑
    });
});
```

#### 2.3 用户交互

通过事件监听实现用户交互功能，例如切换时间点、控制旋转等：

```javascript
document.getElementById('timeSelect').addEventListener('change', function () {
    const time = parseInt(this.value);
    if (earth && textures[time]) {
        earth.material.map = textures[time];
        earth.material.needsUpdate = true;
    }
});

const rotateButton = document.getElementById('rotateButton');
rotateButton.addEventListener('click', function () {
    controls.autoRotate = !controls.autoRotate;
    this.textContent = controls.autoRotate ? '停止自动旋转' : '开始自动旋转';
});
```

### 3. 使用的库函数

- **Three.js**：用于3D图形渲染，提供了丰富的几何体、材质和光源等功能。
- **D3.js**：虽然本项目主要使用Three.js，但D3.js可以用于数据可视化和动态数据绑定，未来可以考虑将其集成以增强数据展示能力。

## 四、算法描述

本项目的核心算法主要包括：

1. **纹理加载算法**：使用异步加载的方式，确保在所有纹理加载完成后再进行地球模型的渲染。
2. **时间切换算法**：通过索引管理当前时间点，用户选择时间后，更新地球的纹理。
3. **用户输入处理算法**：通过键盘和鼠标事件监听，实时响应用户的输入，更新视角或切换时间。

## 五、总结

本项目通过结合Three.js和HTML/JavaScript实现了一个交互式的地球古地理可视化工具，用户可以方便地查看不同历史时期的地球状态。项目的创新功能和良好的用户体验使其在教育和科研领域具有广泛的应用前景。未来可以考虑进一步优化性能，增加更多的交互功能和数据展示能力。
