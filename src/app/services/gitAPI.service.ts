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
        const apiUrl = helper().generateAPIUrl(url)
        const folderPath = apiUrl.slice(apiUrl.lastIndexOf('/') + 1)

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

//JSzip
// We use JSZip library to create a zip file.
// Inside the loop iterating over the files in the folder, we download each file's content asynchronously and add it to the zip using zip.file().
// After adding all files to the zip, we generate the zip content using zip.generateAsync({ type: 'blob' }).
// Then, we create a temporary URL for the zip content and initiate the download by creating a link element with the appropriate download attributes.
// Finally, we remove the link element and revoke the temporary URL to free up memory.