import { StrToBooleanPipe } from './strToBooleanPipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SincronizarComponent } from './sincronizar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MyMaterialModule } from '../my-material/my-material.module';
import { MatNativeDateModule } from '@angular/material';
import { UpperCaseModule } from '../uppercase/uppercase.module';
import { DatepipeModule } from '../datepipe/datepipe.module';
import { FocusModule } from '../focus/focus.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MyMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    UpperCaseModule,
    DatepipeModule,
    FocusModule
  ],
  declarations: [StrToBooleanPipe, SincronizarComponent],
  exports: [StrToBooleanPipe],
  entryComponents: [SincronizarComponent]
})
export class UtilitarioModule {}
