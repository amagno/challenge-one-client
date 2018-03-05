import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatTableModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatDividerModule,
  MatSelectModule,
  MatSliderModule,
  MatDatepicker,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatListModule,
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  exports: [
    MatMomentDateModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatListModule
  ]
})
export class StylesModule {
}
