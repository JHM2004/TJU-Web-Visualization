# 实验报告：生物演化史导航页-移动端

## 一、引言

本实验旨在开发一个生物演化史的移动端导航页面，利用现代Web技术（HTML、CSS、JavaScript）和3D图形库（Three.js）实现一个交互式的用户体验。该页面不仅展示了生物演化的相关信息，还通过3D场景和动态效果增强了用户的沉浸感。

## 二、创新功能点

1. **3D场景展示**：使用Three.js库创建一个动态的3D场景，用户可以通过触摸或鼠标操作来旋转视角，增强了交互性。
2. **移动端优化**：针对移动设备进行了特别优化，提供了适合触摸操作的按钮和提示信息。
3. **动态加载天空盒**：用户可以选择不同的场景背景，使用equirectangular和cubemap类型的纹理，提升了视觉效果。
4. **实时反馈**：在加载资源时提供加载提示，确保用户体验流畅。
5. **设备检测与提示**：在移动端访问时，提供了设备检测功能，提示用户使用PC端以获得最佳体验。

## 三、代码实现细节

### 3.1 HTML结构

HTML部分主要负责页面的基本结构和元素的布局。以下是关键部分的代码示例：

```html
<div id="message" class="message">
    请使用PC端(电脑)访问以获得最佳体验
</div>
```

该部分用于提示用户在移动设备上访问时的体验限制。

### 3.2 CSS样式

CSS部分负责页面的样式设计，包括按钮、提示信息和3D场景的样式。以下是部分样式的实现：

```css
.message {
    position: fixed;
    top: 5%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: red;
    font-size: 1em;
    text-align: center;
    padding: 20px;
    z-index: 1000;
    white-space: nowrap;
    letter-spacing: 0.2em;
}
```

### 3.3 JavaScript实现

JavaScript部分是页面的核心，负责逻辑处理和3D场景的创建。以下是关键功能的实现细节：

#### 3.3.1 3D场景的创建

使用Three.js库创建3D场景的代码如下：

```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

#### 3.3.2 加载天空盒

天空盒的加载使用了不同类型的纹理，以下是加载函数的实现：

```javascript
function loadSkyboxTexture(textureConfig) {
    loadingDiv.style.display = 'block';
    const loadCallback = function() {
        loadingDiv.style.display = 'none';
        // 移除任何现有的提示
        const existingHint = document.querySelector('.vr-hint');
        if (existingHint) {
            existingHint.remove();
        }
        // 根据设备类型显示不同的提示
        const vrHint = document.createElement('div');
        vrHint.className = 'vr-hint';
        vrHint.textContent = isMobileDevice() ? '左右滑动体验VR全景' : '点击并拖动体验VR全景';
        document.body.appendChild(vrHint);
    };

    if (textureConfig.type === 'cubemap') {
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.load(textureConfig.urls, function(cubeTexture) {
            scene.background = cubeTexture;
            loadCallback();
        }, undefined, function(err) {
            loadingDiv.innerHTML = '天空盒资源加载失败，请刷新页面重试';
            console.error('天空加载错误:', err);
        });
    } else {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(textureConfig.url, function(texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            loadCallback();
        }, undefined, function(err) {
            loadingDiv.innerHTML = '天空盒资源加载失败，请刷新页面重试';
            console.error('天空盒加载错误:', err);
        });
    }
}
```

#### 3.3.3 交互功能

通过触摸和鼠标事件实现用户交互，以下是触摸事件的处理代码：

```javascript
document.addEventListener('touchstart', onTouchStart, false);
document.addEventListener('touchmove', onTouchMove, false);

function onTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function onTouchMove(event) {
    event.preventDefault();
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const deltaX = (touchX - touchStartX) * 0.01;
    const deltaY = -(touchY - touchStartY) * 0.01;
    currentRotationY += deltaX;
    currentRotationX += deltaY;
    // 限制旋转角度
    currentRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, currentRotationX));
    camera.position.x = 5 * Math.sin(currentRotationY) * Math.cos(currentRotationX);
    camera.position.y = 5 * Math.sin(currentRotationX);
    camera.position.z = 5 * Math.cos(currentRotationY) * Math.cos(currentRotationX);
    camera.lookAt(scene.position);
    touchStartX = touchX;
    touchStartY = touchY;
}
```

### 3.4 库函数引用

- **Three.js**：用于创建和渲染3D场景，提供了丰富的3D图形处理功能。
- **D3.js**：虽然在本项目中未直接使用，但可以用于数据可视化和动态交互效果的实现。

## 四、总结

本实验成功实现了一个生物演化史的移动端导航页面，通过3D场景和动态效果提升了用户体验。未来可以考虑进一步优化性能，增加更多的交互功能和场景选择，以丰富用户的探索体验。
