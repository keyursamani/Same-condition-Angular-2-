import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-crisis',
  templateUrl: './crisis.component.html',
  styleUrls: ['./crisis.component.css']
})
export class CrisisComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;
	private listCrisis:any = [];

	//constructor
	constructor(private APIservices:SCApi, private NotificationService: NotificationsService) { 
		super();
	}

	//ngOnInit
	ngOnInit() {		
		this.getCrisis();
	}

	getCrisis(){
		try{
			this.blockUI.start('please wait...');
			let data = {
				'slag_name' : 'crisis-hotlines'
			}
			this.APIservices.getPageDetails(data, this.headers).subscribe(res=>{
    			if(res.body.status == "1" || res.body.status == 1){
    				if(!res.body.isArray){
    					this.listCrisis.push(res.body.data);
    				} else{
    					this.listCrisis = res.body.data;
    				}    				
    				//window.prompt('this.listCrisis', JSON.stringify(this.listCrisis));
    				this.blockUI.stop();
    			}
        	}, err=>{
        		this.blockUI.stop();
     	  });
		} catch(e){
			this.blockUI.stop();
			console.log("Error occure while get crisis. Error is ", e);
		}
	}
}
