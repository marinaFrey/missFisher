import { Component, OnInit, Input } from '@angular/core';
import { VisualizationComponent } from '../visualization/visualization.component';

@Component({
  selector: 'app-outfits-visualization',
  templateUrl: './outfits-visualization.component.html',
  styleUrls: ['./outfits-visualization.component.css']
})
export class OutfitsVisualizationComponent extends VisualizationComponent implements OnInit {

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

  constructor() {
    super("#viz", 500, 300);
  }

  ngOnInit() {
  }

}
