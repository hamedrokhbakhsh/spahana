import {Component, OnInit} from '@angular/core';
import {NavController, PickerController} from '@ionic/angular';
import {AppService} from '../../service/app.service';
import {Router} from '@angular/router';
import * as moment from 'moment-jalaali';

@Component({
    selector: 'app-reserve',
    templateUrl: './reserve.page.html',
    styleUrls: ['./reserve.page.scss'],
})
export class ReservePage implements OnInit {
    order: any = {
        sex: 1,
        count: 1,
        date: ''
    };
    date: any = {};
    items: any[];
    durations: any[];
    loading = false;
    info: any;

    constructor(private pickerController: PickerController, public service: AppService,
                private router: Router, private navCtrl: NavController) {
        service.observableClear.asObservable().subscribe(res => {
            if (res) {
                this.date = null;
                this.order = {
                    sex: 1,
                    count: 1,
                    date: ''
                };
                this.ngOnInit();
            }
        });
    }


    ngOnInit() {
        this.initDatePickerData();
        this.fetchInfo();
    }

    initDatePickerData() {
        if (!this.date) {
            this.date = {};
        }
        this.date.dayOptions = this.getDays();
        this.date.monthOptions = this.getMonths();
        this.date.yearsOptions = this.getYears();
        this.selectDefaultDate();
    }

    selectDefaultDate() {
        if (!this.date.day || !this.date.month || !this.date.years) {
            let m = moment();
            this.date.years = m.jYear();
            this.date.yearsIndex = 0;
            this.date.month = m.jMonth() + 1;
            this.date.day = m.jDate();
            this.initDate();
        }
    }

    async openDatePicker() {
        this.initDatePickerData();
        const picker = await this.pickerController.create({
            mode: 'ios',
            keyboardClose: true,
            buttons: [{
                text: 'انتخاب',
                handler: (value) => {
                    this.date.yearsIndex = this.getYears().findIndex(x => x.value == value.years.value);
                    this.date.years = value.years.value;
                    this.date.month = value.month.value;
                    this.date.day = value.day.value;
                    this.initDate();
                    this.fetchInfo();
                }
            }, {
                text: 'انصراف',
                role: 'cancel'
            }],
            columns: [
                {
                    name: 'day',
                    options: this.date.dayOptions,
                    selectedIndex: this.date.day - 1
                },
                {
                    name: 'month',
                    options: this.date.monthOptions,
                    selectedIndex: this.date.month - 1
                },
                {
                    name: 'years',
                    options: this.date.yearsOptions,
                    selectedIndex: this.date.yearsIndex
                }
            ]
        });
        await picker.present();
    }

    initDate() {
        this.date.pDate = moment(`${this.date.years}-${this.date.month}-${this.date.day}`, 'jYYYY-jM-jD');
        this.order.gDate = this.date.pDate.format('YYYY-MM-DD');
        this.order.date = this.date.pDate.format('jYYYY-jMM-jDD');
    }

    setPad(val: number) {
        return (val + '').padStart(2, '0');
    }

    getMonths(): any[] {
        const months = Array.apply(0, Array(12)).map((_, i) => moment().jMonth(i).format('jMMMM'));
        const out: any[] = [];
        for (let i = 1; i <= months.length; i++) {
            out.push({
                text: months[i - 1],
                value: i
            });
        }
        return out;
    }

    getDays(): any[] {
        const out: any[] = [];
        for (let i = 1; i <= 31; i++) {
            out.push({
                text: this.setPad(i),
                value: i
            });
        }
        return out;
    }

    getYears() {
        const current = moment().jYear();
        const out: any[] = [];
        for (let i = current; i <= (current + 10); i++) {
            out.push({
                text: i,
                value: i
            });
        }
        return out;
    }

    plus() {
        this.order.count++;
    }

    minus() {
        if (this.order.count > 1) {
            this.order.count--;
        }
    }

    compareWith(a, b) {
        return a && b && a.id == b.id;
    }

    isEnabledSubmit() {
        return this.info && this.info.worktime;
    }

    async submit() {
        if (this.isEnabledSubmit()) {
            this.service.order = this.order;
            await this.navCtrl.navigateForward('/subscribe');
        }
    }

    changeGender() {
        this.fetchInfo();
    }

    fetchInfo() {
        this.loading = true;
        this.service.fetchInfo({
            sex: parseInt(this.order.sex),
            gDate: this.order.gDate,
            count: this.order.count
        }).subscribe(res => {
            if (res.status) {
                this.info = res.data;
            }
            this.loading = false;
        }, err => {
            this.loading = false;
        });
    }
}
