import {Component, OnInit} from '@angular/core';
import {AppService} from '../../service/app.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    loading = true;
    content: string;

    constructor(private service: AppService) {
    }

    ngOnInit() {
        this.fetchData(null);
    }

    fetchData(event) {
        if (!event) {
            this.loading = true;
        }
        this.service.about().subscribe(res => {
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
