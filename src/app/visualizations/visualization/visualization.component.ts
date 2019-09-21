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
  transitionSpeed = 1000;

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

  highlightLine(d, c) {
    d3.selectAll(".line").attr("opacity", 0.3);
    d3.selectAll("#" + d.character.replace(/\s/g, '')).attr("stroke-width", 3).attr("opacity", 1);
    d3.selectAll("circle").attr("opacity", 0.3);
    d3.selectAll(c).attr("fill", d.highlightColor).attr("opacity", 1);
  }

  unhighlightLine(d, c) {
    d3.selectAll(c).attr("fill", d.color);
    d3.selectAll(".line").attr("opacity", 1);
    d3.selectAll("circle").attr("opacity", 1);
    d3.selectAll("#" + d.character.replace(/\s/g, '')).attr("stroke-width", 2).attr("opacity", 1);
  }

  createYAxis(yAxis, text) {
    this.svg.selectAll(".y.axis").remove();
    this.svg.append("g")
      .attr("transform", "translate(" + (this.margin.left / 2 + 10) + ",0)")
      .attr("class", "y axis").call(yAxis)
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("font-size", "8px")
      .attr("text-anchor", "end")
      .text(text);
  }

  createXAxis(xAxis, text) {
    this.svg.selectAll(".x.axis").remove();
    this.svg.append("g")
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .attr("class", "x axis")
      .call(xAxis)
      .selectAll("text")
      .attr("font-size", "8px")
      .style("text-anchor", "start")
      .attr("transform", "rotate(30)");
  }

  createAxes(yText, xText) {
    var yAxis = d3.axisLeft().scale(this.yScale).tickFormat(d => d + "%");
    var xAxis = d3.axisBottom(this.xScale);
    if (this.svg.selectAll(".y.axis").empty() && this.svg.selectAll(".x.axis").empty()) {
      this.createYAxis(yAxis, yText);
      this.createXAxis(xAxis, xText);

    } else {
      this.svg.selectAll(".y.axis").transition().duration(this.transitionSpeed).call(yAxis).selectAll("text").attr("font-size", "8px");
      this.svg.selectAll(".x.axis").transition().duration(this.transitionSpeed).call(xAxis).selectAll("text")
        .attr("font-size", "8px")
        .style("text-anchor", "start")
        .attr("transform", "rotate(30)");
    }
  }

  createBarChart(data) {
    var pointer = this;
    if (data.length <= 0) {
      this.clearSvg();
      return;
    }

    this.svg.selectAll("g.circles").remove();
    this.svg.selectAll(".line").remove();

    this.xScale = this.createScaleBand(data.map(function (d) {
      return d.character;
    }), this.width, this.margin, 0.1);

    this.yScale = d3.scaleLinear()
      .domain([0, 100])
      .rangeRound([this.height - this.margin.bottom, this.margin.bottom]);

    this.createAxes("Percentage of screen time", null);

    var barGroups = this.svg.selectAll("g.layer");
    if (barGroups.empty())
      barGroups = this.svg.append("g").classed('layer', true);
    var rects = barGroups.selectAll("rect").data(data);

    rects
      .enter()
      .append("rect") // Add a new rect for each new elements
      .attr("x", function (d) { return pointer.xScale(d.character); })
      .attr("y", function (d) { return pointer.height - pointer.margin.bottom; })
      .on("mouseover", function (d, i) { d3.select(this).attr("fill", d.highlightColor); })
      .on("mouseout", function (d, i) { d3.select(this).attr("fill", d.color); })
      .merge(rects) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(this.transitionSpeed)
      .attr("class", "bar")
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("x", function (d) { return pointer.xScale(d.character); })
      .attr("y", function (d) { return pointer.yScale(Number(d.value)); })
      .attr("width", this.xScale.bandwidth())
      .attr("height", function (d) { return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom; })
      .on('end', function () {

        d3.select(this)
          .attr("data-original-title", function (d) { var text = d.character + ": " + Math.round(d.value) + "%"; return text; });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });


    // If less group in the new dataset, I delete the ones not in use anymore
    rects.exit().remove();

    var images = this.svg.selectAll("image").data(data);

    images
      .enter()
      .append("image")
      .attr("x", function (d) { return pointer.xScale(d.character); })
      .attr("y", function (d) { return pointer.height - pointer.margin.bottom; })
      //.on("mouseover", function (d, i) { d3.select(this).attr("fill", d.highlightColor); })
      //.on("mouseout", function (d, i) { d3.select(this).attr("fill", d.color); })
      .merge(images) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(this.transitionSpeed)
      .attr("class", "img")
      .attr("opacity", function(d){ if(d.value > 0) return 1; else return 0 })
      .attr("xlink:href", function (d) { return "../../../assets/images/" + d.character + ".png"; })
      .attr("width", function (d) {
        if ((pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth()) > 0)
          return pointer.xScale.bandwidth();
        else
          return pointer.yScale(Number(d.value));
      })
      .attr("height", function (d) {
        if ((pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth()) > 0)
          return pointer.xScale.bandwidth();
        else
          return pointer.yScale(Number(d.value));
      })
      .attr("x", function (d) {
        if ((pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth()) > 0)
          return pointer.xScale(d.character);
        else
          return pointer.xScale(d.character) + pointer.xScale.bandwidth() / 2 - pointer.yScale(Number(d.value)) / 2;
      })
      .attr("y", function (d) {
        if ((pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth()) > 0)
          return pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth();
        else
          return 0;
      }).on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) { var text = d.character + ": " + Math.round(d.value) + "%"; return text; });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });;

    images.exit().remove();
  }

  createGroupedBarChart(data) {
    var pointer = this;
    if (data[0].characters.length <= 0) {
      this.clearSvg();
      return;
    }

    this.svg.selectAll("image").remove();
    this.svg.selectAll("g.circles").remove();
    this.svg.selectAll(".line").remove();

    this.xScale = this.createScaleBand(data.map(function (d) {
      return d.name;
    }), this.width, this.margin, 0.05);

    var x1 = d3.scaleBand()
      .padding(0.005)
      .domain(data[0].characters.map(function (d) {
        return d.character;
      }))
      .rangeRound([0, this.xScale.bandwidth()]);

    this.yScale = d3.scaleLinear()
      .rangeRound([this.height - this.margin.bottom, this.margin.bottom]);
    this.yScale.domain([0, 100]);

    this.createAxes("Percentage of screen time", null);

    var barGroups = this.svg.selectAll("g.layer").data(data);
    barGroups.enter().append("g").classed('layer', true);
    barGroups.exit().remove();

    var bars = this.svg.selectAll("g.layer").selectAll("rect")
      .data(function (d) {
        return d.characters;
      });

    bars.enter().append("rect")
      .attr("width", x1.bandwidth())
      .attr("y", function (d) { return pointer.height - pointer.margin.bottom; })
      .attr("x", function (d) { return pointer.xScale(d.name) + x1(d.character); })
      .on("mouseover", function (d, i) { d3.select(this).attr("fill", d.highlightColor); })
      .on("mouseout", function (d, i) { d3.select(this).attr("fill", d.color); })
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("y", function (d) { return pointer.yScale(d.value); })
      .attr("height", function (d) { return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom; })
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) { var text = d.character + ": " + Math.round(d.value) + "%<br/>" + "Season " + d.season; return text; });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });

    bars
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("x", function (d) { return pointer.xScale(d.name) + x1(d.character); })
      .attr("y", function (d) { return pointer.yScale(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function (d) { return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom; })
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) { var text = d.character + ": " + Math.round(d.value) + "%<br/>" + "Season " + d.season; return text; });
      });

    bars.exit().remove();
  }

  createLineChart(data) {
    var pointer = this;
    if (data.length <= 0) {
      this.clearSvg();
      return;
    }
    this.svg.selectAll("image").remove();
    this.svg.selectAll("rect").remove();

    this.xScale = d3.scaleLinear()
      .range([this.margin.left, this.width - this.margin.right]);
    this.xScale.domain([0, data[0].episodes.length - 1]);

    this.yScale = d3.scaleLinear()
      .range([this.height - this.margin.bottom, this.margin.bottom]);
    this.yScale.domain([0, 100]);

    var line2 = d3.line()
      .x(function (d, i) { return 0; }) // set the x values for the line generator
      .y(function (d) { return 0 }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line = d3.line()
      .x(function (d, i) { return pointer.xScale(i); }) // set the x values for the line generator
      .y(function (d) { return pointer.yScale(d.value); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    this.createAxes("Percentage of screen time", null);

    var lines = this.svg.selectAll(".line").data(data);

    lines.enter().append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", function (d) { return d.color })
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", function () {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", 0)
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("stroke", d.color) })
      .attr("d", function (d) { return line(d.episodes) })
      .attr("stroke-dashoffset", 0);

    lines
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("stroke", d.color) })
      .attr("d", function (d) { return line(d.episodes) });

    lines.exit().remove();

    var circleGroups = this.svg.selectAll("g.circles").data(data);
    circleGroups.enter().append("g").classed('circles', true);
    circleGroups.exit().remove();

    var circles = this.svg.selectAll("g.circles").selectAll("circle")
      .data(function (d) { return d.episodes; });

    circles.enter().append("circle")
      .attr("class", "dot") // Assign a class for styling
      .style("stroke", "white")
      .attr("r", 2)
      .attr("cx", function (d, i) { return pointer.xScale(i) })
      .attr("cy", function (d) { return pointer.height - pointer.margin.bottom })
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("cx", function (d, i) { return pointer.xScale(i) })
      .attr("cy", function (d) { return pointer.yScale(d.value) })
      
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) { var text = d.character + ": " + Math.round(d.value) + "%<br/>" + "Season " + d.season; return text; });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });

    circles
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("cx", function (d, i) { return pointer.xScale(i) })
      .attr("cy", function (d) { return pointer.yScale(d.value) })
      .attr("r", 2)
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) { var text = d.character + ": " + Math.round(d.value) + "%<br/>" + "Season " + d.season; return text; });
      });


    circles.exit().remove();

  }

}
