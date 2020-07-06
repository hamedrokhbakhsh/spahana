import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../service/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import * as moment from 'moment-jalaali';

@Component({
    selector: 'app-history-detail',
    templateUrl: './history-detail.page.html',
    styleUrls: ['./history-detail.page.scss'],
})
export class HistoryDetailPage implements OnInit {
    loading = true;
    content: any;
    cancelTime = 12;
    submitLoading = false;
    allowCancel = false;

    constructor(private service: AppService, private router: Router, private route: ActivatedRoute, private alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.fetchData(null);
    }

    async submit() {
        let alert = await this.alertCtrl.create({
            header: 'هشدار',
            message: 'آیا از لغو رزرو اطمینان دارید؟',
            buttons: [
                {
                    text: 'بله',
                    handler: async () => {
                        this.submitLoading = true;
                        let id: string = this.route.snapshot.params['id'];
                        if (id) {
                            this.service.cancelReserve(id).subscribe((res) => {
                                if (res.status) {
                                    this.router.navigate(['/history']).then();
                                }
                                this.service.showMessage(res.message).then();
                                this.submitLoading = false;
                            }, (err) => {
                                this.service.showMessage('خطای ارتباط با سرور.').then();
                                this.submitLoading = false;
                            });
                        }

                    }
                }, {
                    text: 'خیر',
                    handler: () => {
                        alert.dismiss().then();
                    }
                }
            ]
        });
        await alert.present();
    }

    fetchData(event) {
        if (!event) {
            this.loading = true;
        }
        let id: string = this.route.snapshot.params['id'];
        if (id) {
            this.service.historyItem(id).subscribe(res => {
                if (res.status) {
                    this.content = res.data.reserve;
                    this.cancelTime = res.data.cancelTime;
                    if (!this.cancelTime) {
                        this.cancelTime = 12;
                    }
                    let m = moment(this.content.ReserveDate, 'YYYY-MM-DD').utc().subtract(this.cancelTime, 'hours');
                    if (moment().utc().isBefore(m)) {
                        this.allowCancel = true;
                    }
                }
                this.loading = false;
            }, err => {
                this.service.showMessage('خطای ارتباط با سرور.').then();
                this.loading = false;
            });
        }
    }
}
