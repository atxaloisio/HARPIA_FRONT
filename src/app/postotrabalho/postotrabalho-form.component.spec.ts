import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostoTrabalhoFormComponent } from './postotrabalho-form.component';

describe('PostoTrabalhoFormComponent', () => {
  let component: PostoTrabalhoFormComponent;
  let fixture: ComponentFixture<PostoTrabalhoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostoTrabalhoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostoTrabalhoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
