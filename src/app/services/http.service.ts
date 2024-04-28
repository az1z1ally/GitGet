import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { helper } from '../shared/helpers/helper';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  fetchData(url: string): Observable<any> {
    return this.http.get(url);
  }

  async processItem(item: any, zip: JSZip, currentPath: string = ''): Promise<void> {
    const fullPath = currentPath + item.name;

    if (item.type === 'file') {
      const fileName = fullPath;
      const fileUrl = item.download_url;
      try {
        const fileContent = await this.downloadFile(fileUrl);
        zip.file(fileName, fileContent); // add item to zip
      } catch (error) {
        throw new Error(`Error downloading file ${fileName}: ${error}`);
      }
    } else if (item.type === 'dir') {
      const dirContents = await this.fetchDirContents(item.url).toPromise();
      if (dirContents) {
        for (const subItem of dirContents) {
          await this.processItem(subItem, zip, fullPath + '/');
        }
      } else {
        console.warn(`Directory contents for ${fullPath} are null.`);
      }
    }
  }

  // Function to download a file from a URL
  private downloadFile(url: string): Promise<ArrayBuffer> {
    // Wait to comply with rate limiting
    helper().waitForRateLimit();

    return new Promise<ArrayBuffer>((resolve, reject) => {
      this.http.get(url, { responseType: 'arraybuffer' }).subscribe(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  private fetchDirContents(url: string): Observable<any[]> {
    return this.http.get<any[]>(url);
  }
  
}
