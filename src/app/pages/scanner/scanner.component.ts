import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AppService} from '../../service/app.service';

@Component({
    selector: 'app-scanner',
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnInit {

    flash = false;
    isAllow = true;
    loading = true;

    constructor(public modalController: ModalController, private service: AppService) {
    }

    ngOnInit() {
    }

    async close() {
        await this.modalController.dismiss();
    }

    async permissionResponse(event: any) {
        this.isAllow = event;
        if (!event) {
            await this.service.showMessage('مجوز استفاده از دوربین وجود ندارد.');
            await this.modalController.dismiss({status: false, data: 'مجوز استفاده از دوربین وجود ندارد.'});
        }
    }

    async scanSuccess(event: any) {
        await this.modalController.dismiss({status: true, data: event});
    }

    async scanFailure(event) {

    }

    async scanError(event: any) {
        await this.service.showMessage('خطا در اسکن qr code رخ داد.');
    }

    async scanComplete(event) {
        //console.log(event);
    }
}
