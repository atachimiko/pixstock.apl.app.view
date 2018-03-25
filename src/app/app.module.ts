import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, NgZone } from '@angular/core';
import { Logger, Options as LoggerOptions, Level as LoggerLevel } from "angular2-logger/core";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ThumbnailListPage } from '../pages/thumbnail-list/thumbnail-list';
import { PreviewPage } from '../pages/preview/preview';
import { MessagingService } from '../shared/service/messaging.service';
import { ContentDao } from '../shared/dao/content.dao';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ThumbnailListPage,
    PreviewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ThumbnailListPage,
    PreviewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LoggerOptions, useValue: { level: LoggerLevel.DEBUG } },
    Logger,
    ContentDao,
    MessagingService,
  ]
})
export class AppModule {
  constructor(private _logger: Logger,
    private _ngZone: NgZone,
    private _pixstock: MessagingService
  ) {

    _logger.info("アプリケーションの初期化 v0.0.1#4");

    window['angularComponentRef'] = {
      component: this,
      zone: this._ngZone
    };

    var parent: any = window.parent; // JSのWindowオブジェクト
    _logger.info("ParentLocation = " + parent.location);

    if (parent.getFirstLoad == null) {
      _logger.error("getFirstLoadの定義を見つけることができません");
    } else {
      let flag = parent.getFirstLoad();
      if (flag == false) {
        _logger.info("AApp初期読み込み判定");
        parent.setFirstLoad();
        this._pixstock.initialize(parent.getIpc(), true, this._logger); // IPCオブジェクト取得
      } else {
        _logger.info("AApp初期化済み判定");
        this._pixstock.initialize(parent.getIpc(), false, this._logger); // IPCオブジェクト取得
      }
    }
  }
}
