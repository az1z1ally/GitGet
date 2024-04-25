// download-link.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadLinkService {
  private downloadLinkSubject = new BehaviorSubject<string | null>(null);
  downloadLink$ = this.downloadLinkSubject.asObservable();

  setDownloadLink(link: string) {
    this.downloadLinkSubject.next(link);
  }
}
