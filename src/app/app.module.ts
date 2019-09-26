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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NavigationBarComponent,
    NumberOfScenesPerCharacterVisualizationComponent,
    VisualizationComponent,
    NameCallingVisualizationComponent
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
