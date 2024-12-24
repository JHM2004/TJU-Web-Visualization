// 引入 D3.js
const width = window.innerWidth;  // 获取浏览器窗口的宽度
const height = window.innerHeight; // 获取浏览器窗口的高度

// 创建 SVG 元素
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// 创建缩放行为
const zoom = d3.zoom()
    .scaleExtent([0.1, 10]) // 设置缩放范围
    .on("zoom", (event) => {
        g.attr("transform", event.transform); // 应用缩放变换
    });

// 将缩放行为应用到 SVG
svg.call(zoom);

// 创建一个组元素用于放置链接和节点
const g = svg.append("g");

// 加载数据
d3.json("webkit-dep.json").then(data => {
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 创建力导向图
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink().id((d, i) => i).distance(50))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2));

    // 绘制链接
    const link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke-width", 1)
        .attr("stroke", "#999");

    // 绘制节点
    const node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 6)
        .attr("fill", d => color(d.category))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 12); // 高亮节点
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", event.pageX)
                .attr("y", event.pageY)
                .text(d.name);
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 6); // 恢复节点大小
            d3.select("#tooltip").remove(); // 移除提示
        });

    // 更新节点和链接的位置
    simulation
        .nodes(data.nodes)
        .on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

    simulation.force("link").links(data.links);

    // 设置初始��放和中心位置
    const initialScale = 0.3; // 初始缩放比例
    const initialTranslateX = width / 3; // 初始平移X
    const initialTranslateY = height / 3; // 初始平移Y
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialTranslateX, initialTranslateY).scale(initialScale));
});

// 监听窗口大小变化
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    svg.attr("width", newWidth).attr("height", newHeight);
    simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2)).alpha(1).restart();
});
