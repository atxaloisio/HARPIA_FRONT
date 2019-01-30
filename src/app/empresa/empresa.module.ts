import { UpperCaseModule } from './../uppercase/uppercase.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EmpresaListComponent } from './empresa-list.component';
import { EmpresaFormComponent } from './empresa-form.component';
import { EmpresaService } from './empresa.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmpresaRoutingModule } from './empresa-routing.module';
import { AddEmpresaComponent } from './addempresa.component';

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
    EmpresaRoutingModule
  ],
  declarations: [
    EmpresaListComponent,
    EmpresaFormComponent,
    AddEmpresaComponent
  ],
  entryComponents: [AddEmpresaComponent],
  providers: [EmpresaService]
})
export class EmpresaModule {}
