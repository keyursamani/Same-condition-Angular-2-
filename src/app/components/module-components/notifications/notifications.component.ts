import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications-lite';

import { HeadersProvider } from '../../../../common/core/headers.providers';
import {SCNotificationsRemindersService} from '../../common-components/services/notifications-reminders.service';
import {NotificationsTabVisibility} from './notifications-tab-visibility.model';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})

export class NotificationsComponent extends HeadersProvider implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  private notifications: any[];
  private reminders: any[];
  private notificationsUnreadCount: number = 0;
  private remindersUnreadCount: number = 0;
  private notificationsCount: number = 0;
  private remindersCount: number = 0;
  private notificationsTabs = new NotificationsTabVisibility();
  private loading: boolean;
  private page: number = 1;
  private perPage: number = 20;
  private offset: number = 0;
  private suffixes: any;

  constructor(
    private notificationService: NotificationsService, 
    private scNotificationsRemindersService: SCNotificationsRemindersService
    ) {
    super();
    this.suffixes = ["th", "st", "nd", "rd"];
  }

  ngOnInit() {    
    console.log('notifications init');    
    this.getNotificationsReminders();
  }

  ngOnDestroy() {
    console.log('destroyed');
  }

  getNotificationsReminders() {

    this.blockUI.start('please wait...');
    const params = {
      'limit': 'see_all',
      'per_page': this.perPage,
      'page': this.page,
      'offset': this.offset
    };

    this.loading = true;
    this.scNotificationsRemindersService.getNotifications(params, this.headers).subscribe(res => {
      if(res.status == "1" || res.status == 1){
        this.loading = false;
        this.notifications = this.sortingFunction(res.data.notifications[0]);
        this.reminders = this.sortingFunction(res.data.reminders[0]);
        this.notificationsCount = res.data.notifications_count;
        this.remindersCount = res.data.reminders_count;
        if(this.notificationsCount == 0 && this.remindersCount > 0){
          this.selectNotificationsTab()
        }
        this.blockUI.stop();
      } else{
        this.blockUI.stop();
      }
      }, err => {
        this.blockUI.stop();
        this.loading = false;
        this.notificationService.error(
          'Error', err.error,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
    });
  }

  getMoreNotificationsReminders() {
    this.blockUI.start('please wait...');
    this.page += 1;
    this.offset += this.perPage;
    const params = {
      'limit': 'see_all',
      'per_page': this.perPage,
      'page': this.page,
      'offset': this.offset
    };

    this.loading = true;
    this.scNotificationsRemindersService.getNotifications(params, this.headers).subscribe(res => {
        if(res.status == "1" || res.status == 1){
          this.loading = false;
          const notifications = this.sortingFunction(res.data.notifications[0]);
          const reminders = this.sortingFunction(res.data.reminders[0]);
          this.notifications = this.notifications.concat(notifications);
          this.reminders = this.reminders.concat(reminders);
          this.notificationsCount = res.data.notifications_count;
          this.remindersCount = res.data.reminders_count;
          this.blockUI.stop();
        } else{
          this.blockUI.stop();
        }
      }, err => {
        this.blockUI.stop();
        this.loading = false;
        this.notificationService.error('Error', err.error, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
  }

  sortingFunction(data) {
    const sortedKeys = [];
    const sortedObjects = [];
    for (const key in data) {
      sortedKeys.push(key);
    }
    sortedKeys.forEach((value, index, array) => {
      const obj = {};
      obj[value] = data[value];
      sortedObjects.push(obj);
    });
    return sortedObjects;
  }

  selectNotificationsTab() {
    if (this.notificationsCount === 0 && this.remindersCount > 0) {
      this.switchNotificationsTab(2);
    } else if (this.notificationsCount > 0 && this.remindersCount === 0) {
      this.switchNotificationsTab(1);
    }
  }

  switchNotificationsTab(tabId: number) {
    this.notificationsTabs.isNotificationsTabVisible = (tabId === 1);
    this.notificationsTabs.isRemindersTabVisible = (tabId === 2);
    this.notificationsTabs.selectedTabNo = tabId;
  }

  markAsRead(object, type) {
    if (object) {
      const data = {
        type: type,
        is_read: !object.is_read
      };
      this.scNotificationsRemindersService.patchNotificationDetail(object.id, data, this.headers).subscribe(res => {
          if(res.status == "1" || res.status == 1){          
            object.is_read = res.data.is_read;
            this.scNotificationsRemindersService.get_notification_count(this.headers);
            this.scNotificationsRemindersService.get_reminder_count(this.headers);
          }
        }, err => {
          console.log(err);
          this.notificationService.error('Error', err.error,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
      });
    }
  }

  hideNotificationReminder(object, type) {
    if (object) {
      const data = {
        type: type,
        is_hide: !object.is_hide
      };
      this.scNotificationsRemindersService.patchNotificationDetail(object.id, data, this.headers).subscribe(res => {
          object.is_hide = res.data.is_hide;
      }, 
      err => {
        console.log(err);
        this.notificationService.error('Error', err.error,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }
  }

  onScroll() {
    if (!this.loading) {
      console.log('scrolled!!');
      this.getMoreNotificationsReminders();
    }
  }

  // check if date of notification/reminder is same as today's date
  // and return highlighting class 'sc-today'
  checkDate(object) {
    if (object) {
      const key = <any>Object.keys(object)[0];
      if (key && (moment().format('YYYY-MM-DD') === moment(key).format('YYYY-MM-DD'))) {
        return true;
      }
    }
    return false;
  }

  formatDate(object){
    var yesterday = moment().subtract(1, 'days');
    const key = <any>Object.keys(object);
    if (key && (moment().format('YYYY-MM-DD') === moment(key).format('YYYY-MM-DD'))) {
      return "Today";
    } else if(moment(yesterday).format('YYYY-MM-DD') === moment(object).format('YYYY-MM-DD')){
      return "Yesterday";
    } else{
      var dtfilter = moment(object).format('MMMM DD');
      var day = parseInt(dtfilter.slice(-2));
      var relevantDigits = (day < 30) ? day % 20 : day % 30;
      var suffix = (relevantDigits <= 3) ? this.suffixes[relevantDigits] : this.suffixes[0];
      return dtfilter+suffix + "," + moment(object).format('YYYY');
    }
  }
}
