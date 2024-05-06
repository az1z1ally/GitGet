import { Component } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileDownloaderService } from '../../services/gitAPI.service';
import { DownloadLinkService } from '../../services/downloadLink.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../shared/services/notifications.service';
import { NetworkErrorsEnum } from '../../shared/types/errors.enum';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-input-section',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './input-section.component.html',
  styleUrl: './input-section.component.scss'
})
export class InputSectionComponent {
  githubUrl: string   = '';
  isDownloading$ = this.fileDownloaderService.isDownloading$

  // urlRegex: string = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  urlRegex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/|www\.)?github.com\/([^/]+)\/([^/]+)(?:\/(?:tree|blob)\/main\/([^/]+\/?.*))?/
  
  form = this.fb.group({
    url: this.fb.control('', Validators.compose([Validators.required, Validators.pattern(this.urlRegex)]))
  })

  constructor (
    private fb: NonNullableFormBuilder,
    private fileDownloaderService: FileDownloaderService,
    private downloadLinkService: DownloadLinkService,
    private notificationService: NotificationService
  ) {}

  generateDownloadLink(): void {
    if(this.form.invalid) {
      this.notificationService.showError(`Please enter a valid url! ⚡🫢`, `${NetworkErrorsEnum.invalid}:`);
      return
    } 

    try {
      const url = this.form.get('url')?.value.trim()
      this.githubUrl = url as string
 
    } catch(error) {        
      this.notificationService.showError(`${error} ⚡🫢`, `${NetworkErrorsEnum.invalid}:`);
      return
    }
 
    const downloadLink = `${environment.config.frontEndURL}/?url=${this.githubUrl}`
    this.downloadLinkService.setDownloadLink(downloadLink)
  }

  downloadFiles(): void {    
    if(this.form.valid) {
      this.githubUrl = this.form.get('url')?.value.trim() as string
      this.fileDownloaderService.downloadFilesFromGitHub(this.githubUrl)
    }
  }
}
