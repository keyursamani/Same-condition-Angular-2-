import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers : [SCApi]
})

export class ResetPasswordComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;
	private formValidation : boolean = false;
	private show_success_msg : boolean = false;
	private user_reset_password = {
		"reset_password_token" : '',
		"password" : '',
		"password_confirmation" : ''
	};

	constructor(private APIservices : SCApi, private notificationService: NotificationsService, private activatedRoute: ActivatedRoute) { 
		super();
	}

	ngOnInit() {
		this.user_reset_password.reset_password_token = (this.activatedRoute.snapshot.queryParams["reset_password_token"] || '');
	}

	//Password recovery
	password_recovery(){
		try{

			if(this.user_reset_password.password == ''){
				this.formValidation = true;
				return false;
			}
			if(this.user_reset_password.password_confirmation == ''){
				this.formValidation = true;
				return false;
			}
			this.blockUI.start('please wait...');
	    	this.APIservices.password_recovery({'data' : this.user_reset_password}, this.headers).subscribe(suc => {
	    		if(suc.body.status == "1" || suc.body.status == 1){
	    			this.show_success_msg = true;
	    			this.user_reset_password.password = "";
	    			this.user_reset_password.password_confirmation = "";
	    			this.blockUI.stop();
	    		}
	    	}, err => {
	    		this.blockUI.stop();
	    		const err_res = JSON.parse(err._body);
	    		this.user_reset_password.password = "";
	    		this.user_reset_password.password_confirmation = "";
	    		this.notificationService.error("Error",err_res.message, {
	    			timeOut: 5000, 
	    			showProgressBar: true,
	    			pauseOnHover: true,
	    			clickToClose: true,
	    			maxLength: 1000
	    		});
	    		console.error("Error occure while password recovery. Error is ", err_res.message);
	    	});
		} catch(e){
			this.blockUI.stop();
			console.error("Error occure while password recovery. Error is ",e);
		}
	}
}
