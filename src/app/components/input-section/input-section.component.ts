import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubApiService } from '../../services/gitAPI.service';

@Component({
  selector: 'app-input-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-section.component.html',
  styleUrl: './input-section.component.scss'
})
export class InputSectionComponent {
  public githubUrl: string = '';

  constructor (private gitAPIService: GithubApiService) {

  }

  generateDownloadLink(): void {

  }

  downloadFiles(): void {
    this.gitAPIService.downloadFolderFromGitHub(this.githubUrl)
  }
}
