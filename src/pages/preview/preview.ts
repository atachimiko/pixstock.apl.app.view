import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Logger } from "angular2-logger/core";
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { MessagingService } from '../../shared/service/messaging.service';
import { ContentDao } from '../../shared/dao/content.dao';

/**
 * プレビュー画面コンポーネント
 */
@Component({
    selector: 'page-preview',
    templateUrl: 'preview.html'
})
export class PreviewPage {

    constructor(public navCtrl: NavController, public _logger: Logger, public _pixstock: MessagingService,
        public contentDao: ContentDao,
        public loadingCtrl: LoadingController) {
        this._logger.info("Previewのコンストラクタ");

        let loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
        loader.present();
        contentDao.loadContent(1)
            .subscribe(result => {
                this._logger.debug("取得アイテム一覧", result);
            });
    }
}