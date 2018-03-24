//import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { Injectable, EventEmitter } from '@angular/core';
//import { Injectable } from '@angular/core';
import { Logger } from "angular2-logger/core";

@Injectable()
export class MessagingService {
    /**
     * ElectronNETのRendererで使用するIPCオブジェクト
     */
    ipcRenderer: any;

    /**
     * ロガー
     */
    logger: Logger;

    echo: EventEmitter<string> = new EventEmitter();
    ShowContentPreview: EventEmitter<string> = new EventEmitter();
    ShowContentList: EventEmitter<string> = new EventEmitter();

    /**
     * サービスの初期化
     * 
     * @param ipcRenderer IPCオブジェクト
     * @param isRpcInitialize IPCオブジェクトのイベントハンドラ登録を行うかどうかのフラグ
     */
    initialize(_ipcRenderer: any, _isRpcInitialize: boolean, _logger: Logger) {
        this.ipcRenderer = _ipcRenderer;
        this.logger = _logger;

        if (!window['angularComponentRef_PixstockNetService']) {
            window['angularComponentRef_PixstockNetService'] = {
                // NOTE: IPCイベントをすべて登録する
                componentFn_MSG_SHOW_CONTENTPREVIEW: (event, arg) => this.onMSG_SHOW_CONTENTPREVIEW(event, arg),
                componentFn_MSG_SHOW_CONTENLIST: (event, arg) => this.onMSG_SHOW_CONTENLIST(event, arg)
            };
        }

        if (_isRpcInitialize) {
            _logger.info("IPCイベントの初期化");
      
            this.ipcRenderer.removeAllListeners(["MSG_SHOW_CONTENTPREVIEW", "MSG_SHOW_CONTENLIST"]);
      
            this.ipcRenderer.on('MSG_SHOW_CONTENTPREVIEW', (event, arg) => {
              var ntv_window: any = window;
              ntv_window.angularComponentRef.zone.run(() => {
                ntv_window.angularComponentRef_PixstockNetService.componentFn_MSG_SHOW_CONTENTPREVIEW(event, arg);
              });
            });
      
            this.ipcRenderer.on('MSG_SHOW_CONTENLIST', (event, arg) => {
              var ntv_window: any = window;
              ntv_window.angularComponentRef.zone.run(() => {
                ntv_window.angularComponentRef_PixstockNetService.componentFn_MSG_SHOW_CONTENLIST(event, arg);
              });
            });
          }
    }

    private onMSG_SHOW_CONTENTPREVIEW(event, args) {
        this.logger.debug("[PixstockNetService][onMSG_SHOW_CONTENTPREVIEW] : Execute");
        //this.ShowContentPreview.emit(args);
    }

    private onMSG_SHOW_CONTENLIST(event, args) {
        this.logger.debug("[PixstockNetService][onMSG_SHOW_CONTENLIST] : Execute");
        //this.ShowContentList.emit(args);
    }
}