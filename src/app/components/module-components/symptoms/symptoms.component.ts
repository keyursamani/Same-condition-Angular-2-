import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
//import {IMyDpOptions} from 'mydatepicker';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
//import { DatepickerOptions } from 'ng2-datepicker';
import * as en from 'date-fns/locale/fr';
import * as enLocale from 'date-fns/locale/en';
import {getYear} from 'date-fns';

declare var $ : any;
declare var jQuery : any;

@Component({
  selector: 'aq-symptoms',
  templateUrl: './symptoms.component.html',
  styleUrls: ['./symptoms.component.scss']
})

export class SymptomsComponent extends HeadersProvider implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  private deleteSymptoms : any ;
  private updateSymptoms : any ;
  private updateSympStep1 : any ;
  private updateSympStep2 : any ;
  private updateSympStep3 : any ;
  private updateStepOneBtn : any ;
  private updateStepTwoBtn : any ;
  private updateStepThreeBtn : any ;
  private addSympStep1 : any ;
  private addSympStep2 : any ;
  private addSympStep3 : any ;
  private addStepOneBtn : any ;
  private addStepTwoBtn : any ;
  private addStepThreeBtn : any ;
  private SymptomsSearchname: string = "";
  private symptomsList:any = [];
  private searchtSymptomsString: boolean;
  private selectSymptomsInfo:any = [];
  private newSymptomsName: string = "";
  private NewSymtId:any = "";
  private conditionList: any = [];
  private selectedDate: any = "";
  private selectDate: any = "";
  private visibility: string = "all_users";
  private selectedsevere: string = "";
  private addsymptomDontknow: boolean = false;
  private addsymptomcondition: string = "";
  private symptomIsTracklist:any = [];
  private symptomUnTracklist:any = [];
  private sortBy: string = "newest_to_oldest";
  private deleteSymptomId: number;
  private IstrackPage: number = 1;
  private UntrackPage: number = 1;
  private searchtTreatmentString: boolean = false;
  private treatmentList: any = [];
  private treatmentInfo: any = [];
  private selectedSymptopid: number;
  private treatmentSearchname: string = "";
  private selectedAddoption: string = "";
  private selectedupdateSeverity: string = "";
  private updateSymptomCount: number = 0;
  private tempUpdateSymptoms: any = [];
  private stopSymptomTracking: boolean = undefined;
  private currentDate:any = new Date();;
  private symptomStatus: string = "current";
  private deleteTreatmentConfirm: any;
  private dayList:any;
  private monthList:any;
  private yearList:any;
  private formValidation  : boolean = false;  
  private GLOBAL_MEDIUM_TIMEOUT : number = 1500;
  private is_next_step: boolean = false;
  private datePlaceholder: string = 'Select your date';
  private selected_symptom: string = "";
  private trackingType : string = "stop";
  private isEditMode : boolean = false;
  private my_symptom_id : number = 0;
  private sevirity_id : number = 0;
  private my_sevirity : string = 'none';
  private my_symptom_severities : any = [];
  private severity_date : any = new Date();
  private symptom_name : string = "";
  private chooseSevirity : string = ""
  private date : any;
  private birthDate : any = Date();
 
  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService
    ) {
    super();
  }

  ngOnInit() {
    this.updateSympStep1 = document.getElementById('symptomsOne');
    this.updateSympStep2 = document.getElementById('symptomsTwo');
    this.updateSympStep3 = document.getElementById('symptomsThree');
    this.updateStepOneBtn = document.getElementById('stepOneBtn');
    this.updateStepTwoBtn = document.getElementById('stepTwoBtn');
    this.updateStepThreeBtn = document.getElementById('stepThreeBtn');
    this.addSympStep1 = document.getElementById('addStepOne');
    this.addSympStep2 = document.getElementById('addStepTwo');
    this.addSympStep3 = document.getElementById('addStepThree');
    this.deleteTreatmentConfirm = document.getElementById('deleteTreatmentConfirm');

    this.loadSymptomCondition();
    this.loadSymptomList();
    this.loadSymptomUntrackList();
  }

  deleteSymptomsOpen(symptom){
    this.selected_symptom = symptom.symptom_name.name;
    this.deleteSymptomId = symptom.id;
    $("#deleteSymptomsOpen").modal("show");
  }

  moodSwingOpen(symptomId: number,addoption:string){
    this.treatmentSearchname = "";
    this.selectedAddoption = "";
    this.selectedAddoption = addoption;
    this.selectedSymptopid = symptomId;
    $("#moodSwingModel").modal('show');
  }

  updateSymptomsOpen(){
    this.symptom_name = this.symptomIsTracklist[0].symptom_name.name;
    this.selectedupdateSeverity = this.symptomUnTracklist;
    this.updateSymptomCount = 0;
    this.tempUpdateSymptoms = [];
    this.stopSymptomTracking = undefined;
    $("#updateAllSymptoms").modal('show');
  }

  updateSympStepTwo(){
    this.updateStepThreeBtn.style.display = "none";
    this.updateStepOneBtn.style.display = "none";
    this.updateStepTwoBtn.style.display = "block";
    this.updateSympStep1.style.display = "none";
    this.updateSympStep3.style.display = "none";
    this.updateSympStep2.style.display = "block";
  }

  updateSympStepThree(){
    this.updateStepOneBtn.style.display = "none";
    this.updateStepTwoBtn.style.display = "none";
    this.updateStepThreeBtn.style.display = "block";
    this.updateSympStep1.style.display = "none";
    this.updateSympStep2.style.display = "none";
    this.updateSympStep3.style.display = "block";
  }

  addSymptomsOpen(){
    this.is_next_step = false;
    this.selectedDate = "";
    this.selectDate = "";
    this.visibility = "all_users";
    this.selectedsevere = "";
    this.addsymptomDontknow = false;
    this.addsymptomcondition = "";
    this.NewSymtId = "";
    this.SymptomsSearchname = "";
    this.newSymptomsName = "";
    this.searchtSymptomsString = false;
    this.formValidation = false;
    $("#addAllSymptoms").modal('show');
    this.addSympStep1.style.display = "block";
    this.addSympStep2.style.display = "none";
    this.addSympStep3.style.display = "none";
  }

  addSymptomsClosedAfter(NewSymtId){
    this.addSympStep2.style.display = "none";
    this.addSympStep3.style.display = "block";
  }

  goSymptomsStepone(){
    this.addSympStep1.style.display = "none";
    this.addSympStep2.style.display = "block";
  }

  goSymptomsSteptwo(){
    this.addSympStep2.style.display = "none";
    this.addSympStep1.style.display = "block";
  }

  // Select  Date
  onDateChangeddiagnose(event){
    if(event.epoc == 0){
      this.selectedDate = "";
      this.selectDate = "";
    }else{
      this.selectedDate = moment(event).format('YYYY/MM/DD');
      this.selectDate = moment(event).format('YYYY/MM/DD');
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
      this._APIservices.get_mycondition_filter({}, this.headers).subscribe(suc =>{
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

  // Search symptoms
  searchSymptoms(symptomsSearch){
    try{
      if(symptomsSearch.length > 0){
        this.selectSymptomsInfo=[];
        let body_param = {
          "search_word" : symptomsSearch
        }
        this._APIservices.search_symptoms(body_param, this.headers).subscribe(suc =>{
          this.selectSymptomsInfo = [];
          this.searchtSymptomsString = true;
          this.symptomsList = suc.body.data;
          if(this.symptomsList.length<0){
            this.searchtSymptomsString=false;
          }
        },err=>{        
          var err_res = JSON.parse(err._body);        
          if(err_res.status == 404){
            this.symptomsList = [];
            this.searchtSymptomsString=true;
          }else{
            this.notificationService.error('Error',err_res.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
          }
        });
      } else{
        this.symptomsList = [];
        this.searchtSymptomsString = false;
      }
    }catch(err){
      console.log("Error occure while load sysptoms. Error is ", err);
    }
  }

  selectSymptoms(SymptomsInfo){
    this.selectSymptomsInfo = SymptomsInfo;
    this.SymptomsSearchname = SymptomsInfo.name;
    this.NewSymtId = SymptomsInfo.id;
    this.searchtSymptomsString = false;
  }

  // Add New symptoms
  addnewSymptomsTwo(){
    try{
      this.notificationService.remove();
      if(this.SymptomsSearchname==""){
        this.notificationService.error('Error','Please Enter Symptoms Name',{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
        return false;
      }
     
      let body_param = {
        "name" : this.SymptomsSearchname,
        "Authentication-Token": this.getToken().AuthToken
      };

      this._APIservices.addnew_symptoms(body_param, this.headers).subscribe(suc =>{
        this.NewSymtId = suc.body.data.id;
        this.addSymptomsToProfile(this.NewSymtId);
        this.addSymptomsClosedAfter(this.NewSymtId);
        this.addSympStep1.style.display = "none";
      },err=>{
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      console.log("Error occure while condition. Error is ", err);
    }
  }

  addSymptomsTwo(){
    this.addSympStep1.style.display = "none";
    this.addSympStep2.style.display = "block";
  }

  addSymptomsToProfile(id){
    try{
      this.blockUI.start('please wait...');
      let body_param = {
        "id" : id
      };

      this._APIservices.symptom_addourprofile(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.NewSymtId=suc.body.data.id;
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

  addSymptomsThree(){
    try{

      if(this.selectSymptomsInfo == ""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      let body_param = {
        "id" : Number(this.selectSymptomsInfo.id)
      };

      this._APIservices.symptom_addourprofile(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.loadSymptomList();
          this.NewSymtId = suc.body.data.id;
          this.addSympStep1.style.display = "none";
          this.addSympStep2.style.display = "none";
          this.addSympStep3.style.display = "block";
          this.is_next_step = true;
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

  clearCondition(){
    try{
      this.addsymptomcondition = "";
    } catch(e){
      console.log("Error occure while clear condition. Error is ",e);
    }
  }

  //select Condition
  selectNewCondition(conditionid){
    this.addsymptomcondition = conditionid;
    this.addsymptomDontknow = false;
  }

  //Symptom  Filtering List
  sortBysymptom(value){
    this.sortBy = value;
    this.loadSymptomList();
    this.loadSymptomUntrackList();
  }

  // Add new Symptom
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
          this.loadSymptomList();
          this.loadSymptomUntrackList();          
          this.notificationService.success('Symptom',this.SymptomsSearchname + " has been added to your profile.",{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
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
      console.log("Error occure while add new symptoms. Error is",err);
    }
  }

  loadMoreSymptomList(){
    try{
      this.blockUI.start("please wait...");
      let body_param = {
        "date_sort":this.sortBy,
        "is_tracking":true,
        "page":this.IstrackPage,
        "per_page":10,
        "offset":0,
      };
      this._APIservices.symptomtrackinglist(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.symptomIsTracklist = this.symptomIsTracklist.concat(suc.body.data);
          this.blockUI.stop();
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        this.blockUI.stop();
        console.log("Error occure while load symptoms list. Error is ", err_res.message);        
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while load symptoms list. Error is ", err);
    }
  }

  loadSymptomList(){
    try{
      this.blockUI.start("please wait...");
      let body_param = {
        "date_sort": (this.sortBy || 'newest_to_oldest'),
        "is_tracking":  true,
        "page": 1,
        "per_page": 10,
        "offset": 0,
      };
      this._APIservices.symptomtrackinglist(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.symptomIsTracklist = [];
          this.symptomIsTracklist = suc.body.data;
          this.blockUI.stop();
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        this.blockUI.stop();
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: true, 
          pauseOnHover: true, 
          clickToClose: true, 
          maxLength: 1000 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while load symptoms list. Error is ", err);
    }
  }

   // Load Untrack Symptoms
  loadMoreSymptomUntrackList(){
    try{
      this.blockUI.start("please wait...");
      let body_param = {
        "date_sort":this.sortBy,
        "is_tracking":false,
        "page":this.UntrackPage,
        "per_page":10,
        "offset":0,
      };

      this._APIservices.symptomtrackinglist(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.symptomUnTracklist = this.symptomUnTracklist.concat(suc.body.data);
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
      console.log("Error occure while load symptoms track list. Error is ", err);
    }
  }

  // Load Untrack Symptoms
  loadSymptomUntrackList(){
    try{
      this.blockUI.start("please wait...");
      let body_param = {
        "date_sort": (this.sortBy || 'newest_to_oldest'),
        "is_tracking": false,
        "page": 1,
        "per_page": 10,
        "offset": 0,
      };

      this._APIservices.symptomtrackinglist(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.symptomUnTracklist = [];
          this.symptomUnTracklist = suc.body.data;
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
      console.log("Error occure while load symptoms track list. Error is ", err);
    }
  }

  // Accordian of Track List
  accordiansymptomIsTrack(symptomIstrack){
    if(symptomIstrack.show == true){
      symptomIstrack.show = false;
    }else{
      symptomIstrack.show = true;
    }
    this.my_symptom_id = symptomIstrack.id;
    this.get_symptoms_tracklist_by_date();
  }

  //Accordian of Untrack List
  accordiansymptomUnTrack(symptomUntrack){
    if(symptomUntrack.show == true){
      symptomUntrack.show = false;
    }else{
      symptomUntrack.show = true;
    }

    this.my_symptom_id = symptomUntrack.id;
    this.get_symptoms_tracklist_by_date();
  }

  deleteSymptom(){
    try{
      this.blockUI.start("please wait...");
      $("#deleteSymptomsOpen").modal('hide');
      let body_param = {
        "id":this.deleteSymptomId
      }

      this._APIservices.delete_symptom(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){          
          this.notificationService.success('Symptom',suc.body.message,{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          this.loadSymptomList();
          this.loadSymptomUntrackList();
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
      console.log("Error occure while delete symptoms. Error is ", err);
    }
  }

  //Scroll Down Symptoms Is track List
  onScrollDownsIsTrack(){
    this.IstrackPage++;
  }

  // Scroll Down Symptoms Untrack List
  onScrollDownsUnTrack(){
    this.UntrackPage++;
  }

  //Clear treament Search
  clearTreatment(){
    this.treatmentSearchname = ""
    this.treatmentInfo = [];
    this.searchtTreatmentString = false;
  }

  // Search Treatment
  searchTreatment(treatmentSearch){
    try{
      let body_param = {
        "search_word" : treatmentSearch
      }

      this._APIservices.search_treatment(body_param, this.headers).subscribe(suc =>{
        this.treatmentInfo = [];
        this.searchtTreatmentString = true;
        this.treatmentList=suc.body.data;
        if(this.treatmentList.length < 0){
          this.searchtTreatmentString = false;
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        if(err_res.status == 404){
          this.treatmentList = [];
          this.searchtTreatmentString = true;
        }else{
          this.notificationService.error('Error',err_res.message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        }
      });
    }catch(err){
      console.log("Error occure while search treatment. Error is ", err);
    }
  }

  // Select Treatment
  selectTreatment(treatmentInfo){
    this.treatmentInfo = treatmentInfo;
    this.treatmentSearchname = this.treatmentInfo.name;
    this.searchtTreatmentString = false;
  }

  //Tag Side Effect Treatment In Our Profile
  tagSideeffectProfile(){
    try{

      if(this.treatmentInfo == ""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start("please wait...");
      $("#moodSwingModel").modal('hide');
      let body_param = {
        'id' :this.selectedSymptopid,
        'data': { "treatment_id" : this.treatmentInfo.id },
      }

      this._APIservices.add_symptom_treatment_side_effect(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.notificationService.success('Treatment Added',suc.body.message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          this.symptomIsTracklist = [];
          this.symptomUnTracklist = [];
          this.IstrackPage = 1;
          this.UntrackPage = 1;
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.blockUI.stop();
        }
      }, err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        if(err_res.status == 404){
          this.searchtTreatmentString = true;
        }else{
          this.notificationService.error('Error',err_res.message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        }
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while load tag side effect. Error is ", err);
    }
  }

  // Tag Treatment In Our Profile
  tagTreatmentProfile(){
    try{

      if(this.treatmentInfo == ""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      $("#moodSwingModel").modal('hide');
      let body_param = {
        "id" :this.selectedSymptopid,
        "treatment_id" : this.treatmentInfo.id,
        "Authentication-Token": this.getToken().AuthToken,
      }

      this._APIservices.add_symptom_treatment(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){          
          this.symptomIsTracklist = [];
          this.symptomUnTracklist = [];
          this.IstrackPage = 1;
          this.UntrackPage = 1;
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.notificationService.success('Treatment Added',suc.body.message,{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
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
      console.log("Error occure while tag treatment profile. Error is ", err);
    }
  }

  //Remove Symptom treatment In Our Profile
  removeTreatmentProfile(symptomid,treatmentid){
    try{

      this.blockUI.start('please wait...');
      let body_param = {
        "id" :symptomid,
        "treatment_id" : treatmentid
      }
      this._APIservices.remove_symptom_treatment(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.symptomIsTracklist = [];
          this.symptomUnTracklist = [];
          this.IstrackPage = 1;
          this.UntrackPage = 1;
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.notificationService.success('Treatment Deleted',suc.body.message,{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          this.blockUI.stop();
        }        
      },err=>{
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      console.log("Error occure while remove tag profile. Error is ",err);
    }
  }

  //Remove Side Effect treatment In Our Profile
  removeSideeffectTreatment(symptomid,treatmentid){
    try{

      this.blockUI.start("please wait...");
      let body_param = {
        "id" :symptomid,
        "treatment_id" : treatmentid
      }
      this._APIservices.remove_sideeffect_treatment(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.blockUI.stop();
          this.symptomIsTracklist = [];
          this.symptomUnTracklist = [];
          this.IstrackPage = 1;
          this.UntrackPage = 1;
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.notificationService.success('Treatment Deleted',suc.body.message,{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
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
      console.log("Error occure while remove sise effect. Error is ", err);
    }
  }

  selectUpdateSeverity(value){
    this.selectedupdateSeverity = value;
    this.chooseSevirity = value;
  }

  updateSelectSymptoms(isIncrease){

    if(this.chooseSevirity == ""){
      this.formValidation = true;
      return false;
    }else{
      this.formValidation = false;
      if(this.symptomIsTracklist.length > 0){
        if( this.symptomStatus == "current"){
          this.tempUpdateSymptoms.push(
            {
              "my_symptom_id":this.symptomIsTracklist[this.updateSymptomCount].id,
              "severity":this.selectedupdateSeverity,
              "severity_date":moment(this.currentDate).format('YYYY/MM/DD'),
              "is_monitoring":this.stopSymptomTracking == true ? false : true,
              'visibility':'all_users'
            });

          this.selectedupdateSeverity = "";
          this.chooseSevirity = "";
          this.stopSymptomTracking = false;
       
          if(isIncrease){
            this.updateSymptomCount++;
          }

          this.symptom_name = this.symptomIsTracklist[this.updateSymptomCount].symptom_name.name;

          if(this.symptomIsTracklist.length == this.tempUpdateSymptoms.length){
            this.updateAllsymtom();
          }
        }else{
          this.tempUpdateSymptoms.push(
            {
              "my_symptom_id":this.symptomUnTracklist[this.updateSymptomCount].id,
              "severity":this.selectedupdateSeverity,
              "severity_date":moment(this.currentDate).format('YYYY/MM/DD'),
              "is_monitoring":this.stopSymptomTracking == true ? false : true,
              'visibility':'all_users'
            });

          this.selectedupdateSeverity = "";
          this.chooseSevirity = "";
          this.stopSymptomTracking = false;
          if(isIncrease){
            this.updateSymptomCount++;
          }
          this.symptom_name = this.symptomIsTracklist[this.updateSymptomCount].symptom_name.name;

          if(this.symptomIsTracklist.length == this.symptomUnTracklist.length){
            this.updateAllsymtom();
          }
        }
      } else {
        this.notificationService.success('Symptom', "Data not found",{ 
            timeOut: 3000,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: false
        });
      }
    }
  }

  // Update All symtoms
  updateAllsymtom(){
    try{
      this.blockUI.start('please wait...');
      $("#updateAllSymptoms").modal('hide');
      let body_param = {
        "severities" : this.tempUpdateSymptoms
      }

      this._APIservices.update_Multiplesymptoms({'body':body_param}, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.notificationService.success('Symptom update',suc.body.message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          this.blockUI.stop();
        }
      }, err=>{
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
      console.log("Error occure while update all sumptoms. Error is ", err);
    }
  }

  filterSymptom(status){
    this.symptomStatus = status;
  }

  openDeleteTreatment(){
    this.deleteTreatmentConfirm.style.display = "block";
  }

  closeDeleteTreatment(){
    this.deleteTreatmentConfirm.style.display = "none";
  }

  stopTrackingConfirm(symptomId, type){
    try{
      this.deleteSymptomId = symptomId;
      this.trackingType = type;
      $("#stopTrackingConfirm").modal('show');
    } catch(e){
      console.log("Error occure while stop tracking confirm. Error is ", e);
    }
  }

  stopTracking(){
    try{

      this.blockUI.start('please wait...');
      $("#stopTrackingConfirm").modal('hide');
      let data = {
        'id' : this.deleteSymptomId,
        'data' : {'is_monitoring' : this.trackingType == 'stop' ? false : true}
      } 
      this._APIservices.start_stop_monitoring(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){          
          this.notificationService.success('Symptom update',suc.body.message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.blockUI.stop();
        }
      }, err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while stop tracking. Error is ", e);
    }
  }

  remove_symptoms_sevirity_confirm(my_symptom_id, sevirity_id){
    this.my_symptom_id = my_symptom_id;
    this.sevirity_id = sevirity_id;
    $('#removesymptomssevirityConfirm').modal('show');
  }

  remove_symptoms_sevirity(){
    try{
      $('#removesymptomssevirityConfirm').modal('hide');
      let data = {
        'my_symptom_id' : (this.my_symptom_id || 0),
        'id' : (this.sevirity_id || 0)
      }
      this._APIservices.remove_symptom_severities(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){          
          this.symptomIsTracklist = [];
          this.symptomUnTracklist = [];
          this.IstrackPage = 1;
          this.UntrackPage = 1;
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.notificationService.success('Treatment Deleted',suc.body.message,{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        }
        this.blockUI.stop();
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
    } catch(e){
      console.log('Error occure while remove symptoms. Error is ', e);
    }
  }

  sevirity_edit_visibility(visibility, my_symptom_id, sevirity_id){
    try{

      this.blockUI.start('please wait...');
      let body_params = {
        'my_symptom_id' : (my_symptom_id || 0),
        'visibility' : (visibility || 'all_users')
      }

      let data = {
        'id' : (sevirity_id || 0),
        'data' : body_params
      }

      this._APIservices.sevirity_edit_visibility(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){          
          this.symptomIsTracklist = [];
          this.symptomUnTracklist = [];
          this.IstrackPage = 1;
          this.UntrackPage = 1;
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.notificationService.success('Sevirity',suc.body.message,{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        }
        this.blockUI.stop();
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
    } catch(e){
      this.blockUI.stop();
      console.log('Error occure while remove symptoms. Error is ', e);
    }
  }

  add_severity_confirm(my_symptom_date){
    try{
      this.formValidation = false;
      this.selectedsevere = "";
      $('#addAdditionalSymptoms').modal('show');
      this.severity_date = my_symptom_date;
    } catch(e){
      console.log('Error occcure while add severity. Error is ', e);
    }
  }

  add_severity(){
    if(this.selectedsevere == ""){
      this.formValidation = true;
      return false;
    }
    this.blockUI.start('please wait...');
    $('#addAdditionalSymptoms').modal('hide');
    let body_params = {
      'my_symptom_id' : (this.my_symptom_id || 0),
      'severity_date' : (this.severity_date || 0),
      'severity' : (this.selectedsevere || 'none'),
      'visibility' : (this.visibility || 'all_users'),
    }
    this._APIservices.add_sevirity({'data': body_params }, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){    
          this.formValidation = false;
          this.selectedsevere = "";
          this.isEditMode = false;      
          this.symptomIsTracklist = [];
          this.symptomUnTracklist = [];
          this.IstrackPage = 1;
          this.UntrackPage = 1;
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.notificationService.success('Severity', suc.body.message,{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        }
        this.blockUI.stop();
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
  }

  update_sevirity(my_symptom_id, sevirity_id, my_sevirity){
    try{
      this.blockUI.start('please wait...');
      let body_params = {
        'my_symptom_id' : (my_symptom_id || 0),
        'severity' : (my_sevirity || 'none')
      }

      let data = {
        'id' : (sevirity_id || 0),
        'data' : body_params
      }
      this._APIservices.update_sevirity(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){    
        this.isEditMode = false;      
          this.symptomIsTracklist = [];
          this.symptomUnTracklist = [];
          this.IstrackPage = 1;
          this.UntrackPage = 1;
          this.loadSymptomList();
          this.loadSymptomUntrackList();
          this.notificationService.success('Severity', suc.body.message,{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        }
        this.blockUI.stop();
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
    } catch(e){
      this.blockUI.stop();
      console.log('Error occure while remove symptoms. Error is ', e);
    }
  }

  setSevirity(severities){
    severities.is_visible = true;
    this.my_sevirity = severities.severity;
    this.isEditMode = true; 
  }

  get_symptoms_tracklist_by_date(){
    try{
      let tempDate =  moment(this.birthDate).add('days',1).format('YYYY/MM/DD');
      let currentDate = moment(tempDate).format('YYYY/MM/DD');
      let lastDate = moment(tempDate).add('days',-7).format('YYYY/MM/DD');
      let data = {
        'id' : (this.my_symptom_id || 0),
        'from_date' : (lastDate || ''),
        'end_date' : (currentDate || '')
      }

      this._APIservices.get_symptoms(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          if(suc.body.my_symptom_severities.length > 0){
            this.my_symptom_severities = [];
            let startDate = ''
            let oseverities = {};
            for (var i = 0; i <= 6; i++) {
              oseverities = {}
              startDate = moment(lastDate).add('days',i).format('YYYY-MM-DD');
              let mySeverities = $.grep(suc.body.my_symptom_severities, (i, j)=>{
                return i.severity_date == startDate
              });
              if(mySeverities.length > 0){
                oseverities = {                  
                  "id": (mySeverities[0]['id'] || 0),
                  "my_symptom_id": (mySeverities[0]['my_symptom_id'] || 0),
                  "severity_date": (mySeverities[0]['severity_date'] || ''),
                  "severity": (mySeverities[0]['severity'] || ''),
                  "visibility": (mySeverities[0]['visibility'] || ''),
                  "severity_in_number": (mySeverities[0]['severity_in_number'] || 0),
                  "is_visible" : (mySeverities[0]['is_visible'] || false)
                }
              } else{
                oseverities = {
                  "id": 0,
                  "my_symptom_id": 0,
                  "severity_date": startDate,
                  "severity": "",
                  "visibility": "",
                  "severity_in_number": 0,
                  "is_visible" : false
                }                
              }

              this.my_symptom_severities.push(oseverities);              
            }
          } else{
            this.my_symptom_severities = [];
            for (var i = 0; i <= 6; i++) {
              let o = moment(lastDate).add('days',i).format('YYYY-MM-DD');
              let oseverities = {
                "id": 0,
                "my_symptom_id": 0,
                "severity_date": o,
                "severity": "",
                "visibility": "",
                "severity_in_number": 0
              }
              this.my_symptom_severities.push(oseverities);
            }
          }
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        console.log("Error occure while get symptoms. Error is ", err_res.message);
      });
    } catch(e){
      console.log("Error occure while get records by date. Error is ", e);
    }
  }

  previousDate(){
    let currentDate = moment(this.birthDate).format('YYYY/MM/DD');
    this.birthDate=moment(currentDate).add('days',-7).format('YYYY/MM/DD');
    this.get_symptoms_tracklist_by_date();
  }
  nextDate(){

    let CD = moment(new Date()).format('YYYYMMDD');
    let ED = this.my_symptom_severities[this.my_symptom_severities.length-1];
        ED = moment(ED.severity_date).add('days',+1).format('YYYYMMDD');
    if(Number(CD) > Number(ED)){
      let currentDate = moment(this.birthDate).format('YYYY/MM/DD');
      this.birthDate = moment(currentDate).add('days',+7).format('YYYY/MM/DD');
      this.get_symptoms_tracklist_by_date();
    } else{
      this.notificationService.error('Error',"You cannot select future date.",{ 
        timeOut: 3000, 
        showProgressBar: false, 
        pauseOnHover: false, 
        clickToClose: false 
      });
    }    
  }
  displayDay(date){
    try{
      var weekDayName =  moment(date).format('dddd');
      if(weekDayName == "Sunday"){
        return "SU"
      }
      else if(weekDayName == "Monday"){
        return "M"
      }
      else if(weekDayName == "Tuesday"){
        return "T"
      }
      else if(weekDayName == "Wednesday"){
        return "W"
      }
      else if(weekDayName == "Thursday"){
        return "T"
      }
      else if(weekDayName == "Friday"){
        return "F"
      }
      else if(weekDayName == "Saturday"){
        return "S"
      }
    } catch(e){
      console.log("Error occure while display date. Error is ", e);
    }
  }

  displayDate(date){
    try{
      var momthName =  moment(date).format('MMM');
      var day =  moment(date).format('DD');
      var year =  moment(date).format('YYYY');
      return momthName + " " + day;
    } catch(e){
      console.log("Error occure while display date. Error is ", e);
    }
  }

  displayYear(date){
    try{      
      var year =  moment(date).format('YYYY');
      return year;
    } catch(e){
      console.log("Error occure while display date. Error is ", e);
    }
  }

  addSymptomsClosed(){
    $("#confirmationModal").modal('show');
  }

  noHide(){
    $("#confirmationModal").modal('hide');
    $("#addAllSymptoms").modal('show');
  }

  yesdelete(){
    this.SymptomsSearchname = '';
    this.symptomsList = [];
    this.searchtSymptomsString = false;
    this.selectSymptomsInfo = "";    
    $("#confirmationModal").modal('hide');
    $("#addAllSymptoms").modal('hide');
  }
}
