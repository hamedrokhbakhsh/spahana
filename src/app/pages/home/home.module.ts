import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {HomePageRoutingModule} from './home-routing.module';

import {HomePage, ScheduleModal} from './home.page';
import {ShareModule} from '../../service/share.module';
import {PreviewPage} from './preview/preview.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        ShareModule
    ],
    declarations: [HomePage, PreviewPage,ScheduleModal],
    entryComponents:[ScheduleModal]
})
export class HomePageModule {
}
