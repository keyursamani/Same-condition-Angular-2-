import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;

	//DECLARE GLOBAL VARIABLES
	showSuggest : boolean = false;
	tagsSearchname : string = "";
	searchTagList : any = [];
	searchtTagString : boolean = false;
	isOkay : boolean = false;
	hospatalizeTagList : any = [];
	publicationList : any = [];
  	queryText : string = "";
  	filterTags : any = "";
  	formValidation : boolean = false;
  	isReset : boolean = false;

  	//constructor
	constructor(private APIservices:SCApi, private NotificationService: NotificationsService) { 
		super();
	}

	//ngOnInit
	ngOnInit() {
		try{
			this.get_publications();
		} catch(e){
			console.log("Error occured while calling ngOnInit. Error is ", e.message);
		}
	}

	//omit special character
	omit_special_char(event){
		try{
			var k;
			k = event.charCode || event.keyCode;
			return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
		} catch(e){
			console.log("Error occured while omit special character. Error is ", e.message);
		}
	}

	//search value by tag
	searchTags(searchString: string){
		try{
			if(!this.isEmpty(searchString)){
				console.log('searchString', searchString);
				this.showSuggest = true;
				let body_param = {
          		"search_word" : searchString
        		}
        		this.APIservices.usersList_TagsPurpose(body_param, this.headers).subscribe(res=>{
        			this.searchtTagString=true;
            		this.searchTagList=res.body.data;               
               	if(this.searchTagList.length<0){
               		this.searchtTagString=false;
               	}
          	},
          	err=>{
          		var err_res = JSON.parse(err._body);
              	console.log(err_res);
                this.NotificationService.error('Error', err_res.message,{ 
                	timeOut: 3000, 
                	showProgressBar: false, 
                	pauseOnHover: false, 
                	clickToClose: false 
                })
          	});
			}
		} catch(e) {
			console.log("Error occure while search by tag. Error is ", e.message);
		}
	}

	//search hospitilized tags
	selectHospitalizeTag(tagInfo){
		try{
			this.isOkay = true;
			this.tagsSearchname = "";
			this.searchtTagString = false;
			this.showSuggest = false;
			if(this.hospatalizeTagList.length <= 0){
				tagInfo.name = tagInfo.name.toUpperCase();
				this.hospatalizeTagList.push(tagInfo);
			} else {
				for(let items of this.hospatalizeTagList){
					console.log(items.id,tagInfo.id)
           		if(items.id == tagInfo.id){
           			this.isOkay = false;
           		}
        		}
        		if(this.isOkay){
        			tagInfo.name = tagInfo.name.toUpperCase();
             		this.hospatalizeTagList.push(tagInfo);
        		}
			}

		} catch(e){
			console.log("Error occure while select hospitilized tag. Error is ", e.message);
		}
	}

	//remove tag from list
	removeHospitalizeTag(index){

		this.hospatalizeTagList.splice(index,1);
  	}

  	//get publication list
  	get_publications(){
  		try{
  			this.blockUI.start('please wait...');
  			let data = { };
  			this.APIservices.get_publications(data, this.headers).subscribe(res=>{
  				if(res.body.status == "1" || res.body.status == 1){
  					this.publicationList = res.body.data;
  					this.blockUI.stop();
  				}
  			}, err=>{
  				this.blockUI.stop();
  				var err_res = JSON.parse(err._body);
  				console.log('Error occure while get publications. Error is ', err_res);
  			});
  		} catch(e){
  			this.blockUI.stop();
  			console.log("Error occure while get publications. Error is ", e.message);
  		}
  	}

	//search publication
	search_publication(){
		try{
			if(this.hospatalizeTagList.length == 0){
				if(this.isEmpty(this.queryText)){
					this.formValidation = true;
					return;
				}
			}

			let strTags = "";
			if(this.hospatalizeTagList.length > 0){
				this.hospatalizeTagList.map((obj, index)=>{
					strTags = strTags + obj.name + ',' 
				});
				strTags = strTags.replace(/,\s*$/, "");
			}
			this.blockUI.start('please wait...');
			let data = {};
			if(!this.isEmpty(this.queryText)){
				data["query"] = this.queryText;
			}

			if(!this.isEmpty(strTags)){
				data["filter"] = strTags;
			}

			this.APIservices.get_publications(data, this.headers).subscribe(res=>{
				if(res.body.status == "1" || res.body.status == 1){
					this.publicationList = res.body.data;
					this.isReset = true;
					this.blockUI.stop();
				}
			}, err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.log('Error occure while get publications. Error is ', err_res);
			});
		} catch(e){
			this.blockUI.stop();
			console.log("Error occure while search publication. Error is ", e.message)
		}
	}

	//reset page
	reset_search_publication(){
		this.queryText = "";
		this.formValidation = false;
		this.isReset = false;
		this.hospatalizeTagList = [];
		this.get_publications();
	}

  //open link url
  	open_link(url) {
    	try{
    		if(!this.validURL(url)){
    			this.NotificationService.error('URL', "Invalid url supplied",{
    				timeOut: 2000, 
	          		showProgressBar: false, 
	          		pauseOnHover: false, 
	          		clickToClose: false 
	        	});
	        	return;
	      	}

	      	let tarea_regex = /^(http|https)/;
	      	if(tarea_regex.test(String(url).toLowerCase()) == true) {
	      		window.open(url,'_blank');
	      	} else {
	      		window.open('http://' + url,'_blank');
	      	}
	    } catch(e){
	      	console.log("Error occure while open link url. Error is ", e.message);
	    }
	}

	//validate url
	validURL(str) {
		try{
			var pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
			if(!pattern.test(str)) {
				return false;
			} else{
				return true;
			}
		} catch(e){
			console.log("Error occure while validating link url. Error is ", e.message);
		}
	}

	extractTags(tags){
		try{
			let strTags = "";
			if(tags != null){
				tags.map((obj, index)=>{
					strTags = strTags + obj.name + ',  ' 
				});
			} else{
				strTags = "N/A"
			}

			strTags = strTags.replace(/,\s*$/, "");
			return strTags;
		} catch(e){
			console.log("Error occure while extract tags. Error is ", e);
		}
	}

}
