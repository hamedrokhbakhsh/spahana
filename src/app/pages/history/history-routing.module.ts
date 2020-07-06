import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HistoryPage} from './history.page';
import {HistoryDetailPage} from './history-detail/history-detail.page';

const routes: Routes = [
    {
        path: '',
        component: HistoryPage
    }, {
        path: ':id',
        component: HistoryDetailPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HistoryPageRoutingModule {
}
