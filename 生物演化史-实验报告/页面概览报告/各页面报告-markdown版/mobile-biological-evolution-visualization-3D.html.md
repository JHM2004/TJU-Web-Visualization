# 实验报告：生物演化史可视化大屏-3D

## 引言

本实验旨在开发一个生物演化史的可视化大屏，利用3D图形技术展示生物演化的过程和节点。该项目结合了D3.js和Three.js两个强大的JavaScript库，前者用于数据处理和力导向布局，后者用于3D图形渲染。通过该可视化工具，用户可以直观地了解生物演化的历史和各个节点之间的关系。

## 创新功能点

1. **3D可视化**：通过Three.js实现生物演化节点的3D展示，用户可以通过鼠标拖拽和滚轮缩放来查看不同角度的演化图。
2. **动态交互**：用户可以点击节点查看详细信息，节点的颜色和大小根据其重要性和属性动态变化。
3. **多种布局方式**：支持力导向布局、树形布局、球形布局和圆形布局，用户可以根据需求选择不同的布局方式。
4. **背景和天空盒选择**：用户可以选择不同的背景颜色和天空盒，增强视觉效果。
5. **实时数据更新**：通过D3.js的力导向算法，节点和连接的布局会根据用户的交互实时更新。

## 算法描述

### 数据处理

使用D3.js处理生物演化的数据，构建节点和连接的关系。每个节点包含以下属性：
- `id`: 节点的唯一标识符
- `name`: 节点名称
- `time`: 节点对应的地质年代
- `description`: 节点的描述
- `src`: 节点的图像源
- `size`: 节点的大小
- `color`: 节点的颜色

### 力导向布局

使用D3.js的力导向算法来处理节点之间的关系。通过设置不同的力（如引力、斥力和中心力），实现节点的动态布局。具体实现如下：

```javascript
simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", createCenter3D(0, 0, 0).strength(0.1))
    .force("collision", d3.forceCollide().radius(20))
    .force("3d", create3DForce(1))
    .force("axis", createAxisForce())
    .on("tick", updatePositions);
```

### 3D渲染

使用Three.js进行3D渲染，创建场景、相机和渲染器。节点通过球体表示，连接通过线段表示。具体实现如下：

```javascript
function createGraphObjects() {
    nodes.forEach(node => {
        const geometry = new THREE.SphereGeometry(node.size);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(node.color || 0x00ff00) // 默认颜色
        });
        const sphere = new THREE.Mesh(geometry, material);
        node.object = sphere;
        scene.add(sphere);
    });

    links.forEach(link => {
        link.object = createEdge('line'); // 默认使用直线
        scene.add(link.object);
    });
}
```

## 代码实现细节

### 主要库函数引用

1. **D3.js**：
   - `d3.forceSimulation()`: 创建一个力导向模拟。
   - `d3.forceLink()`: 创建连接力。
   - `d3.forceManyBody()`: 创建斥力。
   - `d3.forceCollide()`: 创建碰撞力。

2. **Three.js**：
   - `THREE.Scene()`: 创建一个场景。
   - `THREE.PerspectiveCamera()`: 创建一个透视相机。
   - `THREE.WebGLRenderer()`: 创建一个WebGL渲染器。
   - `THREE.SphereGeometry()`: 创建球体几何体。
   - `THREE.MeshBasicMaterial()`: 创建基本材质。

### 代码实现示例

以下是部分关键代码的实现示例：

```javascript
function init() {
    // 初始化Three.js场景
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // 添加节点和连接
    processData(treeData);
    createGraphObjects();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
```

## 结论

本实验成功实现了一个生物演化史的3D可视化大屏，利用D3.js和Three.js的强大功能，提供了动态交互和多种布局方式。该项目不仅展示了生物演化的历史，还为用户提供了丰富的交互体验。未来可以进一步扩展功能，如增加更多的节点属性、支持更多的交互方式等，以提升用户体验和数据展示的丰富性。
