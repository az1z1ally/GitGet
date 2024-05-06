import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DownloadLinkService } from '../../services/downloadLink.service';
import { Observable } from 'rxjs';
import { NotificationService } from '../../shared/services/notifications.service';
import { NetworkErrorsEnum } from '../../shared/types/errors.enum';

@Component({
  selector: 'app-download-link-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-link-section.component.html',
  styleUrls: ['./download-link-section.component.scss']
})
export class DownloadLinkSectionComponent implements OnInit {
  @ViewChild('codeBtn') codeBtnRef!: ElementRef<HTMLButtonElement>;  // Use ViewChild to get a reference to the button

  constructor(
    private downloadLinkService: DownloadLinkService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
  }

  downloadLink$: Observable<string | null> = this.downloadLinkService.downloadLink$;

  // Copy download link to clipboard
  copyDownloadLink = async (link: string): Promise<void> => {
    if (this.codeBtnRef) {
      const textToCopy = link
      try {
        if (textToCopy) {
          await navigator.clipboard.writeText(textToCopy);
          const originalText = this.codeBtnRef.nativeElement.textContent;
          this.codeBtnRef.nativeElement.textContent = 'Copied!';
          setTimeout(() => {
            this.codeBtnRef.nativeElement.textContent = originalText;
          }, 2000);
        }
      } catch (error) {
        this.notificationService.showError(`Error copying to clipboard: ${error}`, `COPYING__ERROR`)
      }
    }
  };
}

/*
The Window.navigator read-only property returns a reference to the Navigator object, which has methods and properties about the application running the script.
The window.navigator object contains information about the visitor's browser.

Example 1: Browser detect and return a string
function getBrowserName(userAgent) {
  // The order matters here, and this may report false positives for unlisted browsers.

  if (userAgent.includes("Firefox")) {
    // "Mozilla/5.0 (X11; Linux i686; rv:104.0) Gecko/20100101 Firefox/104.0"
    return "Mozilla Firefox";
  } else if (userAgent.includes("SamsungBrowser")) {
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36"
    return "Samsung Internet";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 OPR/90.0.4480.54"
    return "Opera";
  } else if (userAgent.includes("Edge")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    return "Microsoft Edge (Legacy)";
  } else if (userAgent.includes("Edg")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
    return "Microsoft Edge (Chromium)";
  } else if (userAgent.includes("Chrome")) {
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
    return "Google Chrome or Chromium";
  } else if (userAgent.includes("Safari")) {
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
    return "Apple Safari";
  } else {
    return "unknown";
  }
}

const browserName = getBrowserName(navigator.userAgent);
console.log(`You are using: ${browserName}`);


The clipboard read-only property of the Navigator interface returns a Clipboard object used to read and write the clipboard's contents.
This is the entry point to the Clipboard API, which can be used to implement cut, copy, and paste features within a web application.

The following code uses navigator.clipboard to access the system clipboard in order to read text contents from the clipboard.

navigator.clipboard
  .readText()
  .then(
    (clipText) => (document.querySelector(".cliptext").innerText = clipText),
  );
*/
