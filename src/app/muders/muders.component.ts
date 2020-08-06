import { Component, OnInit } from '@angular/core';
import { EpisodeService } from '../episode.service';
import { Episode } from '../episode';

@Component({
  selector: 'app-muders',
  templateUrl: './muders.component.html',
  styleUrls: ['./muders.component.css']
})
export class MudersComponent implements OnInit {

  public episodes: Episode[];

  constructor(private episodeService: EpisodeService) { }

  ngOnInit()
  {

    this.episodeService.getEpisodes()
      .subscribe(episodes => this.episodes = episodes, e => console.log("error ", e));

  }

}
