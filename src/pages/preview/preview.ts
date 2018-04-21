import { Component, NgZone, ViewChild } from '@angular/core';
import { Content } from '../../shared/model/content';
import { ContentDao } from '../../shared/dao/content.dao';
import { ContentPageBase } from '../../shared/pages/ContentPageBase';
import { LoadingController } from 'ionic-angular';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../../shared/service/messaging.service';
import {
  NavController,
  NavParams,
  PopoverController,
  Slide,
  Slides
  } from 'ionic-angular';
import { Observable } from 'rxjs';

/**
 * プレビュー画面コンポーネント
 */
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html'
})
export class PreviewPage extends ContentPageBase {
  @ViewChild(Slides) slides: Slides;

  Items: Array<{ Content }>;

  Item: Content;

  /**
   * コンストラクタ
   *
   * @param navCtrl
   * @param navParams
   * @param _logger
   * @param _pixstock
   * @param contentDao
   * @param loadingCtrl
   * @param popoverCtrl
   * @param ngZone
   */
  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public _logger: Logger
    , public _pixstock: MessagingService
    , public contentDao: ContentDao
    , public loadingCtrl: LoadingController
    , public popoverCtrl: PopoverController
    , public ngZone: NgZone
  ) {
    super(_logger, ngZone, popoverCtrl);
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
  }

  /**
   * @inheritDoc
   */
  OnWindowResize() {
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
    this._logger.debug("ngAfterViewInit - OUT");
  }

}
