import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppService} from './service/app.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public selectedIndex;
    public appPages = [
        {
            title: 'کارت های هدیه',
            url: '/subscribe/true',
            icon: 'gift'

        },
        {
            title: 'خدمات ما',
            url: '/services',
            icon: 'apps'
        },
        {
            title: 'تاریخچه رزروها',
            url: '/history',
            icon: 'archive'
        }, {
            title: 'سوالات متداول',
            url: '/faq',
            icon: 'help-buoy'
        },
        {
            title: 'پشتیبانی',
            url: '/contact',
            icon: 'call'
        },
        {
            title: 'درباره ما',
            url: '/about',
            icon: 'information-circle'
        }
    ];
    user: any;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private appService: AppService
    ) {
        this.initializeApp();
        this.appService.observableUser.subscribe(u => {
            this.user = u;
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            setTimeout(() => {
                this.splashScreen.hide();
            }, 1000);
        });
    }

    ngOnInit() {
        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }
    }

    logout() {
        this.appService.logout();
    }
}
