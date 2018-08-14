import { Component, OnInit} from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
//import { IMyDpOptions } from 'mydatepicker';
import * as moment from 'moment';
declare var $ : any;
declare var jQuery : any;

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-forum-thread',
  templateUrl: './forum-thread.component.html',
  styleUrls: ['./forum-thread.component.css']
})

export class ForumThreadComponent extends HeadersProvider implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
	id : number;
    sub : any;
    threadList : any;
    threadCounter = 0;
    addNewForumThread : any;
    forumCategoryItemList : any;
    forumThreadTitle : string = '';
    forumThreadDescription :string = '';
    forumThreadTags : string = '';
    SelectedforumThread : any;
    search_word : string = '';
    formValidation : boolean = false;
    
    constructor(public _router:Router,public _APIservices:SCApi,private notificationService: NotificationsService,private route: ActivatedRoute) {
    	super();
    }

    ngOnInit() {
    	this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
            this.loadForumsThread(this.id)
     	});

        this.addNewForumThread = document.getElementById('addNewForumThread');
        this.addNewForumThread.style.display = "none";   
        this.forumCategoryList(); 
    }

    forumCategoryList(){
    	try{
            this.blockUI.start("please wait...");
    		this._APIservices.get_forums_category(this.headers).subscribe(suc =>{
    			let result = suc.body.data;
    			if(suc.body.data.length != 0){
    				this.forumCategoryItemList=result;
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
    	} catch(e){
            this.blockUI.stop();
    		console.error("Error occure while get forum category list. Error is ", e);
    	}
    }

    loadForumsThread(id){
    	try{
            this.blockUI.start("please wait...");
    		let body_param = {
    		 	"forum_id":id
    		};
    		this._APIservices.get_forum_threads(body_param, this.headers).subscribe(suc =>{
    			let result = suc.body.data;
    			if(suc.body.data.length != 0){
    				this.threadList = result;
    				this.threadCounter = result.length;
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
    	} catch(e){
            this.blockUI.stop();
    		console.log("Error occure while load forums thread. Error is ", e);
    	}
    }
    
    Selectedthread(item){

    	this._router.navigate(['/global/forum-thread-reply/'+item.id]);
    }

    CreateNewThread(){
    	this.addNewForumThread.style.display = "block";
    	this.forumThreadTitle = "";
        this.SelectedforumThread = this.id;
    }

    closeAddThreadModal(){
    	this.addNewForumThread.style.display = "none";
    }

    createThreadApi(){
    	try{
            this.blockUI.start("please wait...");
    		let data = {
    			"forum_id" : +this.SelectedforumThread,
    			"title": this.forumThreadTitle,
    			"description": this.forumThreadDescription,
    			"tags":null
    		}

    		this._APIservices.create_forum_threads({'body':data}, this.headers).subscribe(suc =>{
    			this.addNewForumThread.style.display = "none";
    			this.forumThreadTitle = "";
    			this.forumThreadDescription = "";
    			let result = suc.body;
    			if(result.status === "1"){
	    			this.notificationService.success("Thread",result.message,{ 
	    				timeOut: 3000, 
	    				showProgressBar: false, 
	    				pauseOnHover: false, 
	    				clickToClose: false 
	    			});
	    		}else{
	    			this.notificationService.alert("Thread",result.message,{ 
	    				timeOut: 3000, 
	    				showProgressBar: false, 
	    				pauseOnHover: false, 
	    				clickToClose: false 
	    			});
	    		}
                setTimeout(()=>{
                    this.loadForumsThread(this.id)
                    this.blockUI.stop();
                },1500);
	    	}, err=>{
	    		var err_res = JSON.parse(err._body);
	    		this.notificationService.error('Error',err_res.message,{
	    			timeOut: 3000,
	    			showProgressBar: false,
	    			pauseOnHover: false,
	    			clickToClose: false
	    		});
	    	});
    	} catch(e){
    		console.log("Error occure while create thread api. Error is ", e);
    	}
    }

    search_thread(){
        try{
            if(this.search_word == ""){
                this.formValidation = true;
                return false;
            }

            this.blockUI.start("please wait...");
            this.formValidation = false;
            let body_param = {
                "forum_id":this.id,
                "search_word" : this.search_word
            };
            this._APIservices.get_forum_threads(body_param, this.headers).subscribe(suc =>{
                let result = suc.body.data;
                this.threadList = result;
                this.threadCounter = result.length;
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
        } catch(e){
            console.log("Error occure while search thread. Error is ", e);
        }
    }

    reset_thread_search(){
        try{
            if(this.search_word == ""){
                this.loadForumsThread(this.id);
            }
        } catch(e){
            console.log("Error occure while reset thread search. Error is ", e)
        }
    }

}
