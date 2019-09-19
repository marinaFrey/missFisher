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
    this.height = height;
    this.svgName = svgName;
    this.createSvg(svgName, width, height);
    //this.svg = d3.select(this.svgName);

  }

  ngOnInit() {
  }

  createSvg(svgName: string, width: number, height: number) {
    
    this.svg = d3.select(svgName)
      .attr("width", width)
      .attr("height", height);

    this.clearSvg();

    return this.svg;
  }

  clearSvg() {
    this.svg.selectAll("*").remove();
  }

  setSvg() {
    this.svg = d3.select(this.svgName);
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

  
}
