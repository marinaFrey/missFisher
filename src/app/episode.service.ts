import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as d3 from "d3";
import { Episode } from './episode';
import { EPISODES } from './episodeData';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {

  constructor() {

  }

  getEpisodes(): Observable<Episode[]> {
    return of(EPISODES);
  }


}
