# 可视语言与信息可视化

## 大作业 - 生物演化史 - EvoViz - 网站

### 网站链接 https://www.yangyuxin.cn 

#### ①网站主页

![1](.\readme-static\1.jpg)

#### ②网站导航页

![2](.\readme-static\2.png)

#### ③四象限联动页面

![3](.\readme-static\3.png)

![4](.\readme-static\4.png)

#### ④交流反馈区

![5](.\readme-static\5.png)

#### ⑤纯文本知识库

![6](.\readme-static\6.png)

# 生物演化史可视化项目 - 技术实验报告

## 一、项目概述

该项目是一个生物演化史的可视化展示系统，结合 3D 全景和数据可视化，为用户提供沉浸式的生物演化历史学习体验。通过 Three.js 实现空间展示，D3.js 实现数据可视化，形成完整的学习系统。

## 二、核心技术栈

### 1. 前端基础

- HTML5
- CSS3
- JavaScript (ES6+)

### 2. 3D 渲染技术

- Three.js 框架
  - 3D 场景渲染
  - 全景天空盒（Skybox）
  - 立方体贴图（Cubemap）

### 3. 数据可视化

- D3.js 框架
  - 力导向图（Force-directed Graph）
    - 展示生物演化关系
    - 节点间连接关系
  - 交互式时间轴
    - 地质年代展示
    - 演化过程时序可视化
  - 树状层级结构
    - 生物分类系统展示
    - 进化树可视化

### 4. 响应式设计

- 设备自适应布局
- PC/移动端分离设计, 实现双端适配
- 媒体查询（Media Queries）

## 三、主要功能实现

### 1. 3D 场景系统

```javascript
// Three.js 场景初始化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
```

### 2. 数据可视化实现

```javascript
// D3.js 力导向图示例
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter());
```

### 3. 交互控制集成

- 3D 场景控制
- 数据可视化交互
- 统一的用户界面

### 4. 全景场景系统

- 多种全景类型支持
- 场景切换动画
- 视角控制

### 5. 全栈评论系统

#### 前端实现

```javascript
// 评论区组件
const CommentSystem = {
    handleCommentRedirect() {
        ...
    }
}
```

#### 后端架构

```javascript
// Express服务器配置
const express = require('express');
const app = express();

// MongoDB数据模型
const CommentSchema = new mongoose.Schema({
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    scene: String  // 关联的3D场景
});
```

#### 技术栈组成

- 前端
  - React.js 构建评论UI
  - WebSocket 实时通信
  - JWT 用户认证 (未来将实现)
- 后端
  - Node.js + Express
  - MongoDB 数据存储
  - Socket.io 实时推送
- 功能特点
  - 实时评论更新
  - 场景关联评论
  - 多媒体评论支持

## 四、系统架构

### 1. 前端架构

- 展示层
  - Three.js 3D渲染
  - D3.js 数据可视化
  - React 评论组件
- 业务层
  - 场景控制逻辑
  - 数据处理逻辑
  - 用户交互逻辑
- 通信层
  - RESTful API
  - WebSocket 连接

### 2. 后端架构

- API 服务
  - Express 路由
  - 中间件处理
  - 错误处理
- 数据层
  - MongoDB 数据库
  - Mongoose ODM
  - 数据模型设计
- 实时通信
  - Socket.io 服务
  - 事件处理
  - 消息推送

### 3. 数据模型

```javascript
// 用户模型
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    avatar: String
});

// 评论模型
const CommentSchema = new mongoose.Schema({
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scene: String,
    replies: [{
        content: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: Date
    }]
});
```

这个项目通过整合 Three.js 和 D3.js 两大可视化库，创造了一个独特的生物演化史学习平台。结合 3D 场景展示和数据可视化的优势，为用户提供了丰富的学习体验。项目的技术实现既保证了良好的性能，又确保了出色的可扩展性。