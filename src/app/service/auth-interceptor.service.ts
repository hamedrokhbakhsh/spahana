import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError, tap} from 'rxjs/operators';
import {isPlatformBrowser} from '@angular/common';
import {AppService} from './app.service';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AppService, private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem('token');
        if (token) {
            req = req.clone({headers: req.headers.set('authorization', token)});
        }
        return next.handle(req).pipe(
            tap(
                res => {
                    return res;
                }),
            catchError((error: any) => {
                if (error.status === 401) {
                    this.authService.logout().then();
                } else if (error.status === 404) {

                } else if (error.status === 403) {
                    this.authService.logout().then();
                }
                return throwError(error);
            })
        );
    }
}
