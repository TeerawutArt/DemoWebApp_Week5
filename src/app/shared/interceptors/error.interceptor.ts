import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

//ดัก api ที่รับ-ส่ง backEnd
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    //pipe ดัก Observe ที่ส่งกลับมา
    catchError((err: HttpErrorResponse) => {
      let message = '';
      if (err.status) {
        const errors = Object.values(err.error.errors);
        message += '<ul>';
        errors.map((e) => {
          message += '<li>' + e + '</li>';
        });
        message += '</ul>';
      }
      return throwError(() => new Error(message));
    })
  );
};
