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
  constructor(private loaderService: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.show();
    
    // Pass the request through to the next handler
    return next.handle(req).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) {
            this.loaderService.hide();
          }
        },
        error: (error: HttpErrorResponse) => {
          throw new Error(`Error: ${error.error}`)
        }
      }),

      finalize(() => {
        this.loaderService.hide();
      })
    );

  }
}


/*
Certainly! In Angular, you can create an HTTP interceptor to intercept all network calls to APIs (such as API requests). Interceptors allow you to inspect and transform HTTP requests before they are sent to the server and also handle responses on their way back to the application.

STEPS:
1. Declare a class that implements the HttpInterceptor interface. This class will define the logic for intercepting requests.

2. Implement the intercept() Method:
The intercept() method transforms a request into an Observable that eventually returns the HTTP response.
Most interceptors inspect the request and forward the potentially altered request to the handle() method of the next object (which implements the HttpHandler interface).

The handle() method transforms an HTTP request into an Observable of HttpEvents, which ultimately includes the server’s response.

3. Provide the Interceptor:
The LoaderInterceptor is like a service managed by Angular’s dependency injection (DI) system.
You need to provide the interceptor class in your app’s module or a specific feature module

4. Using the Interceptor:
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