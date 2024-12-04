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
    .attr('id', 'graph_g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);


d3.json("../data.json")
    .then(function(graph) {
        const nodes = graph.nodes;
        const links = graph.links;

        const group2color = {
            'Cited Works': '#4e79a7',
            'Citing Patents': '#f28e2c'
        }

        const node_name2node_id = {};
        for (const [id, node] of Object.entries(nodes)) {
            node.color = group2color[node.group];
            node_name2node_id[node.name] = id;
            node.id = id;
        }

        for (const link of links) {
            link.source = node_name2node_id[link.source];
            link.target = node_name2node_id[link.target];
            link.id = link.source + '_' + link.target
        }

        const link = graph_g.append("g")
            .attr('id', 'links_g')
            .selectAll("line")
            .data(links)
            .enter().append('line')
            .attr('id', d => 'link_' + d.id)
            .attr('stroke', '#ccc');

        const node = graph_g.append("g")
            .attr('id', 'circles_g')
            .selectAll("circle")
            .data(nodes)
            .enter().append('circle')
            .attr('id', d => 'node_' + d.id)
            .attr("stroke", '#fff')
            .attr('fill', d => d.color)
            .attr("r", 5);
        node.append('title')
            .text(d => d.name);

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links))
            .force("charge", d3.forceManyBody())
            .force("x", d3.forceX())
            .force("y", d3.forceY())
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