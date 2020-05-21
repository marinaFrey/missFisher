import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosenessVisualizationComponent } from './closeness-visualization.component';

describe('ClosenessVisualizationComponent', () => {
  let component: ClosenessVisualizationComponent;
  let fixture: ComponentFixture<ClosenessVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosenessVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosenessVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
