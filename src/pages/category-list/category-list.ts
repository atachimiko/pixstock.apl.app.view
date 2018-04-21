import { Component } from "@angular/core";
import { Category } from "../../shared/model/category";
import { NavController, NavParams } from "ionic-angular";
import { Logger } from "angular2-logger/core";
import { MessagingService } from "../../shared/service/messaging.service";
import { Observable } from "rxjs";
import { CategoryDetailResponse } from "../../shared/dao/response/category-detail.response";

@Component({
    selector: 'page-category-list',
    templateUrl: 'category-list.html'
})
export class CategoryListPage {
    Items: Array<{ Category: Category }>

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public _logger: Logger,
        public _pixstock: MessagingService) {
        this.Items = [];

        let targetCategoryId = navParams.get("CategoryId") as Number;
        if(targetCategoryId==null){
            targetCategoryId = 1;
        }

        let o: Observable<CategoryDetailResponse> = Observable.create(observer => {
            this._logger.info("sendSync EAV_GETCATEGORY");

            let result = this._pixstock.ipcRenderer.sendSync("EAV_GETCATEGORY", targetCategoryId);

            let desobj = JSON.parse(result) as CategoryDetailResponse;
            observer.next(desobj);
        });

        o.subscribe(result => {
            _logger.info("EAV_GETCATEGORYイベントのレスポンス", result);
            //TODO:
        });
    }
}