import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';

var timezonesjson = require('./../../../../common/utilities/timezones.json'); 

declare var $ : any;
declare var jQuery : any;
declare var window: any;
declare var FB: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;

	private connect_facebook : boolean = false;
	private keep_profile_info_as_it_is : boolean = false;
	private update_selected_information : boolean = false;
	private	access_token : string = '';
	private my_profile_photo : boolean = false;
	private my_name : boolean = false;
	private my_birthday : boolean = false;
	private my_gender : boolean = false;
	private my_current_city : boolean = false;
	private my_email : boolean = false;

	private isEmailEdit : boolean = false;
	private userEmail : string = "";
	private confirmPassword : string = "";
	private email : string = "";
	private confirmEmail : string = "";
	private isEditPassword : boolean = false;
	private oldPassword : string = ""; //(this._localStorage.get('mypassword') == null || this._localStorage.get('mypassword') == undefined) ? "" : this._localStorage.get('mypassword').toString();
	private newPassword : string = "";
	private isEditTimezone : boolean = false;
	private timeZones : any = [];
	private myTimeZone : string = "";
	private isEditLanguage : boolean = false;
	private change_languages : string = "";
	private isHideProfile : boolean = false;
	private comments_on_my_posts_notifications : boolean = false;
	private comments_on_my_posts_email : boolean = false;
	private comments_on_forums_notifications : boolean = false;
	private comments_on_forums_email : boolean = false;
	private likes_on_my_posts_notifications : boolean = false;
	private likes_on_my_posts_email : boolean = false;
	private tags_notifications : boolean = false;
	private tags_email : boolean = false;
	private birthdays_patients_follow_notifications : boolean = false;
	private birthdays_patients_follow_email : boolean = false;
	private new_messages_notifications : boolean = false;
	private new_messages_email : boolean = false;
	private monthly_newsletters_notifications : boolean = false;
	private monthly_newsletters_email : boolean = false;
	private monthly_newsletters_my_conditions_notifications : boolean = false;
	private monthly_newsletters_my_conditions_email : boolean = false;
	private research_opportunities_notifications : boolean = false;
	private research_opportunities_email : boolean = false;

	private color_blind : boolean = false;
	private font_size : string = "standard"

	private my_feelings_notifications : boolean = false;
	private my_feelings_email : boolean = false;
	private my_feelings_frequency : string = "daily";

	private my_qol_score_notifications : boolean = false;
	private my_qol_score_email : boolean = false;
	private my_qol_score_frequency : string = "daily";

	private my_symptoms_notifications : boolean = false;
	private my_symptoms_email : boolean = false;
	private my_symptoms_frequency : string = "daily";

	private my_treatments_notifications : boolean = false;
	private my_treatments_email : boolean = false;
	private my_treatments_frequency : string = "daily";

	private my_conditions_notifications : boolean = false;
	private my_conditions_email : boolean = false;
	private my_conditions_frequency : string = "daily";

	private my_weight_notifications : boolean = false;
	private my_weight_email : boolean = false;
	private my_weight_frequency : string = "daily";

	private my_labs_tests_notifications : boolean = false;
	private my_labs_tests_email : boolean = false;
	private my_labs_tests_frequency : string = "daily";

	private donate_my_data_notifications : boolean = true;
	private donate_my_data_email : boolean = true;
	private donate_my_date_frequency : string = "monthly";

	private clinical_trials_notifications : boolean = true;
	private clinical_trials_email : boolean = true;

	private view_condition_list : any = [];
	private formValidation : boolean = false;

	private send_message = {
		'first_name' : '',
		'last_name' : '',
		'email' : '',
		'reason' : '',
		'message' : ''
	}

	//constructor
	constructor(
		private APIservices : SCApi, 
		private NotificationService : NotificationsService,
		private _router : Router
		) { 
		super();
	}

	//ngOnInit
	ngOnInit() {
		var signInWithFacebook = this._localStorage.get('signInWithFacebook');
		this.connect_facebook = (signInWithFacebook == 'false' || signInWithFacebook == false) ? false : true;
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

		//this.get_login_user_profile();
		this.get_user_details();
		this.load_timezones();
		this.view_timezone();
		this.view_accessibility_setting();
		this.view_hide_my_profile();
		this.view_email_setting();
		this.view_reminder_setting();
	}

	//get user detail from local storage
  	get_user_details(){
  		try{
  			this.userEmail = (String(this._localStorage.get('email')) || '');
  		} catch(e){
  			console.log("Error occur while get user details. Error is ", e);
  		}
  	}

	//get_login_user_profile
	get_login_user_profile(){
		try {
	    	this.blockUI.start('please wait...');
	    	this.APIservices.get_patient_profile({}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			let userProfile = suc.body.data;
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while get login user profile. Error is ", err_res.message);
	    	});
	    } catch (err) {
	    	this.blockUI.stop();
	    	console.log('Error occure while get logged in user profile. Error is ', err);
	    }
  	}

  	//connect to facebook
  	connect_to_facebook_prompt(){
  		try{
  			if(this.connect_facebook){
  				$("#connect-facebook").modal('show');
  			} else{
  				$("#facebookDisconnectModal1").modal('show');
  			}
  		} catch(e){
  			console.log("Error occure while connect to facebok. Error is ", e);
  		}
  	}

  	//Facebook Connection
  	connect_to_facebook(){
  		try{
  			$("#connect-facebook").modal('hide');
  			let data = {
  				'access_token' : (this.access_token || ''),
  				'my_profile_photo' : this.update_selected_information == true ? this.my_profile_photo : false,
  				'my_name' : this.update_selected_information == true ? this.my_name : false,
  				'my_birthday' : this.update_selected_information == true ? this.my_birthday : false,
  				'my_gender' : this.update_selected_information == true ? this.my_gender : false,
  				'my_current_city' : this.update_selected_information == true ? this.my_current_city : false,
  				'my_email' : this.update_selected_information == true ? this.my_email : false 
  			}
  			this.APIservices.connect_with_facebook({data : data}, this.headers).subscribe(suc => {
  				//window.prompt('suc', JSON.stringify(suc));
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.connect_facebook = true;
	    			this._localStorage.set('signInWithFacebook', true);
	    			this.NotificationService.success('facebook', suc.body.message,{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		const err_res = JSON.parse(err._body);
	    		this.NotificationService.error('facebook', err_res.message,{
    				timeOut: 3000,
    				showProgressBar: false,
    				pauseOnHover: false,
    				clickToClose: false
    			});
    			this.blockUI.stop();
	    		this.connect_facebook = false;	    		  		
	    	});
  		} catch(e){
  			this.connect_facebook = false;
  			console.log("Error occure while connect to facebook. Error is ", e);
  		}
  	}

  	//get token from facebook
  	get_access_token_facebook(){
	    try{
	      this.blockUI.start('please wait...');
	      $('#facebookDisconnectModal2').modal('hide');
	      FB.getLoginStatus((response)=> {
	        //window.prompt('LoginStatus', JSON.stringify(response));
	        if (response.status === 'connected'){
	          this.access_token = response.authResponse.accessToken;
	          this.connect_to_facebook();
	        } else{
	          FB.login((response)=> {
	            if (response.authResponse){
	              this.access_token = response.authResponse.accessToken;
	              this.connect_to_facebook();
	            } else{
	              console.log("Error occure while login with signin with facebook. Error is ", response);
	            }
	          }, { scope: 'email, user_friends' });
	        }        
	      });
	      this.blockUI.stop();
	    } catch(e){
	      this.blockUI.stop();
	      console.log("Error occure while get facebook access token. Error is ", e);
	    }
  	}

  	//Facebook Disconnection
  	disconnect_with_facebook(){
  		try{
  			this.blockUI.start('please wait...');
  			$("#facebookDisconnectModal1").modal('hide');
  			let data = {
  				'password' : (this.newPassword || ""),
  				'password_confirmation' : (this.confirmPassword || ""),
  			}
  			this.APIservices.disconnect_with_facebook(data, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this._localStorage.set('signInWithFacebook', false);
	    			$("#facebookDisconnectModal2").modal('show');
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		this.NotificationService.error('Password', err_res.message,{
    				timeOut: 3000,
    				showProgressBar: false,
    				pauseOnHover: false,
    				clickToClose: false
    			});
	    	});
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while disconnect facebook. Error is ", e);
  		}
  	}

  	cancel_request(){
  		this.connect_facebook = false;
  		$("#connect-facebook").modal('hide');
  	}

  	//Change email
  	change_email() {
	  	try{
	  		var emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
	  		if(this.confirmPassword == ""){
	  			this.formValidation = true;
	  			return false;
	  		}
	  		if(this.email == ""){
	  			this.formValidation = true;
	  			return false;
	  		}
	  		if(this.confirmEmail == ""){
	  			this.formValidation = true;
	  			return false;
	  		}
	  		if(!(emailfilter.test(this.email))){
	  			this.formValidation = true;
	  			return false;
		    }

	  		this.blockUI.start('please wait...');
	  		let data = {
	  			'current_password' : (this.confirmPassword || ""),
	  			'email' : (this.email || ""),
	  			'email_confirmation' : (this.confirmEmail || ""),
	  		}

	  		this.APIservices.change_email({data : data}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.userEmail = suc.body.data.email;
	    			this._localStorage.set('email',suc.body.data.email);
	    			this.isEmailEdit = false;
	    			this.formValidation = false;
	    			this.NotificationService.success('Email', suc.body.message,{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while change password. Error is ", err_res.message);
	    	});
	  	} catch(e){
	  		this.blockUI.stop();
	  		console.log("Error occure while change password. Error is ", e);
	  	}
  	}

  	//Change password
  	change_password(){
  		try{
  			if(this.oldPassword == ""){
  				this.formValidation = true;
  				return false;
  			}
  			if(this.newPassword == ""){
  				this.formValidation = true;
  				return false;
  			}
  			if(this.confirmPassword == ""){
  				this.formValidation = true;
  				return false;
  			}
  			if(this.confirmPassword != this.newPassword){
  				this.formValidation = true;
  				return false;
  			}

  			this.blockUI.start('please wait...');
  			let data = {
  				'current_password' : (this.oldPassword || ""),
  				'password' : (this.newPassword || ""),
  				'password_confirmation' : (this.confirmPassword || ""),
  			}

  			this.APIservices.change_password({data : data}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.isEditPassword = false;
	    			this.formValidation = false;
	    			this.newPassword = "";
	    			this.confirmPassword = "";
	    			this.NotificationService.success('Password', suc.body.message,{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while change password. Error is ", err_res.message);
	    	});
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while change password. Error is ", e);
  		}
  	}

  	//Update Time Zone
  	update_timezone(){
  		try{

  			this.blockUI.start('please wait...');
  			let data = {
  				'timezone' : (this.myTimeZone || "")
  			}
  			this.APIservices.update_timezone({data : data}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.formValidation = false;
	    			this.isEditTimezone = false;
	    			this.view_timezone();
	    			this.NotificationService.success('Timezone', suc.body.message,{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while change time zone. Error is ", err_res.message);
	    	});
  		} catch(e){
  			console.log("Error occure while change time zone. Error is ", e);
  		}
  	}

  	//load_timezones
  	load_timezones(){
  		try{
  			this.blockUI.start('please wait...');
  			this.timeZones = timezonesjson
  			this.blockUI.stop();
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while load timezones. Error is ", e)
  		}
  	}

  	//View Time Zone
  	view_timezone(){
  		try{
  			this.blockUI.start('please wait...');
  			this.APIservices.view_timezone({}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.myTimeZone = suc.body.data.timezone
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while view timezone. Error is ", err_res.message);
	    	});

  		} catch(e){
  			console.log("Error occure while view timezone. Error is ", e);
  		}
  	}

  	//change language
  	change_language(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'change_languages' : this.change_languages == "" ? "English" : (this.change_languages || "")
  			}
  			this.update_accessibility_setting(data);
  		} catch(e){
  			console.log("Error occure while change password. Error is ", e);
  		}
  	}

  	//change font
  	change_font(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'font_size' : this.font_size == "" ? "standard" : (this.font_size || "")
  			}
  			this.update_accessibility_setting(data);
  		} catch(e){
  			console.log("Error occure while change font. Error is ", e);
  		}
  	}

  	//change color blind
  	change_color_blind(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'color_blind' : this.color_blind
  			}
  			this.update_accessibility_setting(data);
  		} catch(e){
  			console.log("Error occure while change font. Error is ", e);
  		}
  	}

  	//Update Accessibility Settings
  	update_accessibility_setting(data){
  		try{  			
  			this.APIservices.update_accessibility_setting({data : data}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.formValidation = false;
	    			this.isEditLanguage = false;
	    			this.view_accessibility_setting();
	    			this.NotificationService.success('Accessibility', suc.body.message,{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while update language. Error is ", err_res.message);
	    	});
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while update language. Error is ", e);
  		}
  	}

  	//View Accessibility Settings
  	view_accessibility_setting(){
  		try{
  			this.APIservices.view_accessibility_setting({}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.change_languages = suc.body.data.change_languages;
	    			this.font_size = suc.body.data.font_size.toLowerCase();
	    			this.color_blind = suc.body.data.color_blind;
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while view language. Error is ", err_res.message);
	    	});
  		} catch(e){
  			console.log("Error occure while view language. Error is ", e);
  		}
  	}

  	hide_my_profile_confirm(){
  		$("#hideProfileModal").modal('show');
  	}

  	//Update Privacy Settings - Hide My Profile
  	hide_my_profile(){
  		try{
  			this.blockUI.start('please wait...');
  			$("#hideProfileModal").modal('hide');
  			$("#deactivateProfileModal").modal('hide');
  			let data = {
  				'is_hidden' : this.isHideProfile
  			}
  			this.APIservices.hide_my_profile({data : data}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.view_hide_my_profile();
	    			this.NotificationService.success('Profile', "Profile has been hidden.",{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while update language. Error is ", err_res.message);
	    	});
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while hide profile. Error is ", e);
  		}
  	}

  	//View Privacy Settings - Hide My Profile
  	view_hide_my_profile(){
  		try{
  			this.APIservices.view_hide_my_profile({}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.isHideProfile = suc.body.data.is_hidden;
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while view hide profile. Error is ", err_res.message);
	    	});
  		} catch(e){
  			console.log("Error occure while view hide profile. Error is ", e);
  		}
  	}

  	//Deactivate My Account
  	deactivate_my_account(){
  		try{
  			this.blockUI.start('please wait...');
  			$("#deactivateProfileModal").modal('hide');
  			this.APIservices.deactivate_my_account({}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this._localStorage.remove('role');
	    			this._localStorage.remove('profile');
	    			this.NotificationService.success('Account', suc.body.message,{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    			this._router.navigate(['']);
	    			FB.getLoginStatus((response)=> {
	    			  console.log('login status', response.status);
	    			  if (response.status === 'connected') {
	    			    FB.logout((response)=> {
	    			      
	    			    });
	    			  }
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while deactivate my account. Error is ", err_res.message);
	    	});
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while deactivate my account. Error is ", e);
  		}
  	}

  	//Notification on post
  	notification_on_post(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'comments_on_my_posts_notifications' : this.comments_on_my_posts_notifications
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on post
  	email_alerts_on_post(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'comments_on_my_posts_email' : this.comments_on_my_posts_email
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	//Notification on forum
  	notification_on_forum(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'comments_on_forums_notifications' : this.comments_on_forums_notifications
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on post
  	email_alerts_on_forum(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'comments_on_forums_email' : this.comments_on_forums_email
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	//Notification on like
  	notification_on_like(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'likes_on_my_posts_notifications' : this.likes_on_my_posts_notifications
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on like
  	email_alerts_on_like(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'likes_on_my_posts_email' : this.likes_on_my_posts_email
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	//Notification on tags
  	notification_on_tags(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'tags_notifications' : this.tags_notifications
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on tags
  	email_alerts_on_tags(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'tags_email' : this.tags_email
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	//Notification on birthday
  	notification_on_birthday(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'birthdays_patients_follow_notifications' : this.birthdays_patients_follow_notifications
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on tags
  	email_alerts_on_birthday(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'birthdays_patients_follow_email' : this.birthdays_patients_follow_email
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	//Notification on new message
  	notification_on_newMessage(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'new_messages_notifications' : this.new_messages_notifications
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on new message
  	email_alerts_on_newMessage(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'new_messages_email' : this.new_messages_email
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	//Notification on monthly news letter
  	notification_on_monthly_newsletter(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'monthly_newsletters_notifications' : this.monthly_newsletters_notifications
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on monthly news letter
  	email_alerts_on_monthly_newsletter(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'monthly_newsletters_email' : this.monthly_newsletters_email
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	//Notification on my condition monthly news letter
  	notification_on_mycondition_monthly_newsletter(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'monthly_newsletters_my_conditions_notifications' : this.monthly_newsletters_my_conditions_notifications
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on my condition monthly news letter
  	email_alerts_on_mycondition_monthly_newsletter(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'monthly_newsletters_my_conditions_email' : this.monthly_newsletters_my_conditions_email
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	//Notification on research
  	notification_on_research(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'research_opportunities_notifications' : this.research_opportunities_notifications
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on research
  	email_alerts_on_research(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'research_opportunities_email' : this.research_opportunities_email
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	//View Email Settings
  	view_email_setting(){
  		try{
  			this.blockUI.start('please wait...');
  			this.APIservices.view_email_setting({}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			let response = suc.body.data;
	    			this.comments_on_my_posts_notifications = (response.comments_on_my_posts_notifications || "");
	    			this.comments_on_my_posts_email = (response.comments_on_my_posts_email || "");
	    			this.comments_on_forums_notifications = (response.comments_on_forums_notifications || "");
	    			this.comments_on_forums_email = (response.comments_on_forums_email || "");
	    			this.likes_on_my_posts_notifications = (response.likes_on_my_posts_notifications || "");
	    			this.likes_on_my_posts_email = (response.likes_on_my_posts_email || "");
	    			this.tags_notifications = (response.tags_notifications || "");
	    			this.tags_email = (response.tags_email || "");
	    			this.birthdays_patients_follow_notifications = (response.birthdays_patients_follow_notifications || "");
	    			this.birthdays_patients_follow_email = (response.birthdays_patients_follow_email || "");
	    			this.new_messages_notifications = (response.new_messages_notifications || "");
	    			this.new_messages_email = (response.new_messages_email || "");
	    			this.monthly_newsletters_notifications = (response.monthly_newsletters_notifications || "");
	    			this.monthly_newsletters_email = (response.monthly_newsletters_email || "");
	    			this.monthly_newsletters_my_conditions_notifications = (response.monthly_newsletters_my_conditions_notifications || "");
	    			this.monthly_newsletters_my_conditions_email = (response.monthly_newsletters_my_conditions_email || "");
	    			this.research_opportunities_notifications = (response.research_opportunities_notifications || "");
	    			this.research_opportunities_email = (response.research_opportunities_email || "");
	    			this.clinical_trials_notifications = (response.clinical_trials_notifications || "");
	    			this.clinical_trials_email = (response.clinical_trials_email || "");	    			
	    			this.view_condition_list = (response.clinical_trials_conditions || []);
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while view hide profile. Error is ", err_res.message);
	    	});
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while view email setting. Error is ", e);
  		}
  	}

  	//call api update_email_setting
  	update_email_setting(data){
  		try{
  			this.APIservices.update_email_setting({data : data}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.view_email_setting();
	    			this.NotificationService.success('Notification', suc.body.message,{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while deactivate my account. Error is ", err_res.message);
	    	});
  		} catch(e){
  			console.error("Error occure while call api. Error is ", e);
  		}
  	}

  	//set reminder for feelings
  	set_reminder_for_feelings(){
  		try{

  			if(this.my_feelings_frequency == ""){
  				this.formValidation = true;
  				return false;
  			}

  			this.blockUI.start('please wait...');
  			let data = {
  				'my_feelings_notifications' : this.my_feelings_notifications,
  				'my_feelings_email' : this.my_feelings_email,
  				'my_feelings_frequency' : (this.my_feelings_frequency || '')
  			}
  			this.update_reminder_setting(data);
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while set reminder setting for feelings. Error is ", e);
  		}
  	}

  	//set reminder for qol server
  	set_reminder_for_qol(){
  		try{
  			if(this.my_qol_score_frequency == ""){
  				this.formValidation = true;
  				return false;
  			}

  			this.blockUI.start('please wait...');
  			let data = {
  				'my_qol_score_notifications' : this.my_qol_score_notifications,
  				'my_qol_score_email' : this.my_qol_score_email,
  				'my_qol_score_frequency' : (this.my_qol_score_frequency || '')
  			}
  			this.update_reminder_setting(data);
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while set reminder setting for qol. Error is ", e);
  		}
  	}

  	//set reminder for symptoms
  	set_reminder_for_symptoms(){
  		try{

  			if(this.my_symptoms_frequency == ""){
  				this.formValidation = true;
  				return false;
  			}

  			this.blockUI.start('please wait...');
  			let data = {
  				'my_symptoms_notifications' : this.my_symptoms_notifications,
  				'my_symptoms_email' : this.my_symptoms_email,
  				'my_symptoms_frequency' : (this.my_symptoms_frequency || '')
  			}
  			this.update_reminder_setting(data);
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while set reminder setting for symptoms. Error is ", e);
  		}
  	}

  	//set reminder for treatment
  	set_reminder_for_treatment(){
  		try{

  			if(this.my_treatments_frequency == ""){
  				this.formValidation = true;
  				return false;
  			}

  			this.blockUI.start('please wait...');
  			let data = {
  				'my_treatments_notifications' : this.my_treatments_notifications,
  				'my_treatments_email' : this.my_treatments_email,
  				'my_treatments_frequency' : (this.my_treatments_frequency || '')
  			}
  			this.update_reminder_setting(data);
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while set reminder setting for treatment. Error is ", e);
  		}
  	}

  	//set reminder for condition
  	set_reminder_for_condition(){
  		try{

  			if(this.my_conditions_frequency == ""){
  				this.formValidation = true;
  				return false;
  			}

  			this.blockUI.start('please wait...');
  			let data = {
  				'my_conditions_notifications' : this.my_conditions_notifications,
  				'my_conditions_email' : this.my_conditions_email,
  				'my_conditions_frequency' : (this.my_conditions_frequency || '')
  			}
  			this.update_reminder_setting(data);
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while set reminder setting for condition. Error is ", e);
  		}
  	}

  	//set reminder for weight
  	set_reminder_for_weight(){
  		try{

  			if(this.my_weight_frequency == ""){
  				this.formValidation = true;
  				return false;
  			}

  			this.blockUI.start('please wait...');
  			let data = {
  				'my_weight_notifications' : this.my_weight_notifications,
  				'my_weight_email' : this.my_weight_email,
  				'my_weight_frequency' : (this.my_weight_frequency || '')
  			}
  			this.update_reminder_setting(data);
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while set reminder setting for weight. Error is ", e);
  		}
  	}

  	//set reminder for labtest
  	set_reminder_for_labtest(){
  		try{

  			if(this.my_labs_tests_frequency == ""){
  				this.formValidation = true;
  				return false;
  			}

  			this.blockUI.start('please wait...');
  			let data = {
  				'my_labs_tests_notifications' : this.my_labs_tests_notifications,
  				'my_labs_tests_email' : this.my_labs_tests_email,
  				'my_labs_tests_frequency' : (this.my_labs_tests_frequency || '')
  			}
  			this.update_reminder_setting(data);
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while set reminder setting for labtest. Error is ", e);
  		}
  	}

  	//set reminder for labtest
  	set_reminder_for_donate_my_data(){
  		try{
  			if(this.donate_my_date_frequency == ""){
  				this.formValidation = true;
  				return false;
  			}
  			
  			this.blockUI.start('please wait...');
  			let data = {
  				'donate_my_data_notifications' : this.donate_my_data_notifications,
  				'donate_my_data_email' : this.donate_my_data_email,
  				'donate_my_date_frequency' : (this.donate_my_date_frequency || '')
  			}
  			this.update_reminder_setting(data);
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while set reminder setting for labtest. Error is ", e);
  		}
  	}

  	//View Profile Reminders Settings
  	view_reminder_setting(){
  		try{
  			this.blockUI.start('please wait...');
  			this.APIservices.view_reminder_setting({}, this.headers).subscribe(suc => {
  				this.formValidation = false;
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			let response = suc.body.data;

	    			this.my_feelings_notifications = (response.my_feelings_notifications || false);
	    			this.my_feelings_email = (response.my_feelings_email || false);
	    			this.my_feelings_frequency = (response.my_feelings_frequency || "daily");

	    			this.my_qol_score_notifications = (response.my_qol_score_notifications || false);
	    			this.my_qol_score_email = (response.my_qol_score_email || false);
	    			this.my_qol_score_frequency = (response.my_qol_score_frequency || "daily");

	    			this.my_symptoms_notifications = (response.my_symptoms_notifications || false);
	    			this.my_symptoms_email = (response.my_symptoms_email || false);
	    			this.my_symptoms_frequency = (response.my_symptoms_frequency || "daily");

	    			this.my_treatments_notifications = (response.my_treatments_notifications || false);
	    			this.my_treatments_email = (response.my_treatments_email || false);
	    			this.my_treatments_frequency = (response.my_treatments_frequency || "daily");

	    			this.my_conditions_notifications = (response.my_conditions_notifications || false);
	    			this.my_conditions_email = (response.my_conditions_email || false);
	    			this.my_conditions_frequency = (response.my_conditions_frequency || "daily");


	    			this.my_weight_notifications = (response.my_weight_notifications || false);
	    			this.my_weight_email = (response.my_weight_email || false);
	    			this.my_weight_frequency = (response.my_weight_frequency || "daily");

	    			this.my_labs_tests_notifications = (response.my_labs_tests_notifications || false);
	    			this.my_labs_tests_email = (response.my_labs_tests_email || false);
	    			this.my_labs_tests_frequency = (response.my_labs_tests_frequency || "daily");

	    			this.donate_my_data_notifications = response.donate_my_data_notifications;
	    			this.donate_my_data_email = response.donate_my_data_email;
	    			this.donate_my_date_frequency = (response.donate_my_date_frequency || "monthly");
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while view reminder settings. Error is ", err_res.message);
	    	});
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while view reminder setting. Error is ", e);
  		}
  	}

  	//call api update_email_setting
  	update_reminder_setting(data){
  		try{
  			this.APIservices.update_reminder_setting({data : data}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.view_reminder_setting();
	    			this.NotificationService.success('Reminder', suc.body.message,{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.log("Error occure while deactivate my account. Error is ", err_res.message);
	    	});
  		} catch(e){
  			console.error("Error occure while call api. Error is ", e);
  		}
  	}

  	configure_all_condition_notification(){
  		try{
  			this.view_condition_list.map((a, b)=>{
  				a.notifications = this.clinical_trials_notifications;
  			});
  			this.notification_on_clinical_trials();
  		} catch(e){
  			console.log("Errpr occur while configure all condition. Error is ", e);
  		}
  	}

  	configure_all_condition_email(){
  		try{
  			this.view_condition_list.map((a, b)=>{
  				a.email_alerts = this.clinical_trials_email;
  			});
  			this.email_alerts_on_clinical_trials();
  		} catch(e){
  			console.log("Errpr occur while configure all condition. Error is ", e);
  		}
  	}

  	//Notification on clinical trials
  	notification_on_clinical_trials(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'clinical_trials_notifications' : this.clinical_trials_notifications,
  				'clinical_trials_conditions' : this.view_condition_list
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post notification. Error is ", e);
  		}
  	}

  	//Email on clinical trials
  	email_alerts_on_clinical_trials(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = {
  				'clinical_trials_email' : this.clinical_trials_email,
  				'clinical_trials_conditions' : this.view_condition_list
  			}
  			this.update_email_setting(data);
  		} catch(e){
  			console.log("Error occure while setting for post email. Error is ", e);
  		}
  	}

  	update_clinical_trials_conditions(condition){
  		try{
  			let clinical_trials_conditions = [];
  			let data = {
  				"id": condition.id,
  				"notifications": condition.notifications,
  				"email_alerts": condition.email_alerts
  			}
  			if (!condition.notifications)
  				this.clinical_trials_notifications = false;

  			if (!condition.email_alerts)
  				this.clinical_trials_email = false;
  			
  			clinical_trials_conditions.push(data);
  			let oCondition = {
  				'clinical_trials_conditions' : clinical_trials_conditions,
  				'clinical_trials_notifications' : this.clinical_trials_notifications,
  				'clinical_trials_email' : this.clinical_trials_email
  			}
  			this.update_email_setting(oCondition);
  		} catch(e){
  			console.log("Error occur while update clincal trials condition. Error is ", e);
  		}
  	}

  	//Send a message
  	send_a_message(){
  		try{
  			var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  			if(this.send_message.first_name == ""){
  				this.formValidation = true;
  				return false;
  			}
  			if(this.send_message.last_name == ""){
  				this.formValidation = true;
  				return false;
  			}
  			if(this.send_message.email == ""){
  				this.formValidation = true;
  				return false;
  			}
  			if(this.send_message.reason == ""){
  				this.formValidation = true;
  				return false;
  			}
  			if(this.send_message.message == ""){
  				this.formValidation = true;
  				return false;
  			}
  			if (!EMAIL_REGEXP.test(this.send_message.email)) {
  				this.formValidation = true;
  				return false;
  			}

  			this.blockUI.start('please wait...');
  			$("#send-request").modal('hide');
  			let data = {
  				'data' : this.send_message
  			}
  			this.APIservices.send_a_message(data, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.formValidation = false;
	    			this.send_message.first_name = '';
	    			this.send_message.last_name = '';
	    			this.send_message.email = '';
	    			this.send_message.reason = '';
	    			this.send_message.message = '';
	    			this.NotificationService.success('Message', "sent successfully",{
	    				timeOut: 3000,
	    				showProgressBar: false,
	    				pauseOnHover: false,
	    				clickToClose: false
	    			});
	    		}
	    		this.blockUI.stop();
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		console.error("Error occure while send message. Error is ", err_res.message);
	    	});

  		} catch(e){
  			console.error("Error occure while send message. Error is ", e)
  		}
  	}
}
