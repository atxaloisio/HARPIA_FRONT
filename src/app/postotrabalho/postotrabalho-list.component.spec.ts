import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostoTrabalhoListComponent } from './postotrabalho-list.component';

describe('PostoTrabalhoComponent', () => {
  let component: PostoTrabalhoListComponent;
  let fixture: ComponentFixture<PostoTrabalhoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostoTrabalhoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostoTrabalhoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
