# 交互设计

## 引言
- 定义和意义
- 发展历史
- 基本方法
- 应用和挑战

## 交互模型
- 交互技术
- 交互范式

## 交互技术概览
### 通用交互技术
- 命令行界面
- WIMP（窗口、图标、菜单、指针）
- 笔式用户界面
- 多点触控交互
- 手势交互
- 可穿戴计算
- 可触摸用户界面

### 直接触摸
### 多点触控
### 深度相机
### AR设备
- Google Glass
- MYO腕带
- Oculus Rift头戴式虚拟现实设备
- G-Speak手套

## 可视化交互类型
- 信息可视化的两个主要成分：表征和交互
  - 表示（representation）是用户的关注对象
  - 交互（interaction）提供用户可操作的手段

## 交互类型
### Dix和Ellis (AVI 1998) 提出
- 高亮和焦点
- 搜索更多信息 - drill down和超链接
- 概况与上下文，缩放与鱼眼
- 同一个表示，不同参数选择
- 链接不同的表示/征：提供时间上的过渡（如淡入淡出）

### Daniel Keim (TVCG 2002)
- 投影/映射
- 过滤
- 缩放
- 失真变形
- Brushing & linking

### Yi, Kang, and Stasko (2007)
- Select: 标记有趣的内容
- Explore: 展示其他内容
- Reconfigure: 展示不同的排列
- Encode: 展示不同的表示
- Abstract/Elaborate: 展示更多或更少的细节
- Filter: 有条件地展示内容
- Connect: 展示相关项目

## 主要交互技术
### Select
- TableLens
- 信息提示：悬停鼠标光标显示项目详情
- 鼠标选择：单击选择一个项目，并显示数据点的属性
- 选择时的视觉混乱及解决办法：放大

### Explore
- 显示其他内容
- 滚动条
- 平移
- 直接行走
- 超链接遍历
- 视觉词典

### Reconfigure
- 显示不同的排列
- 表中的排序
- 堆叠直方图的基线调整
- Geotime
- Data Mountain
- 减少遮挡（抖动）

### Encode
- 显示不同的表示
- 在软件底部选择不同的显示模式
- 改变颜色编码
- 改变其他编码：大小、方向、字体、形状等

### Abstract / Elaborate
- 显示更多或更少的数据细节
- 调整抽象级别（概观和细节）
- 展开子类别，提供互动的可视化方法
- 展开TreeMap
- Sunburst中的Details-on-demand
- 缩放（缩放几何）

### Filter
- 有条件地展示内容
- 动态查询
- 直方图刷取（Brushing Histogram）
- Attribute Explorer
- DataMaps

### Connect
- 展示相关项目
- 高亮连接性
- Brushing（刷取）
- Coordinated Multiple Views (CMV)
- Snap-Together Visualization
- 协作刷取和链接

## 交互范式
- 概览+细节 Overview + Detail
- 焦点+上下文 Focus + Context
- 对偶界面 Dual Interface
- 动画过渡 Animated Transitions

## 概览+细节
- 同时显示信息空间的概览和详细视图

## 焦点+上下文
- 可以与失真一起使用，如鱼眼
- 与缩放一起工作，如果动画化 - Photomesa

## 鱼眼视图
- 模仿人的视觉系统：中央视野高解析度，周边视野低解析度

## 透视墙
- 计算机实现的3D双焦点显示

## 动画效果
- 叙事动画
