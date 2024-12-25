# 实验报告：生物演化史导航页-PC端

## 一、引言

本实验旨在开发一个生物演化史的导航页面，利用Web技术和3D图形库Three.js，提供用户友好的交互体验。该页面不仅展示了生物演化的历史，还通过3D场景和动态效果增强了用户的沉浸感。

## 二、创新功能点

1. **3D场景展示**：使用Three.js创建动态的3D场景，用户可以通过鼠标或触摸操作自由旋转视角，增强了交互性。
2. **天空盒选择**：用户可以选择不同的天空盒背景，提供多样化的视觉体验。
3. **设备检测**：自动检测用户设备类型，提供适配的操作提示，确保用户在不同设备上都能获得良好的体验。
4. **动态加载提示**：在加载3D资源时，显示加载动画，提升用户体验。
5. **按钮交互**：提供多个功能按钮，如跳转到首页、评论区等，方便用户操作。

## 三、代码实现细节

### 3.1 HTML结构

HTML文件的基本结构如下：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>生物演化史导航页-PC端</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
    <style>
        /* CSS样式定义 */
    </style>
</head>
<body>
    <div id="message" class="message no-select">生物演化史 - EvoViz</div>
    <div id="device-check" style="position: fixed; bottom: 10px; left: 10px; color: white; font-size: 1em; z-index: 1000;">
        页面格式有问题？点击重新进行设备检测→
        <button onclick="window.location.href='./device-testing.html'" style="margin-left: 5px; padding: 5px 10px; background-color: rgba(0, 123, 255, 0.9); color: white; border: none; border-radius: 5px; cursor: pointer;">设备检测</button>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        // JavaScript代码实现
    </script>
</body>
</html>
```

### 3.2 CSS样式

CSS样式用于美化页面，主要包括按钮、加载提示、消息框等的样式定义。以下是部分样式示例：

```css
.message {
    position: fixed;
    top: 5%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: red;
    font-size: 3em;
    text-align: center;
    padding: 20px;
    z-index: 1000;
    white-space: nowrap;
    letter-spacing: 0.2em;
}

.loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 1.2em;
    text-align: center;
    z-index: 1000;
}
```

### 3.3 JavaScript实现

JavaScript部分是实现页面交互和3D场景的核心。以下是主要功能的实现细节：

#### 3.3.1 设备检测

通过`navigator.userAgent`检测用户设备类型：

```javascript
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
```

#### 3.3.2 创建3D场景

使用Three.js创建3D场景、相机和渲染器：

```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

#### 3.3.3 加载天空盒

天空盒的加载通过`THREE.CubeTextureLoader`和`THREE.TextureLoader`实现，支持多种类型的纹理：

```javascript
function loadSkyboxTexture(textureConfig) {
    loadingDiv.style.display = 'block';
    const loadCallback = function() {
        loadingDiv.style.display = 'none';
        // 显示提示信息
    };

    if (textureConfig.type === 'cubemap') {
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.load(textureConfig.urls, function(cubeTexture) {
            scene.background = cubeTexture;
            loadCallback();
        });
    } else {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(textureConfig.url, function(texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            loadCallback();
        });
    }
}
```

#### 3.3.4 交互功能

通过事件监听器实现用户交互，如鼠标和触摸控制：

```javascript
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mouseup', onMouseUp, false);

function onMouseDown(event) {
    isMouseDown = true;
    mouseStartX = event.clientX;
    mouseStartY = event.clientY;
}

function onMouseMove(event) {
    if (!isMouseDown) return;
    // 计算旋转角度
}
```

### 3.4 库函数引用

- **Three.js**：用于创建和渲染3D场景，提供了丰富的3D图形功能。
- **D3.js**：虽然在本项目中未直接使用，但可以用于数据可视化，未来可以考虑将生物演化数据以图表形式展示。

## 四、总结

本实验成功实现了一个生物演化史的导航页面，利用Three.js提供的3D图形能力，结合用户交互设计，提升了用户体验。未来可以进一步扩展功能，如增加更多的生物演化数据展示、优化加载性能等。通过不断迭代和优化，期望为用户提供更丰富的学习体验。
