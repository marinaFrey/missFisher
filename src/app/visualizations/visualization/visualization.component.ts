import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {

  @Input('episodesData') public episodes;

  @Input() seasonSelection = 0; // 0 = all seasons
  @Input() graphTypeSelection = 0; // 0 = sum 1 = per season 2 = per episode
  @Input() graphStyleSelection = 1; // 0 = line chart 1 = bar chart
  @Input() graphDataTypeSelection = 1; // 0 = number of times 1 = average per episode

  svgName: string;
  parsedData: any;

  constructor(svgName?: string) {
    this.svgName = svgName;
  }

  ngOnInit() {
  }
}
