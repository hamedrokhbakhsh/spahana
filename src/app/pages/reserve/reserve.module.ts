import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservePageRoutingModule } from './reserve-routing.module';

import { ReservePage } from './reserve.page';
import {ShareModule} from '../../service/share.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReservePageRoutingModule,
        ShareModule
    ],
  declarations: [ReservePage]
})
export class ReservePageModule {}
