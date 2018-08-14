import { Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
// import { LocalStorageModule } from 'angular-2-local-storage';
import { LocalStorageService } from 'angular-2-local-storage';
 import { ILocalStorageServiceConfig } from 'angular-2-local-storage';

export interface TokenRes {
  data?: any
}

@Injectable()
export class HeadersProvider {

  public headers: Headers;
  public _localStorage: LocalStorageService;
  public _lconfig: ILocalStorageServiceConfig = {};

  constructor() {
    this.headers = new Headers();
    this._localStorage = new LocalStorageService(this._lconfig);
    this.addBasicHeaders();
  }

  /**
   * Adds a header to the request headers
   * @method
   * @name BaseProvider#addHeader
   * @param {string} key - The key of the header
   * @param {string} value - The value of the header
   */
  protected addHeader(key: string, value: string): void {
    this.headers.append(key, value);
  }

  /**
   * Removes the header of the given key
   * @param key = the key of the header
   */
  protected removeHeader(key: string): void {
    this.headers.delete(key);
  }

  /**
   * Replaces the header with the given key, with value
   * @param key - the key of the header
   * @param value - the value of the header
   */
  protected replaceHeader(key: string, value: string): void {
    this.removeHeader(key);
    this.addHeader(key, value);
  }

  /**
   * Gets the authorization token
   * @method
   * @name BaseProvider#getToken
   * @returns {string} the authorization token
   */
  protected getToken(): any {
    if(this._localStorage) {
      let profile = this._localStorage.get('profile');
      // let model
      return profile;
    }
  }

  /**
   * Adds the headers that are going to be sent in every request
   * @method
   * @name BaseProvider#addBasicHeaders
   * @returns {string} the authorization token
   */
  protected addBasicHeaders(): void {
    let authToken = this.getToken();
    this.addHeader('X-Requested-With', 'XMLHttpRequest');
    this.addHeader('Accept', 'application/json');
    this.addHeader('Content-Type', 'application/json');
    if (authToken){
      this.addHeader('Authentication-Token', authToken.AuthToken);
    }
  }

  /**
   * Check value is empty or not
   * @method
   * @name BaseProvider#getToken
   * @returns {string} the authorization token
  */
  public isEmpty(str: any): boolean {
    let arrObj = [null, 'null', '', undefined, 'undefined'];
    let i, key;
    for (i = 0; i < arrObj.length; i++) {
        if (arrObj[i] === str) {
            return true;
        }
    }
    if (typeof str === 'object') {
        for (key in str) {
            return false;
        }
        return true;
    }
    return false;
  }
}
