import {NgModule} from '@angular/core';
import {DateFormat} from './date.pipe';
import {BaseUrl} from './baseurl.pipe';

@NgModule({
    declarations: [DateFormat, BaseUrl],
    entryComponents: [],
    imports: [],
    exports: [
        DateFormat, BaseUrl
    ]
})
export class ShareModule {
}
