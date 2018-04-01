import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Logger } from "angular2-logger/core";
import { NavController } from 'ionic-angular';

import { MessagingService } from '../../shared/service/messaging.service';
import { Content } from '../../shared/model/content';
import { CategoryDetailResponse } from '../../shared/dao/response/category-detail.response';
import { PreviewPage } from '../preview/preview';

/**
 * サムネイル一覧画面コンポーネント
 */
@Component({
    selector: 'page-thumbnail-list',
    templateUrl: 'thumbnail-list.html'
})
export class ThumbnailListPage {

    Items: Array<{ Content: Content }>;

    constructor(public navCtrl: NavController, public _logger: Logger, public _pixstock: MessagingService) {
        this._logger.info("ThumbnailListPageのコンストラクタ");
        this.Items = [];

        let o: Observable<CategoryDetailResponse> = Observable.create(observer => {
            this._logger.info("sendSync EAV_GETCATEGORY");

            let result = this._pixstock.ipcRenderer.sendSync("EAV_GETCATEGORY", "3");

            let desobj = JSON.parse(result) as CategoryDetailResponse;
            observer.next(desobj);
        });

        o.subscribe(result => {
            result.Content.forEach((item, index) => {
                this.Items.push({ Content: item });
            });
        });
    }

    /**
     * アイテムクリックのイベントハンドラ
     * @param item クリックされたアイテム(Itemsプロパティ内の要素)
     */
    onClick_ItemContainer(item: Content): void {
        this._logger.info("onClick_ItemContainer", item);
        this.navCtrl.push(PreviewPage,{
            Contents: this.Items,
            Content: item
        });
    }
}