import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { InputSectionComponent } from './components/input-section/input-section.component';
import { DownloadLinkSectionComponent } from './components/download-link-section/download-link-section.component';
import { FooterComponent } from './components/footer/footer.component';

const COMPONENTS = [HeaderComponent, InputSectionComponent, DownloadLinkSectionComponent, FooterComponent] 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, COMPONENTS],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GitGet';
}
