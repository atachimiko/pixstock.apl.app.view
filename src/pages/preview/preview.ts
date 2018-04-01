import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Logger } from "angular2-logger/core";
import { NavController, NavParams, Slides } from 'ionic-angular';
import { Content as ionic_content } from 'ionic-angular'; // ModelのContentと名前が重複するので、別名に設定
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
export class PreviewPage implements OnInit {
    @ViewChild(Slides) slides: Slides;
    @ViewChild(ionic_content) content: ionic_content;

    Items: Array<{ Content }>;

    Item: Content;

    ImageHeight: Number;

    constructor(public navCtrl: NavController, public navParams: NavParams, public _logger: Logger, public _pixstock: MessagingService,
        public contentDao: ContentDao,
        public loadingCtrl: LoadingController,
        private ngZone: NgZone) {
        this._logger.info("Previewのコンストラクタ");

        this.Items = [];

        // くるくる表示サンプル
        // let loader = this.loadingCtrl.create({
        //     content: "Please wait...",
        //     duration: 3000
        // });
        // loader.present();

        this.Items = navParams.get("Contents") as Array<{ Content }>;
        _logger.info("プレビュー用ナビゲーションリスト", this.Items);
        let content = navParams.get("Content") as Content;
        _logger.info("プレビュー表示対象データ", content);
        this.Item = content;


        // Subscriber利用サンプル
        // contentDao.loadContent(1)
        //     .subscribe(result => {
        //         this._logger.debug("取得アイテム一覧", result);
        //     });

        window.onresize = (e) => {
            //ngZone.run will help to run change detection
            this.ngZone.run(() => {
                this.fitImageContainer();
            });
        };
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this._logger.debug("ngAfterViewInit - IN", this.slides);
        let pos = this.Items.findIndex(prop => prop.Content.Id == this.Item.Id);
        if (pos != -1) {
            this._logger.debug("プレビュー表示対象データの位置", pos);
            this.slides.initialSlide = pos;
        } else {
            this._logger.debug("プレビュー表示対象データが見つかりませんでした");
        }

        this.fitImageContainer();
        this._logger.debug("ngAfterViewInit - OUT");
    }

    /**
     * DOM要素のサイズに表示画像のサイズを合わせる
     */
    fitImageContainer() {
        //this._logger.info("ContentHeight", this.content.getContentDimensions());
        //this._logger.info("renderedHeight", this.slides.getElementRef().nativeElement.clientHeight);\
        this.ImageHeight = this.slides.getElementRef().nativeElement.clientHeight - 10;
    }

}