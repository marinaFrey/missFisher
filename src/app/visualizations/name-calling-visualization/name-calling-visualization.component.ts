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
  PER_NUMBER_OF_EPISODES = 0;
  PER_PERCENTAGE_OF_EPISODES = 1;

  @Input('episodesData') public episodes;
  parsedData;
  seasonSelection = 0; // 0 = all seasons
  graphTypeSelection = 0; // 0 = sum 1 = per season 2 = per episode
  graphDataTypeSelection = 1;
  selectAll = true;

  charactersInfo = [
    {
      name: "Jack", infos: [
        { name: "Jack", label: "Jack says '(Miss) Phryne Fisher'", color: "#163075ff", hightlight: "#102252ff", isShowing: true },
        { name: "Jack", label: "Jack says 'Miss Fisher'", color: "#3553a0ff", hightlight: "#284284ff", isShowing: true },
        { name: "Jack", label: "Jack says 'Phryne'", color: "#4b76e4ff", hightlight: "#3b62c7ff", isShowing: true }
      ]
    },
    {
      name: "Phryne", infos: [
        { name: "Phryne", label: "Phryne says 'Detective Inspector Jack Robinson'", color: "#4e252bff", hightlight: "#42171eff", isShowing: true },
        { name: "Phryne", label: "Phryne says 'Inspector (Jack) (Robinson)'", color: "#7c3842ff", hightlight: "#60252eff", isShowing: true },
        { name: "Phryne", label: "Phryne says 'Jack Robinson'", color: "#b74d5cff", hightlight: "#9f4552ff", isShowing: true },
        { name: "Phryne", label: "Phryne says 'Jack'", color: "#e25b6fff", hightlight: "#c14b5dff", isShowing: true }
      ]
    }

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
        this.createGroupedStackedBarChart(this.parsedData, "Calling", " appearance(s)");
        break;

      case this.PER_SEASON:
        this.parseSeasonData();
        this.reorderData();
        if (this.graphDataTypeSelection == this.PER_NUMBER_OF_EPISODES)
          this.createGroupedStackedBarChart(this.parsedData, "Calling", " appearance(s)");
        else
          this.createGroupedStackedBarChart(this.parsedData, "Calling", " appearance(s) per episode");
        break;

      case this.PER_EPISODE:
        this.parseEpisodicData();
        this.reorderData();
        this.createGroupedStackedBarChart(this.parsedData, "Calling", " appearance(s)");
        break;

    }


  }

  changeFilterSelection() {
    for (var i = 0; i < this.charactersInfo.length; i++) {
      for (var j = 0; j < this.charactersInfo[i].infos.length; j++)
        this.charactersInfo[i].infos[j].isShowing = this.selectAll;
    }
    this.createVisualization();
  }

  reorderData() {
    var pointer = this;
    var result = [];
    for (var i = 0; i < this.parsedData.length; i++) {
      for (var j = 0; j < this.parsedData[i].characters.length; j++) {
        var result = [];
        var index = this.charactersInfo.map(function (e) { return e.name; }).indexOf(this.parsedData[i].characters[j].name);
        this.charactersInfo[index].infos.forEach(function (item) {
          pointer.parsedData[i].characters[j].infos.forEach(function (character) {
            if (item.label == character.label)
              result.push(character);
          })
        })
        pointer.parsedData[i].characters[j].infos = result;
      }
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
    this.parsedData = data;
  }

  pushTotalCharacterData(data, i) {
    if (!data[0])
      data[0] = { name: "Total", characters: [] };
    for (var j = 0; j < this.episodes[i].nameCalling.length; j++) {
      var index = data[0].characters.map(function (e) { return e.name; }).indexOf(this.episodes[i].nameCalling[j].character);
      if (index == -1 && this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "isShowing") == true) {
        data[0].characters.push({ name: this.episodes[i].nameCalling[j].character, parent: "Total", infos: [] });
        index = data[0].characters.length - 1;
      }
      if (this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "isShowing") == true) {
        var labelIndex = data[0].characters[index].infos.map(function (e) { return e.label; }).indexOf(this.episodes[i].nameCalling[j].label);
        if (labelIndex == -1) {
          data[0].characters[index].infos.push({
            name: "Total",
            label: this.episodes[i].nameCalling[j].label,
            value: this.episodes[i].nameCalling[j].value,
            character: this.episodes[i].nameCalling[j].character,
            color: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "color"),
            highlightColor: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "hightlight")
          })
        }
        else {
          data[0].characters[index].infos[labelIndex].value += this.episodes[i].nameCalling[j].value;
        }
      }
    }
    return data;
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

    if (this.graphDataTypeSelection == this.PER_PERCENTAGE_OF_EPISODES) {
      for (var j = 0; j < data.length; j++) {
        for (var k = 0; k < data[j].characters.length; k++) {
          for (var l = 0; l < data[j].characters[k].infos.length; l++)
            data[j].characters[k].infos[l].value = data[j].characters[k].infos[l].value / numberOfEpisodesPerSeason[j];
        }
      }
    }

    this.parsedData = data;
  }

  pushSeasonCharacterData(data, i) {
    if (!data[this.episodes[i].season - 1])
      data[this.episodes[i].season - 1] = { name: "Season " + this.episodes[i].season, characters: [] };

    for (var j = 0; j < this.episodes[i].nameCalling.length; j++) {

      var index = data[this.episodes[i].season - 1].characters.map(function (e) { return e.name; }).indexOf(this.episodes[i].nameCalling[j].character);
      if (index == -1 && this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "isShowing") == true) {
        data[this.episodes[i].season - 1].characters.push({ name: this.episodes[i].nameCalling[j].character, parent: "Season " + this.episodes[i].season, infos: [] });
        index = data[this.episodes[i].season - 1].characters.length - 1;
      }

      if (this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "isShowing") == true) {

        var labelIndex = data[this.episodes[i].season - 1].characters[index].infos.map(function (e) { return e.label; }).indexOf(this.episodes[i].nameCalling[j].label);
        if (labelIndex == -1) {
          data[this.episodes[i].season - 1].characters[index].infos.push({
            name: "Season " + this.episodes[i].season,
            label: this.episodes[i].nameCalling[j].label,
            value: this.episodes[i].nameCalling[j].value,
            character: this.episodes[i].nameCalling[j].character,
            color: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "color"),
            highlightColor: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "hightlight")
          })
        }
        else {
          data[this.episodes[i].season - 1].characters[index].infos[labelIndex].value += this.episodes[i].nameCalling[j].value;
        }
      }
    }
    return data;
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

    this.parsedData = data;
  }

  pushEpisodicCharacterData(data, i, id) {
    data[id] = { name: this.episodes[i].name, characters: [] };
    for (var j = 0; j < this.episodes[i].nameCalling.length; j++) {

      var index = data[id].characters.map(function (e) { return e.name; }).indexOf(this.episodes[i].nameCalling[j].character);
      if (index == -1 && this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "isShowing") == true) {
        data[id].characters.push({ name: this.episodes[i].nameCalling[j].character, parent: this.episodes[i].name, infos: [] });
        index = data[id].characters.length - 1;
      }
      if (this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "isShowing") == true) {
        data[id].characters[index].infos.push({
          name: this.episodes[i].name,
          season: this.episodes[i].season,
          episode: this.episodes[i].episode,
          label: this.episodes[i].nameCalling[j].label,
          value: this.episodes[i].nameCalling[j].value,
          character: this.episodes[i].nameCalling[j].character,
          color: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "color"),
          highlightColor: this.getCharacterInfo(this.episodes[i].nameCalling[j].label, "label", "hightlight")
        })
      }

    }
    return data;
  }

  getCharacterInfo(label, parameter, info) {
    for (var i = 0; i < this.charactersInfo.length; i++) {
      for (var j = 0; j < this.charactersInfo[i].infos.length; j++)
        if (this.charactersInfo[i].infos[j][parameter] == label)
          return this.charactersInfo[i].infos[j][info];
    }
  }


}
