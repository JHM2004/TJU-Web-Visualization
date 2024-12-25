# 实验报告：生物演化可视化3D系统

## 一、引言

随着科学技术的不断发展，数据可视化在生物学研究中扮演着越来越重要的角色。本实验旨在开发一个基于Web的生物演化可视化3D系统，利用Three.js和D3.js库实现生物演化树的动态展示。该系统不仅能够展示生物的演化关系，还提供了多种交互功能，增强了用户体验。

## 二、创新功能点

1. **3D可视化**：通过Three.js实现生物演化树的三维展示，用户可以从不同角度观察演化关系。
2. **动态交互**：用户可以通过鼠标拖拽、滚轮缩放等方式与可视化图形进行交互，增强了可视化的灵活性。
3. **节点信息展示**：点击节点后，系统会显示该节点的详细信息，包括名称、时期和描述等。
4. **多种布局选择**：用户可以选择不同的布局方式（如力导向、树形、球形等），以适应不同的可视化需求。
5. **背景和边类型自定义**：用户可以自定义背景颜色、透明度以及边的类型（直线、曲线、箭头），提升了可视化的个性化。

## 三、算法描述

### 3.1 数据处理

系统首先通过`processData`函数处理输入数据，构建节点和连接关系。每个节点包含以下属性：
- `id`：节点唯一标识
- `name`：节点名称
- `time`：节点对应的时间
- `description`：节点描述
- `src`：节点相关图像的URL
- `size`：节点大小
- `color`：节点颜色

### 3.2 力导向布局

使用D3.js的力导向算法，节点之间的关系通过力的作用进行动态调整。主要力的类型包括：
- **链接力**：控制节点之间的距离。
- **斥力**：防止节点重叠。
- **中心力**：将节点吸引到中心。
- **碰撞力**：防止节点之间的重叠。

### 3.3 3D渲染

使用Three.js进行3D渲染，创建场景、相机和渲染器。节点通过`THREE.SphereGeometry`创建，连接通过`THREE.Line`或`THREE.Curve`实现。

## 四、代码实现

### 4.1 主要库引用

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.0.0/d3.min.js"></script>
```

### 4.2 数据处理函数

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

    // 继承父节点颜色
    if (parent && parent.color && parent.color !== '#FFFFFF') {
        node.color = parent.color;
    } else {
        // 根据节点名称确定颜色
        node.color = determineColor(data.name);
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

function determineColor(name) {
    // 根据节点名称确定颜色
    if (name.includes('冥古宙')) return '#FF0000';
    if (name.includes('太古宙')) return '#FFA500';
    if (name.includes('元古宙')) return '#FFFF00';
    if (name.includes('显生宙')) return '#00FF00';
    if (name.includes('中生代')) return '#00FFFF';
    if (name.includes('新生代')) return '#0000FF';
    if (name.includes('第四纪')) return '#800080';
    return '#FFFFFF'; // 默认颜色
}
```

### 4.3 力导向布局实现

```javascript
simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", createCenter3D(0, 0, 0).strength(0.1))
    .force("collision", d3.forceCollide().radius(20))
    .on("tick", updatePositions);
```

### 4.4 3D渲染实现

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

### 4.5 更新节点位置

```javascript
function updatePositions() {
    nodes.forEach(node => {
        if (node.object) {
            node.object.position.x += (node.x - node.object.position.x) * 0.1;
            node.object.position.y += (node.y - node.object.position.y) * 0.1;
            node.object.position.z += (node.z - node.object.position.z) * 0.1;
        }
    });

    links.forEach(link => {
        const source = link.source;
        const target = link.target;
        // 更新连接线位置
        updateLinkPosition(link, source, target);
    });
}
```

## 五、总结

本实验成功实现了一个基于Web的生物演化可视化3D系统，利用Three.js和D3.js库实现了生物演化树的动态展示。系统的创新功能点和交互设计提升了用户体验，为生物学研究提供了有效的可视化工具。未来可以进一步扩展功能，如增加更多的交互方式和数据分析功能，以满足更广泛的应用需求。
