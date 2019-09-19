import { Component, OnInit, Input } from '@angular/core';
import { VisualizationComponent } from '../visualization/visualization.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import * as d3 from "d3";
declare var $: any;

@Component({
  selector: 'app-number-of-scenes-per-character-visualization',
  templateUrl: './number-of-scenes-per-character-visualization.component.html',
  styleUrls: ['./number-of-scenes-per-character-visualization.component.css']
})
export class NumberOfScenesPerCharacterVisualizationComponent extends VisualizationComponent implements OnInit {

  TOTAL = 0;
  PER_SEASON = 1;
  PER_EPISODE = 2;
  LINE_CHART = 0;
  BAR_CHART = 1;

  @Input('episodesData') public episodes;
  parsedData;
  svgName = "#viz";
  seasonSelection = 0; // 0 = all seasons
  graphTypeSelection = 0; // 0 = sum 1 = per season 2 = per episode
  graphStyleSelection = 0; // 0 = line chart 1 = bar chart
  margin = {
    top: 20,
    right: 30,
    bottom: 80,
    left: 50
  };
  charactersInfo = [
    { name: "Phryne", color: "#e25b6fff", hightlight: "#be495aff", isShowing: true },
    { name: "Jack", color: "#4b76e4ff", hightlight: "#415a9eff", isShowing: true },
    { name: "Dot", color: "#f8b76eff", hightlight: "#c68f52ff", isShowing: true },
    { name: "Hugh", color: "#67c5deff", hightlight: "#4b9bb0ff", isShowing: true },
    { name: "Aunt Prudence", color: "#51e6b2ff", hightlight: "#50ac8cff", isShowing: true },
    { name: "Cec and Bert", color: "#86817eff", hightlight: "#685950ff", isShowing: true },
    { name: "Jane", color: "#ff84bfff", hightlight: "#c46090ff", isShowing: true },
    { name: "Mac", color: "#f27f66ff", hightlight: "#bb6a58ff", isShowing: true },
    { name: "Mr Butler", color: "#cda5ffff", hightlight: "#9a7cc1ff", isShowing: true },
    { name: "Hispano Suiza", color: "#9e5b60ff", hightlight: "#6d3a3dff", isShowing: true }
  ];

  constructor() {
    super("#viz", 100, 100);
  }

  ngOnInit() {
    this.create();
  }

  create() {
    var pointer = this;
    if (document.querySelector(this.svgName) != null) {
      this.setSvgSize(1 / 2.3);
      if (this.episodes)
        this.createVisualization();
    }
    else {
      setTimeout(function () {
        pointer.create();
      }, 50);
    }

  }

  createVisualization() {

    this.clearSvg();

    switch (this.graphTypeSelection) {
      case this.TOTAL:
        this.parseTotalData();
        this.createTotalBarGraph();
        break;

      case this.PER_SEASON:
        this.parseSeasonData();
        if (this.graphStyleSelection == this.BAR_CHART)
          this.createGroupedBarGraph();
        if (this.graphStyleSelection == this.LINE_CHART)
          this.createLineGraph();
        break;

      case this.PER_EPISODE:
        this.parseEpisodicData();
        if (this.graphStyleSelection == this.BAR_CHART)
          this.createGroupedBarGraph();
        if (this.graphStyleSelection == this.LINE_CHART)
          this.createLineGraph();
        break;

    }

  }

  updateVisualization() {

    switch (this.graphTypeSelection) {
      case this.TOTAL:
        this.parseTotalData();
        this.updateTotalBarGraph();
        break;

      case this.PER_SEASON:
        this.parseSeasonData();
        if (this.graphStyleSelection == this.BAR_CHART)
          this.updateGroupedBarGraph();
        if (this.graphStyleSelection == this.LINE_CHART)
          this.updateLineGraph();
        break;

      case this.PER_EPISODE:
        this.parseEpisodicData();
        if (this.graphStyleSelection == this.BAR_CHART)
          this.updateGroupedBarGraph();
        if (this.graphStyleSelection == this.LINE_CHART)
          this.updateLineGraph();
        break;

    }
  }

