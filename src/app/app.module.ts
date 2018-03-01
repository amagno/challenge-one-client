import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { StylesModule } from './shared/styles.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    StylesModule
    // StylesModule
    // BrowserAnimationsModule,
    // StylesModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
