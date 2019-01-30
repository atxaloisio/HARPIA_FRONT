import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { UserListComponent } from './user-list.component';
import { UserAddFormComponent } from './useradd-form.component';
import { Routes, RouterModule } from '@angular/router';
import { UserEditFormComponent } from './useredit-form.component';

const routes: Routes = [
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  {
    path: 'users/adduser',
    component: UserAddFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'users/edituser',
    component: UserEditFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
