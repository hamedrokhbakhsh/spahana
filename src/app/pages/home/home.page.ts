import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AppService} from '../../service/app.service';
import {Router} from '@angular/router';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    animations: [
        trigger('openClose', [
            state('true', style({height: '*', opacity: 1})),
            state('false', style({height: '0px', opacity: 0})),
            transition('false <=> true', animate(300))
        ])
    ]
})
export class HomePage implements OnInit {

    serviceList: any;
    loading = false;
    order: any;

    constructor(private service: AppService, private router: Router,
                private navCtrl: NavController, private modalController: ModalController) {
    }

    ngOnInit() {
        this.init().finally();
    }

    async openScheduleModal(item: any) {
        let modal = await this.modalController.create({
            component: ScheduleModal,
            swipeToClose: true,
            componentProps: {
                item: item
            }
        });
        await modal.present();
    }

    async init() {
        this.order = this.service.order;
        if (!this.order) {
            await this.navCtrl.navigateBack('/home');
        }
        this.order.services = {};
        this.loadServices();
    }

    loadServices() {
        this.loading = true;
        this.service.scheduleList({
            sex: this.order.sex,
            date: this.order.gDate,
            serials: this.service.serials.map(x => parseInt(x, 0))
        }).subscribe(res => {
            if (res.status) {
                this.serviceList = res.data;
            }
            this.loading = false;
        }, err => {
            this.loading = false;
        });
    }

    async submit() {
        if (this.isEnableReserve()) {
            this.service.order.serials = this.service.serials;
            await this.navCtrl.navigateForward('/reserve/preview');
        }
    }

    isEnableReserve(): boolean {
        return (this.serviceList && ((this.serviceList.creditService && this.serviceList.creditService.length > 0 && this.serviceList.creditService.findIndex(service => !service.count
            || service.serials.length > service.count) == -1) || (this.serviceList.services && this.serviceList.services.findIndex(service => service.count > 0) > -1)));
    }
}

@Component({
    selector: 'app-schedule-modal',
    templateUrl: 'schedule.page.html',
    styleUrls: ['./schedule.page.scss'],
})
export class ScheduleModal implements OnInit {

    order: any;
    @Input('item') item: any;

    constructor(private service: AppService, private modalController: ModalController, private navCtrl: NavController) {
        this.order = service.order;
        if (!this.service.order.gDate) {
            this.navCtrl.navigateRoot('/home').then();
        }
    }

    async closeDialog() {
        await this.modalController.dismiss();
    }

    plus(sch: any) {
        const selectedService: any = this.order.services[this.item.id];
        if (this.item.count < this.order.count && sch.baseService - sch.reserved > 0) {
            this.item.count++;
            sch.count++;
            if (selectedService) {
                const index = selectedService.items.findIndex(z => z.id == sch.id);
                if (index >= 0) {
                    selectedService.items[index].count++;
                } else {
                    selectedService.items.push(this.addNewSchedule(sch));
                }
            } else {
                this.order.services[this.item.id] = {
                    id: this.item.id,
                    title: this.item.title,
                    serials: this.item.serials,
                    part: this.item.part,
                    items: [this.addNewSchedule(sch)]
                };
            }
            this.initSchedule(sch);
        }
    }

    addNewSchedule(sch: any) {
        return {
            id: sch.id,
            title: sch.time,
            count: 1,
            reserved: sch.reserved
        };
    }

    minus(sch: any) {
        const selectedService: any = this.order.services[this.item.id];
        if (this.item.count > 0 && sch.count > 0) {
            this.item.count--;
            sch.count--;
            if (selectedService) {
                const index = selectedService.items.findIndex(z => z.id == sch.id);
                if (index >= 0) {
                    if (selectedService.items[index].count > 1) {
                        selectedService.items[index].count--;
                    } else {
                        selectedService.items.splice(index, 1);
                    }
                }
            }
            this.initSchedule(sch);
        }
    }

    ngOnInit() {
        this.initBtnSelected();
    }

    initBtnSelected() {
        if (this.item) {
            if (!this.item.count) {
                this.item.count = 0;
            }
            this.item.schedules.forEach(sch => {
                if (!(sch.count >= 0 || sch.users)) {
                    this.initSchedule(sch);
                }
            });
        }
    }

    initSchedule(sch: any) {
        if (!sch.count) {
            sch.count = 0;
        }
        sch.users = [];
        for (let i = 0; i < sch.baseService; i++) {
            sch.users.push({
                id: i,
                disabled: i < sch.reserved,
                selected: i < sch.reserved + sch.count
            });
        }
    }
}