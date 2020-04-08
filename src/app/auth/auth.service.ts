import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthResponseData } from "./authResponseData.model";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTmer: any;
  private API_KEY: string = "AIzaSyBvKng5n8yt9B7mS1cCkCygISUR5nKcalY";
  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
          this.API_KEY,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
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
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
          this.API_KEY,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }
  logout() {
    this.user.next(null);
    this.router.navigate(["/auth"]);
    localStorage.removeItem("userData");
    if (this.tokenExpirationTmer) {
      clearTimeout(this.tokenExpirationTmer);
    }
    this.tokenExpirationTmer = null;
  }
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTmer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
  private handleAuthentication(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem("userData", JSON.stringify(user));
  }
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured !!";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_NOT_FOUND": {
        errorMessage =
          "There is no user record corresponding to this identifier. The user may have been deleted";
        break;
      }
      case "INVALID_PASSWORD": {
        errorMessage =
          "The password is invalid or the user does not have a password";
        break;
      }
      case "USER_DISABLED": {
        errorMessage = "The user account has been disabled by an administrator";
        break;
      }
      case "EMAIL_EXISTS": {
        errorMessage = "The email address is already in use by another account";
        break;
      }
      case "OPERATION_NOT_ALLOWED": {
        errorMessage = "Password sign-in is disabled for this project";
        break;
      }
      case "TOO_MANY_ATTEMPTS_TRY_LATER": {
        errorMessage =
          "We have blocked all requests from this device due to unusual activity. Try again later";
        break;
      }
      default: {
        errorMessage = "An unknown error occured !!";
      }
    }
    return throwError(errorMessage);
  }
}