  createTotalBarGraph() {
    var pointer = this;

    this.xScale = this.createScaleBand(this.parsedData.map(function (d) {
      return d.character;
    }), this.width, this.margin, 0.1);

    this.yScale = d3.scaleLinear()
      .rangeRound([this.height - this.margin.bottom, this.margin.bottom]);

    this.yScale.domain([0, 100]);

    //var g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("g")
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(d3.axisBottom(this.xScale))
      .selectAll("text")
      .style("text-anchor", "start")
      //.attr("dx", "-.8em")
      //.attr("dy", ".15em")
      .attr("transform", "rotate(30)");

    this.svg.append("g")
      .attr("transform", "translate(" + (this.margin.left / 2 + 10) + ",0)")
      .call(d3.axisLeft(this.yScale).tickFormat(d => d + "%"))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Percentage of screen time");

    this.svg.selectAll(".bar")
      .data(this.parsedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("class", "tooltipped")
      .attr("data-toggle", "tooltip")
      .attr("title", function (d) { return d.character + ": " + Math.round(d.value) + "%"; })
      .attr("x", function (d) {
        return pointer.xScale(d.character);
      })
      .attr("y", function (d) {
        return pointer.yScale(Number(d.value));
      })
      .attr("width", this.xScale.bandwidth())
      .attr("height", function (d) {
        return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom;
      })
      .attr("fill", function (d) {
        return d.color
      }).on("mouseover", function (d, i) {
        d3.select(this).attr("fill", d.highlightColor);
      })
      .on("mouseout", function (d, i) {
        d3.select(this).attr("fill", d.color);
      });

    this.svg.selectAll("svg")
      .data(this.parsedData)
      .enter()
      //.filter(function (d) { return (pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth()) > 0; })
      .append("png:image")
      .attr("class", "img")
      .attr("class", "tooltipped")
      .attr("data-toggle", "tooltip")
      .attr("title", function (d) { return d.character + ": " + Math.round(d.value) + "%"; })
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
          return pointer.xScale(d.character) + pointer.xScale.bandwidth()/2 - pointer.yScale(Number(d.value))/2;

      })
      .attr("y", function (d) {
        if ((pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth()) > 0)
          return pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth();
        else
          return 0;
      });


  }

  updateTotalBarGraph() {
    var pointer = this;

    d3.select(this.svgName).selectAll("rect")
      .data(this.parsedData).transition().duration(500)
      .attr("y", function (d) {
        return pointer.yScale(Number(d.value));
      })
      .attr("height", function (d) {
        return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom;
      });

    d3.select(this.svgName).selectAll("image.tooltipped")
      .data(this.parsedData).transition().duration(500)
      .attr("y", function (d) {
        //if ((pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom) < pointer.xScale.bandwidth())
        return pointer.yScale(Number(d.value)) - pointer.xScale.bandwidth();
        //else
        //return pointer.yScale(Number(d.value));
      });
  }



  createGroupedBarGraph() {
    var pointer = this;
    console.log(this.parsedData);
    this.clearSvg();
    var x = this.createScaleBand(this.parsedData.map(function (d) {
      return d.name;
    }), this.width, this.margin, 0.05);

    var x1 = d3.scaleBand()
      .padding(0.005)
      .domain(this.parsedData[0].characters.map(function (d) {
        return d.character;
      }))
      .rangeRound([0, x.bandwidth()]);

    this.yScale = d3.scaleLinear()
      .rangeRound([this.height - this.margin.bottom, this.margin.bottom]);

    this.yScale.domain([0, 100]);

    //var g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("g")
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "start")
      //.attr("dx", "-.8em")
      //.attr("dy", ".15em")
      .attr("transform", "rotate(30)");

    this.svg.append("g")
      .attr("transform", "translate(" + (this.margin.left / 2 + 10) + ",0)")
      .call(d3.axisLeft(this.yScale).tickFormat(d => d + "%"))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Percentage of screen time");

    this.svg.selectAll(".barCluster")
      .data(this.parsedData)
      .enter().append("g")
      .attr("class", "barCluster")
      .attr("transform", function (d) { return "translate(" + x(d.name) + ",0)"; })
      .selectAll("rect")
      .data(function (d) { return d.characters })
      .enter().append("rect")
      .filter(function (d) { return d.value != 0; })
      .attr("class", "tooltipped")
      .attr("data-toggle", "tooltip")
      .attr("title", function (d) {
        if (pointer.graphTypeSelection == pointer.PER_EPISODE)
          return d.character + ": " + Math.round(d.value) + "%<br/>" +
            "S" + d.season + "E" + d.episode + ": " + d.name;
        else
          return d.character + ": " + Math.round(d.value) + "%<br/>" +
            "Season " + d.season;
      })
      .attr("x", function (d) {
        return x1(d.character);
      })
      .attr("y", function (d) {
        return pointer.yScale(Number(d.value));
      })
      .attr("width", x1.bandwidth())
      .attr("height", function (d) {
        return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom;
      })
      .attr("fill", function (d) {
        return d.color
      })
      .on("mouseover", function (d, i) {
        d3.select(this).attr("fill", d.highlightColor);
      })
      .on("mouseout", function (d, i) {
        d3.select(this).attr("fill", d.color);
      });
  }

  updateGroupedBarGraph() {
    //this.createGroupedBarGraph();

    var pointer = this;

    d3.select(this.svgName).selectAll(".bar")
      .data(this.parsedData).transition().duration(500)
      .attr("y", function (d) {
        return pointer.yScale(Number(d.value));
      })
      .attr("height", function (d) {
        return pointer.height - pointer.yScale(Number(d.value)) - pointer.margin.bottom;
      });

  }

  createLineGraph() {

    this.parseLineData();
    this.clearSvg();
    var pointer = this;
    this.xScale = d3.scaleLinear()
      .range([this.margin.left, this.width - this.margin.right]);
    this.xScale.domain([0, this.parsedData[0].episodes.length - 1]);
    //this.createScaleLinear([0, this.parsedData[0].episodes.length - 1], this.width, this.margin);

    this.yScale = d3.scaleLinear()
      .range([this.height - this.margin.bottom, this.margin.bottom]);
    this.yScale.domain([0, 100]);

    // 7. d3's line generator
    var line = d3.line()
      .x(function (d, i) { return pointer.xScale(i); }) // set the x values for the line generator
      .y(function (d) { return pointer.yScale(d.value); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    this.svg.append("g")
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(d3.axisBottom(this.xScale))
      .selectAll("text")
      .style("text-anchor", "start")
      //.attr("dx", "-.8em")
      //.attr("dy", ".15em")
      .attr("transform", "rotate(30)");

    this.svg.append("g")
      .attr("transform", "translate(" + (this.margin.left / 2 + 10) + ",0)")
      .call(d3.axisLeft(this.yScale).tickFormat(d => d + "%"))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Percentage of screen time");

    // 9. Append the path, bind the data, and call the line generator 

    for (var i = 0; i < this.parsedData.length; i++) {
      this.svg.append("path")
        .datum(this.parsedData[i].episodes) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling
        .attr("id", this.parsedData[i].character.replace(/\s/g, ''))
        .attr("fill", "none")
        .attr("stroke", function (d) { ; return pointer.parsedData[i].color })
        .attr("stroke-width", 2)
        .attr("d", line); // 11. Calls the line generator 
    }


    // 12. Appends a circle for each datapoint 
    this.svg.selectAll("circle-group")
      .data(this.parsedData).enter()
      .append("g")
      .style("fill", (d, i) => d.color)
      .style("stroke", "white")
      .selectAll("circle")
      .data(d => d.episodes).enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("class", "tooltipped")
      .attr("data-toggle", "tooltip")
      .attr("title", function (d) {
        if (pointer.graphTypeSelection == pointer.PER_EPISODE)
          return d.character + ": " + Math.round(d.value) + "%<br/>" +
            "S" + d.season + "E" + d.episode + ": " + d.name;
        else
          return d.character + ": " + Math.round(d.value) + "%<br/>" +
            "Season " + d.season;
      })
      .attr("cx", function (d, i) { return pointer.xScale(i) })
      .attr("cy", function (d) { return pointer.yScale(d.value) })
      .attr("r", 3)
      .on("mouseover", function (d, i, c) {

        pointer.highlightLine(d, c);
      })
      .on("mouseout", function (d, i, c) {
        pointer.unhighlightLine(d, c);
      });
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

  updateLineGraph() {
    this.createLineGraph();
    /*
    this.parseLineData();
    var line = d3.line()
      .x(function (d, i) { return pointer.xScale(i); }) // set the x values for the line generator
      .y(function (d) { return pointer.yScale(d.value); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line
    var pointer = this;
    for (var i = 0; i < this.parsedData.length; i++) {
      console.log(this.parsedData[i],this.parsedData[i].character);
      d3.select(this.svgName).selectAll("#" + this.parsedData[i].character.replace(/\s/g, ''))
        .data(this.parsedData).transition().duration(500)
        .attr("d", line);;
    }*/
  }

  parseTotalData() {
    var data = [];
    var numberOfEpisodes = 0;
    for (var i = 0; i < this.episodes.length; i++) {
      if ((this.seasonSelection == 0) || (this.episodes[i].season == this.seasonSelection)) {
        data = this.pushTotalCharacterData(data, i);
        numberOfEpisodes++;
      }
    }

    var parsedData = [];
    data.forEach(function (item) {
      parsedData.push(item);
    });

    for (var j = 0; j < parsedData.length; j++) {
      parsedData[j].value = parsedData[j].value / numberOfEpisodes;
    }
    this.parsedData = parsedData;

  }

  parseSeasonData() {
    var data = [];
    var numberOfEpisodesPerSeason = [];
    for (var i = 0; i < this.episodes.length; i++) {
      data = this.pushSeasonCharacterData(data, i);
      if (!numberOfEpisodesPerSeason[this.episodes[i].season - 1])
        numberOfEpisodesPerSeason[this.episodes[i].season - 1] = 0;
      numberOfEpisodesPerSeason[this.episodes[i].season - 1]++;
    }

    var parsedData = [];
    for (var j = 0; j < data.length; j++) {
      parsedData[j] = { name: data[j].name, characters: [] };
      parsedData[j].characters = [];
      data[j].characters.forEach(function (item) {
        parsedData[j]['characters'].push(item);
      });
    }

    for (var j = 0; j < parsedData.length; j++) {
      for (var k = 0; k < parsedData[j].characters.length; k++) {
        parsedData[j].characters[k].value = parsedData[j].characters[k].value / numberOfEpisodesPerSeason[j];
      }
    }
    this.parsedData = parsedData;
  }

  parseEpisodicData() {
    var data = [];
    var numberOfEpisodes = 0;
    for (var i = 0; i < this.episodes.length; i++) {
      if ((this.seasonSelection == 0) || (this.episodes[i].season == this.seasonSelection)) {
        data = this.pushEpisodicCharacterData(data, i, numberOfEpisodes);
        numberOfEpisodes++;
      }
    }

    var parsedData = [];
    for (var j = 0; j < data.length; j++) {
      parsedData[j] = { name: data[j].name, characters: [] };
      parsedData[j].characters = [];
      data[j].characters.forEach(function (item) {
        parsedData[j]['characters'].push(item);
      });
    }

    this.parsedData = parsedData;
  }

  parseLineData() {

    var parsedData = [];
    for (var j = 0; j < this.parsedData.length; j++) {
      //parsedData[j] =  { name: data[j].name, characters: [] };
      //parsedData[j].characters = [];
      this.parsedData[j].characters.forEach(function (item, index) {
        if (!parsedData[index])
          parsedData[index] = { character: item.character, color: item.color, highlightColor: item.highlightColor, episodes: [] };
        parsedData[index]['episodes'].push({
          name: item.name,
          season: item.season,
          episode: item.episode,
          value: item.value,
          character: item.character,
          color: item.color,
          highlightColor: item.highlightColor
        });
      });
    }

    this.parsedData = parsedData;
    console.log(this.parsedData);

  }

  pushTotalCharacterData(data, i) {
    for (var j = 0; j < this.episodes[i].scenesPerCharacter.length; j++) {
      if (this.getCharacterInfo(this.episodes[i].scenesPerCharacter[j].character, "isShowing") == true) {
        if (!data[j]) {
          data[j] = {
            label: this.episodes[i].scenesPerCharacter[j].label,
            value: (this.episodes[i].scenesPerCharacter[j].value * 100) / this.episodes[i].totalNumberOfScenes,
            character: this.episodes[i].scenesPerCharacter[j].character,
            color: this.getCharacterInfo(this.episodes[i].scenesPerCharacter[j].character, "color"),
            highlightColor: this.getCharacterInfo(this.episodes[i].scenesPerCharacter[j].character, "hightlight")
          }
        }
        else {
          data[j].value += (this.episodes[i].scenesPerCharacter[j].value * 100) / this.episodes[i].totalNumberOfScenes;
        }
      }

    }

    return data;
  }

  pushSeasonCharacterData(data, i) {
    if (!data[this.episodes[i].season - 1])
      data[this.episodes[i].season - 1] = { name: "Season " + this.episodes[i].season, characters: [] };

    for (var j = 0; j < this.episodes[i].scenesPerCharacter.length; j++) {
      if (this.getCharacterInfo(this.episodes[i].scenesPerCharacter[j].character, "isShowing") == true) {
        if (!data[this.episodes[i].season - 1].characters[j]) {
          data[this.episodes[i].season - 1].characters[j] = {
            season: this.episodes[i].season,
            label: this.episodes[i].scenesPerCharacter[j].label,
            value: (this.episodes[i].scenesPerCharacter[j].value * 100) / this.episodes[i].totalNumberOfScenes,
            character: this.episodes[i].scenesPerCharacter[j].character,
            color: this.getCharacterInfo(this.episodes[i].scenesPerCharacter[j].character, "color"),
            highlightColor: this.getCharacterInfo(this.episodes[i].scenesPerCharacter[j].character, "hightlight")
          }

        }
        else {
          data[this.episodes[i].season - 1].characters[j].value += (this.episodes[i].scenesPerCharacter[j].value * 100) / this.episodes[i].totalNumberOfScenes;
        }
      }
    }
    return data;
  }

  pushEpisodicCharacterData(data, i, id) {
    data[id] = { name: this.episodes[i].name, characters: [] };

    for (var j = 0; j < this.episodes[i].scenesPerCharacter.length; j++) {
      if (this.getCharacterInfo(this.episodes[i].scenesPerCharacter[j].character, "isShowing") == true) {
        data[id].characters[j] = {
          name: this.episodes[i].name,
          season: this.episodes[i].season,
          episode: this.episodes[i].episode,
          label: this.episodes[i].scenesPerCharacter[j].label,
          value: (this.episodes[i].scenesPerCharacter[j].value * 100) / this.episodes[i].totalNumberOfScenes,
          character: this.episodes[i].scenesPerCharacter[j].character,
          color: this.getCharacterInfo(this.episodes[i].scenesPerCharacter[j].character, "color"),
          highlightColor: this.getCharacterInfo(this.episodes[i].scenesPerCharacter[j].character, "hightlight")
        }
      }

    }
    return data;
  }

  getCharacterInfo(characterName, info) {
    for (var i = 0; i < this.charactersInfo.length; i++) {
      if (this.charactersInfo[i].name == characterName)
        return this.charactersInfo[i][info];
    }
  }

}
