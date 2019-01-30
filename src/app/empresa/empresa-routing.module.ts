import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { EmpresaListComponent } from './empresa-list.component';
import { EmpresaFormComponent } from './empresa-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'empresas', component: EmpresaListComponent, canActivate: [AuthGuard] },
  { path: 'empresas/empresa', component: EmpresaFormComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'empresas/empresa/:id', component: EmpresaFormComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
