import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MurdersVisualizationComponent } from './murders-visualization.component';

describe('MurdersVisualizationComponent', () => {
  let component: MurdersVisualizationComponent;
  let fixture: ComponentFixture<MurdersVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MurdersVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MurdersVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
