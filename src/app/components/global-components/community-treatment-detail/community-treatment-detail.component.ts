import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Routes, ActivatedRoute } from '@angular/router';
declare var $ : any;

@Component({
  selector: 'app-community-treatment-detail',
  templateUrl: './community-treatment-detail.component.html',
  styleUrls: ['./community-treatment-detail.component.css']
})
export class CommunityTreatmentDetailComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;
	tag: any;
	title: any;
	userRole: any;
	classopen: any;
	statistics: any = [];
	statuslist: any;
	showcaret: boolean = true;
	addTreatment: boolean = false;
	symptomsViewTreatmentPatients: boolean = false;
	requiredDosage: string = "";
	treatmentSearchname: string = "";
	donotLoad: boolean = false;
	donotLoadPatient: boolean = false;
	donotLoadData: boolean = false;
	perpage: number = 10;
	pageT: number = 1;
	pageP: number = 1;
	pageD: number = 1;
	evaluationList: any = [];
	patientList: any = [];
	selectedRow: any;
	dialogtitle: any = '';
	dataList: any = [];
	patientfilter: any;
	options: any = [];
	formValidation : boolean = false;
	GLOBAL_MEDIUM_TIMEOUT : number = 1000;

	//constructor
	constructor(private APIservices:SCApi, private NotificationService: NotificationsService,private route: ActivatedRoute) {
		super();
		this.userRole = this._localStorage.get('role');
		this.statuslist = [
			{ 'id': 'current_treatment', 'name': 'Current Treatment' },
			{ 'id': 'past_treatment', 'name': 'Past Treatment' }
		];
		this.treatmentSearchname = this.route.params['_value'].tname;
	}

	//ngOnInit
  	ngOnInit() {
  		this.View_Treatment_With_Statistics();
		this.listEvaluation();
		this.listPatients();
  	}

  	/* toggle hide/show want_to_see element */
	toggleWantToSee(show) {
		if (show) {
			document.querySelector('#want_to_see').classList.remove('hidden');
		}
		else {
			document.querySelector('#want_to_see').classList.add('hidden');
		}
	}

	/*Toggle tags dropdown*/
  	toggleTagDropdown(el) {

	  	el.active = !el.active;    
	}

	/*Toggle selected*/
	toggleSelected(el) {

		this.selectedRow = el;
	}

	toggleStatusDropdown(el) {
		this.classopen = !this.classopen;     
		this.showCaretFn(); 
	}

	showCaretFn() {

		this.showcaret = !this.showcaret;      
	}

	View_Treatment_With_Statistics() {
		if(this.route.params['_value'].tid){

			this.blockUI.start('please wait...');
			let body_param = {
				"id" : this.route.params['_value'].tid
			}

			this.APIservices.view_treatment_with_statistics(body_param, this.headers).subscribe(suc =>{
				if(suc.body.status == "1" || suc.body.status == 1){
					this.statistics = suc.body.data;
					//window.prompt('statistics', JSON.stringify(this.statistics));
				}

				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			},err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				this.statistics=[];
				this.NotificationService.error('Error',err_res.message,{ 
					timeOut: 3000, 
					showProgressBar: false, 
					pauseOnHover: false, 
					clickToClose: false 
				});
			});
		}
	}

	checkAll(ev) {
		this.statuslist.forEach(x => x.state = ev.target.checked)
		this.listEvaluation();
	}

	isAllChecked() {

		return this.statuslist.every(_ => _.state);
	}

	addTreatmentOpen(data) {

		this.addTreatment = true;
	}

	addTreatmentClosed() {

		this.addTreatment = false;
	}

	addsymptomsViewTreatmentPatientsOpen(title,patients,tag) {
		this.symptomsViewTreatmentPatients = true;
		this.title = title.toLowerCase();
		if(title=='Less Than a Month'){
			this.title = 'less_than_month';
		}
		if(title=='1-6 Months'){
			this.title = 'one_month_to_6_months';
		}
		if(title=='6 Months - 1 Year'){
			this.title = 'six_months_to_year';
		}
		if(title=='1 - 2 Years'){
			this.title = 'one_year_to_2_years';
		}
		if(title=='2 - 5 Years'){
			this.title = 'two_years_to_5_years';
		}
		if(title=='5 - 10 Years'){
			this.title = 'five_years_to_10_years';
		}
		if(title=='10+ Years'){
			this.title = 'more_than_10_years';
		}
		if(title=='Can’t Tell'){
			this.title = 'cant_tell';
		}
		if(tag=='current treatment'){
			
			this.dialogtitle = "<p><strong>"+patients+" patients</strong> logged that they have currently been doing this<br> treatment for <strong>"+title+".</strong></p>";
			this.tag = true;
			
			this.options = [
				{ name: "Less Than a Month", value:"less_than_month" },
				{ name: "1-6 Months", value:"one_month_to_6_months" },
				{ name: "6 Months - 1 Year", value:"six_months_to_year" },
				{ name: "1 - 2 Years", value:"one_year_to_2_years" },
				{ name: "2 - 5 Years", value:"two_years_to_5_years" },
				{ name: "5 - 10 Years", value:"five_years_to_10_years" },
				{ name: "10+ Years", value:"more_than_10_years" }
		    ];
		}
		
		if(tag == 'past treatment'){
			this.dialogtitle = "<p><strong>"+patients+" patients</strong> logged that they previously did this treatment<br> for <strong>"+title+".</strong></p>";
			this.tag = false;
			this.options = [
				{ name: "Less Than a Month", value:"less_than_month" },
				{ name: "1-6 Months", value:"one_month_to_6_months" },
				{ name: "6 Months - 1 Year", value:"six_months_to_year" },
				{ name: "1 - 2 Years", value:"one_year_to_2_years" },
				{ name: "2 - 5 Years", value:"two_years_to_5_years" },
				{ name: "5 - 10 Years", value:"five_years_to_10_years" },
				{ name: "10+ Years", value:"more_than_10_years" }
		    ];
		}
	
		if(tag == 'Effectiveness'){
			this.dialogtitle = "<p><strong>"+patients+" patients</strong> said "+title+" for how effective this treatment<br> was for its intended purpose.</p>";
			this.tag = 'effectiveness';
			
			this.options = [
				{ name: "Can't Tell", value:"cant_tell" },
				{ name: "None", value:"none" },
				{ name: "Slight", value:"slight" },
				{ name: "Moderate", value:"moderate" },
				{ name: "Major", value:"major" }
		    ];
		}
		
		if(tag == 'Side Effects'){
			this.dialogtitle = "<p><strong>"+patients+" patients</strong> said "+title+" when rating side effects they experienced from this treatment.</p>";
			this.tag = 'side_effects';
			this.options = [
				{ name: "None", value:"none" },
				{ name: "Mild", value:"mild" },
				{ name: "Moderate", value:"moderate" },
				{ name: "Severe", value:"severe" }
		    ];
		}
	
		if(tag == 'Adherence'){
			this.dialogtitle = "<p><strong>"+patients+" patients</strong> said "+title+" for how often they are doing this treatment.</p>";
			this.tag = 'adherence';

			this.options = [
				{ name: "Never", value:"never" },
				{ name: "Sometimes", value:"sometimes" },
				{ name: "Usually", value:"usually" },
				{ name: "Always", value:"always" }
			];
		}
		
		if(tag=='Burden'){
			if(title=='not_at_all')
			title='Never';
			if(title=='a_little')
			title='Sometimes';
			if(title=='somewhat')
			title='Usually';
			if(title=='very')
			title='Always';
			this.dialogtitle = "<p><strong>"+patients+" patients</strong> said "+title+" when rating how much of a burden this treatment was.</p>";
			this.tag = 'burden';

			this.options = [
				{ name: "Never", value:"not_at_all" },
				{ name: "Sometimes", value:"a_little" },
				{ name: "Usually", value:"somewhat" },
				{ name: "Always", value:"very" }
			];
		}
		this.patientfilter = this.title;
        this.listData();
	}

	addsymptomsViewTreatmentPatientsClosed() {

		this.symptomsViewTreatmentPatients = false;
	}

	// Add New Treatment In Our Profile
	addTreatmentOurProfile() {
		try{

			if(this.requiredDosage == ""){
				this.formValidation = true;
				return false;
			}

			if(!this.route.params['_value'].tid){
				this.NotificationService.error('Error','Please enter treatment',{ 
					timeOut: 3000, 
					showProgressBar: false, 
					pauseOnHover: false, 
					clickToClose: false 
				});
				return false;
			}

			this.blockUI.start('please wait...');
			let body_param = {
				"id" : this.route.params['_value'].tid,
				'data' : { "require_dosage": this.requiredDosage }
			};
			
			this.APIservices.addtreatment_ourprofile(body_param, this.headers).subscribe(suc =>{
				if(suc.body.status == "1" || suc.body.status == 1){
					this.NotificationService.success('Treatment',suc.body.message,{ 
						timeOut: 3000, 
						showProgressBar: false, 
						pauseOnHover: false, 
						clickToClose: false 
					});
					this.addTreatmentClosed();
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			},err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				this.NotificationService.error('Error',err_res.message,{ 
					timeOut: 3000, 
					showProgressBar: false, 
					pauseOnHover: false, 
					clickToClose: false 
				});
			});
		}catch(err){
			this.blockUI.stop();
			console.error("Error occur while add treatment to profile. Error is", err);
		}
	}

	onScrollDown() {
		if(!this.donotLoad){
			this.pageT++;
			this.loadlistEvaluation();
		}
	}

	onScrollDownPatient() {
		if(!this.donotLoadPatient){
			this.pageP++;
			this.loadlistPatients();
		}
	}

	onScrollDownData() {
		if(!this.donotLoadData){
			this.pageD++;
			this.loadlistData();
		}
	}

	listEvaluation() {
		this.pageT = 1;
		this.donotLoad = false;
		this.evaluationList = [];
		this.loadlistEvaluation();
	}

	listPatients() {
		this.pageP = 1;
		this.donotLoadPatient = false;
		this.patientList = [];
		this.loadlistPatients();
	}

	loadlistEvaluation(){
		try{

			this.blockUI.start('please wait...');
			let status_ids = '';
			let cnt = 0;
			this.statuslist.forEach(element => {
				if(element.state==true){
					cnt++;
				 status_ids = element.id;
				 if(cnt==2)
				 status_ids = '';
				}
			});

			let body_param = {
				"status" : status_ids,
			 	"id" : this.route.params['_value'].tid,
			 	"page": this.pageT,
			 	"per_page" : this.perpage,
			 	"offset": 0
			}

			this.APIservices.patient_evaluations_of_treatment(body_param, this.headers).subscribe(suc=>{
				if(suc.body.data.length==0){
					this.donotLoad = true;
				} else{
					this.evaluationList = this.evaluationList.concat(suc.body.data);
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			},err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				this.evaluationList=[];
				this.NotificationService.error('Error',err_res.message,{ 
					timeOut: 3000, 
					showProgressBar: false, 
					pauseOnHover: false, 
					clickToClose: false 
				});
			});
		}catch(err){
			this.blockUI.stop();
			console.error("Error occure while load evalution. Error is ", err);
		}
	}

	loadlistPatients() {
		try{
			this.blockUI.start('please wait...');
			let body_param = {
				"id" : this.route.params['_value'].tid,
				"page": this.pageP,
				"per_page" : this.perpage,
				"offset": 0
			}

			this.APIservices.patient_of_treatment(body_param, this.headers).subscribe(suc =>{
				if(suc.body.data.length == 0){
					this.donotLoadPatient = true;
				} else{
					this.patientList = this.patientList.concat(suc.body.data);
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			}, err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				this.patientList = [];
				this.NotificationService.error('Error',err_res.message,{ 
					timeOut: 3000, 
					showProgressBar: false, 
					pauseOnHover: false, 
					clickToClose: false 
				});
			});
		}catch(err){
			this.blockUI.stop();
			console.error("Error occur while load patient list. Error is ", err);
		}
	}

	follow(id) {
		try{
			this.blockUI.start('please wait...');
			let body_param = {
				"follower_id" : id,
				"Authentication-Token": this.getToken().AuthToken
			}

			this.APIservices.follows(body_param, this.headers).subscribe(suc =>{
				if(suc.body.status == 1 || suc.body.status == "1"){
					this.patientList = [];
					this.loadlistPatients();
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			},err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				this.NotificationService.error('Error',err_res.message,{ 
					timeOut: 3000, 
					showProgressBar: false, 
					pauseOnHover: false, 
					clickToClose: false 
				});
			});
		}catch(err){
			this.blockUI.stop();
			console.error("Error occure while following. Error is ",err);
		}
	}

	listData() {
		this.pageD = 1;
		this.donotLoadData = false;
		this.dataList = [];
		this.loadlistData();
	}

	loadlistData() {
		try{
			this.blockUI.start('please wait...');
			if(this.tag == true || this.tag == false) {
				let body_param = {
					"id" : this.route.params['_value'].tid,
					"page": this.pageD,
					"per_page" : this.perpage,
					"offset": 0,
					"current_past_treatment":this.tag,
					"duration": this.patientfilter
				}

				this.APIservices.patients_current_past_treatment(body_param, this.headers).subscribe(suc =>{
					if(suc.body.data.length == 0){
						this.donotLoadData = true;
					} else{
						this.dataList = this.dataList.concat(suc.body.data);
					}
					setTimeout(()=>{
						this.blockUI.stop();
					},this.GLOBAL_MEDIUM_TIMEOUT);
				},err=>{
					this.blockUI.stop();
					var err_res = JSON.parse(err._body);
					this.dataList = [];
					this.NotificationService.error('Error',err_res.message,{ 
						timeOut: 3000, 
						showProgressBar: false, 
						pauseOnHover: false, 
						clickToClose: false 
					});
				});
			}else{
				this.blockUI.start('please wait...');
				let body_param = {
					"id" : this.route.params['_value'].tid,
			 		"page": this.pageD,
			 		"per_page" : this.perpage,
			 		"offset": 0,
			 		"evalaution":this.tag,
			 		"evalaution_kind": this.patientfilter
			 	}

			 	this.APIservices.patients_evaluations(body_param, this.headers).subscribe(suc =>{
			 		if(suc.body.data.length == 0){
			 			this.donotLoadData = true;
			 		} else{
			 			this.dataList = this.dataList.concat(suc.body.data);
			 		}
			 		setTimeout(()=>{
						this.blockUI.stop();
					},this.GLOBAL_MEDIUM_TIMEOUT);
			 	},err=>{
			 		this.blockUI.stop();
			 		var err_res = JSON.parse(err._body);
			 		this.dataList=[];
			 	});
			}
		}catch(err){
			this.blockUI.stop();
			console.error("Error occure while load data. Error is ",err);
		}
	}
}
