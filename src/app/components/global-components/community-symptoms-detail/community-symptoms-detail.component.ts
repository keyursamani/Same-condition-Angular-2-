import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { IMyDpOptions } from 'mydatepicker';
import { Pipe } from "@angular/core";
import { PipeTransform } from "@angular/core";
import { Params } from '@angular/router';
import { window } from 'rxjs/operator/window';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { transform } from 'd3';

import * as moment from 'moment';
declare var $ : any;
declare var jQuery : any;
declare var FusionCharts: any;

@Component({
  selector: 'app-community-symptoms-detail',
  templateUrl: './community-symptoms-detail.component.html',
  styleUrls: ['./community-symptoms-detail.component.css']
})

export class CommunitySymptomsDetailComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;
	viewPatientsModalFlag:any;
    viewPatientsListModal:any;
    headerSymptom : any;
    NosymptomTreatment : any;
    NosymptomPatients : any;
    closePopup:any;
    donotLoadTreatment:boolean;
    donotLoadPatient:boolean;
    okay : boolean;
    pageT: any;
    perpage:any;
    // Hospitalization    
    savedID : number;
    searchtTagString: boolean;
    //placeholder: string;
    tmodel:any;
    tmodel1:any;   
    route :Router;      
    symptomId : any;
    isForPatient : any;
    symptomStatus: string;
    symptomName : string;
    symptomDesc : string;
    symptomTreatmentList : any;
    symptomPatientlist : any;
    patientFirstName : string;
    patientLastName : string;
    patientPhotoUrl : any;
    patientConditions : any;
    severityName : string;
    userProfile : any;
    GLOBAL_MEDIUM_TIMEOUT : number = 1500;
    addSympStep3 : any ;
    //add symptoms
  	newSymptomsName: string;
  	NewSymtId:any;

  	conditionList: any;
  	selectedDate: any;
  	selectDate: any;
  	visibility: string;
  	selectedsevere: string;
  	addsymptomDontknow: boolean;
  	addsymptomcondition: string;
  	selectedSymptopid: number;
  	selectSymptomsInfo:any;
    
  	currentDate:any;  
  	dayList:any;
  	monthList:any;
  	yearList:any;
  	formValidation  : boolean = false;  

	constructor(public _router:Router,public _APIservices:SCApi,private notificationService: NotificationsService, private activatedRoute: ActivatedRoute) {
		super();
		this.route = _router;
    //this.placeholder = 'SELECT YOUR DATE';
    this.donotLoadTreatment = false;  
    this.symptomStatus="current";     
	}

	ngOnInit() {
   	this.activatedRoute.queryParams.subscribe((params: Params) => {
   		this.symptomId = params['id'];
    	this.isForPatient = params['isForPatient'];
    	this.isForPatient = typeof this.isForPatient === 'undefined' ? false : true;
    	this.viewPatientsModalFlag=document.getElementById('viewPatientsModal');
    	this.getLoginuserProfile();           
  	}); 

  	this.addSympStep3 = document.getElementById('addStepThree');
  	this.pageT = 1;
  	this.perpage = 20;
  	this.NosymptomTreatment = false;
  	this.searchtTagString=false;
  	this.closePopup = document.getElementById('confirmationModal');
  	this.loadSymptomCondition();
  	this.loadSymptom();
  	this.loadTreatments();
  	this.loadPatients();
  	this.getLoginuserProfile();
  	if(this.isForPatient){
  		this.filterSymptom('stop');
  	}     

    var revenueChart = new FusionCharts({
        type: 'pie2d',
        renderAt: 'chart-container',
        width: '250',
        height: '250',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                // "caption": "Split of Revenue by Product Categories",
                // "subCaption": "Last year",
                "theme":"fint",
                "numberPrefix": "$",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                "bgColor": "#ffffff",
                "showBorder": "0",
                // "use3DLighting": "0",
                "showShadow": "0",
                "enableSmartLabels": "0",
                "startingAngle": "310",
                "showLabels": "1",
                "showPercentValues": "1",                
                "defaultCenterLabel": "Total revenue: $64.08K",
                "centerLabel": "Revenue from $label: $value",
                "centerLabelBold": "1",                
                "decimals": "0",
                "useDataPlotColorForLabels":"1",
                // "captionFontSize": "14",
                // "subcaptionFontSize": "14",
                // "subcaptionFontBold": "0",
                "enableMultiSlicing": "0",
                "pieRadius": "70",
            },
            "data": [
                {
                    "label": "MILD",
                    "value": "28504"
                }, 
                {
                    "label": "MODERATE",
                    "value": "14633"
                }, 
                {
                    "label": "SEVERE",
                    "value": "10507"
                }, 
                {
                    "label": "NONE",
                    "value": "4910"
                }
            ]
        }
    }).render(); 
        
	}

	viewPatientsModalopen(){
		this.viewPatientsListModal = [];
		try{
			let body_param = {
				"id" : this.symptomId,
				"page" : 1,
				"per_page": 10,
				"offset": 0
			};

			this._APIservices.get_SymptomPatients(body_param, this.headers).subscribe(suc =>{
				if(suc.body.status === "1" || suc.body.status === 1){
					this.viewPatientsListModal=suc.body.data;
				}
				this.donotLoadPatient = true;
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
      this.viewPatientsModalFlag.style.display = "block";
    }
    
    viewPatientsModalClosed(){

      this.viewPatientsModalFlag.style.display = "none";
    }

    // get symptom details
    loadSymptom(){
    	try{
    		let body_param = {
    			"id" : this.symptomId
    		};

    		this._APIservices.get_CommunitySymptom(body_param, this.headers).subscribe(suc =>{
    			this.headerSymptom = suc.body.data;
    			this.symptomName = this.headerSymptom.symptom.name;
    			this.symptomDesc = this.headerSymptom.symptom.description;
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

    loadTreatments(){
    	try{
    		let body_param = {
    			"id" : this.symptomId,
    			"page" : 1,
    			"per_page": 10,
    			"offset": 0
    		};

    		this._APIservices.get_SymptomTreatments(body_param, this.headers).subscribe(suc =>{
    			this.symptomTreatmentList = suc.body.data;
    			if(this.symptomTreatmentList.length==0){
    				this.NosymptomTreatment = true;
    			}

    			for(let items of this.symptomTreatmentList){
    				console.log(items);
    			}

    			this.donotLoadTreatment = true;
    		}, err=>{
    			var err_res = JSON.parse(err._body);
    			this.notificationService.error('Error', err_res.message,{ 
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

    onScrollDownsIsTreatment(){
    	if(!this.donotLoadTreatment){
    		this.pageT++;    
    		this.loadTreatments();
    		this.loadMoreTreatments();
    	}
    }

    loadMoreTreatments(){
    	try{
    		let body_param = {
    			"id" : this.symptomId,
        		"page" : this.pageT,
        		"per_page": 10,
        		"offset": 0
      		};

      		this._APIservices.get_SymptomTreatments(body_param, this.headers).subscribe(suc =>{
      			this.symptomTreatmentList = suc.body.data;
      			if(this.symptomTreatmentList.length == 0){
      				this.NosymptomTreatment = true;
      			}

      			for(let items of this.symptomTreatmentList){
      				console.log(items);
      			}
      			this.donotLoadTreatment = true;
      		}, err=>{
      			var err_res = JSON.parse(err._body);
      			this.notificationService.error('Error', err_res.message,{ 
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

    filterSymptom(status){
    	this.symptomStatus = status;
    }

    // Get User Profile
    getLoginuserProfile(){
    	try{
    		this._APIservices.get_patient_profile({}, this.headers).subscribe(suc =>{
    			this.userProfile=suc.body.data;
    		},err=>{
    			var err_res = JSON.parse(err._body);
    			this.notificationService.error('Error', err_res.message,{ 
    				timeOut: 3000, 
          			showProgressBar: false, 
          			pauseOnHover: false, 
          			clickToClose: false 
        		});
    		});
    	}catch(err){
    		console.log('Error occure while get login user profile. Error is ', err);
    	}
    }

    loadPatients(){

    	this.getLoginuserProfile();
    	try{
    		let body_param = {
    			"id" : this.symptomId,
    			"page" : 1,
    			"per_page": 10,
    			"offset": 0
    		};

    		this._APIservices.get_SymptomPatients(body_param, this.headers).subscribe(suc =>{
    			this.symptomPatientlist = suc.body.data;
    			if(this.symptomPatientlist.length == 0){
    				this.NosymptomPatients = true;
    			}

    			for(let items of this.symptomPatientlist){
    				console.log(items);
    			}
    			this.donotLoadPatient = true;
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

    onScrollDownsIsPatient(){
    	if(!this.donotLoadTreatment){
    		this.pageT++;
    		this.loadPatients();
    		this.loadMorePatients();
    	}
    }

    loadMorePatients(){
    	try{
    		let body_param = {
    			"id" : this.symptomId,
    			"page" : this.pageT,
    			"per_page": 10,
    			"offset": 0
    		};
    		this._APIservices.get_SymptomPatients(body_param, this.headers).subscribe(suc =>{
    			this.symptomPatientlist = suc.body.data;
    			if(this.symptomPatientlist.length == 0){
    				this.NosymptomPatients = true;
    			}

    			for(let items of this.symptomPatientlist){
    				console.log(items);
    			}
    			this.donotLoadPatient = true;
    		}, err=>{
    			var err_res = JSON.parse(err._body);
    			this.notificationService.error('Error', err_res.message,{ 
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

    // -- Follow patient button on click
    followUser(followerid) {
    	try{
    		this.blockUI.start();
    		let data = {
				'follower_id' :Number(followerid)		
			}

			this._APIservices.follow_User({'body':data}, this.headers).subscribe(res=>{
				if(res.body.status == "1" || res.body.status == 1){
					this.loadPatients();
					this.blockUI.stop();
				}
			}, err=>{
				var err_res = JSON.parse(err._body);
				this.blockUI.stop();
           	});
		} catch(e){
			console.log("Error occure while following User. Error is ", e);
			this.blockUI.stop();
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

			this.blockUI.start("please wait...");
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
