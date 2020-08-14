import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UsersComponent } from './user/users.component';
import { UsersResolverService } from './user/users-resolver.service';

const appRoutes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  {
    path: 'users',
    component: UsersComponent,
    children: [
      { path: 'new', component: UserEditComponent },
      {
        path: ':id',
        component: UserEditComponent,
        resolve: [UsersResolverService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
