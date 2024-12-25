# 实验报告：地球古地理动态可视化系统

## 1. 引言

本实验旨在创建一个互动式地球古地理动态可视化系统，利用Three.js库实现了对地球在历史不同时期的地理变化进行模拟。系统通过3D可视化的方式，展示了地球大陆的漂移过程，并在用户交互上提供了多项便于操作的功能。

## 2. 创新功能点

### 2.1 3D 地球展示
使用Three.js创建了一个3D地球模型，展示了地球在不同地质时期的地理变化。用户可以通过交互来观察地球的不同角度。

### 2.2 时光倒流功能
通过选择不同的时间节点，用户可以观察地球在从现代到7.5亿年前不同时期的地理变化。

### 2.3 自动旋转与手动控制
地球模型支持自动旋转，并允许用户通过鼠标和键盘进行手动控制，提供灵活的交互方式。

### 2.4 云层显示
地球表面可以显示和隐藏云层，增加了可视化的真实感。

### 2.5 星空背景
模拟了星空背景，使整个场景更加生动。

### 2.6 全屏显示
支持全屏模式以便用户获得更好的查看体验。

## 3. 技术实现

### 3.1 数据结构
地球地理变化的数据以图片的形式存储，每张图片对应一个特定的时间点。例如，`0.jpg`表示现代地球，`750.jpg`表示7.5亿年前的地球。

### 3.2 Three.js库介绍
Three.js是一个跨平台的JavaScript库，用于在Web浏览器中创建和显示动画3D计算机图形。它使用WebGL构建，因此可以在不使用插件的情况下在现代浏览器上运行。

#### 3.2.1 地球模型创建
```javascript
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshPhongMaterial({
    map: texture,
    specular: new THREE.Color('grey'),
    shininess: 10
});
earth = new THREE.Mesh(geometry, material);
scene.add(earth);
```
- `SphereGeometry`: 创建球体几何。
- `MeshPhongMaterial`: 用于创建具有光泽和反射的材质。
- `Mesh`: 将几何和材质组合成网格。

#### 3.2.2 光照设置
```javascript
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 0, 1);
scene.add(camera);
```
- `AmbientLight`: 环境光，用于整体照亮场景。
- `DirectionalLight`: 方向光，用于模拟太阳光。

#### 3.2.3 控制器
使用`OrbitControls`实现对地球的旋转和缩放控制：
```javascript
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
```
`OrbitControls`允许用户通过鼠标交互来旋转、缩放和移动3D模型。

### 3.3 纹理映射
不同时期的地球纹理使用`TextureLoader`加载，并根据用户选择的时间节点进行切换。

### 3.4 云层实现
```javascript
const cloudsGeometry = new THREE.SphereGeometry(5.05, 32, 32);
const cloudsMaterial = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide
});
clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
clouds.visible = false;
scene.add(clouds);
```
云层通过半透明的双面材质实现，可以通过按钮控制其显示和隐藏。

### 3.5 星空背景
通过`THREE.Points`创建星空背景，模拟宇宙环境：
```javascript
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.1
});
```
`BufferGeometry`和`PointsMaterial`结合，创建出细小的星星效果。

### 3.6 交互功能
系统提供了键盘和鼠标的交互功能，通过事件监听器实现用户对地球的操控。

#### 3.6.1 键盘交互
可以使用键盘的左右方向键或A/D键来切换时间节点。

#### 3.6.2 鼠标交互
鼠标左键和右键可用于快速切换时间节点。

### 3.7 全屏功能
通过调用浏览器的全屏API实现全屏查看功能：
```javascript
document.documentElement.requestFullscreen();
```

## 4. 用户界面设计

### 4.1 控制面板
包括全屏按钮、时间选择下拉菜单、云层控制按钮等，用户可以通过这些控件操作地球模型。

### 4.2 信息展示
在界面上显示当前时间节点的信息，并提供相关的地质时期描述。

## 5. 性能优化

### 5.1 懒加载纹理
只有在需要时才加载特定时间节点的纹理，以减少初始加载时间。

### 5.2 控制器阻尼
使用控制器的阻尼功能，使交互更加自然流畅。

## 6. 跨平台兼容性

### 6.1 响应式设计
使用CSS确保界面在不同设备和屏幕尺寸上都能正常显示。

### 6.2 事件支持
支持鼠标和触摸事件，以便在桌面和移动设备上都可以正常操作。

## 7. 未来改进方向

### 7.1 数据扩展
增加更多的时间节点和更详细的地质数据，以覆盖更广泛的地质历史。

### 7.2 3D渲染优化
利用WebGL的高级特性，提升渲染质量和性能。

### 7.3 用户自定义功能
允许用户上传自定义的地质数据和纹理，以便进行个性化分析和展示。

## 8. 结论

本实验成功创建了一个集成多项先进功能的地球古地理动态可视化系统，利用Three.js实现了3D可视化和丰富的用户交互体验。未来，将继续在数据丰富性和系统性能上进行改进，以满足更广泛的科学研究和教育需求。