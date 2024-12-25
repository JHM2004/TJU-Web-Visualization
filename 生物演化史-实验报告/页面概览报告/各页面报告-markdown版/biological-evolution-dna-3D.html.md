# 实验报告：生物演化史-DNA双螺旋-3D可视化

## 一、引言

本实验旨在通过3D可视化技术展示生物演化史中的DNA双螺旋结构。利用Three.js库实现3D图形渲染，并结合D3.js库处理数据，创建一个交互式的时间旅行模式，用户可以通过界面控制播放速度、前进和后退，直观地了解生物演化的过程。

## 二、创新功能点

1. **时间旅行模式**：用户可以通过按钮控制时间的前进和后退，动态展示生物演化的不同阶段。
2. **交互式信息展示**：当用户将鼠标悬停在时间轴上的事件时，相关信息会以弹出框的形式展示，增强用户体验。
3. **全屏显示功能**：用户可以选择全屏模式，以更好地沉浸在3D可视化中。
4. **动态星空背景**：通过动态变化的星空背景，增强视觉效果，使得整个场景更加生动。

## 三、算法描述

### 3.1 数据处理

使用D3.js库处理生物演化的时间数据。数据结构为树形结构，每个节点包含事件名称、时间、描述和相关图片。通过递归函数将树形数据展平，并根据时间值进行排序。

### 3.2 3D场景构建

使用Three.js库构建3D场景，包括相机、光源、星空背景和DNA双螺旋结构。相机使用透视投影，光源包括环境光和点光源，以确保场景的明亮度和层次感。

### 3.3 动画与交互

通过TWEEN.js库实现平滑动画效果，用户可以通过键盘控制相机的旋转，增强交互性。时间轴的更新通过定时器实现，确保在播放状态下，时间轴能够动态更新。

## 四、代码实现

### 4.1 HTML结构

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>生物演化史-DNA双螺旋-3D</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <style>
        /* 样式定义 */
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="./biological-evolution-data.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.9.5/Tween.min.js"></script>
</head>
<body>
    <div id="navigation">
        <!-- 导航按钮 -->
    </div>
    <div id="info">生物演化史-DNA双螺旋-3D</div>
    <div id="details"></div>
    <div id="controls-info">按 Q/E 键进行顺/逆时针旋转视角</div>
    <script>
        // JavaScript代码实现
    </script>
</body>
</html>
```

### 4.2 JavaScript实现细节

#### 4.2.1 初始化场景

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
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);
    
    createStarField();
    createDNASpiral();
    createTimelineEvents();
    
    createTimeControls();
    
    animate();
}
```

#### 4.2.2 创建DNA双螺旋

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

### 4.3 交互功能实现

#### 4.3.1 鼠标移动事件

```javascript
window.addEventListener('mousemove', onMouseMove);

function onMouseMove(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(timelineObjects.children);
    
    if(intersects.length > 0) {
        const event = intersects[0].object.userData;
        showEventDetails(event);
    } else {
        hideEventDetails();
    }
}
```

## 五、库函数引用

- **Three.js**：用于3D图形的渲染和交互，提供了丰富的几何体、材质和光源选项。
- **D3.js**：用于数据处理和可视化，特别是在处理树形结构数据时，提供了强大的数据绑定和更新功能。
- **TWEEN.js**：用于实现平滑的动画效果，增强用户体验。

## 六、结论

本实验通过Three.js和D3.js的结合，实现了一个生动的生物演化史可视化工具。用户可以通过交互式界面探索DNA双螺旋的结构及其演化过程，增强了对生物学知识的理解。未来可以进一步扩展功能，例如增加更多生物演化事件的详细信息，或引入更多的交互方式，以提升用户体验。
