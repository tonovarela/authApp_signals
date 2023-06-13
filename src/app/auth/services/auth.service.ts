import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User, AuthStatus, LoginResponse, CheckTokenResponse } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseURL: string = environment.baseURL;
  private http = inject(HttpClient)
  
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);


  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseURL}/auth/login`
    const body = { email, password };
    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(e => throwError(() => e.error.message)),
    );

  }


  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseURL}/auth/check-token`;
    const token = localStorage.getItem('token');
    if (!token) {
      this._authStatus.set(AuthStatus.notAuthenticated);
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
        map(({ token, user }) => this.setAuthentication(user, token)),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        }),
      );
  }



  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }
}
