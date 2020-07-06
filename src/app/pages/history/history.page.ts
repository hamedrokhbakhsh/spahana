import {Component, OnInit} from '@angular/core';
import {AppService} from '../../service/app.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

    items: any[] = [];
    loading: boolean = false;

    constructor(private service: AppService) {
    }

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.items = [];
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
        this.service.history(this.items.length).subscribe(res => {
            if (res.status) {
                let data = res.data.map(item => {
                    item.services = this.removeDuplicates(item.services);
                    return item;
                });

                this.items = this.items.concat(data);
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

    removeDuplicates(array: string) {
        if (!array) {
            return '';
        }
        let out = [];
        array.split(',').forEach(item => {
            if (out.indexOf(item.trim()) == -1) {
                out.push(item.trim());
            }
        });
        return out.join(',');
    };
}
