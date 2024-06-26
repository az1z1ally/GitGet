import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import JSZip from 'jszip';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { helper } from '../shared/helpers/helper';
import { BehaviorSubject, Observable, forkJoin, from, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../shared/services/notifications.service';
import { NetworkErrorsEnum } from '../shared/types/errors.enum';

@Injectable({
  providedIn: 'root'
})
export class FileDownloaderService {
  private isDownloadingSubject = new BehaviorSubject<boolean>(false)
  isDownloading$ = this.isDownloadingSubject.asObservable()

  constructor(
    private httpService: HttpService,
    private notificationService: NotificationService
  ) {}

  setIsLoading() {
    this.isDownloadingSubject.next(true)
  }

  unsetIsLoading() {
    this.isDownloadingSubject.next(false)
  }

  // Fetch folder contents from GitHub API and download files
  downloadFilesFromGitHub(url: string): void {
    const trimmedUrl: string = url.endsWith('/') ? url.slice(0, -1) : url; // Remove the url's trailing slash if it exists
    const folderPath = trimmedUrl.split('/').pop(); // Get the last segment of the URL

    let apiUrl: string = ''

    try {
      // Generate GitHub API url
       apiUrl = helper().generateAPIUrl(trimmedUrl);
    } catch(error) {
      // console.error(error);
      this.notificationService.showError(`${error}. ⚡🫢`, `${NetworkErrorsEnum.invalid}:`);
      return
    }

    // Create a zip file
    const zip = new JSZip();

    // Make a GET request to the GitHub API
    this.httpService.fetchData(apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.error(error);
        throw new Error(`${error.message} Failed to fetch folder contents.`);
      }),
      tap(() => this.setIsLoading()),
      map((data: any) => Array.isArray(data) ? data : [data]), // Ensure data is always an array
      mergeMap((data: any[]) => data), // Flatten the array of items to process each item individually
      mergeMap((item: any) => this.processItem(item, zip), 4) // Limit concurrency to 4 requests
    ).subscribe(
      () => {}, // No-op for completion
      error => {
        this.notificationService.showError(`${error.message}. ⚡🫢`, `${NetworkErrorsEnum.unknown}:`)
        this.unsetIsLoading() // Set isDownloading$ to false
      },

      () => {
        // Generate zip Url & download
        this.generateZip(zip, folderPath);
      }
    );
  }


  // Recursively download and add files to zip
  private processItem(item: any, zip: JSZip, currentPath: string = ''): Observable<void> {
    const fullPath = currentPath + item.name;
  
    if (item.type === 'file') {
      const fileName = fullPath;
      const fileUrl = item.download_url;
  
      return this.httpService.downloadFile(fileUrl).pipe(
        catchError((error: HttpErrorResponse)=> {
          // Handle HTTP errors
          //console.error(`Error downloading file from ${fileUrl}.`, `${error.message || error}`);
          throw new Error(`Error downloading file from ${fileUrl}: ${error.name}`);
        }),
        tap(fileContent => {
          zip.file(fileName, fileContent); // add item to zip
        }),
        map(() => void 0) // Transform emitted value into void
      );
  
    } else if (item.type === 'dir') {
      return this.httpService.fetchDirContents(item.url).pipe(
        catchError(error => {
          this.notificationService.showWarning(`Directory contents for ${fullPath} are null. ⚠️`);
          return of([]); // Return empty array to continue processing
        }),
        mergeMap((dirContents: any[]) => {
          if (dirContents) {
            return from(dirContents).pipe(
              mergeMap(subItem => this.processItem(subItem, zip, fullPath + '/'))
            );
          } else {
            this.notificationService.showWarning(`Directory contents for ${fullPath} are null. ⚠️`);
            return of(void 0); // Continue processing even if directory contents are null
          }
        })
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

      this.notificationService.showSuccess(`Files downloaded successfully. 🤗`)
      this.unsetIsLoading() // Set isDownloading$ to false
    }).catch((error: any) => {
      // console.error(`Error generating zip file: ${error}`);
      this.notificationService.showError(`Error generating zip file. ⚡🫢`, `${NetworkErrorsEnum.zipError}:`)
      // throw new Error(`Error generating zip file: ${error}`);
      this.unsetIsLoading() // Set isDownloading$ to false
    });
  }
}




/*
EXPLANATION:
1. MergeMap:
mergeMap is an operator provided by RxJS. It's often used to transform each item emitted by the source observable into an observable, and then merge those observables into a single observable stream.
Here mergeMap is used in the processItem method within the block where the type of the item is 'dir' (directory). This is where recursion happens for processing nested directories.
When a directory is encountered, mergeMap is used to transform the array of directory contents (dirContents) into a stream of observables. Each observable represents the processing of a single item (either a file or another directory) within the directory.
By using mergeMap, the observables generated for processing each item are merged into a single observable stream, ensuring that the processing of each item happens concurrently but in a controlled manner (since you're already limiting concurrency with mergeMap in your downloadFilesFromGitHub method).

2. From:
from is a creation operator provided by RxJS. It's used to create an observable from an array, iterable, or promise.
Here, from is used within mergeMap to convert the array of directory contents (dirContents) into an observable stream.
By using from, each item in the array (subItem) becomes an emission in the resulting observable stream. This allows you to apply operators like mergeMap or concatMap to process each item individually within the observable stream.

**** this is before
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
