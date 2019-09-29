import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndulgingVisualizationComponent } from './indulging-visualization.component';

describe('IndulgingVisualizationComponent', () => {
  let component: IndulgingVisualizationComponent;
  let fixture: ComponentFixture<IndulgingVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndulgingVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndulgingVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
