import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CharactersComponent } from './characters/characters.component';
import { RomanceComponent } from './romance/romance.component';
import { WardrobeComponent } from './wardrobe/wardrobe.component';
import { MudersComponent } from './muders/muders.component';
import { TimelineComponent } from './timeline/timeline.component';
import { AboutComponent } from "./about/about.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'characters', component: CharactersComponent },
  { path: 'romance', component: RomanceComponent },
  { path: 'wardrobe', component: WardrobeComponent },
  { path: 'murders', component: MudersComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
