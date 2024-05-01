import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class FileDownloaderService2 {

  constructor(private http: HttpClient) { }

  downloadFilesFromApi(apiUrl: string): void {
    this.http.get<any[]>(apiUrl, { responseType: 'json' }).subscribe((data: any[]) => {
      const zip = new JSZip();

      this.downloadFilesRecursively(data, zip, '');
      
      zip.generateAsync({ type: 'blob' }).then(content => {
        // Create a blob link to trigger download
        const blob = new Blob([content]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'downloaded_files.zip';
        link.click();
      });
    });
  }

  private downloadFilesRecursively(items: any[], zip: JSZip, basePath: string): void {
    items.forEach(item => {
      if (item.type === 'file') {
        // Add file to zip
        const fileName = basePath ? basePath + '/' + item.name : item.name;
        this.http.get(item.download_url, { responseType: 'blob' }).subscribe((data) => {
          zip.file(fileName, data);
        })
        
      } else if (item.type === 'dir') {
        // Recursively download files in directory
        this.http.get<any[]>(item.url, { responseType: 'json' }).subscribe((subItems: any[]) => {
          this.downloadFilesRecursively(subItems, zip, basePath ? basePath + '/' + item.name : item.name);
        });
      }
    });
  }
}


/*
Given The asynchronous nature of HttpClient calls in Angular means that there's a possibility of downloading the zip before all files have been fetched, leading to missing files in the zip.

To ensure that all files are downloaded before generating the zip, we need to wait for all HTTP requests to complete. We can achieve this using techniques such as using RxJS operators like forkJoin or concatMap to handle multiple HTTP requests and wait for all of them to complete.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as JSZip from 'jszip';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileDownloaderService {

  constructor(private http: HttpClient) { }

  downloadFilesFromApi(apiUrl: string): void {
    this.http.get(apiUrl, { responseType: 'json' }).subscribe((data: any[]) => {
      const zip = new JSZip();
      const observables = [];

      this.createFileObservables(data, observables);

      forkJoin(observables).subscribe(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
          // Create a blob link to trigger download
          const blob = new Blob([content]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'downloaded_files.zip';
          link.click();
        });
      });
    });
  }

  private createFileObservables(items: any[], observables: any[]): void {
    items.forEach(item => {
      if (item.type === 'file') {
        // Create observable for file download
        const fileObservable = this.http.get(item.download_url, { responseType: 'blob' });
        observables.push(fileObservable);
      } else if (item.type === 'dir') {
        // Recursively download files in directory
        const dirObservable = this.http.get(item.url, { responseType: 'json' });
        observables.push(dirObservable);
        dirObservable.subscribe((subItems: any[]) => {
          this.createFileObservables(subItems, observables);
        });
      }
    });
  }
}


We create an array observables to store all the observables representing file downloads.
We use the createFileObservables function to recursively traverse the directory structure and create observables for each file download.
We use forkJoin to wait for all observables to complete before generating the zip file.
This way, we ensure that the zip is generated only after all files have been downloaded.
*/