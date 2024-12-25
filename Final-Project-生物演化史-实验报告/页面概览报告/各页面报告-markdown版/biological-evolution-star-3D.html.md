# 实验报告：生物演化史-星空图-3D

## 一、引言

本实验旨在通过3D可视化技术展示生物演化史，利用Three.js库构建一个交互式的星空图，帮助用户更直观地理解生物演化的过程和各个地质年代的关系。该项目结合了数据可视化和交互设计，具有较高的教育意义和科学价值。

## 二、创新功能点

1. **交互式节点聚焦**：用户可以通过点击节点来聚焦特定的生物演化事件，系统会自动调整视角，提供详细信息。
2. **动态星空背景**：通过Three.js实现动态星空效果，增强视觉体验。
3. **参数调节功能**：用户可以实时调整节点大小、线条长度等参数，观察不同设置下的演化图变化。
4. **全屏模式**：支持全屏显示，提升用户体验。
5. **信息展示**：点击节点后，展示相关的时间、描述和图片信息，增强信息的可读性和趣味性。

## 三、算法描述

### 3.1 数据结构

使用树形结构存储生物演化数据，每个节点包含以下信息：
- `name`: 节点名称（如地质年代）
- `time`: 事件时间
- `description`: 事件描述
- `src`: 相关图片链接
- `children`: 子节点数组

### 3.2 3D可视化算法

1. **节点创建**：根据数据生成3D球体，使用不同颜色表示不同地质年代。
2. **连接线绘制**：使用贝塞尔曲线连接父节点和子节点，增强视觉效果。
3. **动态效果**：实现节点的呼吸效果和星空的动态变化，提升用户体验。

## 四、代码实现

### 4.1 主要库引用

本项目主要使用了以下库：
- **Three.js**：用于3D图形渲染。
- **D3.js**：用于数据处理和可视化（在本项目中未直接使用，但可用于数据的预处理）。

### 4.2 代码实现细节

以下是关键代码片段的实现细节：

#### 4.2.1 初始化场景

```javascript
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(120, 270, 500);
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 3000;
    controls.minDistance = 50;
    
    createStarField();
    networkGroup = createNetworkVisualization();
    
    animate();
}
```

- **场景创建**：初始化Three.js场景，设置背景颜色。
- **相机设置**：使用透视相机，设置视角和位置。
- **渲染器**：创建WebGL渲染器并添加到DOM中。
- **控制器**：使用OrbitControls实现相机的平滑控制。

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
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
}
```

- **星空创建**：生成15000个随机位置的星星，使用点材质进行渲染。
- **动态效果**：通过调整星星的大小和透明度实现动态效果。

#### 4.2.3 创建网络可视化

```javascript
function createNetworkVisualization() {
    const networkGroup = new THREE.Group();
    
    function createNodes(data, position = new THREE.Vector3(), level = 0, angle = 0, parentColor) {
        const nodeGeometry = new THREE.SphereGeometry(networkParameters.nodeSize, 32, 32);
        const color = level === 1 ? categoryColors[data.name] : parentColor;
        
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        networkGroup.add(node);
        
        if (data.children) {
            data.children.forEach((child, index) => {
                const childPosition = new THREE.Vector3(position.x + Math.cos(angle) * radius, position.y + level * networkParameters.levelHeight, position.z + Math.sin(angle) * radius);
                createNodes(child, childPosition, level + 1, angle + (Math.PI / 6), color);
            });
        }
    }
    
    createNodes(treeData);
    scene.add(networkGroup);
    return networkGroup;
}
```

- **节点创建**：根据数据生成3D球体，使用不同颜色表示不同地质年代。
- **递归创建子节点**：通过递归函数创建树形结构的节点。

### 4.3 事件处理

```javascript
window.addEventListener('click', onMouseClick);

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(networkGroup.children.filter(child => child instanceof THREE.Mesh));

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        showEventDetails(selectedObject.userData);
    } else {
        hideEventDetails();
    }
}
```

- **鼠标点击事件**：通过射线检测获取用户点击的节点，并显示相关信息。

## 五、结论

本实验通过Three.js实现了一个生物演化史的3D可视化项目，具有良好的交互性和可视化效果。通过动态星空背景和节点聚焦功能，用户能够更直观地理解生物演化的过程。未来可以进一步扩展功能，如增加更多的交互方式和数据展示形式，以提升用户体验和教育效果。
