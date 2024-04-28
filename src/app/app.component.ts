import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { InputSectionComponent } from './components/input-section/input-section.component';
import { DownloadLinkSectionComponent } from './components/download-link-section/download-link-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ActivatedRoute } from '@angular/router';
import { GithubApiService } from './services/gitAPI.service';

const COMPONENTS = [HeaderComponent, InputSectionComponent, DownloadLinkSectionComponent, FooterComponent, LoaderComponent] 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, COMPONENTS],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'GitHives';
  repoUrl: string = ''; // Initialize with an empty string

  constructor(
    private route: ActivatedRoute,
    private gitAPIService: GithubApiService
  ) {}

  ngOnInit(): void {
    // Extract the 'url' query parameter from the URL
    this.route.queryParams.subscribe((params) => {
      this.repoUrl = params['url'] || ''; // Set repoUrl from the query parameter
      if (this.repoUrl !== '') {
        this.downloadFiles()
      }
    });
  }

  async downloadFiles(): Promise<void> {
    await this.gitAPIService.downloadFolderFromGitHub(this.repoUrl.trim())
  }
  
}
