import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniswapTableComponent } from './uniswap-table.component';

describe('UniswapTableComponent', () => {
  let component: UniswapTableComponent;
  let fixture: ComponentFixture<UniswapTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniswapTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniswapTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
