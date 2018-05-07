import { ContentPageBase } from "../../shared/pages/ContentPageBase";
import { Component, NgZone } from "@angular/core";
import { Logger } from "angular2-logger/core";
import { PopoverController, NavController } from "ionic-angular";
import { LabelDao } from "../../shared/dao/label.dao";
import { Label } from "../../shared/model/label";
import { ThumbnailListPage } from "../thumbnail-list/thumbnail-list";
import { ThumbnailListNavParam } from "../../shared/infra/navparam.thumbnail-list";

@Component({
  selector: 'page-label-list',
  templateUrl: 'label-list.html'
})
export class LabelListPage extends ContentPageBase {

  mItems: Array<Label>;

  constructor(
    protected _logger: Logger
    , protected navCtrl: NavController
    , protected _ngZone: NgZone
    , protected popoverCtrl: PopoverController
    , protected labelDao: LabelDao) {
    super(_logger, _ngZone, popoverCtrl);

    this.mItems = [];
  }

  ionViewDidEnter() {
    this._logger.info("[ionViewDidEnter] - IN");
    super.ionViewDidEnter();

    this.labelDao.loadLabelList().subscribe((result) => {
      this._logger.info("[ionViewDidEnter] - Response");
      this.mItems = result;
    });
  }

  OnWindowResize() {
    // EMPTY
  }

  onClick_ContentItemContainer(item: Label): void {
    this._logger.info("onClick_ContentItemContainer", item);
    this.transitionThumbnailListPage();
  }

  /**
   *
   */
  transitionThumbnailListPage(): void {
    var param: ThumbnailListNavParam = { Rule: "Test" };
    this.navCtrl.push(ThumbnailListPage, { Rule_Label: param });
  }
}
