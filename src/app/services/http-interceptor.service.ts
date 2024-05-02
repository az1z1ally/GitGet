import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log('Interceptor is intercepting HTTP request:', req.url);
    this.loaderService.show(); // Show loader when request starts
    
    // Pass the request through to the next handler
    return next.handle(req).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) {
            setTimeout(() => this.loaderService.hide(), 1500) // Hide loader on successful response
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loaderService.hide(); // Hide loader on error
          // this.toastrService.error('An error occurred. Please try again later.', error.error); // Display error message to the user
          throw new Error(`Error: ${error.error}`) 
        }
      }),

      finalize(() => {
        setTimeout(() => this.loaderService.hide(), 1500) // Hide loader when request completes (whether successful or not)
      })
    );

  }
}




/*
In Angular, you can create an HTTP interceptor to intercept all network calls to APIs (such as API requests). Interceptors allow you to inspect and transform HTTP requests before they are sent to the server and also handle responses on their way back to the application.

STEPS:
1. Declare a class that implements the HttpInterceptor interface. This class will define the logic for intercepting requests.

import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

// Pass untouched request through to the next request handler
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}

2. Implement the intercept() Method:
The intercept() method transforms a request into an Observable that eventually returns the HTTP response.
Most interceptors inspect the request and forward the potentially altered request to the handle() method of the next object (which implements the HttpHandler interface).

Like intercept(), the handle() method transforms an HTTP request into an Observable of HttpEvents, which ultimately includes the server’s response.The next object represents the next interceptor in the chain of interceptors. The final next in the chain is the HttpClient backend handler that sends the request to the server and receives the server's response.
Most interceptors call next.handle() so that the request flows through to the next interceptor and, eventually, the backend handler. An interceptor could skip calling next.handle(), short-circuit the chain, and return its own Observable with an artificial server response.
This no-op interceptor calls next.handle() with the original request and returns the observable without doing a thing.

3. Provide the Interceptor:
The LoaderInterceptor is like a service managed by Angular’s dependency injection (DI) system.
You need to provide the interceptor class in your app’s module or a specific feature module

***** NB Because interceptors are optional dependencies of the HttpClient service, you must provide them in the same injector or a parent of the injector that provides HttpClient. Interceptors provided after DI creates the HttpClient are ignored.

This app provides HttpClient in the app's root injector by adding the HttpClientModule to the providers array of the ApplicationConfig in app.config.ts. You should provide interceptors there as well.

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    noopInterceptorProvider,
  ]
};

4.Interceptor order
Angular applies interceptors in the order that you provide them. For example, consider a situation in which you want to handle the authentication of your HTTP requests and log them before sending them to a server. To accomplish this task, you could provide an AuthInterceptor service and then a LoggingInterceptor service. Outgoing requests would flow from the AuthInterceptor to the LoggingInterceptor. Responses from these requests would flow in the other direction, from LoggingInterceptor back to AuthInterceptor.

5. Using the Interceptor:
Once you’ve provided the interceptor, it will automatically intercept all HTTP requests made using Angular’s HttpClient.

You can add more logic to the intercept() method to modify headers, add authentication tokens, or handle other tasks.

Remember that you can create more complex interceptors to handle specific use cases, such as adding authentication headers or logging requests. Feel free to customize the interceptor according to your project’s requirements! 😊

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Pass the request through to the next handler
    return next.handle(req);
  }
}


import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

HTTP INTERCEPTOR WITH ASYNC
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  async intercept(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const authToken = await this.authService.getAuthToken(); // Your async logic here
    const authReq = req.clone({ setHeaders: { Authorization: authToken } });
    return next.handle(authReq).toPromise();
  }
}
*/