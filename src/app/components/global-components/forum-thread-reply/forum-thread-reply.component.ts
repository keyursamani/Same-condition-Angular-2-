import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
//import { IMyDpOptions } from 'mydatepicker';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
declare var $: any;
declare var jQuery: any;

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { values } from 'd3';

@Component({
  selector: 'app-forum-thread-reply',
  templateUrl: './forum-thread-reply.component.html',
  styleUrls: ['./forum-thread-reply.component.css']
})

export class ForumThreadReplyComponent  extends HeadersProvider implements OnInit {
	@BlockUI() blockUI: NgBlockUI;
	id: number = 0;
    sub: any;
    threadTitle: string = '';
    threadUserName: string = '';
    threadUserPhoto: string = '';
    thredCreatedDate: any;
    threadDescription: string = '';
    threadCommentList: any;
    replycounter: number = 0;
    addcommentmessgae : string = "";
    deleteThreadReplyId: number = 0;
    editThreadReplyId: number = 0;
    editThreadFlag: boolean = false;
    serachString: string = '';
    tagUserList: any;
    selectedserList: any;
    postReplyViewFlag: boolean = false;
    collapspostReplyViewFlag: boolean = false;
    userProfilePicture: string = '';
    userProfileFirstName: string = '';
    userProfileLastName: string = '';
    shortaddcommentmessgae: string = '';
    placeHolderValue: string = '';
    userId : number = 0;

