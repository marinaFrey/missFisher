import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutfitsVisualizationComponent } from './outfits-visualization.component';

describe('OutfitsVisualizationComponent', () => {
  let component: OutfitsVisualizationComponent;
  let fixture: ComponentFixture<OutfitsVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutfitsVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutfitsVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
