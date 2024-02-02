import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPestComponent } from './add-pest.component';

describe('AddPestComponent', () => {
  let component: AddPestComponent;
  let fixture: ComponentFixture<AddPestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
