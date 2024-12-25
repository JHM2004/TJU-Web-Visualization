# 实验报告：生物演化史-DNA双螺旋-3D可视化

## 一、引言

本实验旨在通过3D可视化技术展示生物演化史中的DNA双螺旋结构，利用Three.js库实现动态交互效果，增强用户的学习体验。该项目结合了生物学、计算机图形学和用户交互设计，展示了如何通过现代Web技术将复杂的科学概念以直观的方式呈现。

## 二、创新功能点

1. **动态时间旅行模式**：用户可以通过控制面板播放、暂停和调整播放速度，模拟生物演化的时间线，直观感受生物演化的过程。
2. **交互式信息展示**：用户可以通过鼠标悬停在时间线上的节点，查看详细的事件信息，包括时间、描述和相关图片。
3. **全景视图**：用户可以通过鼠标控制相机视角，360度查看DNA双螺旋结构，增强沉浸感。
4. **自适应界面**：界面元素根据屏幕大小自适应调整，确保在不同设备上均能良好展示。

## 三、代码实现细节

### 3.1 技术栈

- **HTML/CSS**：用于构建页面结构和样式。
- **JavaScript**：实现动态交互和逻辑控制。
- **Three.js**：用于3D图形渲染。
- **D3.js**：用于数据可视化（在本项目中未直接使用，但可扩展用于数据处理）。

### 3.2 主要库函数引用

#### Three.js

Three.js是一个强大的JavaScript库，用于创建和显示3D图形。以下是一些关键的实现细节：

- **场景创建**：
  ```javascript
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  ```

- **相机设置**：
  ```javascript
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
  camera.position.set(100, 0, 100);
  camera.lookAt(0, 0, 0);
  ```

- **渲染器初始化**：
  ```javascript
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  ```

- **光源添加**：
  ```javascript
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  ```

- **创建DNA双螺旋**：
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

### 3.3 交互功能实现

- **时间控制面板**：
  ```javascript
  function createTimeControls() {
      const controlsContainer = document.createElement('div');
      controlsContainer.style.position = 'absolute';
      controlsContainer.style.bottom = '20px';
      controlsContainer.style.right = '20px';
      controlsContainer.style.zIndex = '1000';
      controlsContainer.style.display = 'flex';
      controlsContainer.style.flexDirection = 'column';
      controlsContainer.style.gap = '15px';
      controlsContainer.style.padding = '20px';
      controlsContainer.style.background = 'rgba(0,0,0,0.7)';
      controlsContainer.style.borderRadius = '10px';
      controlsContainer.style.backdropFilter = 'blur(5px)';
      controlsContainer.style.boxShadow = '0 0 20px rgba(0,255,0,0.2)';

      // 添加播放、暂停、前进、倒退按钮
      const playButton = document.createElement('button');
      playButton.innerText = '播放';
      playButton.onclick = () => {
          isPlaying = !isPlaying;
          playButton.innerText = isPlaying ? '暂停' : '播放';
      };
      controlsContainer.appendChild(playButton);
      document.body.appendChild(controlsContainer);
  }
  ```

- **鼠标事件处理**：
  ```javascript
  window.addEventListener('mousemove', onMouseMove);
  function onMouseMove(event) {
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

### 3.4 数据处理与可视化

在本项目中，数据以JSON格式存储，包含生物演化的时间节点、事件描述和相关图片。通过解析这些数据，动态生成时间线上的节点，并为每个节点添加交互功能。

## 四、算法描述

1. **时间线更新算法**：
   - 每当播放状态为真时，定时更新当前时间索引，并根据索引更新可见的事件。
   - 通过`requestAnimationFrame`实现平滑的动画效果。

2. **事件处理算法**：
   - 鼠标移动时，使用射线投射技术检测鼠标与时间线节点的交互。
   - 根据交互结果显示或隐藏事件详情。

## 五、结论

本实验通过Three.js实现了生物演化史的3D可视化，展示了DNA双螺旋的结构及其演化过程。通过动态交互和信息展示，用户能够更直观地理解生物演化的复杂性。未来可以进一步扩展功能，例如增加更多的生物演化事件、优化用户界面和增强数据可视化效果。

## 六、参考文献

- Three.js官方文档：[https://threejs.org/docs/](https://threejs.org/docs/)
- D3.js官方文档：[https://d3js.org/](https://d3js.org/)
- 相关生物学文献与资料。
