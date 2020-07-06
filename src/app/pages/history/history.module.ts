import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {HistoryPageRoutingModule} from './history-routing.module';

import {HistoryPage} from './history.page';
import {ShareModule} from '../../service/share.module';
import {HistoryDetailPage} from './history-detail/history-detail.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HistoryPageRoutingModule,
        ShareModule
    ],
    declarations: [HistoryPage, HistoryDetailPage]
})
export class HistoryPageModule {
}
