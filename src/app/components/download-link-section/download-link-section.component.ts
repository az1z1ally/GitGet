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
  copyDownloadLink = async (link: string): Promise<void> => {
    if (this.codeBlockRef) {
      const textToCopy = link
      try {
        if (textToCopy) {
          await navigator.clipboard.writeText(textToCopy);
          const originalText = this.codeBlockRef.nativeElement.textContent;
          this.codeBlockRef.nativeElement.textContent = 'Copied!';
          setTimeout(() => {
            this.codeBlockRef.nativeElement.textContent = originalText;
          }, 2000);
        }
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };
}
