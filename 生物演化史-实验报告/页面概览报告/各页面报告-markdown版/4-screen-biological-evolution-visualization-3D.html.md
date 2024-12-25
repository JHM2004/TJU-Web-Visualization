# 实验报告：3D生物演化可视化系统

## 引言

本实验旨在开发一个基于Web的3D生物演化可视化系统，利用Three.js和D3.js库实现生物演化数据的动态展示。该系统不仅能够展示生物演化的时间线，还能通过交互式界面让用户深入了解每个节点的详细信息。本文将详细描述系统的创新功能、算法实现、代码细节以及所使用的库函数。

## 创新功能点

1. **动态3D可视化**：利用Three.js实现生物演化数据的三维展示，用户可以通过鼠标拖拽和滚轮缩放来调整视角。
2. **交互式节点信息展示**：用户点击节点后，系统会显示该节点的详细信息，包括名称、时期和描述。
3. **多种布局选择**：用户可以选择不同的布局方式（如力导向布局、树形布局、球形布局等），以便更好地理解数据结构。
4. **背景和边的自定义**：用户可以自定义背景颜色、透明度以及边的类型（直线、曲线、箭头），增强可视化效果。
5. **全景和立方体天空盒**：支持多种背景天空盒的选择，提升视觉体验。

## 算法描述

### 数据处理

系统首先通过`processData`函数处理输入的生物演化数据。该函数递归地遍历数据结构，构建节点和连接关系，并为每个节点分配颜色。节点的颜色根据其所属的地质年代进行分类，具体如下：

- 冥古宙：红色
- 太古宙：橙色
- 元古宙：黄色
- 显生宙：绿色
- 中生代：青色
- 新生代：蓝色
- 第四纪：紫色

### 物理模拟

使用D3.js的力导向布局算法，系统通过`d3.forceSimulation`创建一个物理模拟环境。该模拟包括以下几种力：

- **链接力**：通过`d3.forceLink`实现节点之间的连接。
- **斥力**：通过`d3.forceManyBody`实现节点之间的排斥。
- **中心力**：通过自定义的`createCenter3D`函数实现节点向中心的吸引力。
- **碰撞力**：通过`d3.forceCollide`避免节点重叠。

### 3D图形创建

在Three.js中，节点通过`THREE.SphereGeometry`创建为球体，连接通过`THREE.Line`或`THREE.Curve`实现。每个节点和连接都被添加到场景中，以便进行渲染。

## 代码实现

以下是关键代码片段的实现细节：

### 数据处理

```javascript
function processData(data, parent = null) {
    const node = {
        id: data.name,
        name: data.name,
        time: data.time || "",
        description: data.description || "",
        src: data.src,
        size: 5
    };

    // 继承父节点的颜色
    if (parent && parent.color && parent.color !== '#FFFFFF') {
        node.color = parent.color;
    } else {
        // 根据节点名称确定颜色
        let currentNode = data;
        let color = '#FFFFFF';
        while (currentNode) {
            if (currentNode.name.includes('冥古宙')) {
                color = '#FF0000';  // 红色
                break;
            }
            // 其他颜色判断...
            currentNode = currentNode.parent;
        }
        node.color = color;
    }

    nodes.push(node);
    if (parent) {
        links.push({
            source: parent.id,
            target: node.id
        });
    }

    // 递归处理子节点
    if (data.children) {
        data.children.forEach(child => {
            child.parent = data;  // 设置父节点引用
            processData(child, node);
        });
    }
}
```

### 物理模拟

```javascript
simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", createCenter3D(0, 0, 0).strength(0.1))
    .force("collision", d3.forceCollide().radius(20))
    .on("tick", updatePositions);
```

### 3D图形创建

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

### 交互功能

```javascript
renderer.domElement.addEventListener('click', (event) => {
    event.preventDefault();
    // 计算鼠标坐标
    mouse.x = (event.clientX / (window.innerWidth / 2)) * 2 - 1;
    mouse.y = -(event.clientY / (window.innerHeight / 2)) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodes.map(node => node.object).filter(obj => obj));

    if (intersects.length > 0) {
        const nodeData = nodes.find(n => n.object === intersects[0].object);
        if (nodeData) {
            selectedNode = nodeData;
            updateNodeInfo(nodeData);
            // 更新选择圈
            // ...
        }
    }
});
```

## 库函数引用

### D3.js

- `d3.forceSimulation`: 创建一个物理模拟环境。
- `d3.forceLink`: 创建节点之间的链接力。
- `d3.forceManyBody`: 创建节点之间的斥力。
- `d3.forceCollide`: 创建节点之间的碰撞力。

### Three.js

- `THREE.Scene`: 创建3D场景。
- `THREE.PerspectiveCamera`: 创建透视相机。
- `THREE.WebGLRenderer`: 创建WebGL渲染器。
- `THREE.SphereGeometry`: 创建球体几何体。
- `THREE.Line`: 创建线段。

## 结论

本实验成功实现了一个基于Web的3D生物演化可视化系统，利用Three.js和D3.js库实现了动态的生物演化数据展示。通过交互式界面，用户可以深入了解生物演化的各个节点及其关系。未来的工作可以集中在优化性能和增加更多的交互功能，以提升用户体验。
