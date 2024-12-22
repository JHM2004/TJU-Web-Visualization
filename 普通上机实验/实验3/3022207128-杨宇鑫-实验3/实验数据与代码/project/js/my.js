// 初始化变量
let map;
let points;
let currentYear = null;
let allTimeData = [];
let infoPanel;

// 等待 DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 创建信息面板
    infoPanel = d3.select('#map')
        .append('div')
        .attr('class', 'info-panel')
        .style('position', 'absolute')
        .style('top', '70px')
        .style('right', '20px')
        .style('width', '300px')
        .style('background', 'white')
        .style('padding', '15px')
        .style('border-radius', '4px')
        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
        .style('display', 'none')
        .style('opacity', '0.95');

    initializeMap();
});

async function initializeMap() {
    try {
        // 设置地图容器和尺寸
        const width = document.getElementById('map').clientWidth;
        const height = document.getElementById('map').clientHeight;

        // 创建SVG容器
        const svg = d3.select('#map')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // 加载GeoJSON数据
        const response = await fetch('YELL.geojson');
        const geoJson = await response.json();

        // 创建投影
        const projection = d3.geoMercator()
            .fitExtent([[20, 20], [width - 20, height - 20]], geoJson);

        // 创建路径生成器
        const path = d3.geoPath()
            .projection(projection);

        // 绘制地图
        const mapGroup = svg.append('g');
        mapGroup.selectAll('path')
            .data(geoJson.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', '#e3e3e3')
            .attr('stroke', '#666')
            .attr('stroke-width', 1);

        // 创建点图层
        const pointsGroup = svg.append('g');

        try {
            // 加载时间序列数据
            const timeResponse = await fetch('all.json');
            const timeData = await timeResponse.json();
            allTimeData = timeData;

            // 提取所有年份
            const years = [...new Set(timeData.map(d => d.year))].sort();
            console.log('Available years:', years);

            // 创建年份选择器
            const controls = d3.select('#map')
                .append('div')
                .attr('class', 'controls')
                .style('position', 'absolute')
                .style('top', '10px')
                .style('left', '10px')
                .style('background', 'white')
                .style('padding', '10px')
                .style('border-radius', '4px')
                .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)');

            controls.append('label')
                .text('选择年份: ')
                .style('margin-right', '10px');

            const yearSelect = controls.append('select')
                .on('change', function() {
                    currentYear = this.value;
                    updatePoints(timeData, currentYear, projection, pointsGroup, geoJson.bbox);
                });

            yearSelect.append('option')
                .attr('value', '')
                .text('所有年份');

            yearSelect.selectAll('option.year')
                .data(years)
                .enter()
                .append('option')
                .attr('value', d => d)
                .text(d => d + '年');

            // 显示数据点数量
            const countLabel = controls.append('div')
                .attr('class', 'count-label')
                .style('margin-top', '10px')
                .style('font-size', '12px');

            // 初始显示所有数据
            updatePoints(timeData, null, projection, pointsGroup, geoJson.bbox, countLabel);

            // 添加缩放功能
            const zoom = d3.zoom()
                .scaleExtent([1, 100])
                .on('zoom', (event) => { 
                    mapGroup.attr('transform', event.transform);
                    pointsGroup.attr('transform', event.transform);

                    // 动态调整节点大小和边框宽度
                    pointsGroup.selectAll('circle')
                        .attr('r', 5 / event.transform.k) // 根据缩放比例调整半径
                        .attr('stroke-width', 0.5 / event.transform.k); // 根据缩放比例调整边框宽度
                });

            svg.call(zoom);

        } catch (timeError) {
            console.error('时间序列数据加载错误:', timeError);
        }
    } catch (error) {
        console.error('初始化错误:', error);
        document.getElementById('map').innerHTML = '地图初始化失败，请检查控制台错误信息';
    }
}

function updatePoints(timeData, year, projection, pointsGroup, bbox, countLabel) {
    // 过滤数据
    const filteredData = timeData.filter(d => {
        const lon = parseFloat(d.lon);
        const lat = parseFloat(d.lat);
        const inBounds = !isNaN(lon) && !isNaN(lat) &&
                        lon >= bbox[0] && lon <= bbox[2] &&
                        lat >= bbox[1] && lat <= bbox[3];
        
        if (!inBounds) return false;
        
        if (year) {
            return d.year === year;
        }
        return true;
    });

    // 更新计数标签
    if (countLabel) {
        countLabel.text(`显示: ${filteredData.length} 张照片`);
    }

    // 更新点
    const points = pointsGroup.selectAll('circle')
        .data(filteredData, d => d.id);

    // 移除不需要的点
    points.exit().remove();

    // 添加新点
    points.enter()
        .append('circle')
        .merge(points)
        .attr('cx', d => {
            const coords = projection([parseFloat(d.lon), parseFloat(d.lat)]);
            return coords ? coords[0] : null;
        })
        .attr('cy', d => {
            const coords = projection([parseFloat(d.lon), parseFloat(d.lat)]);
            return coords ? coords[1] : null;
        })
        .attr('r', 5)
        .attr('fill', '#ff4444')
        .attr('opacity', 0.6)
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event, d) {
            const currentRadius = 5 / d3.zoomTransform(this.parentNode).k; // 获取当前缩放比例下的半径
            d3.select(this)
                .attr('opacity', 1)
                .attr('r', currentRadius * 1.6); // 增加半径，保持相对大小

            updateInfoPanel(d);
        })
        .on('mouseout', function() {
            const currentRadius = 5 / d3.zoomTransform(this.parentNode).k; // 获取当前缩放比例下的半径
            d3.select(this)
                .attr('opacity', 0.6)
                .attr('r', currentRadius); // 恢复原始半径
        });
}

function updateInfoPanel(d) {
    if (!infoPanel) {
        console.error('Info panel not initialized');
        return;
    }

    // 构建 Flickr 图片 URL
    const imgUrl = `https://live.staticflickr.com/${d.server}/${d.id}_${d.secret}_z.jpg`;

    infoPanel
        .style('display', 'block')
        .html(`
            <div style="position: relative;">
                <div style="position: absolute; top: 5px; right: 5px; cursor: pointer; padding: 5px;"
                     onclick="this.parentElement.parentElement.style.display='none'">
                    ✕
                </div>
                <div style="text-align: center; margin-bottom: 10px;">
                    <img src="${imgUrl}" 
                         style="max-width: 100%; border-radius: 4px; margin-top: 10px;"
                         onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Available'">
                </div>
                <div style="font-size: 14px; margin: 15px 0; line-height: 1.4;">
                    <strong>${d.title}</strong>
                </div>
                <div style="font-size: 12px; color: #666; line-height: 1.6;">
                    <div style="margin-bottom: 8px;">
                        <strong>日期:</strong> ${d.date}
                    </div>
                    <div>
                        <strong>位置:</strong><br>
                        纬度: ${d.lat}<br>
                        经度: ${d.lon}
                    </div>
                    <div style="margin-top: 8px;">
                        <strong>照片 ID:</strong> ${d.id}
                    </div>
                </div>
            </div>
        `);
}
