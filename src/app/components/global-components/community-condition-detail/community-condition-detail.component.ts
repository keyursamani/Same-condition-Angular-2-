import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CalanderComponent } from '../calander/calander.component';

declare var $ : any;

@Component({
  selector: 'app-community-condition-detail',
  templateUrl: './community-condition-detail.component.html',
  styleUrls: ['./community-condition-detail.component.css']
})

export class CommunityConditionDetailComponent extends HeadersProvider implements OnInit {
	@BlockUI() blockUI: NgBlockUI;

	private conditionId : number = 0;
	private condition_details : any = [];
	private patients_when_diagnosed : any = [];
	private patients_when_exp_diagnosed : any = [];
	private patient_symptoms : any = [];
	private patients_log_list : any = [];
	private GLOBAL_MEDIUM_TIMEOUT : number = 1500;

	//constructor
	constructor(private APIservices:SCApi, private router : Router, private activatedRoute : ActivatedRoute) {
		super(); 
		this.condition_details = {
			'sex' : {
				'male' : '',
				'female' : ''
			},
			'patients_when_diagnosed' :{
				"less_than_19": 0,
			    "between_20_to_29": 0,
			    "between_30_to_39": 0,
			    "between_40_to_49": 0,
			    "between_50_to_59": 0,
			    "between_60_to_69": 0,
			    "between_70_to_79": 0,
			    "between_80_to_89": 0,
			    "more_than_90": 0
			},
			'patients_when_exp_diagnosed' :{
				"less_than_19": 0,
			    "between_20_to_29": 0,
			    "between_30_to_39": 0,
			    "between_40_to_49": 0,
			    "between_50_to_59": 0,
			    "between_60_to_69": 0,
			    "between_70_to_79": 0,
			    "between_80_to_89": 0,
			    "more_than_90": 0
			}
		}
	}

	//ngOnInit
	ngOnInit() {
		this.activatedRoute.params.subscribe((params : Params) => {
  			this.conditionId = params['id'];
  			this.get_condition_details_by_id();
  		});
	}

	//View (Overview) of Condition
	get_condition_details_by_id(){
		try{
			this.blockUI.start('please wait...');
			let data = {
				'id' : (this.conditionId || 0)
			}
			this.APIservices.get_condition_details_by_id(data, this.headers).subscribe(suc =>{
				if(suc.body.status == 1 || suc.body.status == "1"){
					this.condition_details = suc.body.data;
					//window.prompt('condition_details', JSON.stringify(this.condition_details));
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			}, err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while get condition details by id. Error is ",err_res.message);
			});
		} catch(e){
			console.log("Error occure while get condition details by id. Error is ", e);
		}
	}

	//View Common Symptoms
	view_common_symptoms(){
		try{
			this.blockUI.start('please wait...');
			let data = {
				'id' : (this.conditionId || 0)
			}
			this.APIservices.view_common_symptoms(data, this.headers).subscribe(suc =>{
				if(suc.body.status == 1 || suc.body.status == "1"){
					this.patient_symptoms = suc.body.data;
					//window.prompt('patient_symptoms ', JSON.stringify(this.patient_symptoms ));
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			}, err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while view common symptoms. Error is ",err_res.message);
			});
		} catch(e){
			this.blockUI.stop();
			console.error("Error occure while view common symptoms. Error is ", e);
		}
	}

	//List of treatments taken
	treatments_taken(){
		try{
			this.blockUI.start('please wait...');
			let data = {
				'id' : (this.conditionId || 0)
			}
			this.APIservices.treatments_taken(data, this.headers).subscribe(suc =>{
				//window.prompt('suc', JSON.stringify(suc));
				if(suc.body.status == 1 || suc.body.status == "1"){
					
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			}, err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while get traetment taken. Error is ",err_res.message);
			});
		} catch(e){
			console.error("Error occure while get traetment taken. Error is ", e);
		}
	}

	//List Patients Log
	patients_logs(){
		try{
			this.blockUI.start('please wait...');
			let data = {
				'id' : (this.conditionId || 0)
			}
			this.APIservices.patients_logs(data, this.headers).subscribe(suc =>{
				if(suc.body.status == 1 || suc.body.status == "1"){
					this.patients_log_list = suc.body.data;
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			}, err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while get patient logs. Error is ",err_res.message);
			});
		} catch(e){
			console.error("Error occure while get patient logs. Error is ", e);
		}
	}

	//View Condition's patients list gender wise
	patients_gender_wise(gender){
		try{
			this.blockUI.start('please wait...');
			let data = {
				'id' : (this.conditionId || 0),
				'gender' : gender
			}
			this.APIservices.patients_gender_wise(data, this.headers).subscribe(suc =>{
				//window.prompt('suc', JSON.stringify(suc));
				if(suc.body.status == 1 || suc.body.status == "1"){
					
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			}, err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while get patient logs by gender. Error is ",err_res.message);
			});
		} catch(e){
			console.error("Error occure while get patient logs by gender. Error is ", e);
		}
	}

	//View Condition's patients list Diagnose/Non-Diagnosed
	patients_diagnosed_non_diagnosed(is_diagnosed){
		try{
			this.blockUI.start('please wait...');
			let data = {
				'id' : (this.conditionId || 0),
				'is_diagnosed' : is_diagnosed
			}
			this.APIservices.patients_gender_wise(data, this.headers).subscribe(suc =>{
				//window.prompt('suc', JSON.stringify(suc));
				if(suc.body.status == 1 || suc.body.status == "1"){
					
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			}, err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while get patient diagnosed logs. Error is ",err_res.message);
			});
		} catch(e){
			console.error("Error occure while get patient diagnosed logs. Error is ", e);
		}
	}

	//View Condition's patients When Diagnose/ When experience Diagnosed
	patients_when_diagnosed_or_exp_diagnosed(diagnosed, age_range){
		try{
			this.blockUI.start('please wait...');
			let data = {
				'id' : (this.conditionId || 0),
				'diagnosed' : diagnosed,
				'age_range' : age_range
			}
			this.APIservices.patients_when_diagnosed_or_exp_diagnosed(data, this.headers).subscribe(suc =>{
				//window.prompt('suc', JSON.stringify(suc));
				if(suc.body.status == 1 || suc.body.status == "1"){
					
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			}, err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while get patient diagnosed logs. Error is ",err_res.message);
			});
		} catch(e){
			console.error("Error occure while get patient diagnosed logs. Error is ", e);
		}
	}

	//Follow user
	follow(id) {
		try{
			this.blockUI.start('please wait...');
			let data = {
				"follower_id" : id,
			}
			this.APIservices.follows(data, this.headers).subscribe(suc =>{
				//window.prompt('suc', JSON.stringify(suc));
				if(suc.body.status == 1 || suc.body.status == "1"){
					this.patients_logs();
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			},err=>{
				this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while following. Error is ",err_res.message);
			});
		}catch(err){
			this.blockUI.stop();
			console.error("Error occure while following. Error is ",err);
		}
	}
}
