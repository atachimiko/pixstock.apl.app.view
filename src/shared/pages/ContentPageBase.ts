import { Content, PopoverController } from 'ionic-angular';
import { Logger } from 'angular2-logger/core';
import { NgZone, ViewChild } from '@angular/core';
import { Toolmenu } from '../../pages/toolmenu/toolmenu';

/**
 * コンテント画面の基本クラスです
 */
export abstract class ContentPageBase {
  @ViewChild(Content) content: Content;

  /**
   *
   */
  mImageHeight: Number;

  /**
   * コンストラクタ
   *
   * @param _logger
   * @param _ngZone
   * @param popoverCtrl
   */
  constructor(protected _logger: Logger, protected _ngZone: NgZone, protected popoverCtrl: PopoverController) {
    window.onresize = (e) => {
      //ngZone.run will help to run change detection
      this._ngZone.run(() => {
        this.fitImageContainer();
        this.OnWindowResize();
      });
    };
  }

  ionViewDidEnter() {
    this._logger.debug("ContentPageBase::ionViewDidEnter - IN");
    this.fitImageContainer();
  }

  fitImageContainer(): void {
    let dimention = this.content.getContentDimensions();
    this.mImageHeight = dimention.contentHeight - dimention.contentTop + 46; // 46は、ヘッダー領域の高さ（環境依存）
  }

  public presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(Toolmenu);
    popover.present({
      ev: myEvent
    });
  }

  abstract OnWindowResize(): any;
}
