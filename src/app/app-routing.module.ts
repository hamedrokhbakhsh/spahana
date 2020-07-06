import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {UnAuthGuard} from './service/un-auth-guard.service';
import {ServiceAuthGuard} from './service/service-auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [UnAuthGuard],
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule)
    },
    {
        path: 'subscribe',
        canActivate: [ServiceAuthGuard],
        loadChildren: () => import('./pages/subscribe/subscribe.module').then(m => m.SubscribePageModule)
    },
    {
        path: 'home',
        canActivate: [ServiceAuthGuard],
        loadChildren: () => import('./pages/reserve/reserve.module').then(m => m.ReservePageModule)

    },
    {
        path: 'reserve',
        canActivate: [ServiceAuthGuard],
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
    },
    {
        path: 'about',
        canActivate: [ServiceAuthGuard],
        loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
    },
    {
        path: 'contact',
        canActivate: [ServiceAuthGuard],
        loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactPageModule)
    },
    {
        path: 'services',
        canActivate: [ServiceAuthGuard],
        loadChildren: () => import('./pages/services/services.module').then(m => m.ServicesPageModule)
    },
    {
        path: 'history',
        canActivate: [ServiceAuthGuard],
        loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule)
    },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule)
  }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
