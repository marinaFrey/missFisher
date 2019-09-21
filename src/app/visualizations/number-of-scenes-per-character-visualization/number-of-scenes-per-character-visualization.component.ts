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
  seasonSelection = 0; // 0 = all seasons
  graphTypeSelection = 0; // 0 = sum 1 = per season 2 = per episode
  graphStyleSelection = 1; // 0 = line chart 1 = bar chart
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
    super("#viz", 500, 300);
  }

  ngOnInit() {
    this.create();
  }

  create() {
    var pointer = this;
    if (document.querySelector(this.svgName) != null) {
      this.setSvg();

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

    //this.clearSvg();

    switch (this.graphTypeSelection) {
      case this.TOTAL:
        this.parseTotalData();
        this.createBarChart(this.parsedData);
        break;

      case this.PER_SEASON:
        this.parseSeasonData();
        if (this.graphStyleSelection == this.BAR_CHART)
          this.createGroupedBarChart(this.parsedData);
        if (this.graphStyleSelection == this.LINE_CHART)
        {
          this.parseLineData();
          this.createLineChart(this.parsedData);
        }
        break;

      case this.PER_EPISODE:
        this.parseEpisodicData();
        if (this.graphStyleSelection == this.BAR_CHART)
        this.createGroupedBarChart(this.parsedData);
        if (this.graphStyleSelection == this.LINE_CHART)
        {
          this.parseLineData();
          this.createLineChart(this.parsedData);
        }
        break;

    }

  }

  updateVisualization() {

    switch (this.graphTypeSelection) {
      case this.TOTAL:
        this.parseTotalData();
        this.createBarChart(this.parsedData);
        break;

      case this.PER_SEASON:
        this.parseSeasonData();
        if (this.graphStyleSelection == this.BAR_CHART)
        this.createGroupedBarChart(this.parsedData);  
        if (this.graphStyleSelection == this.LINE_CHART)
        {
          this.parseLineData();
          this.createLineChart(this.parsedData);
        }
        break;

      case this.PER_EPISODE:
        this.parseEpisodicData();
        if (this.graphStyleSelection == this.BAR_CHART)
        this.createGroupedBarChart(this.parsedData);
        if (this.graphStyleSelection == this.LINE_CHART)
        {
          this.parseLineData();
          this.createLineChart(this.parsedData);
        }
        break;

    }
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
      item.value = Math.round(item.value);
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
          value: Math.round(item.value),
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
            name:  "Season " + this.episodes[i].season,
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
          value: Math.round((this.episodes[i].scenesPerCharacter[j].value * 100) / this.episodes[i].totalNumberOfScenes),
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
