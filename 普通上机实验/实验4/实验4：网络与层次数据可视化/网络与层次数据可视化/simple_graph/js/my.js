const height = 800;
const width = 800;

const svg = d3.select('#my_svg')
    .attr('width', width)
    .attr('height', height);

// 添加一个背景矩形以显示svg覆盖的范围
svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('stroke', 'grey');

const graph_g = svg.append('g')
    .attr('id', 'graph_g');

const colors = d3.schemeCategory10;

d3.json("../miserables.json")
    .then(function(graph) {
        const nodes = graph.nodes;
        const links = graph.links;

        const link = graph_g.append("g")
            .attr('id', 'links_g')
            .selectAll("line")
            .data(links)
            .enter().append('line')
            .attr('stroke', '#ccc');

        const node = graph_g.append("g")
            .attr('id', 'circles_g')
            .selectAll("circle")
            .data(nodes)
            .enter().append('circle')
            .attr("stroke", '#fff')
            .attr('fill', d => colors[d.group % 10])
            .attr("r", 5);
        node.append('title')
            .text(d => d.name);

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.name))
            .force("charge", d3.forceManyBody())
            .force("center",  d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked);

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }
    });