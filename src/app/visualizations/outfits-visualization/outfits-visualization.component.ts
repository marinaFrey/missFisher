import { Component, OnInit } from '@angular/core';
import { VisualizationComponent } from '../visualization/visualization.component';
import { TOTAL, PER_SEASON, PER_EPISODE, PER_NUMBER_OF_EPISODES, PER_PERCENTAGE_OF_EPISODES } from "../../constants";

@Component({
  selector: 'app-outfits-visualization',
  templateUrl: './outfits-visualization.component.html',
  styleUrls: ['./outfits-visualization.component.css']
})
export class OutfitsVisualizationComponent extends VisualizationComponent implements OnInit {

  parsedData;

  constructor() {
    super("#viz", 500, 300);
  }

  ngOnInit() {
  }

}
