import { Injectable } from '@angular/core';
import { helper } from '../shared/helpers/helper';
import JSZip from 'jszip';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})

export class GithubApiService {
  constructor(private httpService: HttpService) {}

  // Fetch folder contents from GitHub API and download files
  downloadFolderFromGitHub = async (url: string): Promise<void> => {
    try {
      // Remove the url's trailing slash if it exists
      const trimmedUrl: string = url.endsWith('/') ? url.slice(0, -1) : url; // Remove the url's trailing slash if it exists
      const folderPath = trimmedUrl.split('/').pop(); // Get the last segment of the URL

      // Generate GitHub API url
      const apiUrl = helper().generateAPIUrl(trimmedUrl);

      // Create a zip file
      const zip = new JSZip();

      // Wait to comply with rate limiting
      await helper().waitForRateLimit();

      // Make a GET request to the GitHub API
      const response = await fetch(apiUrl);

      // Check if response status is within the successful range
      if (!response.ok) {
          throw new Error(`Failed to fetch folder contents: ${response.status} ${response.statusText}`);
      }

      // Parse the response JSON
      const data = await response.json();

      if (typeof data === 'object') {
          // Add each file to the zip
        if (Array.isArray(data)) {
            for (const item of data) {
              await this.processItem(item, zip);
            }
        } else {
          // If data is just a single object
          await this.processItem(data, zip);
        }
      }

      // Generate zip Url & download
      this.generateZip(zip, folderPath)

    } catch (error) {
        console.error('Error:', error);
    }
  }

  async processItem(item: any, zip: JSZip, currentPath: string = ''): Promise<void> {
    const fullPath = currentPath + item.name;

    if (item.type === 'file') {
      const fileName = fullPath;
      const fileUrl = item.download_url;
      try {
        const fileContent = await this.httpService.downloadFile(fileUrl);
        zip.file(fileName, fileContent); // add item to zip
      } catch (error) {
        throw new Error(`Error downloading file ${fileName}: ${error}`);
      }
    } else if (item.type === 'dir') {
      const dirContents = await this.httpService.fetchDirContents(item.url).toPromise();
      if (dirContents) {
        for (const subItem of dirContents) {
          await this.processItem(subItem, zip, fullPath + '/');
        }
      } else {
        console.warn(`Directory contents for ${fullPath} are null.`);
      }
    }
  }


  private generateZip(zip: JSZip, folderPath: string | undefined): void {
    zip.generateAsync({ type: 'blob' }).then((zipBlob: Blob) => {
      const zipUrl = URL.createObjectURL(zipBlob); // Create a temporary URL for the zip
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `${folderPath}.zip`; // Name the zip file after the folder path
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl); // Revoke the blob URL to free up memory
    }).catch((error: any) => {
      console.error(`Error generating zip file: ${error}`);
      throw new Error(`Error generating zip file: ${error}`);
    });
  }
}

/*
1. GitHub API Request:
The code starts by constructing the API URL using the helper().generateAPIUrl(url) function. Ensure that the url parameter points to the correct GitHub repository or folder.
The waitForRateLimit() function suggests that you’re handling rate limiting, which is essential when making API requests. Make sure you’re adhering to GitHub’s rate limits.

2. Fetching Folder Contents:
The code makes a GET request to the GitHub API . Verify that the API URL is correctly formed and that you have the necessary permissions to access the repository.
The response status is checked, and an error is thrown if it’s not within the successful range. Consider adding error handling or logging for better debugging.

3. Creating a Zip File:
The JSZip library is used to create a zip file. Ensure that you’ve imported the library correctly.
The loop iterates through each item in the API response. If the item is a file, it adds the file’s content to the zip using zip.file(fileName, fileContent).
Finally, the zip content is generated and made available for download.

3. Download Link:
The code creates a temporary download link for the zip file. The link is hidden (link.style.display = 'none') and triggers the download when clicked.
The zip file is named after the folder path.
*/
