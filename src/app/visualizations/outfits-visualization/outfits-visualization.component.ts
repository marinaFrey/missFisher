import { Component, OnInit } from '@angular/core';
import { VisualizationComponent } from '../visualization/visualization.component';
import { EpisodeService } from '../../episode.service';
import { TOTAL, PER_SEASON, PER_EPISODE, PER_NUMBER_OF_EPISODES, PER_PERCENTAGE_OF_EPISODES } from '../../constants';
import { parse } from 'querystring';
/* tslint:disable */
@Component({
  selector: 'app-outfits-visualization',
  templateUrl: './outfits-visualization.component.html',
  styleUrls: ['./outfits-visualization.component.css']
})
export class OutfitsVisualizationComponent extends VisualizationComponent implements OnInit {

  parsedData;
  selectAll = true;

  tiesInfo = [
    { name: "Striped Tie", color: "#a2a2a2ff", hightlight: "#7e7e7eff", isShowing: true },
    { name: "Rhombus Filled Tie", color: "#58609eff", hightlight: "#3f4787ff", isShowing: true },
    { name: "Diamond Striped Tie", color: "#2a3266ff", hightlight: "#13193cff", isShowing: true },
    { name: "Maroon Tie", color: "#5b1725ff", hightlight: "#3f0813ff", isShowing: true },
    { name: "Beige Tie", color: "#d2c9b3ff", hightlight: "#a69a7aff", isShowing: true },
    { name: "Diamond Tie", color: "#172050ff", hightlight: "#00072fff", isShowing: true },
    { name: "Black Bowtie", color: "#1e1e1eff", hightlight: "#000000ff", isShowing: true },
    { name: "Feathers Tie", color: "#1f1650ff", hightlight: "#080033ff", isShowing: true },
    { name: "Lined Tie", color: "#060027ff", hightlight: "#030015ff", isShowing: true },
    { name: "Gold Tie", color: "#f4cd56ff", hightlight: "#b8952dff", isShowing: true },
    { name: "Cozy Tie", color: "#b6988fff", hightlight: "#9b786eff", isShowing: true },
    { name: "Rather Nice Tie", color: "#18215eff", hightlight: "#11142cff", isShowing: true },
    { name: "Flowers Tie", color: "#254385ff", hightlight: "#172c5cff", isShowing: true },
    { name: "Seal Striped Tie", color: "#1b256bff", hightlight: "#060d3eff", isShowing: true },
    { name: "Brown Tie", color: "#3c1409ff", hightlight: "#190500ff", isShowing: true },
    { name: "Planet Tie", color: "#041349ff", hightlight: "#000721ff", isShowing: true }
  ];

  constructor(private episodeService: EpisodeService) {
    super('#outfitsViz', 500, 300);
  }

  ngOnInit() {
    this.create();
  }

  create() {
    const pointer = this;
    if (document.querySelector(this.svgName) != null) {
      this.setSvg();
      if (this.episodes) {
        this.createVisualization();
      }
    } else {
      setTimeout(function () {
        pointer.create();
      }, 50);
    }

  }

  createVisualization() {
    let ties = this.parseTieData(this.episodes, this.seasonSelection);
    console.log(ties);
    //let data  = this.reorderData(ties, 'label', this.tiesInfo);
    ties.sort((a,b) => b.value - a.value);
    this.createBarChart(ties, 'ties', 'Number of Times Worn', '', null);
    /*
    switch (this.graphTypeSelection) {
      case TOTAL:
        this.parsedData = this.episodeService.parseTotalData(this.episodes,
                                                            this.charactersInfo,
                                                            ['nameCalling'],
                                                            'label',
                                                            function (value) { return value; }, null, this.seasonSelection);
        this.parsedData = this.episodeService.reorderData(this.parsedData, this.charactersInfo);
        this.createGroupedStackedBarChart(this.parsedData, 'Calling', ' appearance(s)');
        break;

      case PER_SEASON:
        this.parsedData = this.episodeService.parseSeasonData(this.episodes,
                                                              this.charactersInfo,
                                                              ['nameCalling'],
                                                              'label',
                                                              function (value) { return value; }, null, this.graphDataTypeSelection);
        this.parsedData = this.episodeService.reorderData(this.parsedData, this.charactersInfo);
        if (this.graphDataTypeSelection === PER_NUMBER_OF_EPISODES) {
          this.createGroupedStackedBarChart(this.parsedData, 'Calling', ' appearance(s)');
        } else {
          this.createGroupedStackedBarChart(this.parsedData, 'Calling', ' appearance(s) per episode');
        }
        break;

      case PER_EPISODE:
        this.parsedData = this.episodeService.parseEpisodicData(this.episodes, this.seasonSelection,
                          this.charactersInfo, ['nameCalling'], 'label', function (value) { return value; }, null, 'stacked');
        this.parsedData = this.episodeService.reorderData(this.parsedData, this.charactersInfo);
        this.createGroupedStackedBarChart(this.parsedData, 'Calling', ' appearance(s)');
        break;
    }*/
  }

  parseTieData(episodes, seasonSelection) {
    let data = [];
    for (let i = 0; i < episodes.length; i++) {
      if ((seasonSelection === 0) || (episodes[i].season === seasonSelection)) {
        data = this.parseTieCountData(data, episodes[i]);
      }
    }
    const parsedData = [];
    // tslint:disable-next-line:forin
    for (const tie in data) {
      parsedData.push({
        label: tie,
        value: data[tie],
        ties: tie,
        color: this.getInfo(tie, this.tiesInfo, 'color'),
        highlightColor: this.getInfo(tie, this.tiesInfo, 'hightlight')
      });
    }

    return parsedData;
  }

  parseTieCountData(data, episode) {
    episode.neckties.forEach(tie => {
      if (!data[tie.label]) {
        data[tie.label] = 0;
      }
      data[tie.label] += 1;
    });

    return data;
  }

  reorderData(data, propertyName, infoVector)
  {
    
  }

  getInfo(name, infoVector, info)
  {
    for (var i = 0; i < infoVector.length; i++)
    {
      if (infoVector[i].name == name)
        return infoVector[i][info];
    }
  }

}
