import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberOfScenesPerCharacterVisualizationComponent } from './number-of-scenes-per-character-visualization.component';

describe('NumberOfScenesPerCharacterVisualizationComponent', () => {
  let component: NumberOfScenesPerCharacterVisualizationComponent;
  let fixture: ComponentFixture<NumberOfScenesPerCharacterVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberOfScenesPerCharacterVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberOfScenesPerCharacterVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
