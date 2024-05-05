import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileDownloaderService } from '../../services/gitAPI.service';
import { DownloadLinkService } from '../../services/downloadLink.service';
import { CommonModule } from '@angular/common';
import { helper } from '../../shared/helpers/helper';
import { NotificationService } from '../../shared/services/notifications.service';
import { NetworkErrorsEnum } from '../../shared/types/errors.enum';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-input-section',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './input-section.component.html',
  styleUrl: './input-section.component.scss'
})
export class InputSectionComponent {
  githubUrl: string = '';
  isDownloading$ = this.fileDownloaderService.isDownloading$

  constructor (
    private fileDownloaderService: FileDownloaderService,
    private downloadLinkService: DownloadLinkService,
    private notificationService: NotificationService
  ) {}

  generateDownloadLink(): void {
    if(this.githubUrl === '') {
      this.notificationService.showError(`Please enter a valid url! ⚡🫢`, `${NetworkErrorsEnum.invalid}:`);
      return
    }

    try {
      // Try to generate GitHub API url - if the syntax is incorrecr the function throws an error
       helper().generateAPIUrl(this.githubUrl);
    } catch(error) {        
      this.notificationService.showError(`${error} ⚡🫢`, `${NetworkErrorsEnum.invalid}:`);
      return
    }
 
    const downloadLink = `${environment.config.frontEndURL}/?url=${this.githubUrl.trim()}`
    this.downloadLinkService.setDownloadLink(downloadLink)
  }

  downloadFiles(): void {
   this.fileDownloaderService.downloadFilesFromGitHub(this.githubUrl.trim())
  }
}
