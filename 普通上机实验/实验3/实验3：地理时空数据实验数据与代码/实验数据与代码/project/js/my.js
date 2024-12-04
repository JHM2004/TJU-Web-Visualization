const height = 800;
const width = 650;

const svg = d3.select('#my_svg')
    .attr('width', width)
    .attr('height', height);

// 添加一个背景矩形以显示svg覆盖的范围
svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('stroke', 'grey');


Promise.all([
    d3.json("YELL.geojson"),
    d3.csv("all.csv")
]).then((data)=>{

    let geojson = data[0];
    let dots = data[1]

});

