import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiHttpInterceptor } from './http.interceptor';

@NgModule({
  exports: [
    BrowserAnimationsModule,
    HttpClientModule
  ],
  imports: [
    HttpClientModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiHttpInterceptor, multi: true }
  ],
  declarations: []
})
export class CoreModule { }
