import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../service/app.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-service-details',
    templateUrl: './service-details.page.html',
    styleUrls: ['./service-details.page.scss'],
})
export class ServiceDetailsPage implements OnInit {
    loading = true;
    content: any;

    constructor(private service: AppService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.fetchData(null);
    }

    fetchData(event) {
        if (!event) {
            this.loading = true;
        }
        let id: string = this.route.snapshot.params['id'];
        if (id) {
            this.service.serviceItem(id).subscribe(res => {
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

}
