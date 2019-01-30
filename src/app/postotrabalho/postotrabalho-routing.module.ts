import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AuthGuard } from './../auth-guard';
import { NgModule } from '@angular/core';
import { PostoTrabalhoListComponent } from './postotrabalho-list.component';
import { PostoTrabalhoFormComponent } from './postotrabalho-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'postostrabalho', component: PostoTrabalhoListComponent, canActivate: [AuthGuard] },
  {
    path: 'postostrabalho/postotrabalho',
    component: PostoTrabalhoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'postostrabalho/postotrabalho/:id',
    component: PostoTrabalhoFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostoTrabalhoRoutingModule {}
