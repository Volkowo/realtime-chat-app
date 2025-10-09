import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

    // Provide all required inputs before detectChanges (mocking ngOnInit)
    component.userID = '1';
    component.checkGroupAdminRole = jasmine.createSpy('checkGroupAdminRole').and.returnValue([{ groupID: 'g1' }]);
    component.checkUser = jasmine.createSpy('checkUser');
    component.getGroupById = (id: string) => 'Test Group';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should render dropdown items', () => {
    const dropdownItems = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    expect(dropdownItems.length).toBe(1);
    expect(dropdownItems[0].nativeElement.textContent.trim()).toBe('Test Group');
  });

  it('should call checkUser on item click', () => {
    const button = fixture.debugElement.query(By.css('.dropdown-item'));
    button.nativeElement.click();
    expect(component.checkUser).toHaveBeenCalledWith('1', 'g1', 'groupAdmin');
  });
});
