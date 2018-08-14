import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SCNotificationsRemindersService {
  // domain = 'https://dev.samecondition.com';
  domain ="http://52.173.139.178";

  constructor (private http: Http) {}

  /**
   * Handles api call error
   * @param {any} error
   * @returns {ErrorObservable}
   */
  private handleError(error: any) {
      error = error.json();
      const errMsg = error || {
          status: 500
      };
      return Observable.throw(errMsg);
  }

  getNotifications(params, headers) {
    const requestOptionArgs = {};
    requestOptionArgs['headers'] = headers;
    requestOptionArgs['params'] = params;

    const path = `${this.domain}/api/v1/notifications`;
    return this.http.get(path, requestOptionArgs)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getNotificationDetail(id, params, headers) {
    const requestOptionArgs = {};
    requestOptionArgs['headers'] = headers;
    requestOptionArgs['params'] = params;

    const path = `${this.domain}/api/v1/notifications/${id}`;
    return this.http.get(path, requestOptionArgs)
      .map(res => res.json())
      .catch(this.handleError);
  }

  patchNotificationDetail(id, data, headers) {
    const requestOptionArgs = {};
    headers.delete('content-type');
    requestOptionArgs['headers'] = headers;
    const formData = this.convertObjectToFormData(data);

    const path = `${this.domain}/api/v1/notifications/${id}`;
    return this.http.patch(path, formData, requestOptionArgs)
        .map(res => res.json())
        .catch(this.handleError);
  }

  convertObjectToFormData(object) {
    if (object) {
      const formData = new FormData();
      for (const key in object) {
        formData.append(key, object[key]);
      }
      return formData;
    }
  }

  public notificationsUnreadCount = new Subject<string>();
  notificationsUnreadCount$ = this.notificationsUnreadCount.asObservable();
  get_notification_count(headers:any){
    try{
      const params = {
        'per_page': 10,
      };
      this.getNotifications(params, headers).subscribe(res => {
        this.notificationsUnreadCount.next(res.data.notifications_unread_count);
      }, err => {
      });
    } catch(e){
      console.log("Error occure while get notification count. Error is ", e);
    }
  }

  public remindersUnreadCount = new Subject<string>();
  remindersUnreadCount$ = this.remindersUnreadCount.asObservable();
  get_reminder_count(headers:any){
    try{
      const params = {
        'per_page': 10,
      };
      this.getNotifications(params, headers).subscribe(res => {
        this.remindersUnreadCount.next(res.data.reminders_unread_count);
      }, err => {
      });
    } catch(e){
      console.log("Error occure while get reminder count. Error is ", e);
    }
  }

  get_message_notification(params, headers){
    try{
      const requestOptionArgs = {};
      requestOptionArgs['headers'] = headers;

      const path = `${this.domain}/api/v1/messages/unread/notifications`;
      return this.http.get(path, requestOptionArgs)
        .map(res => res.json())
        .catch(this.handleError);
    } catch(e){
      console.log("Error occure while get messages. Error is ", e);
    }
  }

  public userProfile = new Subject<string>();
  userProfile$ = this.userProfile.asObservable();
  get_Login_user_Profile(headers:any){
    try{
      this.getLoginuserProfile({}, headers).subscribe(res => {
        console.log('bio', res.data); 
        this.userProfile.next(res.data);        
      }, err => {
      });
    } catch(e){
      console.log("Error occure while get user profile. Error is ", e);
    }
  }  

  getLoginuserProfile(params, headers) {
    const requestOptionArgs = {};
    requestOptionArgs['headers'] = headers;
    requestOptionArgs['params'] = params;

    const path = `${this.domain}/api/v1/users/view_profile`;
    return this.http.get(path, requestOptionArgs)
      .map(res => res.json())
      .catch(this.handleError);
  }

}
