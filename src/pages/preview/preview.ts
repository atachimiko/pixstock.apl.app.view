import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Logger } from "angular2-logger/core";
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { MessagingService } from '../../shared/service/messaging.service';
import { ContentDao } from '../../shared/dao/content.dao';
import { Content } from '../../shared/model/content';

/**
 * プレビュー画面コンポーネント
 */
@Component({
    selector: 'page-preview',
    templateUrl: 'preview.html'
})
export class PreviewPage {

    Item: Content;

    constructor(public navCtrl: NavController, public navParams: NavParams, public _logger: Logger, public _pixstock: MessagingService,
        public contentDao: ContentDao,
        public loadingCtrl: LoadingController) {
        this._logger.info("Previewのコンストラクタ");

        let loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
        loader.present();

        let content = navParams.get("Content") as Content;
        _logger.info("プレビュー表示対象データ", content);
        this.Item = content;

        // contentDao.loadContent(1)
        //     .subscribe(result => {
        //         this._logger.debug("取得アイテム一覧", result);
        //     });
    }
}