import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DownloadLinkService } from '../../services/downloadLink.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-download-link-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-link-section.component.html',
  styleUrls: ['./download-link-section.component.scss']
})
export class DownloadLinkSectionComponent implements OnInit {
  @ViewChild('codeBlock') codeBlockRef!: ElementRef<HTMLButtonElement>;  // Use ViewChild to get a reference to the button

  constructor(private downloadLinkService: DownloadLinkService) {}

  ngOnInit(): void {
  }

  downloadLink$: Observable<string | null> = this.downloadLinkService.downloadLink$;

  // Copy download link to clipboard
  copyDownloadLink = (): void => {
    const range = document.createRange();
    range.selectNode(this.codeBlockRef.nativeElement);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      selection.removeAllRanges();
      const originalText = this.codeBlockRef.nativeElement.textContent;
      this.codeBlockRef.nativeElement.textContent = 'Copied';
      setTimeout(() => {
        this.codeBlockRef.nativeElement.textContent = originalText;
      }, 2000);  // Reset to original text after 2 seconds
    }
  };
}
