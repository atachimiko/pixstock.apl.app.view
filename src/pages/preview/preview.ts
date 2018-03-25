import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Logger } from "angular2-logger/core";
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { MessagingService } from '../../shared/service/messaging.service';

/**
 * プレビュー画面コンポーネント
 */
@Component({
    selector: 'page-preview',
    templateUrl: 'preview.html'
})
export class PreviewPage {

    constructor(public navCtrl: NavController, public _logger: Logger, public _pixstock: MessagingService,
        public loadingCtrl: LoadingController) {
        this._logger.info("Previewのコンストラクタ");

        let loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
        loader.present();
    }
}