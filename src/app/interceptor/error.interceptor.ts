import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from '../components/error/error.component';
import { Injectable } from '@angular/core';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

constructor(private matDia : MatDialog){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                let message = 'Custom FE error';
                if(error?.error?.message){
                    message = error.error.message;
                }
                this.matDia.open(ErrorComponent, {data : {message :message }});
                return throwError(error);
            })
        )
    }

}
