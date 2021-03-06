import { Category } from '../../shared/model/category';
import { CategoryDao } from '../../shared/dao/category.dao';
import { Component, NgZone, ViewChild } from '@angular/core';
import { Content } from '../../shared/model/content';
import { ContentPageBase } from '../../shared/pages/ContentPageBase';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../../shared/service/messaging.service';
import { NavController, NavParams, PopoverController, List } from 'ionic-angular';
import { PreviewPage } from '../preview/preview';
import { ResultLoadCategory } from '../../shared/infra/load.category';
import { ThumbnailListNavParam } from '../../shared/infra/navparam.thumbnail-list';
import { LabelDao, ResultFindLabelLinkCategory } from '../../shared/dao/label.dao';

/**
 * サムネイル一覧画面コンポーネント
 */
@Component({
  selector: 'page-thumbnail-list',
  templateUrl: 'thumbnail-list.html'
})
export class ThumbnailListPage extends ContentPageBase {
  @ViewChild(List) list: List;
  mItems: Array<ThumbnailListPageItem>;
  mContentItems: Array<{ Content: Content }>;
  mActiveLoadingCategory: boolean = false;
  mCategoryListLazyLoadSpinner: boolean = true;
  mCategoryId: Number = null;
  mRule: string = null;

  /**
   * 画面の初期化が完了しているかどうかのフラグ
   *
   * ナビゲーションの戻るで、この画面に遷移した場合は初期化を行わないようにする。
   */
  mInitializeCompletedFlag: boolean = true;

  /**
   * リストアイテムの遅延読み込みで、一度に読み込むアイテム数
   *
   * リストの初期化時に読み込んだアイテム数を、
   * 遅延読み込み時の読み込み数とする。
   */
  mAdjustLazyLoadNum: Number = 0;

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
  constructor(protected navCtrl: NavController
    , protected navParams: NavParams
    , protected _logger: Logger
    , protected _pixstock: MessagingService
    , protected _ngZone: NgZone
    , protected popoverCtrl: PopoverController
    , protected categoryDao: CategoryDao
    , protected labelDao: LabelDao
  ) {
    super(_logger, _ngZone, popoverCtrl);
    this._logger.info("ThumbnailListPageのコンストラクタ");

    this.mItems = [];
    this.mContentItems = [];

    let ruleLabelParam = navParams.get("Rule_Label") as ThumbnailListNavParam;
    if (ruleLabelParam != null) {
      this._logger.info("ラベルルールを適応して、サムネイル一覧画面を表示します");
      this._logger.info(ruleLabelParam);
      this.mRule = ruleLabelParam.Rule;
    } else {
      this._logger.info("カテゴリIDから、サムネイル一覧画面を表示します");
      this.mCategoryId = navParams.get("CategoryId") as Number;
      if (this.mCategoryId == null) {
        this.mCategoryId = 1;
      }
    }
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();

    if (!this.mInitializeCompletedFlag) return;

    if (this.mCategoryId != null) {
      // 親カテゴリIDが設定済みの場合、その子階層カテゴリを一覧表示する
      this.showSubCategoryByCategoryId();
    } else if (this.mRule != "") {
      this._logger.info("ルールからカテゴリ一覧を表示する");
      this.showCategoryByRule();
    }
  }

  /**
   * カテゴリDAOのカテゴリ読み込み完了通知のイベントハンドラ
   *
   * @param result
   */
  onLoadCategory_Result(result: ResultLoadCategory) {
    this._logger.info("EAV_GETCATEGORYイベントのレスポンス", result);

    // サブカテゴリ一覧のアイテム化
    result.SubCategory.forEach((category, index) => {
      this.AddThumbnailListPageItem(category);
    });

    if (result.Content.length > 0) {
      // コンテント一覧のアイテム化
      result.Content.forEach((item, index) => {
        this.mContentItems.push({ Content: item });
      });
    }

    this.mActiveLoadingCategory = false;
    this.mCategoryListLazyLoadSpinner = false;
  }

  /**
   * @inheritDoc
   */
  OnWindowResize() {

  }

  /**
   * カテゴリ一覧リストのスクロールDOMイベントのハンドラ
   *
   * @param event DOMイベント
   */
  onCategoryListScroll(event): void {
    var element = this.list.getNativeElement();
    if (this.mCategoryId != null) {
      var diff = event.srcElement.offsetHeight + event.srcElement.scrollTop;
      if (diff > element.offsetHeight && !this.mActiveLoadingCategory) {
        this.mActiveLoadingCategory = true;
        // スクロールの末尾で、続きのデータを再読込する
        var o = this.categoryDao.loadCategory(this.mCategoryId, this.mItems.length, this.mAdjustLazyLoadNum);
        o.subscribe((result) => {
          this.onLoadCategory_Result(result);
        });
      }
    }
  }

