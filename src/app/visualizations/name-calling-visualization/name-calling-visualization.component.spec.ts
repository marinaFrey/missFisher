import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameCallingVisualizationComponent } from './name-calling-visualization.component';

describe('NameCallingVisualizationComponent', () => {
  let component: NameCallingVisualizationComponent;
  let fixture: ComponentFixture<NameCallingVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameCallingVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameCallingVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
