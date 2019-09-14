import { Component, OnInit, Input } from '@angular/core';
import { VisualizationComponent } from '../visualization/visualization.component';
import * as d3 from "d3";

@Component({
  selector: 'app-number-of-scenes-per-character-visualization',
  templateUrl: './number-of-scenes-per-character-visualization.component.html',
  styleUrls: ['./number-of-scenes-per-character-visualization.component.css']
})
export class NumberOfScenesPerCharacterVisualizationComponent extends VisualizationComponent implements OnInit {

  @Input('episodesData') public episodes;
  svgName = "#viz";
  seasonSelection = 0;
  graphTypeSelection = 0;
  
  constructor() {
    super("#viz", 100, 100);
  }

  ngOnInit() {
    this.create();
  }

  create() {
    var pointer = this;
    if (document.querySelector(this.svgName) != null) {
      this.setSvgSize(1 / 2);
      if(this.episodes)
        this.createVisualization();
    }
    else {
      setTimeout(function () {
        pointer.create();
      }, 50);
    }

  }

  createVisualization()
  {
    var rectColor = "#b7e0aeff";
    this.svg
      .append("rect")
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr("fill", rectColor);
  }


}
