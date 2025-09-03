import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteModal } from './promote-modal';

describe('PromoteModal', () => {
  let component: PromoteModal;
  let fixture: ComponentFixture<PromoteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoteModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoteModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
