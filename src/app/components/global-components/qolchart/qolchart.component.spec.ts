import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QolchartComponent } from './qolchart.component';

describe('QolchartComponent', () => {
  let component: QolchartComponent;
  let fixture: ComponentFixture<QolchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QolchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QolchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
