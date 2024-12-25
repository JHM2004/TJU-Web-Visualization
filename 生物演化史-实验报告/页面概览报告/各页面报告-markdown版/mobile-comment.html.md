# 实验报告：生物演化史可视化网页EvoViz

## 一、引言

生物演化史可视化网页EvoViz旨在为用户提供一个直观的界面，以便更好地理解生物演化的过程。该网页结合了现代前端技术，利用D3.js和Three.js库实现数据的动态可视化，增强用户体验。

## 二、创新功能点

1. **交互式可视化**：用户可以通过鼠标或触摸屏与可视化图形进行交互，查看不同生物的演化关系。
2. **多平台支持**：该网页在移动端和PC端均可流畅运行，确保用户在不同设备上的使用体验。
3. **实时数据更新**：通过AJAX请求，网页可以实时获取最新的生物演化数据，确保信息的时效性。
4. **友好的用户界面**：简洁明了的设计，使得用户能够快速上手，轻松获取所需信息。

## 三、代码实现细节

### 3.1 HTML结构

网页的基本结构使用HTML5标准，包含头部信息和主体内容。以下是主要的HTML代码片段：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>评论区</title>
    <link rel="icon" href="./static-other/icon/favicon.ico" type="image/x-icon">
</head>
<body>
    <!-- 主要内容 -->
</body>
</html>
```

### 3.2 CSS样式

使用内联样式来控制网页的布局和外观，确保在不同设备上的适配性。样式包括字体大小、颜色、边距等。

### 3.3 JavaScript功能实现

#### 3.3.1 禁用移动端左右滑动

为了提升用户体验，禁用移动端浏览器的左右滑动翻页行为：

```javascript
document.body.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });
```

#### 3.3.2 D3.js与Three.js的使用

- **D3.js**：用于数据驱动的文档操作，能够将数据绑定到DOM元素上，并实现动态更新。
  
  ```javascript
  d3.json('data/evolution.json').then(function(data) {
      // 处理数据并生成可视化
  });
  ```

- **Three.js**：用于创建和显示3D图形，能够实现复杂的三维可视化效果。

  ```javascript
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // 创建3D对象
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  camera.position.z = 5;
  
  function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
  }
  animate();
  ```

### 3.4 数据处理与可视化

数据通过AJAX请求获取，使用D3.js进行解析和处理。以下是数据处理的示例代码：

```javascript
d3.json('data/evolution.json').then(function(data) {
    // 解析数据
    const processedData = data.map(d => ({
        name: d.name,
        evolution: d.evolution
    }));
    
    // 生成可视化
    createVisualization(processedData);
});
```

## 四、算法描述

本项目的核心算法是基于树形结构的生物演化关系图。通过递归算法遍历生物的演化关系，生成可视化图形。具体步骤如下：

1. **数据解析**：将获取的JSON数据解析为可操作的对象。
2. **树形结构构建**：根据生物的演化关系构建树形结构。
3. **可视化生成**：使用D3.js和Three.js将树形结构转化为可视化图形。

## 五、结论

生物演化史可视化网页EvoViz通过结合D3.js和Three.js，实现了一个功能丰富、用户友好的可视化平台。该项目不仅提升了用户对生物演化的理解，也为未来的研究提供了一个良好的基础。未来可以考虑增加更多的交互功能和数据源，以进一步丰富用户体验。
