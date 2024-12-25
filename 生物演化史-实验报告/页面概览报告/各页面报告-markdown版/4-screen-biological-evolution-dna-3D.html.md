# 实验报告：生物演化史-DNA双螺旋-3D可视化

## 一、引言

本实验旨在通过3D可视化技术展示生物演化史中的DNA双螺旋结构。利用Three.js库实现3D图形渲染，并结合D3.js库处理数据，提供交互式的用户体验。该项目不仅展示了生物演化的过程，还通过时间旅行模式让用户能够直观地理解生物演化的时间线。

## 二、创新功能点

1. **时间旅行模式**：用户可以通过控制按钮在生物演化的时间线上前进或倒退，直观地观察不同时间节点的生物演化事件。
2. **动态交互**：通过鼠标悬停事件，用户可以查看每个生物演化事件的详细信息，包括名称、时间和描述。
3. **全屏显示功能**：用户可以选择全屏模式，以更好地体验3D可视化效果。
4. **播放速度控制**：用户可以调整播放速度，以适应不同的观察需求。

## 三、算法描述

### 3.1 数据处理

使用D3.js库处理生物演化数据，数据结构为树形结构，包含每个事件的名称、时间、描述和子事件。通过递归函数将数据扁平化，便于在3D场景中展示。

### 3.2 3D场景构建

使用Three.js库构建3D场景，包括相机、光源、物体等。通过创建DNA双螺旋结构和星空背景，增强视觉效果。

### 3.3 动画与交互

使用TWEEN.js库实现平滑动画效果，结合键盘事件和鼠标事件实现用户交互。用户可以通过按键控制相机的旋转，或通过鼠标悬停查看事件详情。

## 四、代码实现

### 4.1 主要库引用

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.9.5/Tween.min.js"></script>
```

### 4.2 3D场景初始化

```javascript
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(100, 0, 100);
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 500;
    controls.minDistance = 50;
    
    createStarField();
    createDNASpiral();
    createTimelineEvents();
    
    animate();
}
```

### 4.3 创建DNA双螺旋

```javascript
function createDNASpiral() {
    const curve1Points = [];
    const curve2Points = [];
    const radius = 20;
    const height = 500;
    const turns = 25;
    
    for(let i = 0; i <= 360 * turns; i++) {
        const angle = (i * Math.PI) / 180;
        const y = (i / (360 * turns)) * height - height/2;
        
        curve1Points.push(new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle)));
        curve2Points.push(new THREE.Vector3(radius * Math.cos(angle + Math.PI), y, radius * Math.sin(angle + Math.PI)));
    }
    
    const curve1Geometry = new THREE.BufferGeometry().setFromPoints(curve1Points);
    const curve2Geometry = new THREE.BufferGeometry().setFromPoints(curve2Points);
    
    const material = new THREE.LineBasicMaterial({ color: 0x00ff88, opacity: 0.8, transparent: true });
    
    const dnaStrand1 = new THREE.Line(curve1Geometry, material);
    const dnaStrand2 = new THREE.Line(curve2Geometry, material);
    
    scene.add(dnaStrand1);
    scene.add(dnaStrand2);
}
```

### 4.4 创建时间线事件

```javascript
function createTimelineEvents() {
    function processEvents(events, startY = -250) {
        const sortedEvents = flattenEvents(events);
        const totalHeight = 500;
        const heightPerEvent = totalHeight / sortedEvents.length;
        
        sortedEvents.forEach((event, index) => {
            const geometry = new THREE.SphereGeometry(1.2, 32, 32);
            const material = new THREE.MeshPhongMaterial({ color: getEventColor(event.timeValue), emissive: getEventColor(event.timeValue), emissiveIntensity: 0.5 });
            const sphere = new THREE.Mesh(geometry, material);
            const y = startY + (index * heightPerEvent);
            sphere.position.set(20 * Math.cos(index), y, 20 * Math.sin(index));
            sphere.userData = { name: event.name, time: event.time, description: event.description };
            timelineObjects.add(sphere);
        });
    }
}
```

## 五、总结

本实验通过Three.js和D3.js库实现了生物演化史的3D可视化，展示了DNA双螺旋结构及其演化过程。通过创新的时间旅行模式和动态交互功能，用户能够更直观地理解生物演化的复杂性。未来可以进一步优化数据处理和渲染性能，以支持更大规模的数据集和更复杂的可视化效果。
