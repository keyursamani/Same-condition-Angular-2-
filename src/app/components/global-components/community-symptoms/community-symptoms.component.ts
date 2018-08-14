import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { IMyDpOptions } from 'mydatepicker';
import { Pipe } from "@angular/core";
import { PipeTransform } from "@angular/core";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
declare var $ : any;
declare var jQuery : any;


@Component({
  selector: 'app-community-symptoms',
  templateUrl: './community-symptoms.component.html',
  styleUrls: ['./community-symptoms.component.css']
})
export class CommunitySymptomsComponent extends HeadersProvider implements OnInit {


	@BlockUI() blockUI: NgBlockUI;

	//.toUpperCase()
  	getheadersymptomList : any;
  	Noheadersymptom : boolean = false;
  	closePopup:any;
  	donotLoad:boolean = false;
  	okay : boolean = false;
  	pageT: any = 1;
  	perpage:any = 20;
  	// Hospitalization    
  	savedID : number;    
  	placeholder: string = "SELECT YOUR DATE";
  	tmodel:any;
  	tmodel1:any;      
  	searchString:string = "";
  	tempSearchString:string = "";
  	// -- Search and filter options
  	searchFilter1:boolean = true;
  	searchFilter2:boolean = false;
  	searchFilter3:boolean = false;
  	searchFilter4:boolean = false;
  	srchterm:any;
  	filterconditions:any;

  	//public myForm: FormGroup;
  	GLOBAL_MEDIUM_TIMEOUT : number = 1500;
  	addSympStep3 : any ;

  	//add symptoms
  	newSymptomsName: string = "";
  	NewSymtId:any;

  	conditionList: any;
  	selectedDate: any;
  	selectDate: any;
  	visibility: string = "";
  	selectedsevere: string = "";
  	addsymptomDontknow: boolean = false;
  	addsymptomcondition: string = "";
  	selectedSymptopid: number;
  	selectSymptomsInfo:any;
      
  	currentDate:any;  
  	dayList:any;
  	monthList:any;
  	yearList:any;
  	filterConditionFlag:boolean = true;
  	formValidation  : boolean = false;
  	MySymptomconditionsIds:any;

  	constructor(public _router:Router,public _APIservices:SCApi,private notificationService: NotificationsService) { 
  		super();
  	}

  	ngOnInit() {
  		//this.filterConditionFlag=true;
	    //this.searchString="";
	    //this.tempSearchString="";
	    this.addSympStep3 = document.getElementById('addStepThree');
	    //this.pageT = 1;
	    //this.perpage = 20;
	    //this.searchFilter1=true;
	    //this.searchFilter2=false;
	    //this.searchFilter3=false;
	    //this.searchFilter4=false;
	    //this.Noheadersymptom = false;      
	    this.closePopup = document.getElementById('confirmationModal');
	    this.filterconditions=document.getElementById('filter-conditions');
	    this.loadSymptomCondition();
	    this.loadSymptoms();
	    this.loadMySymptomsIds();
	    // setInterval(() => { 
	    //   console.log(this.editUpdatDischarge);
	    //  }, 1000);
  	}

  	// Get symptoms List
  	loadMySymptomsIds(){
  		this._APIservices.my_symptomconditions_listIds(this.headers).subscribe(res=>{
  			if(res.body.status == "1" || res.body.status == 1){
  				this.MySymptomconditionsIds=[];
  				for(var i =0;i<res.body.data.length;i++){
  					this.MySymptomconditionsIds.push(res.body.data[i].id);
  				}
  			}
  		},err=>{
  			//TODO
  		});
  	}

