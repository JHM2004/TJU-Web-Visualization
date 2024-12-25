# 实验报告：生物演化史-星空图-3D

## 一、引言

本实验旨在通过3D可视化技术展示生物演化史，利用Three.js库实现动态交互效果，帮助用户更直观地理解生物演化的过程。该项目结合了数据可视化和交互设计，提供了多种功能，如节点缩放、连接线显示/隐藏、全屏模式等，增强了用户体验。

## 二、创新功能点

1. **动态交互**：用户可以通过鼠标滚轮缩放视图，左键拖动视角，点击节点聚焦，提升了交互性。
2. **节点信息展示**：点击节点后，展示该节点的详细信息，包括时间、描述和相关图片，增强了信息的可获取性。
3. **连接线控制**：用户可以选择隐藏或显示节点之间的连接线，便于用户根据需要调整视图。
4. **星空背景**：通过动态星空背景，增加了视觉美感，使得整个可视化效果更加生动。
5. **呼吸效果**：节点具有呼吸效果，提升了视觉吸引力，使得用户在观察时更具沉浸感。

## 三、算法描述

### 3.1 数据结构

本项目使用树形结构来表示生物演化的各个节点。每个节点包含以下属性：
- `name`：节点名称
- `time`：节点时间
- `description`：节点描述
- `children`：子节点数组

### 3.2 主要算法

1. **节点创建**：根据树形数据结构递归创建节点，使用Three.js的`SphereGeometry`生成节点的3D模型。
2. **连接线创建**：使用贝塞尔曲线连接节点，增强视觉效果。通过`QuadraticBezierCurve3`实现曲线连接。
3. **动态更新**：通过事件监听器实现动态更新节点信息和视图，确保用户交互的实时反馈。

## 四、代码实现

### 4.1 HTML结构

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>生物演化史-星空图-3D</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <style>
        /* 样式定义 */
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="biological-evolution-data.js"></script>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

### 4.2 JavaScript实现

#### 4.2.1 初始化场景

```javascript
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(120, 270, 500);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    createStarField();
    networkGroup = createNetworkVisualization();
    
    animate();
}
```

#### 4.2.2 创建星空背景

```javascript
function createStarField() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.3,
        transparent: true,
        opacity: 1.0,
        sizeAttenuation: true
    });

    const starsVertices = [];
    for(let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
}
```

#### 4.2.3 创建网络可视化

```javascript
function createNetworkVisualization() {
    const networkGroup = new THREE.Group();
    
    function createNodes(data, position = new THREE.Vector3(), level = 0, angle = 0) {
        const nodeGeometry = new THREE.SphereGeometry(networkParameters.nodeSize, 32, 32);
        const color = categoryColors[data.name] || new THREE.Color(0xffffff);
        
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
            const angleStep = (Math.PI * 2) / childCount;
            const startAngle = 0;

            data.children.forEach((child, index) => {
                const childAngle = startAngle + angleStep * index;
                const childPosition = new THREE.Vector3(
                    position.x + Math.cos(childAngle) * radius,
                    position.y + (level * networkParameters.levelHeight),
                    position.z + Math.sin(childAngle) * radius
                );
                
                createNodes(child, childPosition, level + 1, childAngle);
            });
        }
    }
    
    createNodes(treeData);
    scene.add(networkGroup);
    return networkGroup;
}
```

### 4.3 事件处理

#### 4.3.1 鼠标点击事件

```javascript
window.addEventListener('click', onMouseClick);

function onMouseClick(event) {
    mouse.x = (event.clientX / (window.innerWidth * 0.5)) * 2 - 1;
    mouse.y = -(event.clientY / (window.innerHeight * 0.5)) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(networkGroup.children.filter(child => child instanceof THREE.Mesh));

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        const nodeData = selectedObject.userData;
        showEventDetails(nodeData);
    } else {
        hideEventDetails();
    }
}
```

## 五、库函数引用

### 5.1 Three.js

- **`THREE.Scene`**：创建3D场景。
- **`THREE.PerspectiveCamera`**：设置透视相机。
- **`THREE.WebGLRenderer`**：渲染3D图形。
- **`THREE.SphereGeometry`**：生成球体几何体，用于节点表示。
- **`THREE.LineBasicMaterial`**：创建线条材质，用于连接线。

### 5.2 D3.js

虽然本项目主要使用Three.js进行3D可视化，但D3.js可以用于处理和转换数据，特别是在需要将数据转换为树形结构时。

## 六、结论

本实验通过Three.js实现了生物演化史的3D可视化，提供了丰富的交互功能，增强了用户体验。未来可以考虑进一步优化性能，增加更多的交互功能，如节点搜索、时间轴控制等，以提升可视化效果和用户体验。
