import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesPage } from './services.page';
import {ServiceDetailsPage} from './service-details/service-details.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesPage
  },{
    path: ':id',
    component: ServiceDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesPageRoutingModule {}
