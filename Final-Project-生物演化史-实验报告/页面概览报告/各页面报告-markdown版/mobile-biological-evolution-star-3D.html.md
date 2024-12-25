# 实验报告：生物演化史-星空图-3D

## 一、引言

本实验旨在通过3D可视化技术展示生物演化史，利用Three.js库实现动态交互效果，增强用户体验。该项目结合了生物学、计算机图形学和用户交互设计，展示了生物演化的时间线和不同地质年代的特征。

## 二、创新功能点

1. **动态交互**：用户可以通过鼠标点击和移动与3D模型进行交互，查看不同节点的详细信息。
2. **自适应布局**：根据不同的生物分类，自动调整节点的高度和位置，形成清晰的层次结构。
3. **可视化效果**：使用Three.js的粒子系统创建星空背景，增强视觉效果。
4. **信息展示**：点击节点后，动态显示该节点的详细信息，包括时间、描述和相关图片。
5. **全屏模式**：支持全屏切换，提升用户的沉浸感。

## 三、算法描述

### 3.1 数据结构

使用树形结构表示生物演化的各个节点，每个节点包含以下信息：
- `name`：节点名称（如地质年代）
- `time`：时间信息
- `description`：节点描述
- `src`：相关图片链接
- `children`：子节点数组

### 3.2 主要算法

1. **节点创建**：根据树形数据结构递归创建节点，使用Three.js的`SphereGeometry`生成球体表示节点。
2. **连接线绘制**：使用贝塞尔曲线连接父节点和子节点，增强视觉效果。
3. **动态更新**：通过调整参数（如节点大小、线长度等）实时更新可视化效果。

## 四、代码实现

### 4.1 主要库引用

本项目主要使用以下库：
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

- **场景设置**：创建一个黑色背景的场景，并设置相机位置。
- **渲染器**：使用WebGL渲染器进行3D图形渲染。
- **控制器**：使用`OrbitControls`实现相机的平滑移动和缩放。

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

- **粒子系统**：使用`BufferGeometry`和`PointsMaterial`创建星空效果，生成15000个随机位置的星星。

#### 4.2.3 创建网络可视化

```javascript
function createNetworkVisualization() {
    const networkGroup = new THREE.Group();
    
    function createNodes(data, position = new THREE.Vector3(), level = 0, angle = 0, parentColor, baseAngle = null) {
        const nodeGeometry = new THREE.SphereGeometry(networkParameters.nodeSize, 32, 32);
        let color = (level === 1) ? categoryColors[data.name] : parentColor || new THREE.Color(0xffffff);
        
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
            data.children.forEach((child, index) => {
                const childPosition = calculateChildPosition(position, level, index);
                const connection = createCurvedLine(position, childPosition, color);
                networkGroup.add(connection);
                createNodes(child, childPosition, level + 1, childAngle, color);
            });
        }
    }
    
    createNodes(treeData);
    scene.add(networkGroup);
    return networkGroup;
}
```

- **节点创建**：根据传入的数据递归创建节点，并为每个节点设置颜色和材质。
- **连接线**：使用`createCurvedLine`函数绘制父子节点之间的连接线。

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

- **鼠标点击事件**：通过`Raycaster`检测用户点击的节点，并显示相应的详细信息。

## 五、总结

本实验通过Three.js实现了生物演化史的3D可视化，展示了不同地质年代的特征和演化过程。通过动态交互和视觉效果，提升了用户的体验。未来可以进一步优化数据处理和可视化效果，增加更多的交互功能，以便更好地展示生物演化的复杂性和美丽。
