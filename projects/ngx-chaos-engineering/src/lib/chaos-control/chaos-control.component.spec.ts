import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaosControlComponent } from './chaos-control.component';

describe('ChaosControlComponent', () => {
  let component: ChaosControlComponent;
  let fixture: ComponentFixture<ChaosControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChaosControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChaosControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
