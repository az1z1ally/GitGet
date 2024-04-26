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