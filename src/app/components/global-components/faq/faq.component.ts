import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent extends HeadersProvider implements OnInit {

	@BlockUI() blockUI: NgBlockUI;

	private formValidation:boolean = false;
  private listFaq:any = [];
  private search_word:string = "";
  private isQuestionSubmitted:boolean = false;
  private noDataFound:boolean = false;
	private faq : any  = [];

	//constructor
	constructor(private APIservices : SCApi, private NotificationService : NotificationsService) {
		super();
    this.faq = {
      "email_address" : "",
      "subject" : "",
      "description" : ""
    }
  }

  //ngOnInit
	ngOnInit() {
		this.listAllFaqs();
	}

	//List all FAQs
	listAllFaqs(){
		try{
			this.blockUI.start('please wait...');
      this.noDataFound = false;     
			let data = {};
			this.APIservices.get_faqs(data, this.headers).subscribe(res=>{
				if(res.body.status == "1" || res.body.status == 1){
					this.listFaq = res.body.data;
          //window.prompt('this.listFaq', JSON.stringify(this.listFaq));
				}
				this.blockUI.stop();
          }, err=>{
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
			console.log("Error occure while get faq list. Error is ", e);
		}
	}

	//Search FAQs
	searchFaqs(){
		try{

			if(this.search_word == ""){
				this.formValidation = true;
				return false;
			}

      this.blockUI.start('please wait...');
      let data = {
        "search_word" : this.search_word
      };

			this.APIservices.get_faqs(data, this.headers).subscribe(res=>{  				
				if(res.body.status == "1" || res.body.status == 1){
          //window.prompt('data', JSON.stringify(res.body.data));
          let arrData = [];
          res.body.data.map((obj, index)=>{
            if(obj.faqs == undefined || obj.faqs == null){
              let arrFaqs = [];
              var faqs = {
                'id' : 0,
                'title' : (obj.title || ''),
                'description' : (obj.description || ''),
                'faq_sub_category_id' : 0
              }
              arrFaqs.push(faqs)
              let oData = {
                'name' : (obj.faq_sub_category.name || ''),
                'faqs' : arrFaqs
              }
              arrData.push(oData);
            }
          });

          if(arrData.length > 0){
					  this.listFaq = arrData;
          } else{
            this.noDataFound = true;
          }
				}
				this.blockUI.stop();
      }, err=>{
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
			console.log("Error occure while search faq. Error is ", e);
		}
	}

	//Submit a request
	addFaqs(){
		try{

			if(this.faq.email_address == ""){
				this.formValidation = true;
				return false;
			}

			if(this.faq.subject == ""){
				this.formValidation = true;
				return false;
			}

			if(this.faq.subject.length > 50){
				return false;
			}

			if(this.faq.description == ""){
				this.formValidation = true;
				return false;
			}

			if(this.faq.description.length < 3){
				return false;
			}
			
			if(this.faq.description.length > 2200){
				return false;
			}

			var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		if (!EMAIL_REGEXP.test(this.faq.email_address)) {
			this.formValidation = true;
				return false;
		}

		this.blockUI.start('please wait...');
		let data = {
			'data' : this.faq
		}
		this.APIservices.post_faqs(data, this.headers).subscribe(res=>{
			if(res.body.status == "1" || res.body.status == 1){
				this.formValidation=false;
				this.faq = {};
          		this.NotificationService.success('FAQ', "Faq submitted successfully.",{ 
                	timeOut: 3000, 
                	showProgressBar: false, 
                	pauseOnHover: false, 
                	clickToClose: false 
	            });
              this.isQuestionSubmitted = true;
	            this.blockUI.stop();
        		}}, err=>{
        			this.blockUI.stop();
          		var err_res = JSON.parse(err._body);
              	console.log(err_res);
                this.NotificationService.error('Error', err_res.message,{ 
                	timeOut: 3000, 
                	showProgressBar: false, 
                	pauseOnHover: false, 
                	clickToClose: false 
                });
         	});
			
		} catch(e){
			this.blockUI.stop();
			console.log("Error occure while add faqs. Error is ", e);
		}
	}

  resetPage(){
    try{
      this.noDataFound = false;
      this.formValidation = false;
      this.isQuestionSubmitted = false;
      this.faq = {
        "email_address" : "",
        "subject" : "",
        "description" : ""
      }
    } catch(e){
      console.log("Error occure while reset page. Error is ", e);
    }
  }

  refreshPage(event){
    if(this.search_word == ""){
      this.listAllFaqs();
    }
  }

}
