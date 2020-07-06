import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../service/app.service';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    form: FormGroup;
    loading = false;
    isSubmit = false;

    constructor(private fb: FormBuilder, private service: AppService, private router: Router) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            mobile: [null, [Validators.required, Validators.pattern('09[0-9]{9}')]]
        });
    }

    async requestToken() {
        this.isSubmit = true;
        if (this.form.valid) {
            try {
                this.loading = true;
                let res = await this.service.requestToken(this.form.value).toPromise();
                if (res.status) {
                    await this.router.navigate(['/auth/verify', this.form.value.mobile]);
                    this.form.reset();
                } else {
                    await this.service.showMessage(res.message);
                }
                this.loading = false;
            } catch (e) {
                console.log(e)
                this.loading = false;
                await this.service.showMessage('خطای ارتباط با سرور.');
            }
            this.isSubmit = false;
        }
    }

}
