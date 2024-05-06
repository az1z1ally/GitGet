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


## CHEcK FOR DEVICE NETWORK CONNECTIONS STATUS
`console.log('Initially ' + (window.navigator.onLine ? 'online' : 'offline'));
window.addEventListener('online', () => console.log('Became online'));
window.addEventListener('offline', () => console.log('Became offline'));

// Example: Check the status when a button is clicked
document.getElementById('statusCheck').addEventListener('click', () => {
    console.log('window.navigator.onLine is ' + window.navigator.onLine);
});

// HTML button to trigger the check
<button id="statusCheck">Click to check the <tt>window.navigator.onLine</tt> property</button>`

This code snippet does the following:

1. It logs the initial online/offline status.
2. It listens for the online and offline events and logs messages accordingly.
3. When the button with ID statusCheck is clicked, it checks the window.navigator.onLine property and logs its value.

## navigator.onLine
The online property of the navigator interface, navigator.onLine, is frequently used to detect the online and offline status of the browser.

Combined with listeners for online and offline events, it appears to provide a simple solution for developers that is easy to implement.

## Let's look at how we'd implement navigator.onLine
Start by adding a load event listener. When the load event fires, the listener will check the online property of the navigator interface and then display the online status.

The online property of navigator provides a boolean (true or false) response. To finish the action of the listener, we’ll use a ternary statement to set the status display value.

`window.addEventListener("load", (event) => {
  const statusDisplay = document.getElementById("status");
  statusDisplay.textContent = navigator.onLine ? "Online" : "Offline";
});`

Center an h1 element in your HTML page with the id of “status”. If you apply the JavaScript code above to your page, you should see it display “Online”.

But this only updates the h1 element when the page loads. Let’s add offline and online event listeners to update the status display any time either of those events fires.

`window.addEventListener("offline", (event) => {
  const statusDisplay = document.getElementById("status");
  statusDisplay.textContent = "Offline";
});`

`window.addEventListener("online", (event) => {
  const statusDisplay = document.getElementById("status");
  statusDisplay.textContent = "Online";
});
`
** Keep in mind that while navigator.onLine can tell you if the browser is connected to some network, it doesn’t guarantee internet access. For more accurate checks, you might need additional means, especially if you want to ensure actual internet connectivity **

“Online does not always mean connection to the Internet. It can also just mean connection to some network”.

## So what’s the solution?
We need to know when our application is truly connected to the Internet and not just a router or local network. Let’s go back to our JavaScript file and start over.

1. Ping a Reliable External Server:
You can ping a reliable external server (e.g., Google’s DNS server) to verify internet connectivity.
Use the navigator.sendBeacon() method to send a small request to a known server. If successful, it indicates internet access.

The `navigator.sendBeacon()` method asynchronously sends an HTTP POST request containing a small amount of data to a web server.
The sendBeacon() method returns true if the user agent successfully queued the data for transfer. Otherwise, it returns false. It's intended to be used for sending analytics data to a web server.

Example:
`const serverUrl = 'https://dns.google.com/resolve'; // navigator.sendBeacon(serverUrl);
const data = JSON.stringify({ name: 'example.com' });

navigator.sendBeacon(serverUrl, data);
`

2. Fetch a Lightweight Resource:
Fetch a lightweight resource (e.g., a small image or an empty JSON file) from a known server.
If the fetch is successful, it confirms internet connectivity.

Example:
`const resourceUrl = 'https://example.com/empty.json';

const resourceUrl = 'https://example.com/empty.json';

fetch(resourceUrl)
  .then(response => {
    if (response.ok) {
      console.log('Internet access confirmed.');
      // Process data
    } else {
      console.log('No internet access.');
    }
  })
  .catch(error => {
    console.error('Error fetching resource:', error);
    // Retry or handle the failure
  });`

  // OR

`const checkConnectionStatus = async () => {
  try {
    const response = await fetch("/1pixel.png");
    return response.ok // either true or false
  } catch (err) {
    return false; // definitely offline
  }
};
`

3. Check after some interval
Next, we’ll use the setInterval method and pass it an anonymous async function. The async function will await the result of our checkOnlineStatus function. We will then use a ternary statement with the result to display the current online status.

`setInterval(async () => {
  const result = await checkConnectionStatus();
  const statusDisplay = document.getElementById("status");
  statusDisplay.textContent = result ? "Online" : "Offline";
}, 3000); // probably too often, try 30000 for every 30 seconds`

4. Include the load event listener with async functionality! The load event detection is probably only important if you have a Progressive Web App utilizing a service worker for offline availability. Otherwise, your web page or app simply won't load without a connection.

Here's the new load event listener:

`window.addEventListener("load", async (event) => {
  const statusDisplay = document.getElementById("status");
  statusDisplay.textContent = (await checkConnectionStatus())
    ? "Online"
    : "Offline";
});`

5. A Final Thought
Although  the above interval code is good for displaying a connection status in your app but i don't suggest relying on a connection status that was checked 20 or 30 seconds prior to making a critical data request in your application.

Therefore, you should call the checkOnlineStatus function directly prior to the request and evaluate the response before requesting data.

`const yourDataRequestFunction = async () => {
    const online = await checkConnectionStatus();
    if (online) {
    	// make data request
    }
}`

https://www.freecodecamp.org/news/how-to-check-internet-connection-status-with-javascript/