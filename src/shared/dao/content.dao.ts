import { Content } from '../model/content';
import { ContentDetailResponse } from '../../shared/dao/response/content-detail.response';
import { Injectable } from '@angular/core';
import { Logger } from 'angular2-logger/core';
import { MessagingService } from '../../shared/service/messaging.service';
import { Observable } from 'rxjs';

@Injectable()
export class ContentDao {
  constructor(public _logger: Logger,
    public _MessagingService: MessagingService) {

  }

  /**
   * コンテント詳細情報取得API
   *
   * @param contentId 取得するコンテント情報
   */
  loadContent(contentId: Number): Observable<Content> {
    this._logger.debug("Call LoadContent");

    let o: Observable<Content> = Observable.create(observer => {
      let result = this._MessagingService.ipcRenderer.sendSync("EAV_GETCONTENT", contentId);
      let desobj = JSON.parse(result) as ContentDetailResponse;
      observer.next(desobj.Content);
    });

    return o;
  }
}
