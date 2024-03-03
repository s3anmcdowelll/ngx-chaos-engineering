import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NxgChaosEngineeringComponent } from './nxg-chaos-engineering.component';

describe('NxgChaosEngineeringComponent', () => {
  let component: NxgChaosEngineeringComponent;
  let fixture: ComponentFixture<NxgChaosEngineeringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NxgChaosEngineeringComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NxgChaosEngineeringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
