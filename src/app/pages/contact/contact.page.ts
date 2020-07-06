import {Component, OnInit} from '@angular/core';
import {AppService} from '../../service/app.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.page.html',
    styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

    loading = true;
    content: any;

    constructor(private service: AppService) {
    }

    ngOnInit() {
        this.fetchData(null);
    }

    fetchData(event) {
        if (!event) {
            this.loading = true;
        }
        this.service.contact().subscribe(res => {
            if (res.status) {
                this.content = res.data;
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
