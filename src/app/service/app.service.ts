import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {ResponseModel} from './model';
import {appconfig} from '../appconfig';
import {map} from 'rxjs/operators';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    token: string;
    observableUser: BehaviorSubject<string> = new BehaviorSubject(null);

    observableClear: BehaviorSubject<boolean> = new BehaviorSubject(false);
    serials: any[] = [];
    order: any = {sex: 1, date: '1399', count: 3};

    constructor(private http: HttpClient, private toast: ToastController, private router: Router) {
        this.token = localStorage.getItem('token');
        if (this.token) {
            this.observableUser.next(this.token);
        }
    }

    serviceList(): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(`${appconfig.api}/service-list`);
    }

    chargeSerialList(): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(`${appconfig.api}/credit`);
    }

    submitChargeSerialCode(data: any): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(`${appconfig.api}/credit`, data);
    }

    about(): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(`${appconfig.api}/about`);
    }

    contact(): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(`${appconfig.api}/contact`);
    }

    faq(offset: number = 0): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(`${appconfig.api}/faq?offset=${offset}`);
    }

    services(offset: number = 0): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(`${appconfig.api}/services?offset=${offset}`);
    }

    history(offset: number = 0): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(`${appconfig.api}/history?offset=${offset}`);
    }

    historyItem(id: any): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(`${appconfig.api}/history/${id}`);
    }

    serviceItem(id: any): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(`${appconfig.api}/service-item/${id}`);
    }

    scheduleList(data: any): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(`${appconfig.api}/service`, data);
    }


    reserve(data: any): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(`${appconfig.api}/service/reserve`, data);
    }


    requestToken(data: any): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(`${appconfig.api}/auth/request-token`, data);
    }

    verifyToken(data: any): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(`${appconfig.api}/auth/verify-token`, data).pipe(
            map(res => {
                if (res.status) {
                    let data: any = res.data;
                    this.storeToken(data);
                    this.observableUser.next(data);
                }
                return res;
            })
        );
    }

    isLogin(): boolean {
        return this.token != null;
    }

    storeToken(token: string) {
        this.token = token;
        localStorage.setItem('token', this.token);
    }

    async logout() {
        localStorage.removeItem('token');
        this.token = null;
        this.observableUser.next(null);
        await this.router.navigate(['/auth']);
    }

    async showMessage(msg: string) {
        let toast = await this.toast.create({
            message: msg,
            duration: 3000,
            keyboardClose: true,
            cssClass: 'mytoast'
        });
        await toast.present();
    }

    fetchInfo(param: { sex: any; count: any; gDate: any }): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(`${appconfig.api}/service/reservation-info`, param);
    }

    cancelReserve(id: string): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(`${appconfig.api}/service/cancel`, {id: id});
    }
}
