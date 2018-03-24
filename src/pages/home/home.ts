import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Logger } from "angular2-logger/core";
import { NavController } from 'ionic-angular';

import { MessagingService } from '../../shared/service/messaging.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public _logger: Logger, public _pixstock: MessagingService) {
    _logger.info("HomePage アプリケーションの初期化 v0.0.1#4");
  }

  logEvent(): void {
    this._logger.info("Execute logEvent");

    let o: Observable<Number> = Observable.create(observer => {
      this._logger.info("sendSync EAV_GETCATEGORY");

      let result = this._pixstock.ipcRenderer.sendSync("EAV_GETCATEGORY", "1");

      observer.next(result as Number);
    });
    
    o.subscribe(result => {
      this._logger.info("IPCリクエストの戻り値= " + result);
    });
  }
}
