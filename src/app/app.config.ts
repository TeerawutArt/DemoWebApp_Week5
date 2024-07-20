import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { PageTitleStrategy } from './shared/strategies/page-title.strategy';
// prettier-ignore
import {provideHttpClient,withInterceptorsFromDi,} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from '@auth0/angular-jwt';
import { authKey } from './shared/services/account.service';
import { environment } from '../environments/environment.development';

export function tokenGetter() {
  return localStorage.getItem(authKey.accessToken);
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: environment.allowedDomains, //ส่ง token ไปที่ api domains
          disallowedRoutes: environment.disallowedRoutes, //endpoint ที่ไม่ต้องส่ง token ไป
        },
      })
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()), //auth0
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
  ],
};
