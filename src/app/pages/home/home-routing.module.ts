import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomePage} from './home.page';
import {PreviewPage} from './preview/preview.page';

const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'preview',
        component: PreviewPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {
}
