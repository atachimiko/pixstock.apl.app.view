import { Component } from '@angular/core';
import { Logger } from "angular2-logger/core";
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public _logger: Logger) {
    _logger.info("HomePage アプリケーションの初期化 v0.0.1#4");
  }
}
