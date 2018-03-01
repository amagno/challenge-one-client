import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';

@NgModule({
  exports: [
    BrowserAnimationsModule,
  ],
  providers: [
    AuthService
  ],
  declarations: []
})
export class CoreModule { }
