import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
//import { IMyDpOptions } from 'mydatepicker';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var $ : any;
declare var jQuery : any;

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent extends HeadersProvider implements OnInit {
	@BlockUI() blockUI: NgBlockUI;
	pageT: any;
    perpage:any;
    donotLoad:boolean;
    forumList:any;

    constructor(public _router:Router,public _APIservices:SCApi,private notificationService: NotificationsService) {
    	super();
    }

    ngOnInit() {
    	this.pageT = 1;
        this.perpage = 15;
        this.loadForums();
    }

    loadForums(){
        this.pageT = 1;
        this.donotLoad = false;
        this.perpage = 15;
        try{
        	this.blockUI.start("please wait...");
        	let body_param = {
        		"page" : 1,
        		"per_page": 15,
        		"offset": 0
        	};
        	this._APIservices.get_forums(body_param, this.headers).subscribe(suc =>{
        		if(suc.body.data.length == 0){
        			this.donotLoad=true;
        		}else{
        			this.forumList= suc.body.data;
        		}
        		this.blockUI.stop();
        	}, err=>{
        		this.blockUI.stop();
        		var err_res = JSON.parse(err._body);
        		this.notificationService.error('Error',err_res.message,{ 
        			timeOut: 3000, 
        			showProgressBar: false, 
        			pauseOnHover: false, 
        			clickToClose: false 
        		});
        	});
        }catch(err){
        	this.blockUI.stop();
        	console.log(err);
        }
    }

    loadMoreForums(){
    	this.pageT++;
        try{
        	this.blockUI.start("please wait...");
        	let body_param = {
        		"page" : this.pageT,
        		"per_page": 15,
        		"offset": 0
        	};
        	this._APIservices.get_forums(body_param, this.headers).subscribe(suc =>{
        		if(suc.body.data.length == 0){
        			this.donotLoad = true;
        		}else{
        			this.forumList= this.forumList.concat(suc.body.data);
        		}
        		this.blockUI.stop();
        	}, err=>{
        		this.blockUI.stop();
        		var err_res = JSON.parse(err._body);
        		this.notificationService.error('Error',err_res.message,{ 
        			timeOut: 3000, 
        			showProgressBar: false, 
        			pauseOnHover: false, 
        			clickToClose: false 
        		});
        	});
        }catch(err){
        	this.blockUI.stop();
        	console.log(err);
        }
    }

    onScrollDown() {
    	if(!this.donotLoad){
    		this.loadMoreForums();
        }
  	}

  	SelectedItem(item){
        this._router.navigate(['/global/forum-thread/'+item.id]);
    }

    loadForumsThread(id){
    	try{
    		let body_param = {
    			"forum_id": id
    		};
    		this._APIservices.get_forum_threads(body_param, this.headers).subscribe(suc =>{
    			let result = suc.body.data;
    		}, err=>{
    			var err_res = JSON.parse(err._body);
    			this.notificationService.error('Error',err_res.message,{
    				timeOut: 3000, 
    				showProgressBar: false, 
    				pauseOnHover: false, 
    				clickToClose: false 
    			});
    		});
    	}catch(err){
            console.log(err);
        }
    }
}
