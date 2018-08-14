import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $ : any;

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;

	formValidation:boolean;
	advertisement:any;

	//constructor
	constructor(private APIservices:SCApi, private NotificationService: NotificationsService) {
		super();

		this.formValidation = false;
		this.advertisement = {
			"first_name" : "",
			"last_name" : "",
			"business_name" : "",
			"description" : "",
			"email" : ""
		};
  }

  //ngOnInit
  ngOnInit() {
		//TODO:
	}

  //add advertisement
	addAdvertisement(){
		try{

			if(this.advertisement.first_name == ""){
				this.formValidation = true;
				return false;
			}
			if(this.advertisement.last_name == ""){
				this.formValidation = true;
				return false;
			}
			if(this.advertisement.business_name == ""){
				this.formValidation = true;
				return false;
			}
			if(this.advertisement.description == ""){
				this.formValidation = true;
				return false;
			}
			if(this.advertisement.email == ""){
				this.formValidation = true;
				return false;
			}

      var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      if (!EMAIL_REGEXP.test(this.advertisement.email)) {
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      $("#sc_form_modal").modal('hide');
			let data = {
				'data' : this.advertisement
			}

      this.APIservices.request_advertise(data, this.headers).subscribe(res=>{
          if(res.body.status == "1" || res.body.status == 1){
            $("#sc_form_success_modal").modal('show');            
            this.NotificationService.success('Advertisement', 'Advertisement added successfully.',{
              timeOut: 2000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
            this.blockUI.stop();
          }
        }, err=>{
          var err_res = JSON.parse(err._body);
          this.NotificationService.error('Error', err_res.message,{
            timeOut: 2000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          this.blockUI.stop();
        });
		} catch(e){
			console.log("Error occure while add advertisement. Error is ", e);
		}
	}

	onModalOpen(){
		this.formValidation = false;
		this.advertisement = {
			"first_name" : "",
			"last_name" : "",			
			"business_name" : "",
			"description" : "",
      "email" : "",
		};  		
	}

}
