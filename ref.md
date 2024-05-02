This code snippet will give you the last segment of the path, which corresponds to the word “src” in your provided URL

1. If you are working with the URL as a string: If you have the URL as a string (like the one you provided), you can directly split it by slashes and extract the last part. Here are a couple of variations:
Using location.href (if you are on a page with this URL):

const hrefParts = location.href.split("/");
const lastPart = hrefParts[hrefParts.length - 1];

2. Otherwise (if you have the URL as a string):

const url = "https://github.com/az1z1ally/GitGet/tree/main/src";
const lastPart = url.split("/")[url.split("/").length - 1];

# ANGULAR MODULAR VS STANDALONE COMPONENTS
1. Providers:
In a modular Angular application, providers are typically defined in the providers array of a module(main module i.e app.modules.ts) (usually in the @NgModule decorator).

However, in a standalone component approach, you can still provide services directly within the component itself.

`The providers property in your appConfig object serves a similar purpose. It allows you to provide services specifically for your standalone component.`

2. Service Injection:
Make sure that your GithubApiService (or any other services you’re using) is correctly injected into your AppComponent.
Ensure that the service is available for use within your component.

Interceptors:
Since you’re using an interceptor (LoaderInterceptor), ensure that it’s working as expected.
Check if the interceptor’s logic (showing/hiding the loader) is being executed during 

HTTP requests.
Lifecycle Considerations:
Remember that the AppComponent is created once during the application’s lifetime.
If you’re expecting the interceptor to log on page refresh, ensure that the component lifecycle methods (such as ngOnInit()) are being called as expected.


## HTTP CLIENT SERVICE
n Angular 17, they’ve introduced standalone components, which change how you build and organize Angular applications. These components are self-sufficient and can be used on their own without being tied to a specific NgModule. But, sometimes, when you’re working with these standalone components, you might need to fetch data from servers or interact with APIs using HTTP requests. This article will guide you through various ways of incorporating an HTTP service into your Angular 17 standalone component

### Approach 1: Injecting the HttpClient service directly into the component
//app.component.ts

import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, JsonPipe, HttpClientModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    private http = inject(HttpClient);
    post: any;

    constructor() {
        this.http.get('https://jsonplaceholder.typicode.com/posts/1')
            .subscribe(data => {
                this.post = data;
            });
    }
}


### Approach 2: Creating a standalone service with HttpClient injected
In this approach, you create a separate standalone service that encapsulates the HTTP functionality. The HttpClient service is injected into this standalone service, which can then be used by multiple components.

//main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(withFetch()) // provideHttpClient()
        importProvidersFrom(HttpClientModule),
    ]
}).catch((err) =>
    console.error(err)
);


//app.component.ts

import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyServiceService } from './my-service.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, JsonPipe ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    post: any;

    constructor(private myService: MyServiceService) {
        this.post = this.myService.getData();
    }
}


// my-service.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MyServiceService {

    constructor(private httpClient: HttpClient) { }

    getData() {
        this.httpClient.get('https://jsonplaceholder.typicode.com/posts/1')
            .subscribe(data => {
                return data;
            });
    }
}

## Approach 3: Using the HttpClientModule in a shared NgModule

Although standalone components are designed to be self-contained, you can still create a shared NgModule that provides the HttpClientModule and other services or pipes that may be required by multiple components.

Step 1: Create a new NgModule:
$ ng g module shared

//shared.module.ts

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        HttpClientModule
    ],
    exports: [
        HttpClientModule
    ]
})
export class SharedModule { }


//app.component.ts

//import the SharedModule:

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NgIf, JsonPipe, SharedModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})

https://www.geeksforgeeks.org/using-a-http-service-in-angular-17-with-standalone-components/

/* If you are not using angular's standalone components
  The HttpClientModule is indeed a module, not a component. It provides the HttpClient service for making HTTP requests.
`You should import HttpClientModule in your app’s main module (usually app.module.ts) to make the HttpClient service available throughout your application.`
*/
