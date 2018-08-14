import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.css']
})
export class UserAgreementComponent extends HeadersProvider implements OnInit {
	
	@BlockUI() blockUI: NgBlockUI;

	private agreementDesc:string = "";

	//constructor
	constructor(private APIservices:SCApi) {
		super();
	}

	//ngOnInit
	ngOnInit() {
		this.getUserAgreement();
	}

	//get user agreement
	getUserAgreement(){
		try{
			this.blockUI.start('please wait...');
			let data = {
				'slag_name' : 'user-agreement'
			}
			this.APIservices.getPageDetails(data, this.headers).subscribe(res=>{
    			if(res.body.status == "1" || res.body.status == 1){
    				this.agreementDesc = res.body.data.description;
    				this.blockUI.stop();
    			}
        	}, err=>{
        		this.blockUI.stop();
     	  });
		} catch(e){
			console.log("Error occure while get user agreement. Error is ", e);
		}
	}
}
