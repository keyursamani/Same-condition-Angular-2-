import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $ : any;

@Component({
  selector: 'app-community-condition',
  templateUrl: './community-condition.component.html',
  styleUrls: ['./community-condition.component.css']
})

export class CommunityConditionComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;

	private search_word : string = "";
	private community_condition_list : any = [];
	private condition_list : any = [];
	private page: number = 1;
	private donotLoadData: boolean = false;
	private GLOBAL_MEDIUM_TIMEOUT : number = 1500;
	public dateValue:any = '2018-04-09';

	//constructor
	constructor(private APIservices:SCApi) { 
		super();
	}

	//ngOnInit
	ngOnInit() {
		this.load_community_condition();
	}

	//List all conditions
	load_community_condition(){
		try{
			this.blockUI.start('please wait...');
			this.condition_list = [];
			let data = {
				'search_word' : (this.search_word || ''),
				'sort_by' : '',
				'page' : 1,
				'per_page' : 10,
				'offset' : 0
			}
			this.APIservices.load_community_condition(data,this.headers).subscribe(suc =>{
				if(suc.body.status == 1 || suc.body.status == "1"){
					this.community_condition_list = suc.body.data;
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			  },
			  err=>{
			  	this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while load community condition. Error is ",err_res.message);				
			});
		} catch(e){
			this.blockUI.stop();
			console.log("Error occure while load community condition. Error is ", e);
		}
	}

	//List conditions for suggestions (search)
	list_conditions(){
		try{
			if(this.search_word == ""){

				this.condition_list = "";
				this.load_community_condition();
			} else {

				let data = {
					'search_word' : (this.search_word || "")
				}
				this.APIservices.list_conditions(data,this.headers).subscribe(suc =>{
					if(suc.body.status == 1 || suc.body.status == "1"){
						this.condition_list = suc.body.data;
					}
					setTimeout(()=>{
						this.blockUI.stop();
					},this.GLOBAL_MEDIUM_TIMEOUT);
				  },
				  err=>{
				  	this.blockUI.stop();
					var err_res = JSON.parse(err._body);
					console.error("Error occure while list condition. Error is ",err_res.message);				
				});
			}
		} catch(e){
			console.error("Error occure while list condition. Error is ", e);
		}
	}

	//select condition from list
	select_condition(condition){
		try{
			this.search_word = "";
			this.search_word = (condition["name"] || "");
			this.condition_list = [];
		} catch(e){
			console.error("Error occure while select condition. Error is ", e);
		}
	}

	//List all conditions
	load_more_community_condition(){
		try{
			this.blockUI.start('please wait...');
			this.condition_list = [];
			let data = {
				'search_word' : '',
				'sort_by' : '',
				'page' : this.page,
				'per_page' : 10,
				'offset' : 0
			}
			this.APIservices.load_community_condition(data,this.headers).subscribe(suc =>{
				if(suc.body.status == 1 || suc.body.status == "1"){
					if(suc.body.data.length==0){
						this.donotLoadData = true;
					} else{
						this.community_condition_list = this.community_condition_list.concat(suc.body.data);
					}
				}
				setTimeout(()=>{
					this.blockUI.stop();
				},this.GLOBAL_MEDIUM_TIMEOUT);
			  },
			  err=>{
			  	this.blockUI.stop();
				var err_res = JSON.parse(err._body);
				console.error("Error occure while load community condition. Error is ",err_res.message);				
			});
		} catch(e){
			this.blockUI.stop();
			console.log("Error occure while load community condition. Error is ", e);
		}
	}

	onScrollDown(){
		try{
			if(!this.donotLoadData && this.search_word == ""){
				console.log("scrolled...");
				this.page++;
				this.load_more_community_condition();
			}			
		} catch(e){

		}
	}

	getDate(e){
		console.log('Date', e);
	}

}
