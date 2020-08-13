import { Component, OnInit } from '@angular/core';
import { EpisodeService } from '../episode.service';
import { Episode, Murder, EpisodeDate, Information } from '../episode';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public episodes: Episode[];

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

  constructor(private episodeService: EpisodeService) { }

  ngOnInit() {

    this.episodeService.getEpisodes()
      .subscribe(episodes => this.episodes = episodes, e => console.log("error ", e));

  }

}
