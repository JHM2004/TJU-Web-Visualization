# 实验报告：生物演化史-Tree-3D 可视化项目

## 一、项目概述

本项目旨在通过三维可视化技术展示生物演化史，利用 `Three.js` 和 `D3.js` 库实现动态交互式的生物演化树。用户可以通过鼠标操作进行视角旋转、缩放和节点聚焦，直观地了解不同地质年代的生物演化过程。

## 二、创新功能点

1. **动态交互**：用户可以通过键盘和鼠标进行自由移动和视角调整，增强了用户体验。
2. **节点高亮显示**：点击节点后，系统会高亮显示该节点，并展示相关信息，便于用户获取详细数据。
3. **历史记录功能**：用户的操作可以撤销和重置，方便用户进行多次尝试和调整。
4. **自适应布局**：根据不同的参数动态调整节点的布局和连接线的样式，使得可视化效果更加美观和易于理解。

## 三、算法描述

### 3.1 数据结构

项目使用树形结构来表示生物演化的各个节点。每个节点包含以下信息：
- `name`：节点名称（如地质年代）。
- `children`：子节点数组，表示该节点下的生物种类。
- `time`：时间信息，表示该节点对应的地质年代。
- `description`：节点的描述信息。

### 3.2 主要算法

1. **节点创建算法**：根据树形数据结构递归创建节点，并根据层级和类别设置不同的颜色和位置。
2. **曲线连接算法**：使用贝塞尔曲线连接父子节点，增强可视化效果。
3. **交互处理算法**：通过射线投射技术检测用户点击的节点，并更新视图和信息展示。

## 四、代码实现

### 4.1 主要库引用

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js"></script>
```

### 4.2 关键代码实现

#### 4.2.1 初始化场景

```javascript
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(-2170, 847, 792);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 6000;
    controls.minDistance = 10;
    controls.target = new THREE.Vector3(0, 0, 0);
    
    createStarField();
    networkGroup = createNetworkVisualization();
    animate();
}
```

#### 4.2.2 创建网络可视化

```javascript
function createNetworkVisualization() {
    const networkGroup = new THREE.Group();
    
    // 定义基准角度和高度偏移
    const categoryBaseAngles = { '冥古宙': 0, '太古宙': Math.PI/3, ... };
    const categoryHeightOffset = { '冥古宙': networkParameters.heightStep * 2, ... };

    function createNodes(data, position = new THREE.Vector3(0, -500, 0), level = 0, angle = 0) {
        const nodeGeometry = new THREE.SphereGeometry(10, 32, 32);
        const color = categoryColors[data.name] || new THREE.Color(0xffffff);
        
        const nodeMaterial = new THREE.MeshPhongMaterial({ color: color });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        networkGroup.add(node);
        
        if (data.children) {
            const childCount = data.children.length;
            const radius = networkParameters.radius - level * 6;
            const angleStep = (Math.PI * 2) / childCount;
            const startAngle = angle - (angleStep * (childCount - 1) / 2);

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

#### 4.2.3 交互处理

```javascript
function onMouseClick(event) {
    mouse.x = (event.clientX / (window.innerWidth / 2)) * 2 - 1;
    mouse.y = -(event.clientY / (window.innerHeight / 2)) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(networkGroup.children.filter(child => child instanceof THREE.Mesh));

    if (intersects.length > 0) {
        const clickedNode = intersects[0].object;
        // 高亮显示节点
        highlightNode(clickedNode);
        // 显示节点信息
        showEventDetails(clickedNode.userData);
    }
}
```

### 4.3 重要功能实现细节

- **节点高亮**：通过创建环形几何体并将其放置在节点位置，使用 `MeshBasicMaterial` 实现高亮效果。
- **撤销与重置功能**：使用数组保存历史状态，允许用户撤销最近的操作或重置到默认参数。
- **动态参数调整**：通过滑块控制节点的高度差、线长度和垂直间距，实时更新可视化效果。

## 五、总结

本项目通过 `Three.js` 和 `D3.js` 实现了一个生物演化史的三维可视化工具，提供了丰富的交互功能和动态效果。通过对数据结构的合理设计和算法的有效实现，用户能够直观地理解生物演化的过程和各个地质年代的特征。未来可以考虑增加更多的交互功能和数据展示方式，以进一步提升用户体验。
