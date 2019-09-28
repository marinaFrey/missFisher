import { Component, OnInit, Input } from '@angular/core';
import { VisualizationComponent } from '../visualization/visualization.component';

@Component({
  selector: 'app-name-calling-visualization',
  templateUrl: './name-calling-visualization.component.html',
  styleUrls: ['./name-calling-visualization.component.css']
})
export class NameCallingVisualizationComponent extends VisualizationComponent implements OnInit {

  TOTAL = 0;
  PER_SEASON = 1;
  PER_EPISODE = 2;

  @Input('episodesData') public episodes;
  parsedData;
  seasonSelection = 0; // 0 = all seasons
  graphTypeSelection = 0; // 0 = sum 1 = per season 2 = per episode
  selectAll = true;

  charactersInfo = [
    { name: "Jack", label: "Jack says '(Miss) Phryne Fisher'", color: "#163075ff", hightlight: "#102252ff", isShowing: true },
    { name: "Jack", label: "Jack says 'Miss Fisher'", color: "#3553a0ff", hightlight: "#284284ff", isShowing: true },
    { name: "Jack", label: "Jack says 'Phryne'", color: "#4b76e4ff", hightlight: "#3b62c7ff", isShowing: true },
    { name: "Phryne", label: "Phryne says 'Detective Inspector Jack Robinson'", color: "#4e252bff", hightlight: "#42171eff", isShowing: true },
    { name: "Phryne", label: "Phryne says 'Inspector (Jack) (Robinson)'", color: "#7c3842ff", hightlight: "#60252eff", isShowing: true },
    { name: "Phryne", label: "Phryne says 'Jack Robinson'", color: "#b74d5cff", hightlight: "#9f4552ff", isShowing: true },
    { name: "Phryne", label: "Phryne says 'Jack'", color: "#e25b6fff", hightlight: "#c14b5dff", isShowing: true }
  ];

  constructor() {
    super("#nameCallingViz", 500, 300);
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

    switch (this.graphTypeSelection) {
      case this.TOTAL:
        this.parseTotalData();
        this.reorderData();
        this.createGroupedStackedBarChart(this.parsedData);
        break;

      case this.PER_SEASON:
        this.parseSeasonData();
        this.reorderData();
        this.createGroupedStackedBarChart(this.parsedData);
        break;

      case this.PER_EPISODE:
        this.parseEpisodicData();
        this.reorderData();
        this.createGroupedStackedBarChart(this.parsedData);
        break;

    }
    

  }

  changeFilterSelection() {
    for (var i = 0; i < this.charactersInfo.length; i++) {
      this.charactersInfo[i].isShowing = this.selectAll;
    }
    this.createVisualization();
  }

  reorderData() {
    var pointer = this;
    var result = [];
    for (var i = 0; i < this.parsedData.length; i++) {
      var result = [];
      this.charactersInfo.forEach(function (key) {
        pointer.parsedData[i].characters.forEach(function (character) {
          if(key.label == character.label)
            result.push(character);
        })
      })
      this.parsedData[i].characters = result;
    }
  }

  parseTotalData() {
    var data = [];
    for (var i = 0; i < this.episodes.length; i++) {
      if ((this.seasonSelection == 0) || (this.episodes[i].season == this.seasonSelection)) {
        data = this.pushTotalCharacterData(data, i);
      }
    }

    var parsedData = [];
    data.forEach(function (item) {
      parsedData.push(item);
    });

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

  pushTotalCharacterData(data, i) {
    if (!data[0])
      data[0] = { name: "Season " + this.episodes[i].season, characters: [] };

    for (var j = 0; j < this.episodes[i].nameCalling.length; j++) {
      if (this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "isShowing") == true) {
        if (!data[0].characters[j]) {
          data[0].characters[j] = {
            name: "Season " + this.episodes[i].season,
            label: this.episodes[i].nameCalling[j].label,
            value: this.episodes[i].nameCalling[j].value,
            character: this.episodes[i].nameCalling[j].character,
            color: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "color"),
            highlightColor: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "hightlight")
          }
        }
        else {
          data[0].characters[j].value += this.episodes[i].nameCalling[j].value;
        }
      }
    }
    return data;
  }

  pushSeasonCharacterData(data, i) {
    if (!data[this.episodes[i].season - 1])
      data[this.episodes[i].season - 1] = { name: "Season " + this.episodes[i].season, characters: [] };

    for (var j = 0; j < this.episodes[i].nameCalling.length; j++) {
      if (this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "isShowing") == true)
      {
        if (!data[this.episodes[i].season - 1].characters[j]) {
          data[this.episodes[i].season - 1].characters[j] = {
            name: "Season " + this.episodes[i].season,
            season: this.episodes[i].season,
            label: this.episodes[i].nameCalling[j].label,
            value: this.episodes[i].nameCalling[j].value,
            character: this.episodes[i].nameCalling[j].character,
            color: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "color"),
            highlightColor: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "hightlight")
          }
        }
        else {
          data[this.episodes[i].season - 1].characters[j].value += this.episodes[i].nameCalling[j].value;
        }
      }
    }
    return data;
  }

  pushEpisodicCharacterData(data, i, id) {
    data[id] = { name: this.episodes[i].name, characters: [] };
    for (var j = 0; j < this.episodes[i].nameCalling.length; j++) {
      if (this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "isShowing") == true)
      {
        data[id].characters[j] = {
          name: this.episodes[i].name,
          season: this.episodes[i].season,
          episode: this.episodes[i].episode,
          label: this.episodes[i].nameCalling[j].label,
          value: this.episodes[i].nameCalling[j].value,
          character: this.episodes[i].nameCalling[j].character,
          color: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "color"),
          highlightColor: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "hightlight")
        }
      }

    }
    return data;
  }

  getCharacterInfo(label, parameter, info) {
    for (var i = 0; i < this.charactersInfo.length; i++) {
      if (this.charactersInfo[i][parameter] == label)
        return this.charactersInfo[i][info];
    }
  }


}
