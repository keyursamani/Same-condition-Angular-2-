import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications-lite';
import { SCApi } from '../../../../common/swagger-providers/sc-api.provider';
import { HeadersProvider } from '../../../../common/core/headers.providers';
import { SCNotificationsRemindersService } from '../services/notifications-reminders.service';
import {NotificationsTabVisibility} from '../../module-components/notifications/notifications-tab-visibility.model';

declare const $: any;
declare const jQuery: any;
declare var window: any;
declare var FB: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent extends HeadersProvider implements OnInit {
  private userProfile: any = [];
  notifications: any[];
  reminders: any[];
  private notificationsUnreadCount: number = 0;
  private remindersUnreadCount: number = 0;
  notificationsTabs = new NotificationsTabVisibility();
  userProfilePhysRes: any;
  userRole: any;
  private messages:any = [];
  private msgUnreadCount : number = 0;

  constructor(
    public _router: Router, 
    public _APIservices: SCApi,
    private notificationService: NotificationsService,
    private scNotificationsRemindersService: SCNotificationsRemindersService
    ) {

    super();
    this.userRole = this._localStorage.get('role');
    this.userProfilePhysRes = {
      'photo_url' : '',
      'first_name' : '',
      'last_name' : ''
    }
    this.userProfile = {
      'photo_url' : '',
      'first_name' : '',
      'last_name' : ''
    }
  }

  ngOnInit() {
    // load facebook sdk
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = () => {
      FB.init({
        appId            : '1463731190384773',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10'
      });
      FB.AppEvents.logPageView();
    };

    //this.userRole = 'patient';
    if(this.userRole == 'patient' || this.userRole == 'care_member'){
      this.getLoginuserProfile();
    } else {
      this.getProfilePhysicianResearcher();
    }

    /*setInterval(()=>{
      this.get_message_notification();
    },3000);*/

    this.scNotificationsRemindersService.notificationsUnreadCount$.subscribe(data=>{
      this.notificationsUnreadCount = Number(data);
    });
    this.scNotificationsRemindersService.userProfile$.subscribe(data=>{
      this.userProfile = data;
    });

    this.scNotificationsRemindersService.remindersUnreadCount$.subscribe(data=>{
      this.remindersUnreadCount = Number(data);
    });
  }

  goto_profile(){
    if(this.userRole == 'patient' || this.userRole == 'care_member')
      this._router.navigate(['/app/dashboard']);
    else
      this._router.navigate(['app/dashboard/researcher']);
  }

  getLoginuserProfile() {
    try {
      let data = {};
      this._APIservices.get_patient_profile(data, this.headers).subscribe(suc => {
        this.userProfile = suc.body.data;
        this.getNotificationsReminders();
      }, err => {
        const err_res = JSON.parse(err._body);
        console.log(err_res);
        this.notificationService.error('Error', err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    } catch (err) {
      console.log('Error occure while get logged in user profile. Error is ', err);
    }
  }

  getNotificationsReminders() {
    const params = {
      'per_page': 10
    };

    this.scNotificationsRemindersService.getNotifications(params, this.headers)
      .subscribe(res => {
        this.notifications = res.data.notifications;
        this.reminders = res.data.reminders;
        this.notificationsUnreadCount = res.data.notifications_unread_count;
        this.remindersUnreadCount = res.data.reminders_unread_count;
      }, err => {
        this.notificationService.error(
          'Error', err.error,
          { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false }
        );
      });
  }

  selectNotificationsTab() {
    if (this.notificationsUnreadCount === 0 && this.remindersUnreadCount > 0) {
      this.switchNotificationsTab(2);
    } else if (this.notificationsUnreadCount > 0 && this.remindersUnreadCount === 0) {
      this.switchNotificationsTab(1);
    }
  }

  switchNotificationsTab(tabId: number) {
    this.notificationsTabs.isNotificationsTabVisible = (tabId === 1);
    this.notificationsTabs.isRemindersTabVisible = (tabId === 2);
    this.notificationsTabs.selectedTabNo = tabId;
  }

  /*logout() {
    FB.logout(function(response) {
      console.log("facebook logout", JSON.stringify(response));
    });
    this._localStorage.remove('role');
    this._localStorage.remove('profile');
    this._router.navigate(['']);
  }*/

  logout(){
    try{
      this._localStorage.remove('role');
      this._localStorage.remove('profile');
      this._router.navigate(['']);
      FB.getLoginStatus((response)=> {
        console.log('login status', response.status);
        if (response.status === 'connected') {
          FB.logout((response)=> {
            
          });
        }
      });
    } catch(e){
      console.log("Error occur while logout with facebook. Error is ", e);
    }
  }

  getProfilePhysicianResearcher(){
    let data = {};
    this._APIservices.get_profile_physician_researcher(data, this.headers).subscribe(suc => {
      this.userProfile = this.userProfilePhysRes = suc.body.data;
      if(this.userProfilePhysRes.physicians_researcher){
        this.userRole = this.userProfilePhysRes.role;
      }
    },
    err=>{
      console.log(err);
      var err_res = JSON.parse(err._body);
    });
  }
  getactive() {
   if((this._router.url.indexOf('/global/community-treatment-detail')!=-1)){
     return true;
   }else if(this._router.url=='/global/community-treatment'){
    return true;
   }
 }
 getactiveConnect(){
  if((this._router.url.indexOf('/global/connect')!=-1)){
    return true;
  }else if(this._router.url=='/global/connect'){
   return true;
  }
 }
 
 getactive1(){
   if((this._router.url.indexOf('/global/community-condition-detail')!=-1)){
     return true;
   }else if(this._router.url=='/global/community-condition'){
    return true;
   }
 }

 getactiveSymptoms(){
  if((this._router.url.indexOf('/global/community-symptoms')!=-1)){
    return true;
  }else if(this._router.url=='/global/community-symptoms'){
   return true;
  }
 }

  getactiveFeed(){
  if((this._router.url.indexOf('/global/community-feed')!=-1)){
    return true;
  }else if(this._router.url=='/global/community-feed'){
   return true;
  }
 }

  get_message_notification() {
    this.scNotificationsRemindersService.get_message_notification({}, this.headers).subscribe(res => {
      if(res.status == "1" || res.status == 1){
        this.messages = res.data;
        this.msgUnreadCount = (res.unread_count || 0);
      }
    }, err => {
      this.notificationService.error('Error', err.error,{ 
        timeOut: 3000, 
        showProgressBar: false, 
        pauseOnHover: false, 
        clickToClose: false 
      });
    });
  }

}
