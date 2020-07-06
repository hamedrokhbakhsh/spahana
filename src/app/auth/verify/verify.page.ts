import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../service/app.service';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.page.html',
    styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
    timer: number = 120;
    interval: any;
    mobile: string;
    form: FormGroup;

    loading: boolean = false;
    resendLoading: boolean = false;
    isSubmit = false;

    constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder,
                private service: AppService, private toast: ToastController, private router: Router) {
    }

    ngOnInit() {
        this.createForm();
        this.resetTimer();
    }

    createForm() {
        this.mobile = this.activatedRoute.snapshot.paramMap.get('mobile');
        this.form = this.fb.group({
            mobile: [this.mobile, [Validators.required, Validators.pattern('09[0-9]{9}')]],
            token: [null, [Validators.required, Validators.pattern('[0-9]{6}')]]
        });
    }

    async keyup(event) {
        if (this.form.value.token && this.form.value.token.length == 6) {
            await this.verifyToken();
        }
    }

    async verifyToken() {
        this.isSubmit = true;
        if (this.form.valid) {
            try {
                this.loading = true;
                let res = await this.service.verifyToken(this.form.value).toPromise();
                if (res.status) {
                    this.clearTimer();
                    await this.router.navigate(['/home']);
                    this.form.reset();
                } else {
                    await this.service.showMessage(res.message);
                }
                this.clearTimer();
                this.loading = false;
            } catch (e) {
                console.log(e)
                this.loading = false;
                await this.service.showMessage('خطای ارتباط با سرور.');
            }
            this.isSubmit = false;
        }
    }

    async resendToken() {
        try {
            this.resendLoading = true;
            let res = await this.service.requestToken({mobile: this.mobile}).toPromise();
            if (res.status) {
                this.resetTimer();
                await this.service.showMessage('کد تایید برای شما ارسال شد.');
            } else {
                this.clearTimer();
                await this.service.showMessage(res.message);
            }
            this.resendLoading = false;
        } catch (e) {
            this.resendLoading = false;
            this.clearTimer();
            await this.service.showMessage('خطای ارتباط با سرور.');
        }
    }

    resetTimer() {
        this.clearTimer();
        this.timer = 120;
        setInterval(() => {
            if (this.timer > 0) {
                this.timer--;
            }
        }, 1000);
    }

    clearTimer() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
