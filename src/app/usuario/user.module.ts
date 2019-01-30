import { UpperCaseModule } from './../uppercase/uppercase.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from './../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserListComponent } from './user-list.component';
import { UserAddFormComponent } from './useradd-form.component';
import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { DatepipeModule } from '../datepipe/datepipe.module';
import { UtilitarioModule } from '../utilitario/utilitario.module';
import { FocusModule } from '../focus/focus.module';
import { UserEditFormComponent } from './useredit-form.component';

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
    FocusModule,
    UtilitarioModule,
    UserRoutingModule
  ],
  declarations: [
    UserListComponent,
    UserAddFormComponent,
    UserEditFormComponent
  ],
  providers: [UserService]
})
export class UserModule {}
