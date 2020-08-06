import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
declare var $: any;
/* tslint:disable */
@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {

  @Input('episodesData') public episodes;

  seasonSelection = 0; // 0 = all seasons
  graphTypeSelection = 0; // 0 = sum 1 = per season 2 = per episode
  graphStyleSelection = 1; // 0 = line chart 1 = bar chart
  graphDataTypeSelection = 1; // 0 = number of times 1 = average per episode

  colorScale: any;
  xScale: any;
  yScale: any;
  svg: any;
  width: number;
  height: number;
  margin = {
    top: 50,
    right: 30,
    bottom: 80,
    left: 50
  };
  svgName: string;
  parent: any;
  data: any;
  transitionSpeed = 1000;
  minPhotoSize = 10;
  maxPhotoSize = 50;

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

  calculateImageInfo(responsiveSize, maximumSize, bandwidth, pointer) {
    if (pointer.minPhotoSize <= bandwidth) {
      if (bandwidth <= pointer.maxPhotoSize)
        return responsiveSize;
      else
        return maximumSize;
    }
    return 0;
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
      .attr("font-size", "6px")
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("font-size", "6px")
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
      .attr("font-size", "6px")
      .style("text-anchor", "start")
      .attr("transform", "rotate(30)");
  }

  createAxes(yText, xText, tickFormatText, ) {
    var yAxis = d3.axisLeft().scale(this.yScale);
    if (tickFormatText)
      yAxis.tickFormat(d => d + tickFormatText);
    var xAxis = d3.axisBottom(this.xScale);
    if (this.svg.selectAll(".y.axis").empty() && this.svg.selectAll(".x.axis").empty()) {
      this.createYAxis(yAxis, yText);
      this.createXAxis(xAxis, xText);

    } else {
      this.svg.selectAll(".y.axis").transition().duration(this.transitionSpeed).call(yAxis).selectAll("text")
        .attr("font-size", "6px");
      this.svg.selectAll(".x.axis").transition().duration(this.transitionSpeed).call(xAxis).selectAll("text")
        .attr("font-size", "6px")
        .style("text-anchor", "start")
        .attr("transform", "rotate(30)");
    }
  }

  createTooltip(parentObject, label, valueEndText) {
    this.setTooltipText(parentObject, label, valueEndText);
    d3.select(parentObject).attr("class", "tooltipped");
    d3.select(parentObject).attr("data-toggle", "tooltip");
  }

  setTooltipText(parentObject, label, valueEndText) {
    d3.select(parentObject).attr("data-original-title", function (d) {
      var text;
      if (d.episode)
        text = d[label] + ": " + Math.round(d.value) + valueEndText + "<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name;
      else
        text = d[label] + ": " + Math.round(d.value) + valueEndText + "<br/>" + "Season " + d.season;
      return text;
    });
  }

  createBarChart(data, propertyName, yAxisLabel, yAxisSuffix, maxYAxisValue) {
    var pointer = this;
    if (data.length <= 0) {
      this.clearSvg();
      return;
    }
    console.log(data);
    this.svg.selectAll("g.dot").remove();
    this.svg.selectAll(".line").remove();

    this.xScale = this.createScaleBand(data.map(function (d) {
      return d[propertyName];
    }), this.width, this.margin, 0.1);

    this.yScale = d3.scaleLinear()
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);
    
    if(maxYAxisValue) 
      this.yScale.domain([0, maxYAxisValue])
    else
    {
      this.yScale.domain([0, d3.max(data, d => d.value)])
    }

    this.createAxes(yAxisLabel, null, yAxisSuffix);

    var barGroups = this.svg.selectAll("g.layer");
    if (barGroups.empty())
      barGroups = this.svg.append("g").classed('layer', true);
    var rects = barGroups.selectAll("rect").data(data);

    rects
      .enter()
      .append("rect") // Add a new rect for each new elements
      .attr("x", function (d) { return pointer.xScale(d[propertyName]); })
      .attr("y", function (d) { return pointer.height - pointer.margin.bottom; })
      .on("mouseover", function (d, i) { d3.select(this).attr("fill", d.highlightColor); })
      .on("mouseout", function (d, i) { d3.select(this).attr("fill", d.color); })
      .merge(rects) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(this.transitionSpeed)
      .attr("class", "bar")
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("x", function (d) { return pointer.xScale(d[propertyName]); })
      .attr("y", function (d) { return pointer.yScale(Number(d.value)); })
      .attr("width", this.xScale.bandwidth())
      .attr("height", function (d) { return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom; })
      .on('end', function () {

        d3.select(this)
          .attr("data-original-title", function (d) { var text = d[propertyName] + ": " + Math.round(d.value) + yAxisSuffix; return text; });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });


    // If less group in the new dataset, I delete the ones not in use anymore
    rects.exit().remove();

    var imageGroups = this.svg.selectAll("g.img");
    if (imageGroups.empty())
      imageGroups = this.svg.append("g").classed('img', true);
    var images = imageGroups.selectAll("image").data(data);
    var imagePadding = 10;

    images
      .enter()
      .append("image")
      .attr("x", function (d) { return pointer.xScale(d[propertyName]); })
      .attr("y", function (d) { return pointer.height - pointer.margin.bottom - imagePadding; })
      //.on("mouseover", function (d, i) { d3.select(this).attr("fill", d.highlightColor); })
      //.on("mouseout", function (d, i) { d3.select(this).attr("fill", d.color); })
      .merge(images) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(this.transitionSpeed)
      .attr("class", "img")
      .attr("opacity", function (d) { if (d.value > 0 && (pointer.minPhotoSize <= pointer.xScale.bandwidth())) return 1; else return 0 })
      .attr("xlink:href", function (d) { return "../../../assets/images/" + d[propertyName] + ".png"; })
      .attr("width", function (d) { return pointer.calculateImageInfo(pointer.xScale.bandwidth(), pointer.maxPhotoSize, pointer.xScale.bandwidth(), pointer); })
      .attr("height", function (d) { return pointer.calculateImageInfo(pointer.xScale.bandwidth(), pointer.maxPhotoSize, pointer.xScale.bandwidth(), pointer)*1.3; })
      .attr("x", function (d) { return pointer.calculateImageInfo(pointer.xScale(d[propertyName]), pointer.xScale(d[propertyName]) + pointer.xScale.bandwidth() / 2 - pointer.maxPhotoSize / 2, pointer.xScale.bandwidth(), pointer); })
      .attr("y", function (d) { return pointer.calculateImageInfo(pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth(), pointer.yScale(Number(d.value)) - pointer.maxPhotoSize, pointer.xScale.bandwidth(), pointer) - imagePadding; })
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) { var text = d[propertyName] + ": " + Math.round(d.value) + yAxisSuffix; return text; });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });

    images.exit().remove();
  }

  createGroupedBarChart(data) {
    var pointer = this;
    if (data[0].characters.length <= 0) {
      this.clearSvg();
      return;
    }

    this.svg.selectAll("g.dot").remove();
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
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);
    this.yScale.domain([0, 100]);

    this.createAxes("Percentage of appearances", null, "%");

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
        d3.select(this).attr("data-original-title", function (d) {
          var text;
          if (d.episode)
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name;
          else
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "Season " + d.season;
          return text;
        });
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
        d3.select(this).attr("data-original-title", function (d) {
          var text;
          if (d.episode)
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name;
          else
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "Season " + d.season;
          return text;
        });
      });

    bars.exit().remove();



    var imageGroups = this.svg.selectAll("g.img").data(data);
    imageGroups.enter().append("g").classed('img', true);
    imageGroups.exit().remove();
    var images = this.svg.selectAll("g.img").selectAll("image").data(function (d) { return d.characters; });
    images
      .enter()
      .append("image")
      .attr("width", function (d) { return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer); })
      .attr("height", function (d) { return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer); })
      .attr("x", function (d) { return pointer.calculateImageInfo(pointer.xScale(d.name) + x1(d.character) + x1.bandwidth() / 2 - x1.bandwidth() / 2, pointer.xScale(d.name) + x1(d.character) + x1.bandwidth() / 2 - pointer.maxPhotoSize / 2, x1.bandwidth(), pointer); })
      .attr("y", function (d) { return pointer.height - pointer.margin.bottom; })
      .merge(images) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(this.transitionSpeed)
      .attr("class", "img")
      .attr("opacity", function (d) { if (d.value > 0 && (pointer.minPhotoSize <= pointer.xScale.bandwidth())) return 1; else return 0 })
      .attr("xlink:href", function (d) { return "../../../assets/images/" + d.character + ".png"; })
      .attr("width", function (d) { return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer); })
      .attr("height", function (d) { return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer); })
      .attr("x", function (d) { return pointer.calculateImageInfo(pointer.xScale(d.name) + x1(d.character) + x1.bandwidth() / 2 - x1.bandwidth() / 2, pointer.xScale(d.name) + x1(d.character) + x1.bandwidth() / 2 - pointer.maxPhotoSize / 2, x1.bandwidth(), pointer); })
      .attr("y", function (d) { return pointer.calculateImageInfo(pointer.yScale(Number(d.value)) - x1.bandwidth(), pointer.yScale(Number(d.value)) - pointer.maxPhotoSize, x1.bandwidth(), pointer); })
      .on('end', function () {
        d3.select(this).attr("data-original-title", function (d) {
          var text;
          if (d.episode)
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name;
          else
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "Season " + d.season;
          return text;
        });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });

    images.exit().remove();
  }

  createStackedBarChart(data, tooltipLabel) {
    var pointer = this;
    if (data[0].characters[0].length <= 0) {
      this.clearSvg();
      return;
    }

    //this.svg.selectAll("image").remove();
    this.svg.selectAll("g.dot").remove();
    this.svg.selectAll(".line").remove();

 
    var yPoints = []
    for (var i = 0; i < data.length; i++) {
      yPoints[data[i].name] = [];
      for (var j = 0; j < data[i].characters.length; j++) {
        yPoints[data[i].name][data[i].characters[j].name] = [];
        for (var k = 0; k < data[i].characters[j].infos.length; k++) {
          yPoints[data[i].name][data[i].characters[j].name][k] =
            {
              y: data[i].characters[j].infos[k].value
            }
          if (k > 0) {
            yPoints[data[i].name][data[i].characters[j].name][k].y += yPoints[data[i].name][data[i].characters[j].name][k - 1].y
          }
        }
      }
    }

    this.xScale = this.createScaleBand(data.map(function (d) {
      return d.name;
    }), this.width, this.margin, 0.05);

    var x1 = d3.scaleBand()
      .domain(data[0].characters.map(function (d) {
        return d.name;
      }))
      .rangeRound([0, this.xScale.bandwidth()]);

    this.yScale = d3.scaleLinear()
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);
    this.yScale.domain([0, this.calculateHighestValue(data, 'characters', "infos")]);

    this.createAxes("Number of times", null, null);

    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].characters.length; j++) {
        for (var k = 0; k < data[i].characters[j].infos.length; k++) {
          yPoints[data[i].name][data[i].characters[j].name][k].height = (k == 0) ?
            pointer.yScale.range()[0] - pointer.yScale(yPoints[data[i].name][data[i].characters[j].name][k].y) :
            pointer.yScale(yPoints[data[i].name][data[i].characters[j].name][k - 1].y) - pointer.yScale(yPoints[data[i].name][data[i].characters[j].name][k].y)
        }

      }
    }

    var barGroups = this.svg.selectAll("g.layer").data(data);
    barGroups.enter().append("g").classed('layer', true);
    barGroups.exit().remove();

    var bars = this.svg.selectAll("g.layer").selectAll("g")
      .data(function (d) {
        return d.characters;
      });
    bars.enter().append("g").classed('subLayer', true);
    bars.exit().remove();

    var subBars = this.svg.selectAll("g.subLayer").selectAll("rect")
      .data(function (d) {
        return d.infos;
      });

    subBars.enter().append("rect")
      .attr("width", x1.bandwidth())
      .attr("y", function (d) { return pointer.height - pointer.margin.bottom; })
      .attr("x", function (d) { return pointer.xScale(d.name) + x1(d.character); })
      .on("mouseover", function (d, i) { d3.select(this).attr("fill", d.highlightColor); })
      .on("mouseout", function (d, i) { d3.select(this).attr("fill", d.color); })
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("y", function (d, i) {
        return pointer.yScale(yPoints[d.name][d.character][i].y);
      })
      .attr("height", function (d, i) { return yPoints[d.name][d.character][i].height; })
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) {
            var text;
            if (d.episode)
              text = d.label + ": " + Math.round(d.value) + tooltipLabel + "<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name;
            else
              text = d.label + ": " + Math.round(d.value) + tooltipLabel + "<br/>" + d.name;
            return text;
          });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });

    subBars
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("x", function (d) { return pointer.xScale(d.name) + x1(d.character); })
      .attr("y", function (d, i) {
        return pointer.yScale(yPoints[d.name][d.character][i].y);
      })
      .attr("height", function (d, i) { return yPoints[d.name][d.character][i].height; })
      .attr("width", x1.bandwidth())
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) {
            var text;
            if (d.episode)
              text = d.label + ": " + Math.round(d.value) + tooltipLabel + "<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name;
            else
              text = d.label + ": " + Math.round(d.value) + tooltipLabel + "<br/>" + d.name;
            return text;
          });
      });

    subBars.exit().remove();

  }

  calculateHighestValue(data, vectorsName, vectorsName2) {
    var highestValue = 0;
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i][vectorsName].length; j++) {
        var sum = 0;
        if(vectorsName2)
        {
          for (var k = 0; k < data[i][vectorsName][j][vectorsName2].length; k++) {
            sum += data[i][vectorsName][j][vectorsName2][k].value;
          }
        }
        else
          sum = data[i][vectorsName][j].value;
        if (highestValue < sum)
          highestValue = sum;
      }
      if (highestValue < sum)
        highestValue = sum;
    }

    return highestValue;
  }

  createGroupedStackedBarChart(data, imageName, tooltipLabel) {
    var pointer = this;
    if (data[0].characters.length <= 0 || data[0].characters[0].length <= 0) {
      this.clearSvg();
      return;
    }

    //this.svg.selectAll("image").remove();
    this.svg.selectAll("g.dot").remove();
    this.svg.selectAll(".line").remove();


    var yPoints = []
    for (var i = 0; i < data.length; i++) {
      yPoints[data[i].name] = [];
      for (var j = 0; j < data[i].characters.length; j++) {
        yPoints[data[i].name][data[i].characters[j].name] = [];
        for (var k = 0; k < data[i].characters[j].infos.length; k++) {
          yPoints[data[i].name][data[i].characters[j].name][k] =
            {
              y: data[i].characters[j].infos[k].value
            }
          if (k > 0) {
            yPoints[data[i].name][data[i].characters[j].name][k].y += yPoints[data[i].name][data[i].characters[j].name][k - 1].y
          }
        }
      }
    }

    this.xScale = this.createScaleBand(data.map(function (d) {
      return d.name;
    }), this.width, this.margin, 0.05);

    var x1 = d3.scaleBand()
      .domain(data[0].characters.map(function (d) {
        return d.name;
      }))
      .rangeRound([0, this.xScale.bandwidth()]);

    this.yScale = d3.scaleLinear()
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);
    this.yScale.domain([0, this.calculateHighestValue(data, 'characters', "infos")]);

    this.createAxes("Number of times", null, null);

    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].characters.length; j++) {
        for (var k = 0; k < data[i].characters[j].infos.length; k++) {
          yPoints[data[i].name][data[i].characters[j].name][k].height = (k == 0) ?
            pointer.yScale.range()[0] - pointer.yScale(yPoints[data[i].name][data[i].characters[j].name][k].y) :
            pointer.yScale(yPoints[data[i].name][data[i].characters[j].name][k - 1].y) - pointer.yScale(yPoints[data[i].name][data[i].characters[j].name][k].y)
        }

      }
    }

    var barGroups = this.svg.selectAll("g.layer").data(data);
    barGroups.enter().append("g").classed('layer', true);
    barGroups.exit().remove();

    var bars = this.svg.selectAll("g.layer").selectAll("g")
      .data(function (d) {
        return d.characters;
      });
    bars.enter().append("g").classed('subLayer', true);
    bars.exit().remove();

    var subBars = this.svg.selectAll("g.subLayer").selectAll("rect")
      .data(function (d) {
        return d.infos;
      });

    subBars.enter().append("rect")
      .attr("width", x1.bandwidth())
      .attr("y", function (d) { return pointer.height - pointer.margin.bottom; })
      .attr("x", function (d) { return pointer.xScale(d.name) + x1(d.character); })
      .on("mouseover", function (d, i) { d3.select(this).attr("fill", d.highlightColor); })
      .on("mouseout", function (d, i) { d3.select(this).attr("fill", d.color); })
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("y", function (d, i) {
        return pointer.yScale(yPoints[d.name][d.character][i].y);
      })
      .attr("height", function (d, i) { return yPoints[d.name][d.character][i].height; })
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) {
            var text;
            if (d.episode)
              text = d.label + ": " + Math.round(d.value) + tooltipLabel + "<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name;
            else
              text = d.label + ": " + Math.round(d.value) + tooltipLabel + "<br/>" + d.name;
            return text;
          });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });

    subBars
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("x", function (d) { return pointer.xScale(d.name) + x1(d.character); })
      .attr("y", function (d, i) {
        return pointer.yScale(yPoints[d.name][d.character][i].y);
      })
      .attr("height", function (d, i) { return yPoints[d.name][d.character][i].height; })
      .attr("width", x1.bandwidth())
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) {
            var text;
            if (d.episode)
              text = d.label + ": " + Math.round(d.value) + tooltipLabel + "<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name;
            else
              text = d.label + ": " + Math.round(d.value) + tooltipLabel + "<br/>" + d.name;
            return text;
          });
      });

    subBars.exit().remove();

    if (imageName) {
      var imageGroups = this.svg.selectAll("g.img").data(data);
      imageGroups.enter().append("g").classed('img', true);
      imageGroups.exit().remove();
      var images = this.svg.selectAll("g.img").selectAll("image").data(function (d) { return d.characters; });

      images
        .enter()
        .append("image")
        .attr("width", function (d) { return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer); })
        .attr("height", function (d) { return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer); })
        .attr("x", function (d) { return pointer.calculateImageInfo(pointer.xScale(d.parent) + x1(d.name) + x1.bandwidth() / 2 - x1.bandwidth() / 2, pointer.xScale(d.parent) + x1(d.name) + x1.bandwidth() / 2 - pointer.maxPhotoSize / 2, x1.bandwidth(), pointer); })
        .attr("y", function (d) { return pointer.height - pointer.margin.bottom; })
        .merge(images) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(this.transitionSpeed)
        .attr("class", "img")
        .attr("xlink:href", function (d) { return "../../../assets/images/" + d.name + imageName + ".png"; })
        .attr("opacity", function (d) { if (yPoints[d.parent][d.name][yPoints[d.parent][d.name].length - 1].y > 0 && (pointer.minPhotoSize <= pointer.xScale.bandwidth())) return 1; else return 0 })
        .attr("width", function (d) { return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer); })
        .attr("height", function (d) { return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer); })
        .attr("x", function (d) { return pointer.calculateImageInfo(pointer.xScale(d.parent) + x1(d.name) + x1.bandwidth() / 2 - x1.bandwidth() / 2, pointer.xScale(d.parent) + x1(d.name) + x1.bandwidth() / 2 - pointer.maxPhotoSize / 2, x1.bandwidth(), pointer); })
        .attr("y", function (d) { return pointer.calculateImageInfo(pointer.yScale(yPoints[d.parent][d.name][yPoints[d.parent][d.name].length - 1].y) - x1.bandwidth(), pointer.yScale(yPoints[d.parent][d.name][yPoints[d.parent][d.name].length - 1].y) - pointer.maxPhotoSize, x1.bandwidth(), pointer); })
        ;

      images.exit().remove();
    }

  }

  createLineChart(data, isOverlapping) {
    var pointer = this;
    if (data.length <= 0) {
      this.clearSvg();
      return;
    }
    if(!isOverlapping)
    {
      this.svg.selectAll("image").remove();
      this.svg.selectAll("rect").remove();
    }
    
    this.xScale = this.createScaleBand(data[0].episodes.map(function (d) {
      return d.name;
    }), this.width, this.margin, 0);

    this.yScale = d3.scaleLinear()
      .range([this.height - this.margin.bottom, this.margin.top]);
    this.yScale.domain([0, 100]);

    var line2 = d3.line()
      .x(function (d, i) { return 0; }) // set the x values for the line generator
      .y(function (d) { return 0 }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line = d3.line()
      .x(function (d, i) { return pointer.xScale(d.name) + pointer.xScale.bandwidth() / 2; }) // set the x values for the line generator
      .y(function (d) { return pointer.yScale(d.value); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    this.createAxes("Percentage of appearances", null, "%");

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

    var circleGroups = this.svg.selectAll("g.dot").data(data);
    circleGroups.enter().append("g").classed('dot', true);
    circleGroups.exit().remove();

    var circles = this.svg.selectAll("g.dot").selectAll("circle")
      .data(function (d) { return d.episodes; });

    circles.enter().append("circle")
      .attr("class", "dot") // Assign a class for styling
      .style("stroke", "white")
      .attr("r", 2)
      .attr("cx", function (d, i) { return Number(pointer.xScale(d.name) + pointer.xScale.bandwidth() / 2); })
      .attr("cy", function (d) { return pointer.height - pointer.margin.bottom })
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("cx", function (d, i) { return Number(pointer.xScale(d.name) + pointer.xScale.bandwidth() / 2); })
      .attr("cy", function (d) { return pointer.yScale(d.value) })
      .on('end', function () {
        pointer.createTooltip(this,'character', "%");
      });

    circles
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("cx", function (d, i) { return Number(pointer.xScale(d.name) + pointer.xScale.bandwidth() / 2); })
      .attr("cy", function (d) { return pointer.yScale(d.value) })
      .attr("r", 2)
      .on('end', function () {
        pointer.setTooltipText(this,'character', "%");
      });

    circles.exit().remove();

  }

  createOverlappingLineChart(data)
  {
    var pointer = this;
    if (data.length <= 0) {
      this.clearSvg();
      return;
    }
    this.svg.selectAll("image").remove();
    this.xScale = this.createScaleBand(data[0].episodes.map(function (d) {
      return d.name;
    }), this.width, this.margin, 0);

    this.yScale = d3.scaleLinear()
      .range([this.height - this.margin.bottom, this.margin.top]);
    this.yScale.domain([0, this.calculateHighestValue(data, 'episodes', null)]);

    var line2 = d3.line()
      .x(function (d, i) { return 0; }) // set the x values for the line generator
      .y(function (d) { return 0 }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    var line = d3.line()
      .x(function (d, i) { return pointer.xScale(d.name) + pointer.xScale.bandwidth() / 2; }) // set the x values for the line generator
      .y(function (d) { return pointer.yScale(d.value); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    //this.createAxes("Percentage of appearances", null, "%");

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
      .attr("d", function (d) {console.log(d); return line(d.episodes) })
      .attr("stroke-dashoffset", 0);

    lines
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("stroke", d.color) })
      .attr("d", function (d) { return line(d.episodes) });

    lines.exit().remove();

    var circleGroups = this.svg.selectAll("g.dot").data(data);
    circleGroups.enter().append("g").classed('dot', true);
    circleGroups.exit().remove();

    var circles = this.svg.selectAll("g.dot").selectAll("circle")
      .data(function (d) { return d.episodes; });

    circles.enter().append("circle")
      .attr("class", "dot") // Assign a class for styling
      .style("stroke", "white")
      .attr("r", 2)
      .attr("cx", function (d, i) { return Number(pointer.xScale(d.name) + pointer.xScale.bandwidth() / 2); })
      .attr("cy", function (d) { return pointer.height - pointer.margin.bottom })
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("cx", function (d, i) { return Number(pointer.xScale(d.name) + pointer.xScale.bandwidth() / 2); })
      .attr("cy", function (d) { return pointer.yScale(d.value) })
      .on('end', function () {
        pointer.createTooltip(this,'character', "%");
      });

    circles
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("cx", function (d, i) { return Number(pointer.xScale(d.name) + pointer.xScale.bandwidth() / 2); })
      .attr("cy", function (d) { return pointer.yScale(d.value) })
      .attr("r", 2)
      .on('end', function () {
        pointer.setTooltipText(this,'character', "%");
      });


    circles.exit().remove();
  }

  createSankeyChart(data, color) {
    var pointer = this;
    var nodeWidth = 25;
    var nodePadding = 3;
    var graph = { nodes: data[1], links: data[0] };
    this.clearSvg();
    var nodeMap = {};
    graph.nodes.forEach(function (x, i) { nodeMap[x.name] = i; });
    graph.links = graph.links.map(function (x) {
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

    const guid = () => {
      const _p8 = (i) => {
        const p = (`${Math.random().toString(16)}000000000`).substr(2, 8)
        return i ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p
      }
      return _p8(false) + _p8(true) + _p8(true) + _p8(false)
    }
    const gradient = link.append('linearGradient')
      .attr('id', (d) => {
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

  dragstarted(d, pointer) {
  }

  dragged(d) {
    console.log(d);
    d.x0 = d3.event.x;
    d.y0 = d3.event.y;
  }

  dragended(d, pointer) {

  }

  createSankeyChartv1(data, color) {
    var pointer = this;
    var nodeWidth = 25;
    var nodePadding = 3;
    var graph = { nodes: data[1], links: data[0] };
    this.clearSvg();
    var nodeMap = {};
    graph.nodes.forEach(function (x, i) { nodeMap[x.name] = i; });
    graph.links = graph.links.map(function (x) {
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

    const guid = () => {
      const _p8 = (i) => {
        const p = (`${Math.random().toString(16)}000000000`).substr(2, 8)
        return i ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p
      }
      return _p8(false) + _p8(true) + _p8(true) + _p8(false)
    }
    const gradient = link.append('linearGradient')
      .attr('id', (d) => {
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
