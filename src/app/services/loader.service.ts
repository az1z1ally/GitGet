import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  show() {
    console.log('show');
    this.isLoadingSubject.next(true);
  }

  hide() {
    console.log('hide');
    this.isLoadingSubject.next(false);
  }
}
