import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SubscribePageRoutingModule} from './subscribe-routing.module';

import {SubscribePage} from './subscribe.page';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {ScannerComponent} from '../scanner/scanner.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SubscribePageRoutingModule,
        ReactiveFormsModule,
        ZXingScannerModule
    ],
    declarations: [SubscribePage, ScannerComponent],
    entryComponents: [ScannerComponent]
})
export class SubscribePageModule {
}
