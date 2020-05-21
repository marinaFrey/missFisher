import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './/app-routing.module';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { NumberOfScenesPerCharacterVisualizationComponent } from './visualizations/number-of-scenes-per-character-visualization/number-of-scenes-per-character-visualization.component';
import { VisualizationComponent } from './visualizations/visualization/visualization.component';
import { NameCallingVisualizationComponent } from './visualizations/name-calling-visualization/name-calling-visualization.component';
import { IndulgingVisualizationComponent } from './visualizations/indulging-visualization/indulging-visualization.component';
import { AboutComponent } from './about/about.component';
import { OutfitsVisualizationComponent } from './visualizations/outfits-visualization/outfits-visualization.component';
import { MurdersVisualizationComponent } from './visualizations/murders-visualization/murders-visualization.component';
import { ClosenessVisualizationComponent } from './visualizations/closeness-visualization/closeness-visualization.component';
import { LegendComponent } from './visualizations/legend/legend.component';
import { ButtonGroupComponent } from './visualizations/button-group/button-group.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NavigationBarComponent,
    NumberOfScenesPerCharacterVisualizationComponent,
    VisualizationComponent,
    NameCallingVisualizationComponent,
    IndulgingVisualizationComponent,
    AboutComponent,
    OutfitsVisualizationComponent,
    MurdersVisualizationComponent,
    ClosenessVisualizationComponent,
    LegendComponent,
    ButtonGroupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
