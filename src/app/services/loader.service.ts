import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public isLoading = new BehaviorSubject<boolean>(false);

  show() {
    console.log('show');
    this.isLoading.next(true);
  }

  hide() {
    console.log('hide');
    this.isLoading.next(false);
  }
}
