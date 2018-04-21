import { Category } from '../../shared/model/category';
import { CategoryDetailResponse } from '../../shared/dao/response/category-detail.response';
import { Component, NgZone } from '@angular/core';
import { Content } from '../../shared/model/content';
import { ContentPageBase } from '../../shared/pages/ContentPageBase';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../../shared/service/messaging.service';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { PreviewPage } from '../preview/preview';

/**
 * サムネイル一覧画面コンポーネント
 */
@Component({
  selector: 'page-thumbnail-list',
  templateUrl: 'thumbnail-list.html'
})
export class ThumbnailListPage extends ContentPageBase {

  Items: Array<ThumbnailListPageItem>;
  ContentItems: Array<{ Content: Content }>;

  /**
   * コンストラクタ
   *
   * @param navCtrl
   * @param navParams
   * @param _logger
   * @param _pixstock
   * @param _ngZone
   * @param popoverCtrl
   */
  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public _logger: Logger
    , public _pixstock: MessagingService
    , public _ngZone: NgZone
    , public popoverCtrl: PopoverController
  ) {
    super(_logger, _ngZone, popoverCtrl);
    this._logger.info("ThumbnailListPageのコンストラクタ");

    this.Items = [];
    this.ContentItems = [];

    let targetCategoryId = navParams.get("CategoryId") as Number;
    if (targetCategoryId == null) {
      targetCategoryId = 1;
    }

    let o: Observable<CategoryDetailResponse> = Observable.create(observer => {
      this._logger.info("sendSync EAV_GETCATEGORY", targetCategoryId);
      let result = this._pixstock.ipcRenderer.sendSync("EAV_GETCATEGORY", targetCategoryId);

      let desobj = JSON.parse(result) as CategoryDetailResponse;
      observer.next(desobj);
    });

    o.subscribe(result => {
      _logger.info("EAV_GETCATEGORYイベントのレスポンス", result);

      // サブカテゴリ一覧のアイテム化
      result.SubCategory.forEach((item, index) => {
        let listitem = new ThumbnailListPageItem();
        listitem.Category = item;
        this.Items.push(listitem);
      });

      // コンテント一覧のアイテム化
      result.Content.forEach((item, index) => {
        this.ContentItems.push({ Content: item });
      });
    });
  }

  /**
   * @inheritDoc
   */
  OnWindowResize() {

  }

  /**
   * アイテムクリックのイベントハンドラ
   * @param item クリックされたアイテム(Itemsプロパティ内の要素)
   */
  onClick_ItemContainer(item: Content): void {
    this._logger.info("onClick_ItemContainer", item);
    this.navCtrl.push(PreviewPage, {
      Contents: this.ContentItems,
      Content: item
    });
  }

  /**
   * アイテムクリックのイベントハンドラ
   * @param item クリックされたアイテム(Itemsプロパティ内の要素)
   */
  onClick_CategoryItemContainer(item: Category): void {
    this._logger.info("onClick_CategoryItemContainer", item);
    this.navCtrl.push(ThumbnailListPage, {
      CategoryId: item.Id
    });
  }
}

export class ThumbnailListPageItem {
  Category: Category;
}
