import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpresaComponent } from './addempresa.component';

describe('AddEmpresaComponent', () => {
  let component: AddEmpresaComponent;
  let fixture: ComponentFixture<AddEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmpresaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
