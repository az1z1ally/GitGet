import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubApiService } from '../../services/gitAPI.service';
import { helper } from '../../shared/helpers/helper';
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
    private gitAPIService: GithubApiService,
    private downloadLinkService: DownloadLinkService
  ) {}

  generateDownloadLink(): void {
    if(this.githubUrl === '') {
      return
    }
    
    const downloadLink = `http://localhost:4200/?url=${this.githubUrl}`
    this.downloadLinkService.setDownloadLink(downloadLink)
  }

  async downloadFiles(): Promise<void> {
   await this.gitAPIService.downloadFolderFromGitHub(this.githubUrl)
  }
}
