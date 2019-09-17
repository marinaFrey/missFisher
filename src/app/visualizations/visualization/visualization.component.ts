import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
declare var $: any;

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {

  colorScale: any;
  xScale: any;
  yScale: any;
  svg: any;
  width: number;
  height: number;
  margin;
  tooltip: any;
  svgName: string;
  parent: any;
  data: any;

  constructor(svgName: string, width: number, height: number) {
    this.width = width;
    this.svgName = svgName;
    if ($(svgName).width()) {
      this.width = $(svgName).width();
    }
    this.height = height;
    $(svgName).height(this.height);
    this.createSvg(svgName, width, height);
    this.svg = d3.select(this.svgName);
    this.setTooltip();
  }

  ngOnInit() {
  }

  clearSvg() {
    this.svg.selectAll("*").remove();
  }

  setSvgSize(proportion) {
    if ($(this.svgName).width()) {
      this.width = $(this.svgName).width();
      this.height = this.width * proportion;
      $(this.svgName).height(this.height);
      $(this.svgName).width(this.width);
    }
    this.svg = d3.select(this.svgName);
  }

  setTooltip() {
    this.tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  showTextTooltip(html): void {
    this.tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    this.tooltip.html(html)
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY - 30) + "px");
  }

  hideTooltip() {
    this.tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  }

  createSvg(svgName: string, width: number, height: number) {
    this.svg = d3.select(svgName)
      .attr("width", width)
      .attr("height", height);

    this.clearSvg();

    return this.svg;
  }

  createXScale(domain, width, margin) {
    if (margin.top && margin.bottom) {
      this.xScale = d3.scaleLinear()
        .domain(domain)
        .range([margin.top, width - margin.bottom]);
    }
    else {
      this.xScale = d3.scaleLinear()
        .domain(domain)
        .range([margin, width - margin]);
    }

    return this.xScale;
  }

  createYScale(domain, height, margin) {
    if (margin.top && margin.bottom) {
      this.yScale = d3.scaleLinear()
        .domain(domain)
        .range([margin.top, height - margin.bottom]);
    }
    else {
      this.yScale = d3.scaleLinear()
        .domain(domain)
        .range([margin, height - margin]);
    }


    return this.yScale;
  }

  createScaleLinear(domain, size, margin) {
    if (margin.top && margin.bottom) {
      var scale = d3.scaleLinear()
        .domain(domain)
        .range([margin.top, size - margin.bottom]);
    }
    else {
      var scale = d3.scaleLinear()
        .domain(domain)
        .range([margin, size - margin]);
    }
    return scale;
  }

  createScaleBand(domain, size, margin, padding) {
    if (margin.top && margin.bottom) {
      var scale = d3.scaleBand()
        .domain(domain)
        .rangeRound([margin.left, size - margin.right]) 
        .padding(padding);
    }
    else {
      var scale = d3.scaleBand()
        .domain(domain)
        .rangeRound([margin, size - margin]) 
        .padding(padding);
    }
    return scale;
  }

  getXScale() { return this.xScale; }

  setXScale(scale: any) { this.xScale = scale; }

  getYScale() { return this.yScale; }

  setYScale(scale: any) { this.yScale = scale; }

  getColorScale() { return this.colorScale; }

  setColorScale(scale: any) { this.colorScale = scale; }

  getSvg() { return this.svg; }

  setSvg(scale: any) { this.svg = scale; }

  getHeight() { return this.height; }

  getWidth() { return this.width; }


}
