# 实验报告：生物演化史-Tree-3D 可视化项目

## 一、项目概述

本项目旨在通过三维可视化技术展示生物演化的历史，利用 `Three.js` 库构建一个交互式的三维场景，用户可以通过鼠标和键盘进行操作，探索不同地质年代的生物演化信息。该项目不仅展示了生物演化的时间线，还通过动态效果增强了用户体验。

## 二、创新功能点

1. **交互式节点聚焦**：用户可以通过鼠标点击节点，聚焦到特定的生物演化事件，并显示详细信息。
2. **动态视角控制**：用户可以使用键盘的 W/S/A/D 键进行上下左右移动，使用鼠标滚轮进行缩放，增强了场景的可操作性。
3. **高亮显示功能**：当用户将鼠标悬停在节点上时，节点会高亮显示，提供更好的视觉反馈。
4. **全屏模式**：用户可以选择全屏模式，提升视觉体验。
5. **撤销与重置功能**：用户可以撤销最近的操作或重置到默认参数，方便用户进行实验和调整。

## 三、算法描述

### 3.1 数据结构

项目使用树形结构来表示生物演化的各个节点，每个节点包含以下信息：
- `name`：节点名称（如地质年代）。
- `time`：节点对应的时间信息。
- `description`：节点的详细描述。
- `children`：子节点数组，表示该节点下的演化分支。

### 3.2 主要算法

1. **节点创建算法**：根据树形数据结构递归创建节点，使用 `THREE.SphereGeometry` 创建节点的三维模型，并根据层级和角度计算节点的位置。
2. **曲线连接算法**：使用贝塞尔曲线连接父节点和子节点，增强视觉效果。通过 `THREE.QuadraticBezierCurve3` 创建曲线，并使用 `THREE.Line` 绘制连接线。
3. **动态效果算法**：实现节点的呼吸效果和星空背景的动态变化，提升场景的生动性。

## 四、代码实现

### 4.1 主要库引用

- **Three.js**：用于创建和渲染三维场景。
- **OrbitControls**：用于实现相机的旋转和缩放控制。
- **TWEEN.js**：用于实现平滑的动画效果。

### 4.2 代码实现细节

以下是项目中关键代码片段的实现细节：

#### 4.2.1 初始化场景

```javascript
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(-2170, 847, 792);
    camera.lookAt(-47, -62, -43);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 6000;
    controls.minDistance = 10;
    controls.screenSpacePanning = true;
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.zoomToCursor = true;
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);
    
    createStarField();
    networkGroup = createNetworkVisualization();
    
    initializeSliders();
    animate();
}
```

#### 4.2.2 创建节点和连接线

```javascript
function createNodes(data, position = new THREE.Vector3(0, -500, 0), level = 0, angle = 0, parentColor, baseAngle = null) {
    const nodeGeometry = new THREE.SphereGeometry(10, 32, 32);
    let color = categoryColors[data.name] || new THREE.Color(0xffffff);
    
    const nodeMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(position);
    node.userData = data;
    
    networkGroup.add(node);
    
    if (data.children) {
        const childCount = data.children.length;
        const radius = networkParameters.radius - level * 6;
        
        let angleStep = (Math.PI * 2) / childCount;
        let startAngle = 0;

        data.children.forEach((child, index) => {
            const childAngle = startAngle + angleStep * index;
            const childPosition = new THREE.Vector3(
                position.x + Math.cos(childAngle) * radius,
                position.y + (level * networkParameters.levelHeight),
                position.z + Math.sin(childAngle) * radius
            );
            
            const connection = createCurvedLine(position, childPosition, color);
            networkGroup.add(connection);
            
            createNodes(child, childPosition, level + 1, childAngle, color);
        });
    }
}
```

#### 4.2.3 高亮显示功能

```javascript
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(networkGroup.children.filter(child => child instanceof THREE.Mesh));
    
    if (intersects.length > 0) {
        const clickedNode = intersects[0].object;
        // 创建高亮环
        const highlightRing = new THREE.Mesh(new THREE.RingGeometry(15, 20, 32), new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0.8 }));
        highlightRing.position.copy(clickedNode.position);
        highlightRing.lookAt(camera.position);
        scene.add(highlightRing);
        
        // 显示节点信息
        showEventDetails(clickedNode.userData);
    }
}
```

### 4.3 交互功能实现

用户可以通过键盘和鼠标进行交互，以下是相关代码实现：

```javascript
window.addEventListener('keydown', (event) => {
    switch(event.key.toLowerCase()) {
        case 'w': keyState.w = true; break;
        case 's': keyState.s = true; break;
        case 'a': keyState.a = true; break;
        case 'd': keyState.d = true; break;
    }
});

window.addEventListener('keyup', (event) => {
    switch(event.key.toLowerCase()) {
        case 'w': keyState.w = false; break;
        case 's': keyState.s = false; break;
        case 'a': keyState.a = false; break;
        case 'd': keyState.d = false; break;
    }
});
```

## 五、总结

本项目通过 `Three.js` 和相关库实现了一个生物演化史的三维可视化展示，用户可以通过交互操作深入了解生物演化的历史。项目的创新功能点如动态视角控制、高亮显示和撤销重置功能，极大地提升了用户体验。未来可以考虑进一步优化性能和增加更多的交互功能，以便更好地服务于用户的学习和探索需求。
