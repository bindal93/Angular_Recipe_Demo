import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponseData } from './authResponseData.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_KEY: string = "AIzaSyBvKng5n8yt9B7mS1cCkCygISUR5nKcalY";
  constructor(private http: HttpClient) { };

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.API_KEY,
      { email: email, password: password, returnSecureToken: true })
      .pipe(catchError(errorResp => {
        let errorMessage = 'An unknown error occured !!';
        if (!errorResp.error || !errorResp.error.error) {
          return throwError(errorMessage);
        }
        switch (errorResp.error.error.message) {
          case 'EMAIL_EXISTS': errorMessage = 'The email address is already in use by another account';
          case 'OPERATION_NOT_ALLOWED': errorMessage = 'Password sign-in is disabled for this project';
          case 'TOO_MANY_ATTEMPTS_TRY_LATER': errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later'
        }
        return throwError(errorMessage);
      }));
  }
}
