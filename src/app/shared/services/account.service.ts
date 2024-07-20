import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { environment } from '../../../environments/environment.development';
import { LoginUserDto } from '../dtos/login-user.dto';
import { TokenResultDto } from '../dtos/token-result.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ForgotPasswordDTO } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { JwtHelperService } from '@auth0/angular-jwt';
import { firstValueFrom, Subject } from 'rxjs';

export const authKey = {
  accessToken: 'auth.jwt:' + location.origin, //เปลี่ยนชื่อkey
  refreshToken: 'auth.rt:' + location.origin,
};

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private authChangeSub = new Subject<boolean>();
  authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient, private jwtService: JwtHelperService) {}

  register(request: RegisterUserDto) {
    let reqUrl = environment.apiBaseUrl + '/accounts/register';
    return this.http.post<unknown>(reqUrl, request);
  }

  login(request: LoginUserDto) {
    let reqUrl = environment.apiBaseUrl + '/accounts/login';
    return this.http.post<TokenResultDto>(reqUrl, request);
  }

  logout() {
    let reqUrl = environment.apiBaseUrl + '/accounts/token/revoke';
    return this.http.post<unknown>(reqUrl, {});
  }

  refresh(req: RefreshTokenDto) {
    let reqUrl = environment.apiBaseUrl + '/accounts/token/refresh';
    return this.http.post<TokenResultDto>(reqUrl, req);
  }

  forgotPassword(request: ForgotPasswordDTO) {
    let reqUrl = environment.apiBaseUrl + '/accounts/forgotpassword';
    return this.http.post<unknown>(reqUrl, request);
  }

  resetPassword(request: ResetPasswordDto) {
    let reqUrl = environment.apiBaseUrl + '/accounts/resetpassword';
    return this.http.post<unknown>(reqUrl, request);
  }

  async isUserAuthenticated(): Promise<boolean> {
    const at = localStorage.getItem(authKey.accessToken);
    if (at == null) {
      this.authChangeSub.next(false);
      return false;
    }
    //expired
    if (this.jwtService.isTokenExpired(at) == false) {
      this.authChangeSub.next(true);
      return true;
    }
    //refresh token
    const rt = localStorage.getItem(authKey.refreshToken);
    if (rt == null) {
      this.authChangeSub.next(false);
      return false;
    } //guard
    const req: RefreshTokenDto = { accessToken: at, refreshToken: rt };
    try {
      const res = await firstValueFrom<TokenResultDto>(this.refresh(req)); //return promise
      localStorage.setItem(authKey.accessToken, res.accessToken!);
      localStorage.setItem(authKey.refreshToken, res.refreshToken!);
      this.authChangeSub.next(true);
      return true;
    } catch (error) {
      //cannot refresh token
      console.log(error);
    }
    // access and refresh expire
    localStorage.removeItem(authKey.accessToken);
    localStorage.removeItem(authKey.refreshToken);
    this.authChangeSub.next(false);
    return false;
  }

  notifyAuthChanged(isUserAuthenticated: boolean) {
    this.authChangeSub.next(isUserAuthenticated); //ส่งค่าไปให้ obj authChangeSub เพิ่อให้ component อื่นใช้งาน
  }
  isUserInRole(role: string) {
    const at = localStorage.getItem(authKey.accessToken);
    if (at == null) {
      return false;
    }
    const decodeToken = this.jwtService.decodeToken(at);
    const roles = decodeToken['role'];
    if (roles && roles instanceof Array) {
      return roles.findIndex((v) => v == role) >= 0;
    }
    return roles && roles == role; //TRUE and TRUE return FirstTrue
  }
}
