import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
	set(key: any, value: any) {
		window.localStorage.setItem(key, value);
	}
	get(key: any) {
		return window.localStorage.getItem(key);
	}
}
