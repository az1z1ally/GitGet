import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadLinkSectionComponent } from './download-link-section.component';

describe('DownloadLinkSectionComponent', () => {
  let component: DownloadLinkSectionComponent;
  let fixture: ComponentFixture<DownloadLinkSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadLinkSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownloadLinkSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