  /**
   * コンテントリストコントロール内でのアイテムクリックイベントのハンドラ
   *
   * @param item クリックされたアイテム(Itemsプロパティ内の要素)
   */
  onClick_ContentItemContainer(item: Content): void {
    this._logger.info("onClick_ItemContainer", item);
    this.navCtrl.push(PreviewPage, {
      Contents: this.mContentItems,
      Content: item
    });
  }

  /**
   * カテゴリリストコントロール内でのアイテムクリックイベントのハンドラ
   *
   * @param item クリックされたアイテム(Itemsプロパティ内の要素)
   */
  onClick_CategoryItemContainer(item: Category): void {
    this._logger.info("[ThumbnailListPage.onClick_CategoryItemContainer][IN]", item);
    this.navCtrl.push(ThumbnailListPage, {
      CategoryId: item.Id
    });
  }

  /**
   * カテゴリのコンテントリスト表示ボタンのクリックイベントハンドラ
   *
   * @param item 選択したカテゴリ情報
   */
  onClick_CategoryContentItem(item: ThumbnailListPageItem, category: Category): void {
    this._logger.info("[ThumbnailListPage.onClick_CategoryContentItem][IN]", category);
    this.toggleSelectedItem(item);
    this.loadCategoryItemList(category.Id);
  }

  /**
   * カテゴリ一覧リストの任意アイテムのみ選択状態に設定し、
   * それ以外のアイテムは非選択状態に設定する
   *
   * @param item 選択状態にするアイテム
   */
  private toggleSelectedItem(item: ThumbnailListPageItem) {
    this.mItems.forEach(prop => {
      if (prop != item) prop.Selected = false;
      else prop.Selected = true;
    });
  }

  private loadCategoryItemList(categoryId: Number) {
    this.mContentItems = [];
    var o = this.categoryDao.loadCategory(categoryId);
    o.subscribe(result => {
      //this._logger.info("EAV_GETCATEGORYイベントのレスポンス", result);
      // コンテント一覧のアイテム化
      result.Content.forEach((item, index) => {
        this.mContentItems.push({ Content: item });
      });
    });
  }

  /**
   * 任意のカテゴリIDを親カテゴリとして、子階層カテゴリ一覧を表示する
   */
  private showSubCategoryByCategoryId() {
    this._logger.debug("[ThumbnailListPage.showSubCategoryByCategoryId][IN]");

    var oldCount = 0;
    var callback = (result) => {
      this.onLoadCategory_Result(result);

      if (oldCount == this.mItems.length) {
        this.mInitializeCompletedFlag = false;
        this.mAdjustLazyLoadNum = this.mItems.length; // 1ページ分のアイテムを、一度に読み込むアイテム数とする。
        return;
      }

      oldCount = this.mItems.length;

      // 表示領域からはみ出す分のアイテムを作成するまで、初回の呼び出しを繰り返す。
      // setTimeoutを使って画面の再描画を行わないと、アイテム追加後の高さが正常に取得できない
      let dimention = this.content.getContentDimensions();
      var element = this.list.getNativeElement();
      if (element.offsetHeight < dimention.contentHeight) {
        this.mActiveLoadingCategory = true;
        setTimeout(() => {
          o = this.categoryDao.loadCategory(this.mCategoryId, this.mItems.length, 2);
          o.subscribe((result) => { callback(result) });
        }, 10);
      }
    }

    this.mActiveLoadingCategory = true;

    var o = this.categoryDao.loadCategory(this.mCategoryId, 0, 2); // 初期化読み込みの、最初のカテゴリ読み込み呼び出し
    o.subscribe((result) => { callback(result) });
  }

  /**
   * 任意のルールを条件に、カテゴリ一覧を表示する
   */
  private showCategoryByRule() {
    this._logger.debug("[ThumbnailListPage.showCategoryByRule][IN]");

    var callback = (result: ResultFindLabelLinkCategory) => {
      result.Categories.forEach(category => {
        this.AddThumbnailListPageItem(category);
      });

      this.mCategoryListLazyLoadSpinner = false;
    }; // end callback

    this.labelDao.findLabelLinkCategory(this.mRule)
      .subscribe((result) => {
        callback(result)
      });
  }

  private AddThumbnailListPageItem(category: Category) {
    let listitem = new ThumbnailListPageItem();
    listitem.Category = category;

    if (category.HasLinkSubCategoryFlag) {
      listitem.IsSubCaetgory = true;
    }
    listitem.IsContent = true;

    this.mItems.push(listitem);
  }
}

export class ThumbnailListPageItem {
  Selected: boolean;
  Category: Category;
  IsContent: boolean;
  IsSubCaetgory: boolean;
}
