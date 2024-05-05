import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess<T extends object>(message: string, title?: string, options?: T) {
    this.toastr.success(message, title, options);
  }

  showError<T extends object>(message: string, title?: string, options?: T) {
    this.toastr.error(message, title, options);
  }

  showInfo<T extends object>(message: string, title?: string, options?: T) {
    this.toastr.info(message, title, options);
  }

  showWarning<T extends object>(message: string, title?: string, options?: T) {
    this.toastr.warning(message, title, options);
  }
  
}

