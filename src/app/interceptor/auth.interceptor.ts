import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token = this.authService.authToken;
    let authReq = req.clone({
      headers: req.headers.set('authorization', 'Bearer ' + token)
    })
    return next.handle(authReq);
  }

}
