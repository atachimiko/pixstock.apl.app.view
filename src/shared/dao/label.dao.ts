import { Injectable } from "@angular/core";
import { Logger } from "angular2-logger/core";
import { MessagingService } from "../service/messaging.service";
import { Label } from "../model/label";
import { Observable } from "rxjs";

@Injectable()
export class LabelDao {
  constructor(
    private _logger: Logger,
    private _MessagingService: MessagingService
  ) {

  }

  /**
   * ラベル情報一覧を取得する
   */
  loadLabelList(): Observable<Label[]> {
    return Observable.create(observer => {
      let response = this._MessagingService.ipcRenderer.sendSync("EAV_GETLABELLIST");
      let desobj = JSON.parse(response) as Label[];
      observer.next(desobj);
    });
  }
}