	constructor(public _router: Router, public _APIservices: SCApi, private notificationService: NotificationsService, private route: ActivatedRoute, private _location: Location) { 
		super();
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
            this.loadForumsThreadReply(this.id);
            this.editThreadFlag = false;
            this.shortaddcommentmessgae = "";
            this.selectedserList = [];
            this.postReplyViewFlag = false;
            this.collapspostReplyViewFlag = false;
            this.getLoginuserProfile();
            this.placeHolderValue = "Type a friends name";
        });
        this.userId =  +this._localStorage.get('id');
	}

	confirmDeleteThreadPressed() {
		try{
			this._APIservices.delete_forum_threads({'id': this.id}, this.headers).subscribe(res => {
				if (res.body.status == "1" || res.body.status == 1) {
					this.notificationService.success("Thread", res.body.message, {
						timeOut: 3000,
						showProgressBar: false,
                    	pauseOnHover: false,
                    	clickToClose: false
                    });
                    this._location.back();
                }
            }, err => {
            	let error = JSON.parse(err._body);
            	this.notificationService.error("Error", error.message, {
            		timeOut: 3000,
                	showProgressBar: false,
                	pauseOnHover: false,
                	clickToClose: false
            	});
            });
		} catch(e){
			//TODO
		}        
    }

    openEditMode() {
        this.postReplyViewFlag = true;
        this.collapspostReplyViewFlag = false;
    }

    postcomment() {
    	try{
	        if (this.addcommentmessgae.length > 0) {
	            this.blockUI.start('please wait...');
	            if (this.editThreadFlag) {
	                this._APIservices.edit_forum_thread_reply({
	                    'comment': this.addcommentmessgae,
	                    'forum_post_id': this.editThreadReplyId
	                }, this.headers).subscribe(res => {
	                    this.blockUI.stop();
	                    if (res.body.status == "1" || res.body.status == 1) {
	                        this.addcommentmessgae = "";
	                        this.editThreadFlag = false;
	                        this.loadForumsThreadReply(this.id);
	                        this.postReplyViewFlag = false;
	                        this.selectedserList = [];
	                        this.placeHolderValue = "Type a friends name";
	                        this.notificationService.success("Comment", res.body.message, {
	                            timeOut: 3000,
	                            showProgressBar: false,
	                            pauseOnHover: false,
	                            clickToClose: false
	                        })
	                    }
	                }, err => {
	                    this.blockUI.stop();
	                    var err_res = JSON.parse(err._body);
	                    this.notificationService.success("Errorr",err_res.body.message, {
	                    	timeOut: 3000,
	                    	showProgressBar: false,
	                    	pauseOnHover: false,
	                    	clickToClose: false
	                    });
	                });
	            } else {
	                let tagUser = this.selectedserList.map(function(elem) {return elem.id;}).join(",");
	                let data = {
	                    'comment': this.addcommentmessgae,
	                    'tags': tagUser,
	                    'forum_post_id': this.id
	                }
	                this._APIservices.addForumThreadComment({'body': data}, this.headers).subscribe(res => {
	                	this.blockUI.stop();
	                	this.postReplyViewFlag = false;
	                    if (res.body.status == "1" || res.body.status == 1) {
	                    	this.addcommentmessgae = "";
	                        this.loadForumsThreadReply(this.id);
	                        this.selectedserList = [];
	                        this.placeHolderValue = "Type a friends name";
	                        this.notificationService.success("Comment", res.body.message, {
	                            timeOut: 3000,
	                            showProgressBar: false,
	                            pauseOnHover: false,
	                            clickToClose: false
	                        })
	                    }
	                }, err => {
	                    this.blockUI.stop();
	                    var err_res = JSON.parse(err._body);
	                    this.notificationService.success("Errorr",err_res.body.message, {
	                    	timeOut: 3000,
	                    	showProgressBar: false,
	                    	pauseOnHover: false,
	                    	clickToClose: false
	                    });
	                });
	            }
	        } else {

	            this.notificationService.info('Info', 'Your comment is too short', {
	                timeOut: 2000,
	                showProgressBar: false,
	                pauseOnHover: false,
	                clickToClose: false
	            })
	        }
    	} catch(e){
    		//TODO
    	}
    }

    removeTagUser(user) {
    	try{
    		if (this.selectedserList.findIndex(x => x.id === user.id) !== -1) {
    			let index = this.selectedserList.findIndex(x => x.id == user.id);
            	this.selectedserList.splice(index, 1)
	            if (this.selectedserList.length == 0) {
	                this.placeHolderValue = "Type a friends name";
	            }
        	}
    	} catch(e){
    		//TODO
    	}        
    }

    sarchTagUsers() {
    	try{
    		if (this.serachString.length >= 1) {
    			this._APIservices.get_tag_userlist({'searchString': this.serachString}, this.headers).subscribe(res => {
    				if (res.body.status == "1" || res.body.status == 1) {
    					this.tagUserList = res.body.data;
    				}
    			}, err => {
    			})
    		} else {
    			this.placeHolderValue = "Type a friends name";
    			this.tagUserList = [];
    		}
    	} catch(e){
    		//TODO:
    	}        
    }

    DeleteThreadReply(item) {
        this.deleteThreadReplyId = item.id;
    }

    editThreadReply(item) {
        this.postReplyViewFlag = true;
        this.editThreadReplyId = item.id;
        this.addcommentmessgae = item.comment;
        this.editThreadFlag = true;
        this.collapspostReplyViewFlag = false;
        window.scrollTo(0, 13000);
    }

    addUser(user) {
        if (this.selectedserList.filter(x => x.id === user.id).length === 0) {
            this.placeHolderValue = "";
            this.selectedserList.push(user);
            this.serachString = "";
            this.tagUserList = [];
        }
    }

    removeaddEditComment() {
        this.selectedserList = [];
        this.placeHolderValue = "Type a friends name";
        this.postReplyViewFlag = false;
        this.collapspostReplyViewFlag = false;
        this.addcommentmessgae = "";
        this.editThreadFlag = false;
        this.postReplyViewFlag = false;
    }

    movetoTop() {
        if (this.addcommentmessgae.length > 50) {
            this.shortaddcommentmessgae = this.addcommentmessgae.substring(0, 50);
        } else {
            this.shortaddcommentmessgae = this.addcommentmessgae;
        }
        this.postReplyViewFlag = false;
        this.collapspostReplyViewFlag = true;
    }

    cancelPost(){
        try{
            this.postReplyViewFlag = false;
            this.addcommentmessgae = "";
            //this.editThreadFlag = true;
            this.editThreadReplyId = null;
            //this.collapspostReplyViewFlag = true;
        } catch(e){
            console.log("Error occcure while cancel post. Error is ", e)
        }
    }

    movetoBottom() {
        this.postReplyViewFlag = true;
        this.addcommentmessgae = "";
        this.editThreadFlag = false;
        this.editThreadReplyId = null;
        window.scrollTo(0, 13000);
        this.collapspostReplyViewFlag = false;
    }

    getLoginuserProfile() {
        try {
        	this.blockUI.start("Please wait...");
            this._APIservices.get_patient_profile({}, this.headers).subscribe(suc => {
            	if (suc.body.status === "1") {
            		let result = suc.body.data;
            		this.userProfilePicture = (result.photo_url || '/assets/modules/images/no-image-found.png');
            		this.userProfileFirstName = (result.first_name || "");
            		this.userProfileLastName = (result.last_name || "");
            	}
            	setTimeout(()=>{
            		this.blockUI.stop();
            	},1500);
            }, err => {
            	var err_res = JSON.parse(err._body);
            	this.notificationService.error('Error',err_res.message, {
            		timeOut: 3000,
            		showProgressBar: false,
            		pauseOnHover: false,
            		clickToClose: false
            	});
            	this.blockUI.stop();
            });
        } catch (err) {
        	this.blockUI.stop();
            console.log(err);
        }
    }

    confirmDeletePressed() {
    	try{
    		this.blockUI.start('please wait...');
    		let body_param = {
    			"id": this.id,
    			"forum_post_id": this.deleteThreadReplyId
    		};

    		this._APIservices.delete_forum_thread_reply(body_param, this.headers).subscribe(res => {
    			this.deleteThreadReplyId = null;
    			if (res.body.status == "1" || res.body.status == 1) {
    				this.addcommentmessgae = "";
    				this.loadForumsThreadReply(this.id);
    				this.notificationService.success("Delete", res.body.message, {
    					timeOut: 3000,
    					showProgressBar: false,
    					pauseOnHover: false,
    					clickToClose: false
    				});
    				this.blockUI.stop();
    			}
    		}, err => {
    			this.deleteThreadReplyId = null;
    			var err_res = JSON.parse(err._body);
    			this.notificationService.success("Error",err_res.body.message, {
    				timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
                this.blockUI.stop();
            });
    	} catch(e){
    		this.blockUI.stop();
    	}
    }

    loadForumsThreadReply(id) {
    	try{
    		this.blockUI.start("please wait...");
	        let body_param = {
	            "id": id
	        };
	        this._APIservices.get_forum_thread_reply(body_param, this.headers).subscribe(suc => {
	        	let result = suc.body.data;
	        	if(suc.body.status === "1" || suc.body.status === 1) {
	        		this.threadTitle = (result.title || '');
	        		this.threadDescription = (result.description || '');
	        		this.threadUserName = (result.thread_user || '');
	        		this.threadUserPhoto = (result.photo_url || '/assets/modules/images/no-image-found.png');
	        		this.threadCommentList = (result.forum_post_comments || '');
	        		this.replycounter = result.forum_post_comments.length;
	        	}
	        	setTimeout(()=>{
	        		this.blockUI.stop();
	        	},1500);
	        }, err => {
	        	this.blockUI.stop();
	        	var err_res = JSON.parse(err._body);
	        	this.notificationService.error('Error', err_res.message, {
	        		timeOut: 3000,
	        		showProgressBar: false,
	        		pauseOnHover: false,
	        		clickToClose: false
	        	});
	        });
	    } catch (err) {
	    	this.blockUI.stop();
	        console.log(err);
	    }
	}

    //tag comment to user
    tag_to_user(){
        try{
            let tagUser = this.selectedserList.map(function(elem) {return elem.id;}).join(",");
            if(this.addcommentmessgae == ""){
                this.notificationService.error("Errorr","Please write comment to tag user.", {
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
                return false;
            }
            if(tagUser == ""){
                this.notificationService.error("Errorr","Please select user to tag.", {
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
                return false;
            }

            let data = {
                'comment': this.addcommentmessgae,
                'tags': tagUser,
                'forum_post_id': this.id
            }
            this._APIservices.addForumThreadComment({'body': data}, this.headers).subscribe(res => {
                this.postReplyViewFlag = false;
                if (res.body.status == "1" || res.body.status == 1) {
                    this.addcommentmessgae = "";
                    this.loadForumsThreadReply(this.id);
                    this.selectedserList = [];
                    this.placeHolderValue = "Type a friends name";
                    this.notificationService.success("Comment", res.body.message, {
                        timeOut: 3000,
                        showProgressBar: false,
                        pauseOnHover: false,
                        clickToClose: false
                    });
                }
                setTimeout(()=>{
                    this.blockUI.stop();
                },1500);
            }, err => {
                this.blockUI.stop();
                var err_res = JSON.parse(err._body);
                this.notificationService.success("Errorr",err_res.body.message, {
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
            });
        } catch(e){
            console.log("Error occure while tag to user. Error is ", e);
        }
    }

}
