import {Component, OnInit} from '@angular/core';
import {AppService} from '../../service/app.service';

@Component({
    selector: 'app-services',
    templateUrl: './services.page.html',
    styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

    items: any[] = [];
    loading: boolean = false;

    constructor(private service: AppService) {
    }

    ngOnInit() {
        this.loadData(null);
    }

    refreshData(event) {
        this.items = [];
        this.loadData(event);
    }

    loadData(event) {
        if (!event) {
            this.loading = true;
        }
        this.service.services(this.items.length).subscribe(res => {
            if (res.status) {
                this.items = this.items.concat(res.data);
                if (res.data.length < 10 && event) {
                    event.target.disabled = true;
                }
            }
            this.loading = false;
            if (event) {
                event.target.complete();
            }
        }, err => {
            this.loading = false;
            if (event) {
                event.target.complete();
            }
        });
    }
}
