import { Visualization } from './visualization';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';

export class SankeyChart extends Visualization
{
    constructor(svgName: string, width: number, height: number)
    {
        super(svgName, width, height);
    }

    createSankeyChart(data, color)
    {
        console.log(data);
        var pointer = this;
        var nodeWidth = 25;
        var nodePadding = 3;
        var graph = { nodes: data[1], links: data[0] };
        this.clearSvg();
        var nodeMap = {};
        graph.nodes.forEach(function (x, i) { nodeMap[x.name] = i; });
        graph.links = graph.links.map(function (x)
        {
            return {
                source: nodeMap[x['source']],
                target: nodeMap[x['target']],
                value: x.value
            };
        });

        //var color = d3.scaleOrdinal(d3.schemeCategory10);

        const { nodes, links } = d3Sankey()
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            /*.nodeSort(function (d,e) {
              console.log(d,e,d.value < e.value);return d.value < e.value;
            })*/
            .extent([[1, 1], [this.width - 1, this.height - 25]])({
                nodes: graph.nodes.map(d => Object.assign({}, d)),
                links: graph.links.map(d => Object.assign({}, d))
            })
        console.log(nodes, links);

        this.svg.append('g')
            .attr('stroke', 'white')
            .selectAll('rect')
            .data(nodes.filter(d => !d.photo))
            .enter()
            .append('rect')
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr("height", function (d) { return d.y1 - d.y0; })
            .attr('width', nodeWidth)
            .attr('fill', function (d) { return color[d.name] })/*
      .call(d3.drag()
        .on("start", function (d) { pointer.dragstarted(d, pointer) })
        .on("drag", function(d){
          d3.select(this)
            .attr("x", d3.event.x)
            .attr("y", d3.event.y);
          d3Sankey.update({nodes,links});
        })
        .on("end", function (d) { pointer.dragended(d, pointer) }))*/
            //.on('click', onNodeClick)
            .style('cursor', 'pointer')

        this.svg.append('g')
            .attr('stroke', 'white')
            .selectAll('rect')
            .data(nodes.filter(d => d.photo))
            .enter()
            .append('image')
            .attr('xlink:href', d => d.photo)
            .attr('x', d => (d.x0 < pointer.width / 2 ? d.x1 - 41 : d.x0 + 41))
            .attr('y', d => ((d.y0 + d.y1) / 2) - 20)
            .attr('width', 40)
            .attr('height', 40);

        const link = this.svg.append('g')
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.5)
            .selectAll('g')
            .data(links)
            .enter()
            .append('g')
            .style('mix-blend-mode', 'multiply')

        const guid = () =>
        {
            const _p8 = (i) =>
            {
                const p = (`${Math.random().toString(16)}000000000`).substr(2, 8)
                return i ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p
            }
            return _p8(false) + _p8(true) + _p8(true) + _p8(false)
        }
        const gradient = link.append('linearGradient')
            .attr('id', (d) =>
            {
                d.uid = guid()
                return d.uid
            })
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', d => d.source.x1)
            .attr('x2', d => d.target.x0)

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', d => color[d.source.name])

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', d => color[d.target.name])

        link.append('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', d => `url(#${d.uid})`)
            .attr('stroke-width', d => Math.max(1, d.width))

        this.svg.append('g')
            .style('font', '9px sans-serif')
            .selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .attr('x', d => (d.x0 < pointer.width / 2 ? d.x1 + 6 : d.x0 - 6))
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => (d.x0 < pointer.width / 2 ? 'start' : 'end'))
            .text(d => `${d.name} (${(d.value)})`)

    }

    dragstarted(d, pointer)
    {
    }

    dragged(d)
    {
        console.log(d);
        d.x0 = d3.event.x;
        d.y0 = d3.event.y;
    }

    dragended(d, pointer)
    {

    }

    createSankeyChartv1(data, color)
    {
        var pointer = this;
        var nodeWidth = 25;
        var nodePadding = 3;
        var graph = { nodes: data[1], links: data[0] };
        this.clearSvg();
        var nodeMap = {};
        graph.nodes.forEach(function (x, i) { nodeMap[x.name] = i; });
        graph.links = graph.links.map(function (x)
        {
            return {
                source: nodeMap[x['source']],
                target: nodeMap[x['target']],
                value: x.value
            };
        });

        //var color = d3.scaleOrdinal(d3.schemeCategory10);

        const { nodes, links } = d3Sankey()
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            /*.nodeSort(function (d,e) {
              console.log(d,e,d.value < e.value);return d.value < e.value;
            })*/
            .extent([[1, 1], [this.width - 1, this.height - 25]])({
                nodes: graph.nodes.map(d => Object.assign({}, d)),
                links: graph.links.map(d => Object.assign({}, d))
            })
        console.log(nodes, links);

        this.svg.append('g')
            .attr('stroke', 'white')
            .selectAll('rect')
            .data(nodes.filter(d => !d.photo))
            .enter()
            .append('rect')
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr("height", function (d) { return d.y1 - d.y0; })
            .attr('width', nodeWidth)
            .attr('fill', function (d) { return color[d.name] })
            //.on('click', onNodeClick)
            .style('cursor', 'pointer')

        this.svg.append('g')
            .attr('stroke', 'white')
            .selectAll('rect')
            .data(nodes.filter(d => d.photo))
            .enter()
            .append('image')
            .attr('xlink:href', d => d.photo)
            .attr('x', d => (d.x0 < pointer.width / 2 ? d.x1 - 41 : d.x0 + 41))
            .attr('y', d => ((d.y0 + d.y1) / 2) - 20)
            .attr('width', 40)
            .attr('height', 40);

        const link = this.svg.append('g')
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.5)
            .selectAll('g')
            .data(links)
            .enter()
            .append('g')
            .style('mix-blend-mode', 'multiply')

        const guid = () =>
        {
            const _p8 = (i) =>
            {
                const p = (`${Math.random().toString(16)}000000000`).substr(2, 8)
                return i ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p
            }
            return _p8(false) + _p8(true) + _p8(true) + _p8(false)
        }
        const gradient = link.append('linearGradient')
            .attr('id', (d) =>
            {
                d.uid = guid()
                return d.uid
            })
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', d => d.source.x1)
            .attr('x2', d => d.target.x0)

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', d => color[d.source.name])

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', d => color[d.target.name])

        link.append('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', d => `url(#${d.uid})`)
            .attr('stroke-width', d => Math.max(1, d.width))

        this.svg.append('g')
            .style('font', '9px sans-serif')
            .selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .attr('x', d => (d.x0 < pointer.width / 2 ? d.x1 + 6 : d.x0 - 6))
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => (d.x0 < pointer.width / 2 ? 'start' : 'end'))
            .text(d => `${d.name} (${(d.value)})`)

    }
}
