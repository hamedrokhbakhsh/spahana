import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';
import {VerifyPage} from './verify/verify.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  },
  {
    path: 'verify/:mobile',
    component: VerifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
