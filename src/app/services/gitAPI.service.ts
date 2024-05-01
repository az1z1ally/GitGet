import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import JSZip from 'jszip';
import { catchError, map, tap } from 'rxjs/operators';
import { helper } from '../shared/helpers/helper';
import { Observable, forkJoin, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileDownloaderService {
  constructor(private httpService: HttpService) {}

  // Fetch folder contents from GitHub API and download files
  downloadFilesFromGitHub(url: string): void {
    const trimmedUrl: string = url.endsWith('/') ? url.slice(0, -1) : url; // Remove the url's trailing slash if it exists
    const folderPath = trimmedUrl.split('/').pop(); // Get the last segment of the URL

     // Generate GitHub API url
    const apiUrl = helper().generateAPIUrl(trimmedUrl);

    // Create a zip file
    const zip = new JSZip();

    // Make a GET request to the GitHub API
    this.httpService.fetchData(apiUrl).pipe(
      catchError(error => {
        console.error(`Failed to fetch folder contents: ${error}`);
        throw new Error(`Failed to fetch folder contents: ${error}`);
      }),
      map((data: any) => Array.isArray(data) ? data : [data]), // Ensure data is always an array
      tap((data: any[]) => {
        const observables: Observable<void>[] = [];
        data.forEach(item => {
          observables.push(this.processItem(item, zip));
        });
        return forkJoin(observables); // Wait for all observables to complete(waits for all the HTTP requests (for files and directories) to finish processing.)
      })
    ).subscribe(() => {
      // Generate zip Url & download
      this.generateZip(zip, folderPath);
    });
  }

  private processItem(item: any, zip: JSZip, currentPath: string = ''): Observable<void> {
    const fullPath = currentPath + item.name;

    if (item.type === 'file') {
      const fileName = fullPath;
      const fileUrl = item.download_url;

      return this.httpService.downloadFile(fileUrl).pipe(
        catchError((error: HttpErrorResponse)=> {
          // Handle HTTP errors
          console.error(`Error downloading file from ${fileUrl}:`, error.message || error);
          throw new Error(`Error downloading file from ${fileUrl}: ${error.statusText}`);
        }),
        tap(fileContent => {
          zip.file(fileName, fileContent); // add item to zip
        }),
        map(() => void 0) // Transform emitted value into void
      );

    } else if (item.type === 'dir') {
      console.log('dir top');
      
      return this.httpService.fetchDirContents(item.url).pipe(
        catchError(error => {
          console.warn(`Directory contents for ${fullPath} are null.`);
          return of([]); // Return empty array to continue processing
        }),
        tap((dirContents: any[]) => {
          if (dirContents) {
            const observables: Observable<void>[] = [];
            dirContents.forEach(subItem => {
              observables.push(this.processItem(subItem, zip, fullPath + '/'));
            });
            return forkJoin(observables); // Wait for all observables to complete
          } else {
            console.warn(`Directory contents for ${fullPath} are null.`);
            return of(void 0); // Return undefined observable
          }
        }),
        map(() => void 0) // Transform emitted value into void
      );
    } else {
      return of(void 0); // Return undefined observable for unsupported item types
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
EXPLANATION:
For the fetchDirContents call:
Originally, after fetching directory contents, you were using the tap operator to perform a side effect (processing the directory contents) without altering the emitted value. However, since tap doesn't transform the emitted value, it wasn't returning void, which caused a type mismatch.
To align the return type with Observable<void>, we need to ensure that the emitted value is void. Since the fetchDirContents method returns Observable<any[]>, we need to transform the emitted value into void.
To achieve this, we use the map operator after tap. The map operator allows us to transform the emitted value. In this case, we're not interested in the emitted value itself, so we transform it into void by returning void 0. This ensures that the resulting observable emits void.

For the downloadFile call:
Similarly, the original code used the tap operator after downloading a file to perform a side effect (adding the file to the zip) without altering the emitted value. Again, this caused a type mismatch.
To align the return type with Observable<void>, we need to ensure that the emitted value is void. Since the downloadFile method returns Observable<ArrayBuffer>, we need to transform the emitted value into void.
Instead of using tap, we use the map operator. Similar to the previous case, we're not interested in the emitted value itself, so we transform it into void by returning void 0. This ensures that the resulting observable emits void

This approach achieves the same result as using map alone for adding file content to the zip & return void.
*/

/*
The map() and tap() operators in RxJS serve different purposes, primarily in how they handle the values emitted by an observable and the actions they perform:

1. map() Operator:
Purpose: The map() operator transforms each value emitted by the source observable into a new value. It applies a transformation function to each emitted value and emits the transformed value as the output.
Usage: It's commonly used when you want to transform the data emitted by an observable into a different form.
Example: Converting data types, applying calculations, or extracting specific properties from objects.

2. tap() Operator:
Purpose: The tap() operator allows you to perform side effects for each value emitted by the source observable without affecting the emitted value itself. It's often used for logging, debugging, or executing code that doesn't alter the data stream.
Usage: It's used when you need to perform actions that don't modify the emitted values but are still related to the data stream.
Example: Logging values, making HTTP requests, updating external state, or triggering other operations.
Now, when we talk about "performing side effects," we mean executing actions that have observable effects beyond the scope of the current data stream. These actions don't directly transform the emitted values but can have an impact on the application's state or trigger other operations.


CONVEYOR BELT ANALOGY
Imagine you're watching a conveyor belt at a factory where different items pass by. Each item represents a value emitted by an observable. Now, let's talk about the two operators:

map() Operator:
This operator is like a machine on the conveyor belt that modifies each item as it goes by. For example, it might paint each item a different color or change its shape. But the items keep moving along the conveyor belt with their new appearance.
In simpler terms, it's like a machine that changes the look of each item but doesn't stop or affect how the items move along the belt.

tap() Operator:
This operator is like a person standing beside the conveyor belt who looks at each item as it goes by. Instead of changing the item, this person might write down some notes about each item they see or take a photo for documentation. They're not changing the items themselves; they're just observing and recording information about them.
In simpler terms, it's like someone watching the items go by and taking notes or pictures without actually touching or altering the items.
So, when we talk about "performing side effects" with tap(), we mean doing things like taking notes, logging information, or triggering other actions that don't change the items on the conveyor belt (the emitted values), but still have an impact on what's happening around them (like keeping track of what's going on in the factory).

I hope this analogy helps clarify the difference between map() and tap() and what we mean by "performing side effects" in the context of observable streams!


== ABOUT THE SERVICE
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
