import { Component, OnInit, Input } from '@angular/core';
import { VisualizationComponent } from '../visualization/visualization.component';
import { EpisodeService } from '../../episode.service';
import { TOTAL, PER_SEASON, PER_EPISODE, PER_NUMBER_OF_EPISODES, PER_PERCENTAGE_OF_EPISODES } from '../../constants';
import { BarChart } from 'src/app/d3/bar-chart';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent extends VisualizationComponent implements OnInit
{

  @Input() title: string;
  @Input() svgName: string;
  @Input() width: number;
  @Input() height: number;
  @Input() parsingInfo: any;
  @Input() variables: string[];
  @Input() label: string;
  @Input() imageName: string;
  @Input() tooltipLabel: string;

  @Input() seasonSelection: number;
  @Input() graphTypeSelection: number;
  @Input() graphStyleSelection: number;
  @Input() graphDataTypeSelection: number;

  barChart: BarChart;

  constructor(private episodeService: EpisodeService)
  {
    super();
  }

  ngOnInit(): void
  {
    this.create();
  }

  create()
  {
    if (document.querySelector('#'+this.svgName) != null)
    {
      this.barChart = new BarChart('#'+this.svgName, this.width, this.height);
      if (this.episodes)
        this.createVisualization();
    }
    else
    {
      setTimeout(() => this.create(), 50);
    }
  }

  createVisualization()
  {
    console.log(this.episodes, this.graphTypeSelection);
    switch (this.graphTypeSelection)
    {
      case TOTAL:
        this.parsedData = this.episodeService.parseTotalData(this.episodes, this.parsingInfo, this.variables, this.label, value => value, null, this.seasonSelection);
        this.parsedData = this.episodeService.reorderData(this.parsedData, this.parsingInfo);
        console.log(this.parsedData);
        this.barChart.createGroupedStackedBarChart(this.parsedData, this.imageName, this.tooltipLabel);
        break;

      case PER_SEASON:
        this.parsedData = this.episodeService.parseSeasonData(this.episodes, this.parsingInfo, this.variables, this.label, value => value, null, this.graphDataTypeSelection);
        this.parsedData = this.episodeService.reorderData(this.parsedData, this.parsingInfo);
        if (this.graphDataTypeSelection == PER_NUMBER_OF_EPISODES)
          this.barChart.createGroupedStackedBarChart(this.parsedData, this.imageName, this.tooltipLabel);
        else
          this.barChart.createGroupedStackedBarChart(this.parsedData, this.imageName, this.tooltipLabel + ' per episode');
        break;

      case PER_EPISODE:
        this.parsedData = this.episodeService.parseEpisodicData(this.episodes, this.seasonSelection, this.parsingInfo, this.variables, this.label, value => value, null, "stacked");
        this.parsedData = this.episodeService.reorderData(this.parsedData, this.parsingInfo);
        this.barChart.createGroupedStackedBarChart(this.parsedData, this.imageName, this.tooltipLabel);
        break;

    }

  }

}
