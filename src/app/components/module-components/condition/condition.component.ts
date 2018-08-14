import { Component, OnInit, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {SCNotificationsRemindersService} from '../../common-components/services/notifications-reminders.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var jQuery : any;
declare var $ : any;

@Component({
  selector: 'aq-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})

export class ConditionComponent extends HeadersProvider implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  private userProfile: any;
  private NoCondition:boolean = false;
  private conditionFilterId: number = 0;
  private myConditionFilterList: any = [];
  private conditionfilter: string = "";
  private deleteConditionInfo: any = [];
  private pageT :number = 1;
  private blank :string = "";
  private EDITCOMINGDATASTATUS : string = "";
  private editMyconditionStatus : boolean;
  private deleteCondition : any ;
  private showMycondition: any = [];
  private donotLoad : boolean = false;
  private showMyconditiontimeline: any = [];
  private myStoryConditionBlock : any;
  private myStoryConditionBlock1 : any;
  private myAddConditionBlock : any ;
  private myAddConditionBlock1 : any ;
  private selectedMycondtion: any = [];
  private been_diagnosedSelect: string = "false";
  private diagnosis_date2 : any = "";
  private EDITSIDsTa :number;

  //  Symptoms objects
  private submitsymptom_date: string = "";
  private savedID : number;
  private dummyselectedMycondtion : any;
  private symptoms_month: string = "";
  private symptoms_day: string = "";
  private symptoms_year: string = "";
  private firstSymptomsDescription: string = "";
  private firstSymptomsnotice: boolean = false;
  private symptoms_manyprovider: string = "";
  private is_symptoms_manyprovider: boolean;
  private symptoms_second_opinion: string = "";
  private been_diagnosed	: boolean = false;
  private been_diagnosed1	: boolean = false;
  private had_this_disease: string = "";
  private diagnosis_date: string = "";
  private diagnosedDescription: string = "";
  private diagnosed_year: string = "";
  private diagnosed_month: string = "";
  private diagnosed_day:string = "";
  private addNewcondition: string = "";
  private editstatus : string = "";
  private editCondition :any;
  private diagnosed_date: any = "";
  private currentDate: any = new Date();
  private NoConditionTimeLine:boolean = true;
  private searchString: boolean = false;
  private searchList:boolean = false;
  private editconditonDATAALl :any = [];
  private searchConditionList: any = [];
  private searchConditionString: string = "";
  private myconditionDiagnosed : any ;
  private myconditionDiagnosed1 : any ;
  private submitdiagnosed_date: string = "";
  private conformationOf : string = "";

  private formValidation : boolean = false;
  private showAddPanel:boolean = false;
  private addNewExperience : string = "";
  public didnotNotice : boolean = false;
  private formValidationoption:boolean=false;    
  public dateValue:any = '';
  private set_new_experience: boolean = false;

  public symptoms_date1: any;
  public symptoms_date : any;

  isUpdateRecord : boolean = false;

  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService, 
    private scNotificationsRemindersService: SCNotificationsRemindersService,
    private renderer: Renderer2
    ) {
    super();
    this.userProfile = {
      "first_name" : ""
    }
    this.searchList = false;
  }

  ngOnInit() {

    this.myStoryConditionBlock = document.getElementById('storyLabel');
    this.myStoryConditionBlock1 = document.getElementById('storyTextarea');

    this.myAddConditionBlock = document.getElementById('searchCondition');
    this.myAddConditionBlock1 = document.getElementById('enterNameCondition');
    this.myconditionDiagnosed = document.getElementById('diagnosed_yes');
    this.editCondition = document.getElementById('EDITConditionModal');
    
    //  Symptoms objects
    this.getLoginuserProfile();
    this.loadMyconditionsfilter();
    this.loadMyconditions();
    this.loadMyconditionsTimeline();
    this.EDITCOMINGDATASTATUS = localStorage.getItem("editconditionDATASTATUS");
    if(this.EDITCOMINGDATASTATUS=='true'){
      this.editconditonDATAALl = JSON.parse(localStorage.getItem("editconditionDATA"));
      this.EditConditionsnew(this.editconditonDATAALl);
    }
  }

  // Get User Profile
  getLoginuserProfile(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.get_patient_profile({}, this.headers).subscribe(suc =>{
        this.userProfile=suc.body.data;
        this.blockUI.stop();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while get login user profile. Error is ', err);
    }
  }

  // Load My condition List
  loadMyconditions(){
    this.pageT = 1;
    this.donotLoad = false;

    this.blockUI.start('please wait...');
    try{
      let body_param = {
        "my_condition_id": this.conditionFilterId,
        "page" : 1,
        "per_page": 10,
        "offset": 0
      };

      this._APIservices.get_api_conditions(body_param, this.headers).subscribe(suc =>{
        this.showMycondition = suc.body.data;
        
        //this.showMycondition = this.dynamicSort(suc.body.data, 'date_of_first_symptom');
        this.setConditionVisibility();
        if(this.showMycondition.length>0){
          this.NoCondition = false;
        }

        this.editstatus = localStorage.getItem('editcondition');
        if(this.editstatus == 'true'){
          this.savedID = JSON.parse(localStorage.getItem('editconditionId'));
        }
        this.blockUI.stop();
        }, err=>{
          this.blockUI.stop();
          var err_res = JSON.parse(err._body);
          this.notificationService.error('Error',err_res.message, { 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
      });
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while load condition. Error is ', err);
    }
  }

  loadMOREMyconditions(){
    this.pageT++;
    try{
      let body_param = {
        "my_condition_id": this.conditionFilterId,
        "page" : this.pageT,
        "per_page": 10,
        "offset": 0
      };
      this._APIservices.get_api_conditions(body_param, this.headers).subscribe(suc =>{
        if(suc.body.data.length==0){
          this.donotLoad = true;
        } else{
          this.showMycondition = this.showMycondition.concat(suc.body.data);
          this.setConditionVisibility();
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
    } catch(err){
      console.log('Error occure while load more condition. Error is ', err);
    }
  }

  onScrollDown() {
    if(!this.donotLoad){
    this.loadMOREMyconditions();
    }
  }

  // Load Myconditions  Timeline
  loadMyconditionsTimeline(){
    this.NoConditionTimeLine = true;
    try{
      this.blockUI.start('please wait...');
      let body_param = {
        "filter": this.conditionFilterId,
        "page" : 1,
        "per_page": 10,
        "offset": 0
      };
      this._APIservices.get_api_conditiontimeline(body_param, this.headers).subscribe(suc =>{
        this.showMyconditiontimeline=suc.body.data;
        this.blockUI.stop();
        this.setUserVisibility();
        if(this.showMyconditiontimeline.length==0){
          this.NoConditionTimeLine = false;
        }
        }, err=>{
          this.blockUI.stop();
          var err_res = JSON.parse(err._body);
          this.notificationService.error('Error', err_res.message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
       });
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while load condition timeline. Error is ', err);
    }
  }

  // Load My Condition Filter
  loadMyconditionsfilter(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.get_mycondition_filter({}, this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.myConditionFilterList = suc.body.data;
        }
        this.blockUI.stop();
      }, err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while load condition filter. Error is ', err);
    }
  }

  // Delete My Condition
  deleteMycondition(){
    try{

      this.blockUI.start('please wait...');
      $('#deleteConditionModal').modal('hide');
      let data= {
        'id' :Number(this.deleteConditionInfo.id)
      }
      this._APIservices.delete_myconditions(data, this.headers).subscribe(suc =>{
        if(suc.body.status==1 || suc.body.status=="1"){
          this.conditionFilterId=0;          
          //this.deleteConditionClosed();
          this.loadMyconditions();
          this.loadMyconditionsfilter();
          this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
          this.loadMyconditionsTimeline();          
        }
        this.blockUI.stop();
      }, err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while delete condition. Error is ', err);
    }
  }

  // Condition Visibility Update
  conditionVisibility(status,my_condition_id){
    try{
      let data={
        'my_condition_id':my_condition_id,
        'data' : {'visibility' : status}
      }

      this._APIservices.update_timeline_visibility(data, this.headers).subscribe(suc  =>{
        if(suc.body.status==1 || suc.body.status=="1"){
          this.loadMyconditionsTimeline();
        }
      }, err=>{
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      console.log('Error occure while condition visibility. Error is ', err);
    }
  }

  // Select Date
  onDateChanged(event){
    this.didnotNotice = false;
    if(event.epoc==0){
      this.symptoms_date="";
      this.submitsymptom_date="";
    }else{
        this.symptoms_date = (moment(event).format('YYYY/MM/DD'));
        this.submitsymptom_date=moment(event).format('YYYY/MM/DD');
    }
  }

  // Select Diagnose Date
  onDateChangeddiagnose(event){
    if(event.epoc==0){
      this.diagnosed_date="";
    }else{
        this.diagnosis_date = moment(event).format('YYYY/MM/DD');
        this.diagnosis_date2 = moment(event).format('YYYY/MM/DD');
        this.submitdiagnosed_date=moment(event).format('YYYY/MM/DD');
    }
  }

  createJourneyObject(){
    try{
      this.blockUI.start('please wait...');
      if(this.symptoms_second_opinion == "dontknow"){
        this.symptoms_second_opinion = "";
      }

      if(this.had_this_disease == "dontknow"){
        this.had_this_disease = "";
      }

      let oJourney = {
        //'date_of_first_symptom': this.symptoms_date == null ? '' : moment(this.symptoms_date).format('YYYY/MM/DD'),
        'date_of_first_symptom': this.didnotNotice == true ? null : moment(this.symptoms_date).format('YYYY/MM/DD'),
        'diagnosis_date': this.been_diagnosedSelect == "false" ? "" : this.diagnosis_date == null ? '' : moment(this.diagnosis_date).format('YYYY/MM/DD'),
        'been_diagnosed': this.been_diagnosed == undefined ? false : this.been_diagnosed.toString(),
        'healthcare_provider_diagnosed': this.been_diagnosedSelect == "false" ? "" : (this.diagnosedDescription || ""),
        'number_of_healthcare_providers': this.been_diagnosedSelect == "false" ? "" : (this.symptoms_manyprovider || ""),
        'second_opinion': this.been_diagnosedSelect == "false" ? "" : (this.symptoms_second_opinion.toString() || ""),
        'had_this_disease': this.had_this_disease == undefined ? false : this.had_this_disease.toString(),
      }
      let data = {
        'id':Number(this.selectedMycondtion.id),
        'data' : oJourney
      }

      if(this.editMyconditionStatus){        
        this.updateCondition(data);
      } else{
        this.addCondition(data);
      }
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while add condition. Error is ", e);
    }
  }

  addCondition(data){
    try{
      this._APIservices.add_new_condition(data, this.headers).subscribe(res =>{
        $("#conditionStep3Modal").modal('hide');
        if(res.body.status==1 || res.body.status=="1"){
          this.loadMyconditions();
          this.loadMyconditionsTimeline();
          this.loadMyconditionsfilter();
          this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
          this.editMyconditionStatus = false;          
        }
        this.blockUI.stop();
        
      }, err=>{
          this.blockUI.stop();
          var err_res = JSON.parse(err._body);
          this.notificationService.error('Error',err_res.message, { 
            timeOut: 2000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
      });
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while add condition. Error is ", e);
    }
  }

  updateCondition(data){
    try{

      this._APIservices.edit_new_condition(data, this.headers).subscribe(res =>{
        $("#conditionStep3Modal").modal('hide');
        if(res.body.status == 1 || res.body.status == "1"){
          this.editMyconditionStatus = false;
          this.conditionFilterId=0;
          this.loadMyconditions();
          this.loadMyconditionsTimeline();
          this.loadMyconditionsfilter();  
          localStorage.removeItem("editconditionDATA");                 
        }
        this.blockUI.stop();

      },err=>{
          this.blockUI.stop();
          var err_res = JSON.parse(err._body);
          this.notificationService.error('Error', err_res.message,{
            timeOut: 2000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        });
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while update condition. Error is ", e);
    }
  }


  myConditionFilter(conditionId: number){
    this.conditionFilterId=conditionId;
    this.loadMyconditions();
    this.loadMyconditionsTimeline();
  }

  // Search My Condition
  searchMycondition(searchStrign: string){
    try{
      if(searchStrign.length > 0){
        let data={
       'searchstring':searchStrign
      }

      this._APIservices.search_mycondition(data, this.headers).subscribe(suc =>{
        if(suc.body.status==1 || suc.body.status=="1"){
          this.searchString=false;
          //this.searchList=false;
          this.selectedMycondtion=[];
          this.searchConditionList=suc.body.data;
          if(this.searchConditionList.length==0){
            this.searchList=true;
          }
        }
        }, err=>{
          this.searchString=true;
          this.searchConditionList=[];
          var err_res = JSON.parse(err._body);
          this.notificationService.error('Error', err_res.message, { 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        });
      } else{
        this.searchString = false;
        this.searchConditionList = [];
      }
    }catch(err){
      console.log('Error occure while search connection. Error is ', err);
    }
  }

  addConditionsOpen(){
    this.isUpdateRecord = false;
    this.editMyconditionStatus = false;
    this.searchConditionString = "";
    this.searchList = false;
    this.been_diagnosed = undefined;

    this.firstSymptomsDescription="";
    this.been_diagnosedSelect = 'false';
    this.had_this_disease=undefined;
    this.firstSymptomsnotice=undefined;
    this.symptoms_manyprovider="";
    this.symptoms_second_opinion=undefined;
    this.diagnosis_date="";
    this.selectedMycondtion="";
    this.diagnosedDescription="";
    this.symptoms_manyprovider="";
    this.symptoms_date="";
    this.diagnosed_date="";
    this.symptoms_date1="";
    this.blank = 'false';
    //this.addConditions.style.display = "block";

    $("#addConditionModal").modal('show');
    this.myAddConditionBlock1.style.display = "none";
    this.myAddConditionBlock.style.display = "block";
    this.diagnosis_date2 = "";
    this.renderer.addClass(document.body, 'noScroll')

  }

  EditConditionsnew(editData){

    this.isUpdateRecord = true;
    this.editMyconditionStatus = true;
    this.conditionfilter = "";
    if(!editData.my_conditions_journey){
      this.searchConditionString="";
      //this.searchList=false;
      this.been_diagnosed=undefined;
      this.firstSymptomsDescription="";
      //this.been_diagnosedSelect=undefined;
      this.had_this_disease=undefined;
      this.firstSymptomsnotice=undefined;
      this.symptoms_manyprovider="";
      this.symptoms_second_opinion=undefined;
      this.diagnosis_date="";
      this.selectedMycondtion=editData;
      this.diagnosedDescription="";
      this.symptoms_manyprovider="";
      this.symptoms_date="";
      this.diagnosed_date="";
      this.symptoms_date1="";
      this.dummyselectedMycondtion = editData.condition_name;
      this.searchConditionString=editData.condition_name.name;
      //this.conditionStep1.style.display = "block";
      $("#conditionStep1Modal").modal('show');
      return false;
    }

    this.diagnosis_date2 = '';
    this.dummyselectedMycondtion = [];
    this.dummyselectedMycondtion = editData.condition_name;
    this.selectedMycondtion = editData;
    this.editMyconditionStatus = true;
    this.searchConditionString=editData.condition_name.name;
    //this.searchList=false;
    this.EDITSIDsTa = editData.my_conditions_journey.my_condition_id;
    this.been_diagnosed=editData.my_conditions_journey.been_diagnosed;
    this.firstSymptomsDescription="";
    this.been_diagnosedSelect=editData.my_conditions_journey.been_diagnosed;
    this.had_this_disease=editData.my_conditions_journey.had_this_disease;
    if(this.had_this_disease=='null' || this.had_this_disease==null){
      this.had_this_disease = "dontknow";
    }
    else{
      this.had_this_disease = this.had_this_disease.toString();
    }
    this.firstSymptomsnotice=undefined;
    this.symptoms_manyprovider=editData.my_conditions_journey.number_of_healthcare_providers;
    this.symptoms_second_opinion=editData.my_conditions_journey.second_opinion;
    if(this.symptoms_second_opinion=='null' || this.symptoms_second_opinion==null){
      this.symptoms_second_opinion = "dontknow";
    }
    else{
      this.symptoms_second_opinion = this.symptoms_second_opinion.toString();
    }
    this.diagnosis_date=editData.my_conditions_journey.diagnosis_date;
    this.diagnosedDescription=editData.my_conditions_journey.healthcare_provider_diagnosed;
    if(editData.my_conditions_journey.date_of_first_symptom == null){
      this.symptoms_date = "";
      this.didnotNotice = true;
    } else{
      this.didnotNotice = false;
      this.symptoms_date = editData.my_conditions_journey.date_of_first_symptom;
      //this.symptoms_date1 = { date: { month:  new Date(this.symptoms_date).getMonth()+ 1, day:  new Date(this.symptoms_date).getDate(),year: new Date(this.symptoms_date).getFullYear() } };  
      this.symptoms_date1 = (moment(this.symptoms_date).format('MMMM DD, YYYY'));
    }

    $("#conditionStep1Modal").modal('show');
    if(this.diagnosis_date){
      //this.diagnosis_date2 = { date: { month:  new Date(this.diagnosis_date).getMonth()+ 1, day:  new Date(this.diagnosis_date).getDate(),year: new Date(this.diagnosis_date).getFullYear() } }; 
      this.diagnosis_date2 = (moment(this.diagnosis_date).format('MMMM DD, YYYY'));
    } 
  }
  
  CloseEditConditionsnew1(){

    this.editCondition.style.display = "none";
  }

  addConditionsClosed(){
    $("#confirmationModal").modal('show');   
    this.conformationOf = "default"; 
    this.renderer.removeClass(document.body, 'noScroll')

  }

  stepOneFinishLater(){
    try{
      this.blockUI.start('please wait...');
      let data={
        'id':this.selectedMycondtion.id
      }
      this._APIservices.add_new_condition_profile(data, this.headers).subscribe(suc =>{
        this.selectedMycondtion = suc.body.data;
        this.getLoginuserProfile();
        this.loadMyconditionsfilter();
        this.loadMyconditions();
        this.loadMyconditionsTimeline();
        this.blockUI.stop();
      }, err=>{
        var err_res = JSON.parse(err._body);
        console.log("Error occure while finish later. Error is ", err_res);
        this.blockUI.stop();
      });
    } catch(e){
      this.blockUI.stop();
      console.log('Error occure while finish later. Error is ', e);
    }
  }

  onSelectionChange(data){

    this.symptoms_second_opinion = data;
  }

  onSelectionChange1(data){
    this.formValidationoption=false;  
    this.had_this_disease = data;
  }

  conditionStep1Open(){

    //this.clear_date();
    if(this.editMyconditionStatus){
      $("#conditionStep1Modal").modal('show');      
      $("#addConditionModal").modal('hide');
      return false;
    }

    if( this.selectedMycondtion==""){
      this.blank = 'true';
      return false;
    } else {
      $("#conditionStep1Modal").modal('show');          
      $("#addConditionModal").modal('hide');
    }
  }

  add_new_condition_profile(){
    try{

      this.blockUI.start('please wait...');
      let data={
        'id':this.selectedMycondtion.id
      }
      this._APIservices.add_new_condition_profile(data, this.headers).subscribe(suc =>{

        this.loadMyconditionsfilter();
        this.loadMyconditions();
        
        this.selectedMycondtion = suc.body.data; 
        this.myconditionDiagnosed.style.display = "block";
        $("#conditionStep2Modal").modal('show');
        $("#conditionStep1Modal").modal('hide');
        this.formValidation = false;
        this.blockUI.stop();       
      }, err=>{
        $("#conditionStep1Modal").modal('hide');          
        $("#addConditionModal").modal('show');
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message, {
          timeOut: 2000,
          showProgressBar: false,
          pauseOnHover: false,
          clickToClose: false 
        });
        this.blockUI.stop();
      });
    } catch(e){
      console.log("Error occure while add new condition to profile. Error is ", e);
    }
  }

  conditionStep1Closed(){
    this.conformationOf = "Step1"
    $("#confirmationModal").modal('show');    
    this.renderer.removeClass(document.body, 'noScroll')

  }

  conditionStep1ClosedFL(){
    this.conformationOf = "FL"
    $("#confirmationModal").modal('show');
    this.renderer.removeClass(document.body, 'noScroll')   
  }

  stepTwoFinishLater1(){
    try{
      this.blockUI.start('please wait...');
      let data={
        'id':this.selectedMycondtion.id
      }

      this._APIservices.add_new_condition_profile(data, this.headers).subscribe(suc =>{
        this.selectedMycondtion = suc.body.data;
        this.stepTwoFinishLater2();
        this.blockUI.stop();
      }, err=>{
        var err_res = JSON.parse(err._body);
        console.log("Error occure while finish later. Error is ", err_res);
        this.blockUI.stop();
      });
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while finish step two. Error is ", e);
    }
  }

  stepTwoFinishLater2(){
    try{

      this.createJourneyObject();
    } catch(e){
      console.log("Error occure while saving date of first symptoms. Error is ", e);
    }
  }

  conditionStep2Open(){
    localStorage.setItem("editconditionDATASTATUS",'false');
    if(this.symptoms_date == "" && this.didnotNotice == false){
      this.formValidation = true;
      return false;
    }else{
      if(!this.editMyconditionStatus){
        this.add_new_condition_profile();
      } else {
        this.formValidation = false;
        this.myconditionDiagnosed.style.display = "block";
        $("#conditionStep2Modal").modal('show');
        $("#conditionStep1Modal").modal('hide');        
      }
    }
  }

  conditionStep2Closed(){
    this.conformationOf = "Step2"    
    $("#confirmationModal").modal('show');
    this.renderer.removeClass(document.body, 'noScroll')
  }

  conditionStep2ClosedFL(){
    this.conformationOf = "Step2FL"
    $("#confirmationModal").modal('show');
    this.renderer.removeClass(document.body, 'noScroll')    
  }

  updateDiagnoseSelection(selection){
    this.been_diagnosed=selection;
    this.been_diagnosedSelect=selection.toString();
    this.formValidation = false;
  }

  conditionStep4Open(){

    if(this.been_diagnosed == undefined){
      this.formValidation = true;
      return false;
    }

    if(this.been_diagnosed == true){

      if(this.diagnosedDescription == "") {
        this.formValidation = true;
        return false;
      }

      if(this.diagnosis_date2 == "" || this.diagnosis_date2  == null){
        this.formValidation = true;
        return false;
      }

      if(this.symptoms_manyprovider == "" && !this.is_symptoms_manyprovider){
        this.formValidation = true;
        return false;
      }

      if(this.symptoms_second_opinion=="" || this.symptoms_second_opinion==null || this.symptoms_second_opinion == undefined){
        this.formValidation = true;
        return false;  
      }

      if(this.symptoms_manyprovider=="" && this.is_symptoms_manyprovider == true) {
        this.symptoms_manyprovider = '0';
      }
    }

    $("#conditionStep3Modal").modal('show');
    $("#conditionStep2Modal").modal('hide');
  }

  conditionStep3Close(){
    this.editMyconditionStatus = false;
    $("#conditionStep3Modal").modal('hide');
    this.renderer.removeClass(document.body, 'noScroll')
  }

  conditionStep3CloseFL(){
    try{
      this.editMyconditionStatus = false;
      this.createJourneyObject();
      $("#conditionStep3Modal").modal('hide');
      this.renderer.removeClass(document.body, 'noScroll')
      this.blockUI.stop();
    } catch(e){
      console.log('Error occure while finish condition. Error is ', e);
    }
  }

  conditionStep3Closed(){
    if(this.had_this_disease=='undefined' || this.had_this_disease==undefined){    
      this.formValidationoption=true;
    } else{
      this.createJourneyObject();
      $("#conditionStep3Modal").modal('hide');
      this.renderer.removeClass(document.body, 'noScroll')
    }

    //this.addNewCondition();

  }

  // addNewCondition   "conditionStep1Open" addNewcondition
  addMynewCondition(){
    try{

      this.clear_date();
      if(this.isEmpty(this.addNewcondition)){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      this.searchConditionString = this.addNewcondition;
      let data = {
        'name' :this.addNewcondition
      }

      this._APIservices.manually_add_new_condition(data, this.headers).subscribe(suc=>{
        if(suc.body.status==1 || suc.body.status=="1"){
          this.formValidation = false;
          this.selectedMycondtion=suc.body.data;
          this.searchString=true;
          this.conditionStep1Open();
          this.blockUI.stop();
        }
      },err=>{
        this.formValidation = false;
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message, { 
          timeOut: 2000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while add new connection. Error is ', err);
    }
  }

  selectMycondition(item){
    this.selectedMycondtion=item;
    this.searchConditionString=item.name;
    this.searchString=true;
  }

  deleteConditionOpen(conditioninfo){
    this.deleteConditionInfo=conditioninfo;
    $("#deleteConditionModal").modal('show');
  }

  goStoryCondition(){
    this.myStoryConditionBlock1.style.display = "none";
    this.myStoryConditionBlock.style.display = "block";
  }

  goAddConditionManually(){
    this.symptoms_date="";
    this.symptoms_date1="";
    this.myAddConditionBlock.style.display = "none";
    this.myAddConditionBlock1.style.display = "block";
  }

  goEditConditionManually(){
    this.myAddConditionBlock1.style.display = "block";
    this.editCondition.style.display = "none";
  }

  goSearchAddCondition(){
    this.myAddConditionBlock1.style.display = "none";
    this.myAddConditionBlock.style.display = "block";
  }

  goSearchEditCondition(){
    this.myAddConditionBlock1.style.display = "block";
    this.editCondition.style.display = "none";
  }

  conditionDiagnosedOpen(){
    this.myconditionDiagnosed.style.display = "none";
    // this.myconditionDiagnosed1.style.display = "block";
  }

  conditionDiagnosedClosed(){
    // this.myconditionDiagnosed1.style.display = "none";
    this.myconditionDiagnosed.style.display = "block";
  }

  goStoryConditionEdit(experience){
    if(experience.open==true){
      experience.open=false;
    }else{
      experience.open=true;
    }
  }

  // Update Condition Story
  updateStoryCondition(experience,conditionId){
    try{

      if(experience.experience == ""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      let data={
        'id':conditionId,
        'data' : { 'experience_key':experience.experience_key, 'experience':experience.experience }
      }

      this._APIservices.update_timeline_story(data, this.headers).subscribe(suc=>{
        if(suc.body.status==1 || suc.body.status=="1"){
          experience.open=false;
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
      console.log('Error occure while update story condition. Error is ', err);
    }
  }

  // add Condition Story
  addStoryCondition(experience_key, conditionId){
    try{

      if(this.addNewExperience == ""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      let data={
        'id':conditionId,
        'data' : { 'experience_key':experience_key, 'experience':this.addNewExperience }
      }

      this._APIservices.update_timeline_story(data, this.headers).subscribe(suc=>{
        if(suc.body.status==1 || suc.body.status=="1"){
          this.addNewExperience ='';
          this.loadMyconditionsTimeline();
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
      console.log('Error occure while update story condition. Error is ', err);
    }
  }

  openNewExperience(myDiv, id){
    this.set_new_experience = true;
    try{
      $('#' + myDiv + id).show();
    } catch(e){
      console.log("Error occure while open experience window. Error is ", e);
    }
  }

  closeNewExperience(myDiv, id){
    this.set_new_experience = false;
    try{
      this.formValidation = false;
      $('#' + myDiv + id).hide();
    } catch(e){
      console.log("Error occure while close experience window. Error is ", e);
    }
  }

  setUserVisibility(){
    try{
      if(this.showMyconditiontimeline.length > 0){
        this.showMyconditiontimeline.map((obj, index)=> {
          if(obj.my_conditions_journey.my_conditions_journey_experiences != undefined){
            if(obj.my_conditions_journey.my_conditions_journey_experiences.length > 0){
              obj.my_conditions_journey.my_conditions_journey_experiences.map((obj1, index1)=>{
                if(obj1.experience_key == "date_of_first_symptom"){
                  //$("#symptoms_"+obj.my_conditions_journey.id).val(obj1.visibility);
                  $("#symptoms_"+obj.my_conditions_journey.id).val(obj.my_conditions_journey.visibility);
                } else{
                  //$("#diagnostic_"+obj.my_conditions_journey.id).val(obj1.visibility);
                  $("#diagnostic_"+obj.my_conditions_journey.id).val(obj.my_conditions_journey.visibility);
                }
              })
            }
          }          
        });
      }
    } catch(e){
      console.log("Error occure while set user visibility. Error is ", e);
    }
  }

  checkNumber(event){
    try {
      var k;
      k = event.keyCode ? event.keyCode : event.which;
      this.is_symptoms_manyprovider = false;
      return (k >= 48 && k <= 57 || k == 8 || k==9);
    } catch(e) {
      console.log('Error occure while check number. Error is ', e);
    }
  }

  dynamicSort(data, key){
    try{
       return data.sort(function(a, b) {
         if(a.my_conditions_journey != undefined || a.my_conditions_journey != null){
           var x = a.my_conditions_journey[key];
           var y = b.my_conditions_journey[key];
           return ((x > y) ? -1 : ((x < y) ? 1 : 0));
         }
      });
    } catch(e){
      console.log("Error occure while sort data. Error is ", e);
    }
  }

  setConditionVisibility(){
    try{
      if(this.showMycondition.length > 0){
        this.showMycondition.map((obj, index)=> {
          if(obj.my_conditions_journey != undefined){
            $("#select_visibility_"+obj.id).val(obj.my_conditions_journey.visibility);
          }
        });
      }
    } catch(e){
      console.log("Error occure while set condition visibility. Error is ", e);
    }
  }

  noHide(conformationOf){
    $("#confirmationModal").modal('hide');
    if(conformationOf == "default")
    {        
      $("#addConditionModal").modal('show');
    }
    else if(conformationOf == "Step1" || conformationOf == "FL")
    {
      $("#conditionStep1Modal").modal('show');
    }
    else if(conformationOf == "Step2" || conformationOf == "Step2FL")
    {      
      $("#conditionStep2Modal").modal('show');     
    }
  }

  yesdelete(conformationOf){
    $("#confirmationModal").modal('hide'); 
    this.searchString = false;
    this.searchConditionList = [];   
    if(conformationOf == "default")
    {
      this.blank = 'false'
      this.editMyconditionStatus = false;
      /*if(this.isUpdateRecord == false){
        this.isUpdateRecord = false;
        this.stepOneFinishLater();
      }*/
      $("#addConditionModal").modal('hide');
    }
    else if(conformationOf == "Step1")
    {
      localStorage.setItem("editconditionDATASTATUS",'false');
      this.editMyconditionStatus = false;
      $("#conditionStep1Modal").modal('hide');
    }
    else if(conformationOf == "FL")
    {
      this.editMyconditionStatus = false;
      $("#conditionStep1Modal").modal('hide');
      if(this.isUpdateRecord == false){
        this.isUpdateRecord = false;
        if(this.symptoms_date == '' || this.symptoms_date == undefined){
          this.stepOneFinishLater();
        } else{
          this.stepTwoFinishLater1();
        }
      }
    }
    else if(conformationOf == "Step2")
    {      
      this.editMyconditionStatus = false;      
      $("#conditionStep2Modal").modal('hide');
      this.formValidation = false;
    }
    else if(conformationOf == "Step2FL")
    {      
      this.editMyconditionStatus = false;
      $("#conditionStep2Modal").modal('hide');
      if(this.been_diagnosed == true){
        this.been_diagnosed = undefined;
        this.been_diagnosedSelect = "false";
        this.had_this_disease = undefined;
        this.createJourneyObject();
      }else{
        this.createJourneyObject();
      }
      
    }
  }

  clear_date(){
    if (this.symptoms_date1 === '') {
      this.symptoms_date1 = null;
    } else {
      this.symptoms_date1 = '';
    }
  }

}
