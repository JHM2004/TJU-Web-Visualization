# 实验报告：生物演化史-Tree-3D 可视化项目

## 1. 引言

本实验报告旨在详细介绍“生物演化史-Tree-3D”项目的设计与实现。该项目利用Web技术和3D可视化库（如Three.js）展示生物演化的历史，提供用户交互功能，增强学习体验。报告将涵盖创新功能点、代码实现细节、算法描述以及所使用的库函数。

## 2. 创新功能点

### 2.1 交互式可视化

用户可以通过鼠标点击节点来聚焦特定生物种类，系统会平滑移动相机到该节点位置，并展示相关信息。这种交互方式使得用户能够深入了解生物演化的细节。

### 2.2 动态参数调整

用户可以通过滑块动态调整可视化参数（如高度差、线长度和垂直间距），实时更新3D图形。这种功能使得用户能够根据个人需求自定义可视化效果。

### 2.3 全屏模式

提供全屏切换功能，用户可以在更大的视图中体验生物演化的3D效果，增强沉浸感。

### 2.4 详细信息展示

点击节点后，系统会在侧边展示该节点的详细信息，包括时间、描述和相关图片，帮助用户更好地理解生物演化的背景。

## 3. 代码实现细节

### 3.1 HTML结构

项目的HTML结构简单明了，主要包括头部信息、样式、脚本引用和主体内容。以下是关键部分的代码示例：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>生物演化史-Tree-3D</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <style>
        /* 样式定义 */
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="./biological-evolution-data.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js"></script>
</head>
<body>
    <div id="info">生物演化史-Tree-3D</div>
    <div id="details"></div>
    <div id="controls-panel">
        <!-- 控制面板 -->
    </div>
    <script>
        // JavaScript代码
    </script>
</body>
</html>
```

### 3.2 JavaScript实现

#### 3.2.1 初始化Three.js场景

在`init`函数中，创建了Three.js的场景、相机和渲染器，并设置了光源和控制器。

```javascript
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 6000;
    controls.minDistance = 10;
    controls.target = new THREE.Vector3(0, 0, 0);
    
    animate();
}
```

#### 3.2.2 创建网络可视化

`createNetworkVisualization`函数负责根据生物演化数据生成3D网络图。该函数使用了Three.js的几何体和材质来创建节点和连接线。

```javascript
function createNetworkVisualization() {
    const networkGroup = new THREE.Group();
    // 创建节点和连接线的逻辑
    createNodes(treeData, new THREE.Vector3(0, -700, 0));
    scene.add(networkGroup);
    return networkGroup;
}
```

#### 3.2.3 节点创建与连接

`createNodes`函数递归地创建节点，并使用`createCurvedLine`函数生成连接线。节点的颜色和位置根据其在生物演化树中的层级和类别进行设置。

```javascript
function createNodes(data, position = new THREE.Vector3(0, -500, 0), level = 0, angle = 0, parentColor, baseAngle = null) {
    const nodeGeometry = new THREE.SphereGeometry(10, 32, 32);
    const color = categoryColors[data.name] || new THREE.Color(0xffffff);
    const nodeMaterial = new THREE.MeshPhongMaterial({ color: color });
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(position);
    networkGroup.add(node);
    
    if (data.children) {
        data.children.forEach((child, index) => {
            const childPosition = calculateChildPosition(position, index, data.children.length);
            const connection = createCurvedLine(position, childPosition, color);
            networkGroup.add(connection);
            createNodes(child, childPosition, level + 1, angle, color);
        });
    }
}
```

### 3.3 交互功能实现

#### 3.3.1 鼠标点击事件

通过`onMouseClick`函数处理鼠标点击事件，使用Raycaster检测用户点击的节点，并展示详细信息。

```javascript
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(networkGroup.children);
    
    if (intersects.length > 0) {
        const clickedNode = intersects[0].object;
        showEventDetails(clickedNode.userData);
    }
}
```

#### 3.3.2 滑块控制

通过滑块调整参数，实时更新可视化效果。每当滑块值变化时，都会更新网络的可视化。

```javascript
function initializeSliders() {
    const sliders = ['heightStep', 'radius', 'levelHeight'];
    sliders.forEach(param => {
        const slider = document.getElementById(param);
        slider.addEventListener('input', function() {
            networkParameters[param] = parseFloat(this.value);
            updateVisualization();
        });
    });
}
```

## 4. 算法描述

### 4.1 数据结构

项目使用树形结构表示生物演化数据，每个节点包含名称、时间、描述和子节点信息。数据结构示例如下：

```javascript
const treeData = {
    name: "生物演化",
    children: [
        {
            name: "冥古宙",
            time: "45.4亿年前",
            description: "地球形成初期的生物。",
            children: []
        },
        // 其他节点...
    ]
};
```

### 4.2 渲染算法

渲染算法主要包括以下步骤：

1. 初始化Three.js场景。
2. 根据数据结构递归创建节点和连接线。
3. 处理用户交互，更新视图。

## 5. 库函数引用

### 5.1 Three.js

Three.js是一个强大的3D图形库，提供了丰富的几何体、材质和光源选项。项目中使用了以下Three.js功能：

- `THREE.Scene`：创建3D场景。
- `THREE.PerspectiveCamera`：设置透视相机。
- `THREE.WebGLRenderer`：渲染3D图形。
- `THREE.Mesh`：创建3D网格对象。
- `THREE.Raycaster`：用于检测鼠标与3D对象的交互。

### 5.2 Tween.js

Tween.js用于实现平滑动画效果，特别是在相机移动时。通过设置目标位置和动画持续时间，创建流畅的过渡效果。

```javascript
new TWEEN.Tween(camera.position)
    .to(newCameraPosition, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();
```

## 6. 结论

本项目通过结合Three.js和Tween.js，实现了一个生动的生物演化可视化工具。用户可以通过交互式界面探索生物演化的历史，动态调整可视化参数，增强了学习的趣味性和有效性。未来可以考虑增加更多的生物数据和交互功能，以进一步提升用户体验。
