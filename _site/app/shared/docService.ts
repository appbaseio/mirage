import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DocService {
	constructor() {}

  // Observable navItem source
  private _navItemSource = new BehaviorSubject<string>('');
  // Observable navItem stream
  navItem$ = this._navItemSource.asObservable();
  // service command
  emitNavChangeEvent(string) {
    this._navItemSource.next(string);
  }
}