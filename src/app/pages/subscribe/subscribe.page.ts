import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../service/app.service';
import {ActivatedRoute} from '@angular/router';
import {ModalController, NavController, Platform} from '@ionic/angular';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {ScannerComponent} from '../scanner/scanner.component';

@Component({
    selector: 'app-subscribe',
    templateUrl: './subscribe.page.html',
    styleUrls: ['./subscribe.page.scss'],
})
export class SubscribePage implements OnInit {

    form: FormGroup;
    loading = false;
    isSubmit = false;
    items: any[];
    dataLoading = false;
    first: string = null;

    constructor(private route: ActivatedRoute, private fb: FormBuilder, private qrScanner: QRScanner,
                private service: AppService,
                private navCtrl: NavController, public modalController: ModalController) {
        this.route.params.subscribe(res => {
            this.first = res['first'];
            console.log(res);
        });
    }

    ngOnInit() {
        this.form = this.fb.group({
            code: [null, [Validators.required]]
        });
        this.loadSubscribe();
        this.service.observableClear.asObservable().subscribe(res => {
            if (res) {
                this.loadSubscribe();
            }
        });
    }


    loadSubscribe() {
        this.dataLoading = true;
        this.service.chargeSerialList().subscribe(res => {
            if (res.status) {
                this.items = res.data;
                for (let i = 0; i < this.items.length; i++) {
                    if (i < this.service.order.count) {
                        this.items[i].selected = true;
                    }
                }
            }
            this.dataLoading = false;
        }, err => {
            this.dataLoading = false;
        });
    }

    async submitSubscribeCode() {
        this.isSubmit = true;
        if (this.form.valid) {
            const res = await this.submitCode(this.form.value);
            if (res) {
                this.form.reset();
            }
            this.isSubmit = false;
        }
    }

    async submitCode(code: any) {
        try {
            this.loading = true;
            let res = await this.service.submitChargeSerialCode(code).toPromise();
            if (res.status) {
                await this.service.showMessage('کد اشتراک شما با موفقیت ثبت شد.');
                this.loadSubscribe();
                this.loading = false;
                return true;
            } else {
                await this.service.showMessage(res.message);
                this.loading = false;
                return false;
            }
        } catch (e) {
            this.loading = false;
            await this.service.showMessage('خطای ارتباط با سرور.');
            return false;
        }
    }

    extractSelectedSerial(): any[] {
        return this.items.filter(s => s.selected).map(s => s.serial);
    }

    async submit() {
        if (this.isEnabledNext()) {
            this.service.serials = this.extractSelectedSerial();
            await this.navCtrl.navigateForward('/reserve');
        }
    }

    async openScanner() {
        let scanner = await this.modalController.create({
            component: ScannerComponent
        });
        await scanner.present();
        scanner.onDidDismiss().then(res => {
            if (res.data && res.data.status) {
                this.submitCode({
                    code: res.data.data
                }).finally();
            }
        }, err => {

        });
    }

    async openQrcode() {
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                if (status.authorized) {
                    // camera permission was granted
                    // start scanning
                    let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                        console.log('Scanned something', text);

                        this.qrScanner.hide(); // hide camera preview
                        scanSub.unsubscribe(); // stop scanning
                        this.submitCode(this.form.value).finally();
                    });

                } else if (status.denied) {
                    // camera permission was permanently denied
                    // you must use QRScanner.openSettings() method to guide the user to the settings page
                    // then they can grant the permission from there
                } else {
                    // permission was denied, but not permanently. You can ask for permission again at a later time.
                }
            })
            .catch((e: any) => {
                this.openScanner().finally();
            });
    }

    isEnabledNext(): boolean {
        return this.items && this.service.order.count >= this.extractSelectedSerial().length;
    }
}
