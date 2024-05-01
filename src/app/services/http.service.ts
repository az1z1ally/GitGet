import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { helper } from '../shared/helpers/helper';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  subItemsSubject = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  fetchData<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  // Function to download a file from a URL
  downloadFile(url: string): Observable<ArrayBuffer> {
    // Wait to comply with rate limiting
    helper().waitForRateLimit();

    // Set request headers to accept binary data and any other required headers
    const headers = new HttpHeaders({
      'Accept': 'application/octet-stream', // Ensure binary data is accepted
      // Add any other required headers here
    });

    // Make HTTP GET request to download the file
    return this.http.get(url, { 
      responseType: 'arraybuffer',
      headers: headers
    })
  }

  fetchDirContents(url: string): Observable<any[]> {
    return this.http.get<any[]>(url);
  }
}

/* 
  Since Angular runs in the browser and doesn't have direct access to the file system like Python does, we'll need to approach it slightly differently. We'll use Angular's HttpClient to interact with the API and the JSZip library to create a zip file containing the downloaded files.
*/


/*
If you prefer python

import requests

def download_file(url, path):
    response = requests.get(url)
    with open(path, 'wb') as file:
        file.write(response.content)

def download_from_api(api_url):
    response = requests.get(api_url)
    data = response.json()
    
    for item in data:
        if item['type'] == 'file':
            download_file(item['download_url'], item['name'])
        elif item['type'] == 'dir':
            download_from_api(item['url'])

# Example usage
api_url = 'https://api.github.com/repos/az1z1ally/GitHives/contents/src'
download_from_api(api_url)


In Python, the mode 'wb' used in the open() function stands for "write binary".

'w' denotes that the file will be opened in write mode.
'b' denotes that the file will be treated in binary mode, which is suitable for working with binary files such as images, audio, video, etc.

When a file is opened in binary mode, it ensures that no line-ending translations are performed, and the data is written or read exactly as it is, without any modification. This mode is commonly used when dealing with non-text files to ensure that no character encoding conversions or line ending translations occur, which could corrupt binary data.
*/