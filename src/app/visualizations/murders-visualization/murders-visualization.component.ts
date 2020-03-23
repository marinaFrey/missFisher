import { Component, OnInit, Input } from '@angular/core';
import { VisualizationComponent } from '../visualization/visualization.component';

@Component({
  selector: 'app-murders-visualization',
  templateUrl: './murders-visualization.component.html',
  styleUrls: ['./murders-visualization.component.css']
})
export class MurdersVisualizationComponent extends VisualizationComponent implements OnInit {

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
  selectAll = true;

  colorInfo = 
    {
      "poison":"#1f77b4",
      "suffocation":"#17becf",
      "perfuration":"#bcbd22",
      "gunshot":"#7f7f7f",
      "burned":"#8c564b",
      "lobotomy":"#ff7f0e",
      "ran over":"#7f7f7f",
      "septicemia":"#9467bd",
      "concussion":"#bcbd22",
      "fall":"#ff7f0e",
      "electrocution":"#ff7f0e",
      "drowning":"#17becf",
      "crushed":"#8c564b",
      "decapitation":"#bcbd22",
      "male victim": "#1f77b4",
      "female victim": "#e377c2",
      "male murderer":"#1f77b4",
      "female murderer":"#e377c2",
      "acquaintance":"#1f77b4",
      "colleague":"#ff7f0e",
      "none": "#7f7f7f",
      "ex-lover": "#8c564b",
      "friend": "#bcbd22",
      "employer": "#1f77b4",
      "self": "#ff7f0e",
      "relative": "#9467bd",
      "lover": "#e377c2"
    };

  constructor() {
    super("#murdersViz", 500, 300);
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
        this.createSankeyChart(this.parsedData, this.colorInfo);
        break;

      case this.PER_SEASON:

        break;

      case this.PER_EPISODE:

        break;

    }


  }

  parseTotalData() {
    var links = [];
    var nodes = [];
    //var labels = ['Cause of Death', 'Victim Sex', 'Murderer Sex', 'Relationship with Victim'];
    var labels = ['source', 'target'];
    //var labels = ['Cause of Death', 'Murderer Sex'];
    for (var i = 0; i < this.episodes.length; i++) {
      if ((this.seasonSelection == 0) || (this.episodes[i].season == this.seasonSelection)) {
        for (var j = 0; j < this.episodes[i].murders.length; j++) {
          links = this.pushTotalMurderData(links, i, this.episodes[i].murders[j], labels);
        }
      }
    }
    for (var i = 0; i < labels.length; i++) {
      nodes = nodes.concat(this.findUniqueItemsInArray(links, labels[i]));
    }
    nodes = this.findUniqueItemsInArray(nodes,'name');
    this.parsedData = [links, nodes];
    console.log(this.parsedData);
  }

  pushTotalMurderData(links, i, murders, labels) {
    var values = [murders.type, murders.victimSex+ ' victim', murders.murdererSex + ' murderer', murders.relationshipWithVictim];
    //var values = [murders.type,  murders.murdererSex + ' murderer'];
    for(var j = 1; j < values.length; j++)
    {
      var index = this.findObjectInArray(links, labels, [values[j-1], values[j]]);
      if (index != null) {
        links[index]['value']++;
      }
      else {
        links.push({
          'source': values[j-1],
          'target': values[j],
          'value': 1
        });
      }
    }
    
    return links;
  }

  findObjectInArray(array, keys, values) {
    for (var i = 0; i < array.length; i++) {
      var found = true;
      for (var j = 0; j < values.length; j++) {
        if (array[i][keys[j]] != values[j]) {
          found = false;
        }
      }
      if (found == true)
        return i;
    }
    return null;
  }

  findUniqueItemsInArray(array, parameter) {
    var flags = [], output = [];
    for (var i = 0; i < array.length; i++) {
      if (flags[array[i][parameter]]) continue;
      flags[array[i][parameter]] = true;
      output.push({name:array[i][parameter]});
    }
    return output;
  }



}