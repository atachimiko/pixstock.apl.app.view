import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Logger } from "angular2-logger/core";
import { NavController } from 'ionic-angular';

import { MessagingService } from '../../shared/service/messaging.service';

import { ThumbnailListPage } from '../thumbnail-list/thumbnail-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public _logger: Logger, public _pixstock: MessagingService) {
    _logger.info("HomePage アプリケーションの初期化 v0.0.1#4");
  }

  naviThumbnailList(): void {
    this.navCtrl.push(ThumbnailListPage);
  }
}
