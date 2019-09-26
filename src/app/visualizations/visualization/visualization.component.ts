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
  margin = {
    top: 10,
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

  calculateImageInfo(responsiveSize, maximumSize, bandwidth, pointer)
  {
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
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);

    this.createAxes("Percentage of appearances", null, "%");

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

    var imageGroups = this.svg.selectAll("g.img");
    if (imageGroups.empty())
      imageGroups = this.svg.append("g").classed('img', true);
    var images = imageGroups.selectAll("image").data(data);

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
      .attr("opacity", function (d) { if (d.value > 0 && (pointer.minPhotoSize <= pointer.xScale.bandwidth())) return 1; else return 0 })
      .attr("xlink:href", function (d) { return "../../../assets/images/" + d.character + ".png"; })
      .attr("width", function (d) {return pointer.calculateImageInfo(pointer.xScale.bandwidth(), pointer.maxPhotoSize, pointer.xScale.bandwidth(), pointer);})
      .attr("height", function (d) {return pointer.calculateImageInfo(pointer.xScale.bandwidth(), pointer.maxPhotoSize, pointer.xScale.bandwidth(), pointer);})
      .attr("x", function (d) {return pointer.calculateImageInfo(pointer.xScale(d.character), pointer.xScale(d.character) + pointer.xScale.bandwidth() / 2 - pointer.maxPhotoSize / 2, pointer.xScale.bandwidth(), pointer);})
      .attr("y", function (d) {return pointer.calculateImageInfo(pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth(), pointer.yScale(Number(d.value)) - pointer.maxPhotoSize, pointer.xScale.bandwidth(), pointer);})
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) { var text = d.character + ": " + Math.round(d.value) + "%"; return text; });
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
          if(d.episode)
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
          if(d.episode)
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
      .attr("width", function (d) {return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer);})
      .attr("height", function (d) {return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer);})
      .attr("x", function (d) {return pointer.calculateImageInfo(pointer.xScale(d.name) + x1(d.character) + x1.bandwidth() / 2 - x1.bandwidth() / 2, pointer.xScale(d.name) + x1(d.character) + x1.bandwidth() / 2 - pointer.maxPhotoSize / 2, x1.bandwidth(), pointer);})
      .attr("y", function (d) {return pointer.height - pointer.margin.bottom;})
      .merge(images) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(this.transitionSpeed)
      .attr("class", "img")
      //.attr("opacity", function (d) {if (d.value > 0 && x1.bandwidth() >= pointer.minPhotoSize) return 1; else return 0})
      .attr("xlink:href", function (d) { return "../../../assets/images/" + d.character + ".png"; })
      .attr("width", function (d) {return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer);})
      .attr("height", function (d) {return pointer.calculateImageInfo(x1.bandwidth(), pointer.maxPhotoSize, x1.bandwidth(), pointer);})
      .attr("x", function (d) {return pointer.calculateImageInfo(pointer.xScale(d.name) + x1(d.character) + x1.bandwidth() / 2 - x1.bandwidth() / 2, pointer.xScale(d.name) + x1(d.character) + x1.bandwidth() / 2 - pointer.maxPhotoSize / 2, x1.bandwidth(), pointer);})
      .attr("y", function (d) {return pointer.calculateImageInfo(pointer.yScale(Number(d.value)) - x1.bandwidth(), pointer.yScale(Number(d.value)) - pointer.maxPhotoSize, x1.bandwidth(), pointer);})
      .on('end', function () {
          d3.select(this).attr("data-original-title", function (d) { 
            var text;
            if(d.episode)
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

  createStackedBarChart(data) {

  }

  calculateHighestValue(data, vectorsName) {
    var highestValue = 0;
    for (var i = 0; i < data.length; i++) {
      var sum = 0;
      var character = "";
      for (var j = 0; j < data[i][vectorsName].length; j++) {
        if (character == data[i][vectorsName].character)
          sum += data[i][vectorsName][j].value;
        else {
          if (highestValue < sum)
            highestValue = sum;
          sum = 0;
          character = data[i][vectorsName].character
        }
      }
      if (highestValue < sum)
        highestValue = sum;
    }
    return highestValue;
  }

  createGroupedStackedBarChart(data) {
    var pointer = this;
    if (data[0].characters[0].length <= 0) {
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
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);
    this.yScale.domain([0, this.calculateHighestValue(data, 'characters')]);

    this.createAxes("Number of times", null, null);

    var subgroups = [];
    for (var i = 0; i < data[0].characters.length; i++)
      subgroups.push(data[0].characters[i].label);

    var stackedData = d3.stack().keys(subgroups)(data)

    var barGroups = this.svg.selectAll("g.layer").data(data);
    barGroups.enter().append("g").classed('layer', true);
    barGroups.exit().remove();

    var bars = this.svg.selectAll("g.layer").selectAll("rect")
      .data(function (d) {
        return d.characters;
      });

    var stackSoFar = [];
    var xDomain = this.xScale.domain();
    var x1Domain = x1.domain();
    for (var i = 0; i < xDomain.length; i++) {
      stackSoFar[xDomain[i]] = [];
      for (var j = 0; j < x1Domain.length; j++)
        stackSoFar[xDomain[i]][x1Domain[j]] = 0;
    }

    bars.enter().append("rect")
      //.filter(function(d){ return d.value > 0;})
      .attr("width", x1.bandwidth())
      .attr("y", function (d) { return pointer.height - pointer.margin.bottom; })
      .attr("x", function (d) { return pointer.xScale(d.name) + x1(d.character); })
      .on("mouseover", function (d, i) { d3.select(this).attr("fill", d.highlightColor); })
      .on("mouseout", function (d, i) { d3.select(this).attr("fill", d.color); })
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("y", function (d) {
        stackSoFar[d.name][d.character] += d.value;
        return pointer.yScale(stackSoFar[d.name][d.character]);
      })
      .attr("height", function (d) { return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom; })
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) { var text = d.label + ": " + Math.round(d.value) + " time(s)<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name; return text; });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });

    bars
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("x", function (d) { return pointer.xScale(d.name) + x1(d.character); })
      .attr("y", function (d) {
        stackSoFar[d.name][d.character] += d.value;
        return pointer.yScale(stackSoFar[d.name][d.character]);
      })
      .attr("width", x1.bandwidth())
      .attr("height", function (d) { return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom; })
      .on('end', function () {
        d3.select(this)
          .attr("data-original-title", function (d) { var text = d.label + ": " + Math.round(d.value) + " time(s)<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name; return text; });
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
      .x(function (d, i) { return pointer.xScale(d.name) + pointer.xScale.bandwidth() /2; }) // set the x values for the line generator
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
      .attr("cx", function (d, i) {return Number(pointer.xScale(d.name)+ pointer.xScale.bandwidth() /2); })
      .attr("cy", function (d) { return pointer.height - pointer.margin.bottom })
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("cx", function (d, i) {return Number(pointer.xScale(d.name)+ pointer.xScale.bandwidth() /2);  })
      .attr("cy", function (d) { return pointer.yScale(d.value) })

      .on('end', function () {
        d3.select(this).attr("data-original-title", function (d) { 
          var text;
          if(d.episode)
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name; 
          else
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "Season " + d.season; 
          return text; 
        });
        d3.select(this).attr("class", "tooltipped");
        d3.select(this).attr("data-toggle", "tooltip");
      });

    circles
      .transition().duration(this.transitionSpeed)
      .on('start', function (d) { d3.select(this).attr("fill", d.color) })
      .attr("cx", function (d, i) { return Number(pointer.xScale(d.name)+ pointer.xScale.bandwidth() /2); })
      .attr("cy", function (d) { return pointer.yScale(d.value) })
      .attr("r", 2)
      .on('end', function () {
        d3.select(this).attr("data-original-title", function (d) { 
          var text;
          if(d.episode)
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "S" + d.season + "E" + d.episode + ": " + d.name; 
          else
            text = d.character + ": " + Math.round(d.value) + "%<br/>" + "Season " + d.season; 
          return text; 
        });
      });


    circles.exit().remove();

  }

}