  	loadSymptoms(){
  		this.pageT = 1;
  		this.donotLoad = false;
  		this.perpage = 15; 
  		let body_param;
  		try{
  			if(this.searchFilter2){
  				body_param = {
  					"page" : 1,
		          	"per_page": 15,
		          	"offset": 0,
		          	"search_word":this.searchString,
		          	"condition_ids":this.MySymptomconditionsIds
        		};
        	}else{
        		body_param = {
        			"page" : 1,
          			"per_page": 15,
          			"offset": 0,
          			"search_word":this.searchString,
          			"condition_ids":[]
        		};
        	}

        	this._APIservices.get_CommunitySymptoms(body_param, this.headers).subscribe(suc=>{
        		this.getheadersymptomList = suc.body.data;
        		if(this.getheadersymptomList.length == 0){
        			this.Noheadersymptom = true;
        		}

        		for(let items of this.getheadersymptomList){
        			console.log(items);
        		}
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

    loadSymptomsMore(){
    	this.pageT++;
    	let body_param;
    	try{
    		if(this.searchFilter2){
    			body_param = {
    				"page" : this.pageT,
    				"per_page": this.perpage,
    				"offset": 0,
    				"search_word":this.searchString,
    				"condition_ids":this.MySymptomconditionsIds
    			};
    		}else{
    			body_param = {
    				"page" : this.pageT,
    				"per_page": this.perpage,
    				"offset": 0,
    				"search_word":this.searchString,
    				"condition_ids":[]
    			};
    		}

    		this._APIservices.get_CommunitySymptoms(body_param, this.headers).subscribe(suc =>{
    			if(suc.body.data.length == 0){
    				this.donotLoad = true;
    			} else{
    				this.getheadersymptomList = this.getheadersymptomList.concat(suc.body.data);
    			}
    		},err=>{
    			var err_res = JSON.parse(err._body);
    			this.notificationService.error('Error',err_res.message,{
    				timeOut: 3000,
    				showProgressBar: false,
    				pauseOnHover: false, 
    				clickToClose: false 
    			})
    		});
    	}catch(err){
    		console.log(err);
    	}
    }

    filter2(){
    	this.searchFilter2=!this.searchFilter2;
    	this.loadSymptoms();
    }

    onScrollDown() {
    	if(!this.donotLoad){
    		this.loadSymptomsMore();
    	}
    }

    // -- Search and filter options
    searchSheet(){
    	this.searchString=this.tempSearchString;
    	this.getheadersymptomList=[];
    	this.loadSymptoms();
    }

    filterConditionOpen(){
    	this.filterConditionFlag=!this.filterConditionFlag;
    	if(this.filterConditionFlag){
    		this.filterconditions.classList.remove('in');
    	}else{
    		this.filterconditions.classList.add('in');
    	}
    }

    SearchSymptoms(){
    	this.pageT = 1;
    	this.donotLoad = false;
    	this.perpage = 15;
    	try{
    		let body_param = {
    			"search_word":this.srchterm,
    			"page" : 1,
    			"per_page": 15,
    			"offset": 0
    		};

    		this._APIservices.search_symptoms(body_param, this.headers).subscribe(suc =>{
    			this.getheadersymptomList=suc.body.data;
    			if(this.getheadersymptomList.length == 0){
    				this.Noheadersymptom = true;
    			}

    			for(let items of this.getheadersymptomList){
    				console.log(items);
    			}
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

    // -- Add Symptom to my profile button click

    // Select  Date
    onDateChangeddiagnose(event){
    	if(event.epoc == 0){
    		this.selectedDate = "";
    		this.selectDate = "";
    	}else{
    		this.selectedDate =moment(event.jsdate).format('YYYY/MM/DD');
    		this.selectDate=moment(event.jsdate).format('YYYY/MM/DD');
    	}
    }

    // Select Severity
    selectSeverity(value){

    	this.selectedsevere = value;
    }

    //Load  symptom condition
    loadSymptomCondition(){
    	try{
    		this.blockUI.start("please wait...");
    		this._APIservices.get_conditionslist_symptom({}, this.headers).subscribe(suc =>{
    			if(suc.body.status == "1" || suc.body.status == 1){
    				this.conditionList  = suc.body.data;
    				this.blockUI.stop();
    			}
    		},err=>{
    			var err_res = JSON.parse(err._body);
    			this.blockUI.stop();
    			this.notificationService.error('Error',err_res.message,{ 
    				timeOut: 3000, 
    				showProgressBar: false, 
    				pauseOnHover: false, 
    				clickToClose: false 
    			});
    		});
    	}catch(err){
    		this.blockUI.stop();
    		console.log("Error occure while load symptoms. Error is ", err);
    	}
    }

    //select Condition
    selectNewCondition(conditionid){
    	this.addsymptomcondition = conditionid;
    	this.addsymptomDontknow = false;
    }

    // -- Add symptom id phase 1
    addSymptomsThree(symptoName){
    	try{
    		if(symptoName == ""){
    			this.formValidation = true;
    			return false;
    		}

    		this.blockUI.start();
    		let body_param = {
    			"id" : Number(symptoName.id)
    		};

    		this._APIservices.symptom_addourprofile(body_param, this.headers).subscribe(suc =>{
    			if(suc.body.status == "1" || suc.body.status == 1){
    				this.NewSymtId = suc.body.data.id;
    				this.addSympStep3.style.display = "block";
    				this.selectedDate = "";
    				this.selectDate = "";
    				this.visibility = "all_users";
    				this.selectedsevere = "";
    				this.addsymptomDontknow = false;
    				this.addsymptomcondition = "";
    				this.newSymptomsName = symptoName.name;
    				this.formValidation = false;
    				$("#addAllSymptoms").modal('show');
    				this.blockUI.stop();
    			}
    		},err=>{
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
    		console.log("Error occure while add symptoms three. Error is ", err);
    	}
    }

    // Add new Symptom final phase
    addNewSymptom(){
    	try{

    		if(this.addsymptomcondition == "" && this.addsymptomDontknow == false){
    			this.formValidation = true;
    			return false;
    		}

    		if( this.addsymptomDontknow == false && this.addsymptomcondition == ""){
    			this.formValidation = true;
    			return false;
    		}

    		if(this.selectDate == "" ){
    			this.formValidation = true;
    			return false;
    		}

    		if(this.selectedsevere == ""){
    			this.formValidation = true;
    			return false;
    		}

    		this.blockUI.start("please wait...");
    		$("#addAllSymptoms").modal('hide');
    		let body_params = {
    			"id":this.NewSymtId,
        		"my_condition_id": this.addsymptomDontknow == false ? Number(this.addsymptomcondition) : "",
        		"do_not_know": this.addsymptomDontknow == false ? false : true,
        		"first_notice_date":this.selectDate,          
        		"your_anxiety":this.selectedsevere,
        		"visibility":this.visibility          
      		};

      		let data = { 'id': this.NewSymtId, 'data' : body_params }
      		this._APIservices.addNewsymptom(data, this.headers).subscribe(suc =>{
      			if(suc.body.status == "1" || suc.body.status == 1){
      				//this.addSymptomsClosed();
      				location.reload();
      				this.notificationService.success('Symptom',suc.body.message,{
      					timeOut: 3000,
      					showProgressBar: false,
      					pauseOnHover: false,
      					clickToClose: false
      				});
      				setTimeout(()=>{
      					this.blockUI.stop();
      				}, this.GLOBAL_MEDIUM_TIMEOUT);
      			}
      		},err=>{
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
      		console.log("Error occure while add new symptoms. Error is",err);
      	}
    }
}
