import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
      .pipe(catchError(this.handleError));
    // .pipe(catchError(errorResp => {
    //   let errorMessage = 'An unknown error occured !!';
    //   if (!errorResp.error || !errorResp.error.error) {
    //     return throwError(errorMessage);
    //   }
    //   switch (errorResp.error.error.message) {
    //     case 'EMAIL_EXISTS': errorMessage = 'The email address is already in use by another account';
    //     case 'OPERATION_NOT_ALLOWED': errorMessage = 'Password sign-in is disabled for this project';
    //     case 'TOO_MANY_ATTEMPTS_TRY_LATER': errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';
    //   }
    //   return throwError(errorMessage);
    // }));

  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.API_KEY,
      { email: email, password: password, returnSecureToken: true })
      .pipe(catchError(this.handleError));
  }
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured !!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_NOT_FOUND': {
        errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted';
        break;
      }
      case 'INVALID_PASSWORD': {
        errorMessage = 'The password is invalid or the user does not have a password';
        break;
      }
      case 'USER_DISABLED': {
        errorMessage = 'The user account has been disabled by an administrator';
        break;
      }
      case 'EMAIL_EXISTS': {
        errorMessage = 'The email address is already in use by another account';
        break;
      }
      case 'OPERATION_NOT_ALLOWED': {
        errorMessage = 'Password sign-in is disabled for this project';
        break;
      }
      case 'TOO_MANY_ATTEMPTS_TRY_LATER': {
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';
        break;
      }
      default: {
        errorMessage = 'An unknown error occured !!';
      }
    }
    return throwError(errorMessage);
  }

}
