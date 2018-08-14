import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var $ : any;
declare var jQuery : any;


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;
	private isDisplayTextArea : boolean = false;
	private inapropriate : boolean = false;
	private spam : boolean = false;
	private other : boolean = false;
	private reason : string = "";
	private userId : number = 0;
	private messageIds : any = [];
	private formValidation : boolean = false;
	private isComposeNewMessage : boolean = false;
	private file2Upload : any = [];
	private chatDescription : string = "";
	private users_list : any = [];
	private old_user_list : any = [];
	private new_user_list : any = [];
	private received_messages : any = [];
	private sent_messages : any = [];
	private user_profile : any = [];
	private list_user_messages : any = [];
	private GLOBAL_MEDIUM_TIMEOUT : number = 1500;
	private isLoaded : boolean = false;
	private message_type : string = "all_message";
	private search_word : string = "";
	private isDisplayUserList : boolean = false;
	private arrDeletedMessage : any = [];
	private timer : any;
	private stopApi : boolean = false;
	private messageToUser : string = "";
	private displayAttachment : boolean = false;

	//constructor
	constructor(private APIservices : SCApi, private NotificationService : NotificationsService) {
		super();
	}

	//ngOnInit
	ngOnInit() {
		this.get_all_message();
		this.display_after_reload();
	}

	//send_message
	send_message(){
		try{
			if(this.userId == 0){
				this.NotificationService.error('', "please select user for conversation.",{
            		timeOut: 3000, 
	                showProgressBar: false, 
	                pauseOnHover: false, 
	                clickToClose: false 
	            });
				return false;
			}

			let data = {
				'Authentication-Token': this.getToken().AuthToken,
				'to_user_id' : this.userId,
				'body' : this.chatDescription,
				'attachment' : this.isEmpty(this.file2Upload) ? null : this.file2Upload[0]
			}

			this.APIservices.send_message(data).subscribe(res=>{
				//window.prompt('res', JSON.stringify(res));
				if(res.body.status == "1" || res.body.status == 1){
					this.file2Upload = [];
					this.displayAttachment = false;
					this.stopApi = false;
					this.chatDescription = "";
					this.isComposeNewMessage = false;
					this.get_user_conversation(this.userId);
				}				
            }, err=>{
            	var err_res = JSON.parse(err._body);
           	});
		} catch(e){
			console.log("Error occure while send message. Error is ", e);
		}
	}

	//send to admin
	sendToAdmin(){
		try{

			if(!this.inapropriate && !this.spam && !this.other){
				this.formValidation = true;
				return false;
			}
			if(this.other && this.reason == ''){
				this.formValidation = true;
				return false;
			}

			this.blockUI.start("please wait...");
			$("#modalSendToAdmin").modal('hide');
			if(this.inapropriate){
				this.reason = "inapropriate"
			}
			else if(this.spam){
				this.reason = "spam"
			}
			
			let data = {
				'reason' : (this.reason || ""),
				'user_id' : (this.userId || 0)
			}

			this.APIservices.send_to_admin(data, this.headers).subscribe(res=>{
  				this.NotificationService.success('', "Message sent to admin.",{
            		timeOut: 3000, 
	                showProgressBar: false, 
	                pauseOnHover: false, 
	                clickToClose: false 
	            });
  				this.blockUI.stop();
            }, err=>{
            	this.blockUI.stop();
            	var err_res = JSON.parse(err._body);
            	this.NotificationService.error('Error', err_res.message,{
            		timeOut: 3000, 
	                showProgressBar: false, 
	                pauseOnHover: false, 
	                clickToClose: false 
	            });
	            this.blockUI.stop();
           	});
		} catch(e){
			this.blockUI.stop();
			console.log("Error occure while send to admin. Error is ", e);
		}
	}

	delete_conversation_confirm(userId){
		this.userId = userId
		$("#modalDeleteConv").modal('show');
	}

	//delete_conversation
	delete_conversation(){
		try{
			this.blockUI.start('please wait...');
			let ids = "";
			$("#modalDeleteConv").modal('hide');
			if(this.messageIds.length > 0){
				this.messageIds.map((obj, index)=>{
					ids = ids + obj + ",";
					
				});
			}
			ids = ids.slice(0, -1);
			let data = {
				'to_user_id' : this.userId,
				'message_ids' : this.messageIds.length > 0 ? ids : 'All'
			}
			this.APIservices.delete_messages_or_conversation(data, this.headers).subscribe(res=>{
				//window.prompt('res', JSON.stringify(res));
				if(res.body.status == "1" || res.body.status == 1){
					this.messageIds = [];
					this.NotificationService.success('Message', "Conversation has been deleted.",{
            			timeOut: 3000, 
	                	showProgressBar: false, 
	                	pauseOnHover: false, 
	                	clickToClose: false 
	            	});
	            	this.get_user_conversation(this.userId);
				}
				this.blockUI.stop();  				
            }, err=>{
            	this.blockUI.stop();
            	var err_res = JSON.parse(err._body);
            	this.NotificationService.error('Error', err_res.message,{
            		timeOut: 3000, 
	                showProgressBar: false, 
	                pauseOnHover: false, 
	                clickToClose: false 
	            });
	            this.blockUI.stop();
           	});
		} catch(e){
  			this.blockUI.stop();
			console.log("Error occure while delete conversation. Error is ", e);
		}
	}

	//List conversations (including filtering)
	get_all_message(){
		try{
			this.blockUI.start('please wait...');
			this.message_type = "all_message";
			let data = {
				'filter' : 'all_messages'
			}
			this.APIservices.list_conversion(data, this.headers).subscribe(res=>{
				if(res.body.status == "1" || res.body.status == 1){

					//new user list
					this.new_user_list = res.body.data.filter(res => {
  						return res.read == false;
    				});
    				
    				//old user list
    				this.old_user_list = res.body.data.filter(res => {
  						return res.read == true;
    				});
				}				
				this.blockUI.stop();
            }, err=>{
            	this.blockUI.stop();
            	var err_res = JSON.parse(err._body);
           	});
		} catch(e){
			console.log("Error occure while get messages. Error is ", e);
		}
	}

	//get all sent messages
	get_sent_message(){
		try{
			this.blockUI.start('please wait...');
			this.message_type = "sent";
			let data = {
				'filter' : 'sent_messages'
			}
			this.APIservices.list_conversion(data, this.headers).subscribe(res=>{
				if(res.body.status == "1" || res.body.status == 1){
					this.sent_messages = res.body.data;
				}				
				this.blockUI.stop();
            }, err=>{
            	this.blockUI.stop();
            	var err_res = JSON.parse(err._body);
           	});
		} catch(e){
			this.blockUI.stop();
			console.log("Error occure while get sent messages. Error is ", e);
		}
	}

	//get all received messages
	get_receive_message(){
		try{
			this.blockUI.start('please wait...');
			this.message_type = "receive";
			let data = {
				'filter' : 'received_messages'
			}
			this.APIservices.list_conversion(data, this.headers).subscribe(res=>{
				if(res.body.status == "1" || res.body.status == 1){
					this.received_messages = res.body.data;
				}				
				this.blockUI.stop();
            }, err=>{
            	this.blockUI.stop();
            	var err_res = JSON.parse(err._body);
           	});
		} catch(e){
			this.blockUI.stop();
			console.log("Error occure while get receive messages. Error is ", e);
		}
	}

	//List users (following/follows)
	list_users(searched_word){
		try{
			if(this.isEmpty(searched_word)){
				this.users_list = [];
				this.isDisplayUserList = false;
				return false;
			}
			let data = {
				'search_word' : searched_word
			}
			this.APIservices.list_users(data, this.headers).subscribe(res=>{
				if(res.body.status == "1" || res.body.status == 1){
					this.users_list = res.body.data;
					this.isDisplayUserList = true;
				}
            }, err=>{
            	var err_res = JSON.parse(err._body);
           	});
		} catch(e){
			console.log("Error occure while list users. Error is ", e);
		}
	}

	select_user(item){
		try{
			this.userId = item["id"];
			let first_name = item["first_name"];
			let last_name = item["last_name"];
			//this.search_word = first_name + " " + last_name;
			this.messageToUser = first_name + " " + last_name;
			this.isDisplayUserList = false;
		} catch(e){
			console.log("Error occure while select user. Error is ", e);
		}
	}

	//mark as read
	mark_as_read(){
		try{
			this.blockUI.start();
			let data = {
				'filter' : 'all_messages'
			}
			this.APIservices.list_conversion(data, this.headers).subscribe(res=>{
				if(res.body.status == "1" || res.body.status == 1){
					
				}				
				this.blockUI.stop();
            }, err=>{
            	this.blockUI.stop();
            	var err_res = JSON.parse(err._body);
           	});
		} catch(e){
			console.log("Error occure while mark as read. Error is ", e);
		}
	}

	//switch chat
	switch_chat(item){
		try{
			this.blockUI.start('please wait...');
			this.userId = item.id;
			this.user_profile = item;
			sessionStorage.setItem("user_profile", JSON.stringify(item));
			sessionStorage.setItem('isLoaded', 'true');
			sessionStorage.setItem('userId', item.id);
			this.IntervalLoadchat();
			setTimeout(()=>{
				this.blockUI.stop();
			},5000);
		} catch(e){
			this.blockUI.stop();
			console.log("Error occure while switch chat. Error is ", e);
		}
	}

	//get user conversation
	get_user_conversation(user_id){
		try{
			//this.blockUI.start('please wait...')
			let data = {
				'to_user_id' : user_id
			}
			this.APIservices.get_user_conversation(data, this.headers).subscribe(res =>{
				//window.prompt("res", JSON.stringify(res));
				if(res.body.status == "1" || res.body.status == 1){
					this.list_user_messages = res.body.data.messages;
					this.isLoaded = this.list_user_messages.length > 0 ? true : false;
					if(!this.isEmpty($(".chat-wrap").get(0))){
						$(".chat-wrap").animate({ scrollTop: $(".chat-wrap").get(0).scrollHeight }, 1000);
					}
				}				
				this.blockUI.stop();
            }, err=>{
            	this.blockUI.stop();
            	var err_res = JSON.parse(err._body);
           	});
		} catch(e){
			console.log("Error occure while get user conversation. Error is ", e);
		}
	}

	//send message while press enter
	sendMessage(event){
		try{
			let	k = event.keyCode ? event.keyCode : event.which;
			if(k===13) {
				this.send_message();
        	}
		} catch(e){
			console.log("Error occure while send message. Error is ", e);
		}
	}

	//display reason text box
	displayTextArea(event){
		try{
			this.isDisplayTextArea = event;
			this.inapropriate = false;
			this.spam = false;
			this.formValidation = false;
		} catch(e){
			//TODO:
		}
	}

	//select file
	file_select(fileInput: any){
		try{
			let fileList: FileList = fileInput.target.files;
			this.file2Upload = fileList;
			this.displayAttachment = true;
		} catch(e){
			console.log("Error occure while file select. Error is ", e);
		}
	}

	select_message_to_delete(event, messges){
		try{
			let msgId = (messges['id'] || 0);
			if(event.target.checked){
				this.stopApi = true;
				this.messageIds.push(msgId);
			} else{
				const index: number = this.messageIds.indexOf(msgId);
				if (index !== -1) {
        			this.messageIds.splice(index, 1);
    			}  
			}
		} catch(e){
			console.log("Error occure while select message to delete. Error is ", e);
		}
	}

	cancel_selected_message_confirm(){
		$("$modalCancelConv").modal('show');
	}

	cancel_selected_message(){
		this.messageIds = [];
		$("#modalCancelConv").modal('hide');
		this.stopApi = false;
  		var checkboxes = document.getElementsByTagName('input');
  		for (var i=0; i<checkboxes.length; i++)  {
		    if (checkboxes[i].type == 'checkbox')   {
		      checkboxes[i].checked = false;
		    }
  		}
	}

	IntervalLoadchat(){
        this.timer = setInterval(()=>{
        	if(!this.stopApi){
        		this.stopApi = true;
        		this.get_user_conversation(this.userId);
        	}
        },3000);
    }

    ngOnDestroy(){
		console.log('model destroyed...');
		sessionStorage.setItem('isLoaded', 'false');
		sessionStorage.setItem("user_profile", null);
		sessionStorage.setItem('userId', '0');
		this.userId = 0;
		this.isLoaded = false;
		this.file2Upload = [];
		this.stopApi = false;
		clearInterval(this.timer);
	}

	display_after_reload(){
		try{
			let isLoaded = sessionStorage.getItem('isLoaded');
			if(isLoaded == "true"){
				let userId = Number(sessionStorage.getItem('userId'));
				if(userId > 0){
					this.isLoaded = true;
					this.user_profile = JSON.parse(sessionStorage.getItem("user_profile"));
					this.userId = userId;
					this.IntervalLoadchat();
				}
			}
		} catch(e){
			console.log("Error occure while display data after reload. Error is ", e);
		}
	}
}
