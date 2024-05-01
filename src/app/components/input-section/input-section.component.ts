import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileDownloaderService } from '../../services/gitAPI.service';
import { DownloadLinkService } from '../../services/downloadLink.service';

@Component({
  selector: 'app-input-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-section.component.html',
  styleUrl: './input-section.component.scss'
})
export class InputSectionComponent {
  public githubUrl: string = '';

  constructor (
    private fileDownloaderService: FileDownloaderService,
    private downloadLinkService: DownloadLinkService
  ) {}

  generateDownloadLink(): void {
    if(this.githubUrl === '') {
      return
    }
    
    const downloadLink = `https://githives.com/?url=${this.githubUrl.trim()}`
    this.downloadLinkService.setDownloadLink(downloadLink)
  }

  downloadFiles(): void {
   this.fileDownloaderService.downloadFilesFromGitHub(this.githubUrl.trim())
  }
}
