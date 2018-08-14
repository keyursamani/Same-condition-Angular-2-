import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var $ : any;

@Component({
  selector: 'app-community-treatment',
  templateUrl: './community-treatment.component.html',
  styleUrls: ['./community-treatment.component.css']
})

export class CommunityTreatmentComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;

	selectTreatmentInfoId: any;
	treatmentSearchname: string = "";
	userRole: any;
	perpage: number = 10;
	pageT: number = 1;
	searchtTreatmentString: string = "";
	treatmentList: any = [];
	category: any = [];
	classin: any;
	donotLoad:boolean = false;
	showcaret: boolean = true;
	conditions: any = [];
	addTreatment: boolean = false;
	requiredDosage: string = "";
	formValidation:boolean = false;
	GLOBAL_MEDIUM_TIMEOUT : number = 1000;

	//constructor
	constructor(private APIservices:SCApi, private NotificationService: NotificationsService) {
		super();
		this.userRole = this._localStorage.get('role');
	}

	//ngOnInit
  	ngOnInit() {
  		this.listTreatmentCategory();
		this.listTreatmentCondition();
		this.listTreatmentList();
  	}

  	onEvent(event) {

		event.stopPropagation();
	}
		
	filterTreatmentOpen() {

		this.classin = !this.classin;      
	}

	showCaretFn() {

		this.showcaret = !this.showcaret;      
	}

	checkAll(ev) {
		this.category.forEach(x => x.state = ev.target.checked)
		this.listTreatmentList();
	}
	
  	isAllCheckedCondition() {
		
		return this.conditions.every(_ => _.state);
	}

	checkAllCondition(ev) {
		this.conditions.forEach(x => x.state = ev.target.checked)
		this.listTreatmentList();
	}

	isAllChecked() {

		return this.category.every(_ => _.state);
	}
	
	listTreatmentCategory() {
		try{
			this.blockUI.start('please wait...');
			this.APIservices.list_treatment_category({},this.headers).subscribe(suc =>{
				if(suc.body.status == 1 || suc.body.status == "1"){
					this.category = suc.body.data;
					if(this.category.length == 0){
						this.NotificationService.remove();
						this.NotificationService.alert('Warning','No Treatment Category Available',{
							timeOut: 5000, 
							showProgressBar: false, 
							pauseOnHover: false, 
							clickToClose: false
						});
					}
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			  },
			  err=>{
			  	this.blockUI.stop();
				this.category = [];
				var err_res = JSON.parse(err._body);
				this.NotificationService.error('Error',err_res.message,{
					timeOut: 5000, 
					showProgressBar: false, 
					pauseOnHover: false, 
					clickToClose: false
				});
			});
		} catch(err){
			this.blockUI.stop();
			this.category = [];
			var err_res = JSON.parse(err._body);
			this.NotificationService.error('Error',err_res.message,{
				timeOut: 3000, 
				showProgressBar: false, 
				pauseOnHover: false, 
				clickToClose: false
			});
		}
	}

	listTreatmentCondition() {
		try{
			this.blockUI.start('please wait...');
			this.APIservices.get_mycondition_filter({},this.headers).subscribe(suc =>{
				if(suc.body.status == 1 || suc.body.status == "1"){
					this.conditions = suc.body.data;
					if(this.conditions.length == 0){
						this.NotificationService.remove();
						this.NotificationService.alert('Warning','No Treatment Condition Available',{
							timeOut: 5000, 
							showProgressBar: false, 
							pauseOnHover: false, 
							clickToClose: false
						});
					}
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			  },
			  err=>{
			  	this.blockUI.stop();
				this.category = [];
				var err_res = JSON.parse(err._body);
				this.NotificationService.error('Error',err_res.message,{
					timeOut: 5000, 
					showProgressBar: false, 
					pauseOnHover: false, 
					clickToClose: false
				});
			});
		} catch(err){
			this.blockUI.stop();
			this.category = [];
			var err_res = JSON.parse(err._body);
			this.NotificationService.error('Error',err_res.message,{
				timeOut: 3000, 
				showProgressBar: false, 
				pauseOnHover: false, 
				clickToClose: false
			});
		}
	}

	onScrollDown() {
		if(!this.donotLoad){
			this.pageT++;
			this.loadlistTreatmentList();
		}
	}
	
	loadlistTreatmentList(){
		try{
			this.blockUI.start('please wait...');
			let condition_ids: number[] = [];			
			this.conditions.forEach(element => {
				if(element.state==true)
				condition_ids.push(parseInt(element.id));
			});
		
			let treatment_category_ids: number[] = [];
			
			this.category.forEach(element => {
				if(element.state==true)
				treatment_category_ids.push(element.id);
			});

			let body_param = {
				"search_word" : this.searchtTreatmentString,
			 	'condition_ids': condition_ids,
			 	'treatment_category_ids': treatment_category_ids,
			 	"page": this.pageT,
			 	"per_page" : this.perpage,
			 	"offset": 0 
		 	}

		 	this.APIservices.list_all_treatments(body_param, this.headers).subscribe(suc =>{
		 		if(suc.body.data.length == 0){
		 			this.donotLoad = true;
		 		} else {
		 			this.treatmentList = this.treatmentList.concat(suc.body.data);
		 		}
		 		setTimeout(()=>{
		 			this.blockUI.stop();
		 		},this.GLOBAL_MEDIUM_TIMEOUT);

		 	}, err=>{
		 		this.blockUI.stop();
		 		var err_res = JSON.parse(err._body);
		 		this.treatmentList=[];
		 		this.NotificationService.error('Error',err_res.message,{ 
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

	listTreatmentList() {
		if(this.searchtTreatmentString == ""){
			this.pageT = 1;
			this.donotLoad = false;
			this.treatmentList = [];
			this.loadlistTreatmentList();
		}
	}

	searchTreatmentList() {
		if(this.searchtTreatmentString == ""){
			return false;
		}

		this.pageT = 1;
		this.donotLoad = false;
		this.treatmentList = [];
		this.loadlistTreatmentList();
	}

	addTreatmentOpen(data) {
		this.treatmentSearchname=data.name;
		this.selectTreatmentInfoId=data.id;
		this.addTreatment = true;
	}		

	addTreatmentClosed() {
		
		this.addTreatment = false;
	}

	// Add New Treatment In Our Profile
	addTreatmentOurProfile() {
		try{

			if(this.requiredDosage == ""){

				this.formValidation = true;
				return false;
			}

			if(this.selectTreatmentInfoId == ""){
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
				"id" : this.selectTreatmentInfoId,
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
			console.log(err);
		}
	}

}
