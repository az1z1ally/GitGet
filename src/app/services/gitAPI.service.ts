import { Injectable } from '@angular/core';
import { helper } from '../shared/helpers/helper';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  constructor() {}

  // Fetch folder contents from GitHub API and download files
  downloadFolderFromGitHub = async (url: string): Promise<void> => {
    try {
      // Remove the url's trailing slash if it exists
      const trimmedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      const folderPath = trimmedUrl.split('/')[trimmedUrl.split('/').length - 1];

      // Generate github API url
      const apiUrl = helper().generateAPIUrl(trimmedUrl)

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

      // Create a zip file
      const zip = new JSZip();

      // Add each file to the zip
      for (const item of data) {
          if (item.type === 'file') {
            const fileName = item.name;
            const fileUrl = item.download_url;
            const fileContent = await this.downloadFile(fileUrl);
            zip.file(fileName, fileContent);
          }
      }

      // Generate the zip content
      const zipContent = await zip.generateAsync({ type: 'blob' });
      
      // Create a temporary URL for the zip
      const zipUrl = URL.createObjectURL(zipContent);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `${folderPath}.zip`; // Name the zip file after the folder path
      link.style.display = 'none';

      // Append the link to the body
      document.body.appendChild(link);

      // Trigger the click event to start the download
      link.click();

      // Remove the link from the body
      document.body.removeChild(link);

      // Revoke the blob URL to free up memory
      URL.revokeObjectURL(zipUrl);

    } catch (error) {
        console.error('Error:', error);
    }
  }

  // Function to download a file from a URL
  downloadFile = async(url: string): Promise<ArrayBuffer> => {
  try {
    // Wait to comply with rate limiting
    await helper().waitForRateLimit();

    // Fetch the file content asynchronously
    const response = await fetch(url);

    // Check if response status is within the successful range
    if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
    }

    // Read the file content as an ArrayBuffer
    const content = await response.arrayBuffer();
    return content;

    } catch (error) {
        throw new Error(`Error: ${error}`)
    }
  }
}

/*
1. GitHub API Request:
The code starts by constructing the API URL using the helper().generateAPIUrl(url) function. Ensure that the url parameter points to the correct GitHub repository or folder.
The waitForRateLimit() function suggests that you’re handling rate limiting, which is essential when making API requests. Make sure you’re adhering to GitHub’s rate limits.

2. Fetching Folder Contents:
The code makes a GET request to the GitHub API using fetch(apiUrl). Verify that the API URL is correctly formed and that you have the necessary permissions to access the repository.
The response status is checked, and an error is thrown if it’s not within the successful range. Consider adding error handling or logging for better debugging.

3. Creating a Zip File:
The JSZip library is used to create a zip file. Ensure that you’ve imported the library correctly.
The loop iterates through each item in the API response. If the item is a file, it adds the file’s content to the zip using zip.file(fileName, fileContent).
Finally, the zip content is generated and made available for download.

3. Download Link:
The code creates a temporary download link for the zip file. The link is hidden (link.style.display = 'none') and triggers the download when clicked.
The zip file is named after the folder path.
*/