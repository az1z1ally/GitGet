import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { helper } from '../../shared/helpers/helper';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  fetchData<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  // Function to download a file from a URL
  downloadFile(url: string): Promise<ArrayBuffer> {
    // Wait to comply with rate limiting
    helper().waitForRateLimit();

    // Set request headers to accept binary data and any other required headers
    const headers = new HttpHeaders({
      'Accept': 'application/octet-stream', // Ensure binary data is accepted
      // Add any other required headers here
    });

    // Make HTTP GET request to download the file
    return new Promise<ArrayBuffer>((resolve, reject) => {
      this.http.get(url, { responseType: 'arraybuffer', headers: headers }).subscribe(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  fetchDirContents(url: string): Observable<any[]> {
    return this.http.get<any[]>(url);
  }
  
}
