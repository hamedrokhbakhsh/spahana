import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../service/app.service';
import {AlertController, NavController} from '@ionic/angular';
import * as moment from 'moment-jalaali';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.page.html',
    styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {

    loading = false;

    constructor(public service: AppService, public alertController: AlertController, private navCtrl: NavController) {
        if ((!this.service.order.gDate || !this.service.order.services)) {
            this.navCtrl.navigateRoot('/home').then();
        }
    }

    ngOnInit() {
    }

    async submit() {
        if (this.service.order) {
            this.loading = true;
            this.service.reserve(this.service.order).subscribe(res => {
                this.showResult(res.status, res.message, res.data);
                this.loading = false;
            }, err => {
                this.loading = false;
                this.showResult(false, 'خطای ارتباط با سرور.', null);
            });
        }
    }

    format() {
        return moment(this.service.order.gDate, 'YYYY-MM-DD').format('dddd,jDD jMMMM  jYYYY');
    }

    async showResult(status: boolean, message: string, data: any) {
        let msg = `<h4>${message}</h4>`;
        if (data) {
            msg += `<p>شناسه رزرو: ${data}</p>`;
        }
        const alert = await this.alertController.create({
            mode: 'ios',
            header: '',
            backdropDismiss: false,
            message: `
                <div class="alert-message-content">
                    <ion-icon src="assets/icon/ios-${status ? 'checkmark-circle-outline' : 'close-circle-outline'}.svg" ></ion-icon>
                    ${msg}
                </div>
            `,
            buttons: [{
                text: `${status ? 'تایید' : 'بستن'}`,
                cssClass: `success-btn`,
                handler: () => {
                    if (status) {
                        this.service.order = {
                            sex: 1,
                            count: 1
                        };
                        this.service.observableClear.next(true);
                        this.navCtrl.navigateRoot('/home');
                    }
                }
            }],
            cssClass: 'myAlert ' + (status ? 'alert-success' : 'alert-danger')
        });
        await alert.present();
    }
}
