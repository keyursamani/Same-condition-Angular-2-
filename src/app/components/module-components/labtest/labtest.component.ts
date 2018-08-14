import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
import { DatepickerOptions } from 'ng2-datepicker';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import * as en from 'date-fns/locale/fr';
import * as enLocale from 'date-fns/locale/en';
import {getYear} from 'date-fns';
import {IMyDpOptions} from 'mydatepicker';

declare var $ : any;
declare var jQuery : any;
declare var tz: any;

@Component({
  selector: 'aq-labtest',
  templateUrl: './labtest.component.html',
  styleUrls: ['./labtest.component.scss']
})

export class LabtestComponent extends HeadersProvider implements OnInit {

  @BlockUI() blockUI: NgBlockUI;  
  private NoLab : boolean = true;
  private showbutton :boolean = true;
  private donotLoad : boolean = false;
  private LabTestStep1Field : any ;
  private LabTestStep2Field : any ;
  private labSearchname: string = "";
  private searchtLabString: boolean = false;
  private searchLabList: any = [];
  private seletedLabDetail: any = [];
  private searchList: boolean = false;
  private testDate: any;
  private labVisibility: string = "all_users";
  private labResult: string = "";
  private labTime: string = "";
  private labTimeZone: string = "pm";
  private addlabName: string = "";
  private date: any;
  private labFilter: string = "everything";
  private labTestlist: any = [];
  private pageT: any = 1;
  private perpage:any = 10;
  private addResulttestDate: any;
  private addResultlabTime: string = "";
  private addResultlabResult: string = "";
  private addResultlabVisibility: string = "all_users";
  private labsInfo: any = [];
  private editResultlabVisibility: string = "";
  private editResultlabResult :string = "";
  private editResultlabTime: string = "";
  private labResultInfo: any = [];
  private editResulttestDate: any;
  private timeZone: any;
  private deletelabid: number;
  private deletelabresultid: number;
  private deletelab_id: number;
  private select_lab_test_name: string = "";
  private formValidation: boolean = false;
  
  private labEditTimeZone: string = "pm";
  public dateValue:any = '';
  //constructor
  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService
    ) {
    super();
    this.date=new Date();
    this.addResulttestDate=this.date;    
  }

  //ngOnInit
  ngOnInit() {
    this.LabTestStep1Field = document.getElementById('labStep1');
    this.LabTestStep2Field = document.getElementById('labStep2');
    this.labFilter="everything";
    this.loadLabList();
  }

  addLabsTestOpen(labsInfo){
    this.labsInfo=labsInfo;
    this.select_lab_test_name = labsInfo.labs_tests_name;
    this.addResulttestDate=this.date;
    this.addResultlabTime = moment.utc("2000-01-01T12:00:00.000Z").format('hh:mm:ss');
    this.addResultlabResult="";
    this.addResultlabVisibility="all_users";
    $("#labsTestAddModal").modal('show')
  }      

  editLabsTestOpen(labResultInfo){
    this.labResultInfo = labResultInfo;
    this.editResulttestDate = labResultInfo.result_date;
    this.labEditTimeZone = moment.utc(labResultInfo.result_time).format('a');
    this.editResultlabTime = this.convert_12_to_24(moment.utc(labResultInfo.result_time).format('hh:mm A')); //moment.utc(labResultInfo.result_time).format('hh:mm:ss');
    this.editResultlabResult = labResultInfo.result;
    this.editResultlabVisibility = labResultInfo.visibility;
    $("#labsTestEditModal").modal('show');
  }     

  labsTestAddProfileOpen(){
    this.showbutton = true;
    this.labVisibility="all_users";
    this.labResult="";
    this.labTimeZone="pm";
    this.labSearchname="";
    this.searchtLabString=false;
    this.searchList=false;
    this.searchLabList=[];
    this.searchLabList=[];
    this.labSearchname="";
    this.seletedLabDetail=[];
    $("#labTestAddModal").modal('show');
    this.formValidation = false;
  }

  goLabTestStep2Field(){
    this.LabTestStep1Field.style.display = "none";
    this.LabTestStep2Field.style.display = "block";
  }

  goLabTestStep1Field(){
    this.LabTestStep2Field.style.display = "none";
    this.LabTestStep1Field.style.display = "block";
  }

  labsTestResultOpen(){
    this.LabTestStep2Field.style.display = "none";
    //this.labsTestResult.style.display = "block";
    $("#labTestResultModal").modal('show');
  }

  labsTestResultClosed(){
    $("#labTestResultModal").modal('hide');
    $("#labTestAddModal").modal('hide');
    this.LabTestStep2Field.style.display = "none";
    this.LabTestStep1Field.style.display = "block";
  }

  selectTabTag(info){
    this.labSearchname=info.name;
    this.seletedLabDetail=info;
    this.searchtLabString=false;
    this.showbutton = true;
  }

  // Accordian in Listing
  openAccordian(labs){
    if(labs.show==true){
      labs.show=false
    }else{
      labs.show=true;
    }
  }

  //Lab Test Filter
  labTestfilter(value: string){
    this.labFilter=value;
    this.loadLabList();
  }
  
  // Load Lab/Test List
  loadLabList(){
    this.pageT = 1;
    this.donotLoad = false;
    this.perpage = 10;

    this.blockUI.start('please wait...');
    try {
      let data = {
        'filter':this.labFilter,
        'page':0,
        'per_page':10,
        'offset':0,
      }

      this._APIservices.get_labstest(data, this.headers).subscribe(suc =>{        
        if(suc.body.status == "1" || suc.body.status == 1){
          this.labTestlist = suc.body.data;
          if(this.labTestlist.length > 0){            
            this.NoLab = false;
          } else{
            this.NoLab = true;
          }
        }
        this.blockUI.stop();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        console.log("Error occure while load lab list. Error is ", err_res.message);
      });
    } catch(err){
      this.blockUI.stop();
      console.log("Error occure while load lab list. Error is ", err);
    }
  }

  loadLabListMore(){
    this.pageT++;
    try{
      let data = {
        'filter':this.labFilter,
        "page" : this.pageT,
        "per_page": this.perpage,
        "offset": 0
      }

      this._APIservices.get_labstest(data, this.headers).subscribe(suc =>{
        if(suc.body.data.length==0){
          this.donotLoad = true;
        } else {
          this.labTestlist = this.labTestlist.concat(suc.body.data);
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        console.log("Error occure while load more. Error is ", err_res.message);
      });
    } catch(err){
      console.log("Error occure while load more. Error is ", err);
    }
  }

  onScrollDown() {
    console.log('scrolled!!');
    if(!this.donotLoad){
      this.loadLabListMore();
    }
  }

  // Search Lab In Our Profile
  searchLabs(labnameSearch: string){
    this.showbutton = false;
    try{
      if(labnameSearch.length > 0) {

        let body_param = {
          "search_word" : labnameSearch
        }
        this._APIservices.search_lab(body_param, this.headers).subscribe(suc =>{
          this.searchtLabString = true;
          this.searchLabList=suc.body.data;
          this.seletedLabDetail = [];
          if(this.searchLabList.length <= 0){
            this.searchList = true;
            this.searchtLabString=false;
          }
        },err=>{
          var err_res = JSON.parse(err._body);
          console.log("Error occure while search lab record. Error is ", err_res.message);
        });
      } else{
        this.searchLabList = [];
      }
    }catch(err){
      console.log("Error occure while search lab record. Error is ", err);
    }
  }

  // Selet Any one lab
  addLabs(){
    try{

      if(this.seletedLabDetail == ""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      let body_param = {
        'id' : Number(this.seletedLabDetail.id)
      }

      this._APIservices.addlab_ourprofile(body_param, this.headers).subscribe(res =>{
        if(res.body.status == 1 || res.body.status == "1"){
          this.loadLabList();
          $("#labTestAddModal").modal('hide');
          this.notificationService.success('Lab',res.body.message,{
            timeOut: 3000,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: false 
          });
          this.seletedLabDetail = res.body.data;
          this.labsTestResultOpen();
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
    } catch(err){
      this.blockUI.stop();
      console.log("Error occure while add labls. Error is ", err);
    }
  }

  convert_12_to_24(time){
    try{  
      var hours = Number(time.match(/^(\d+)/)[1]);
      var minutes = Number(time.match(/:(\d+)/)[1]);
      var AMPM = time.match(/\s(.*)$/)[1];
      if(AMPM == "PM" && hours<12) hours = hours+12;
      if(AMPM == "AM" && hours==12) hours = hours-12;
      var sHours = hours.toString();
      var sMinutes = minutes.toString();
      if(hours<10) sHours = "0" + sHours;
      if(minutes<10) sMinutes = "0" + sMinutes;
      return (sHours + ":" + sMinutes);
    } catch(e){
      console.log("Error occure while convert 12 to 24 format. Error is ", e);
    }
  }

  convert_24_to_12(timeString){
    try{
      let hourEnd = timeString.indexOf(":");
      let H = +timeString.substr(0, hourEnd);
      let h = H % 12 || 12;
      let ampm = H < 12 ? "AM" : "PM";
      return timeString = h + timeString.substr(hourEnd, 3) + ampm;
    } catch(e){
      console.log("Error occur while convert 24 hours time to 12 hours. Error is ", e);
    }
  }
  // Add Result Lab
  addResult(){
    try{
      if(this.testDate == "" || this.testDate == undefined) {
        this.formValidation = true;
        return false;
      }

      if(this.labResult == ""){
        this.formValidation = true;
        return false;
      }

      if(this.labVisibility == ""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      let body_param = {
        "result_date" : moment(this.testDate).format('YYYY/MM/DD'),
        "result_time" : this.convert_24_to_12(this.labTime), //(this.labTime + " " + this.labEditTimeZone),
        "result" : this.labResult,
        "visibility" : this.labVisibility
      }
      let data = {
        "id" : Number(this.seletedLabDetail.id),
        "data" : body_param
      }

      this._APIservices.addlab_Result(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.labTime = "";
          this.testDate = "";
          this.loadLabList();
          this.labsTestResultClosed();
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
      console.log('Error occure while add lab test. Error is ', err);
    }
  }

  //Add Result Lab
  updateLabResult(){
    try{
      if(this.editResulttestDate == ""){
        this.formValidation = true;
        return false;
      }

      if(this.editResultlabResult ==  ""){
        this.formValidation = true;
        return false;
      }

      if(this.editResultlabVisibility==""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      $("#labsTestEditModal").modal('hide');
      let body_param = {        
        'my_labs_test_id': Number(this.labResultInfo.my_labs_test_id),
        "result_date" : moment(this.editResulttestDate).format('YYYY/MM/DD'),
        "result_time" : this.convert_24_to_12(this.editResultlabTime), //(this.editResultlabTime + " " + this.labEditTimeZone),
        "result" : this.editResultlabResult,
        "visibility" : this.editResultlabVisibility
      }

      let data = {
        "id" : Number(this.labResultInfo.id),
        "data" : body_param
      }

      this._APIservices.addlab_UpdateResult(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.editResultlabTime = "";
          this.testDate = "";
          this.editResulttestDate = "";
          this.loadLabList();
          this.notificationService.success('Lab', "Lab/Test test data updated",{ 
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
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while update lab result. Error is ", err);
    }
  }

  //Add Manually Lab
  customAddLab(){
    try{
      if(this.addlabName==""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      let body_param = {
        'data' : { "name" : this.addlabName }
      }

      this._APIservices.addlab_Name(body_param, this.headers).subscribe(res =>{
        if(res.body.status == 1 || res.body.status == "1"){
          this.labsTestResultOpen();
          this.seletedLabDetail = res.body.data;
          this.addLabs();
          this.blockUI.stop();
        }
      }, err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res, {
          timeOut: 3000,
          showProgressBar: false,
          pauseOnHover: false,
          clickToClose: false
        });
      });
    } catch(err){
      this.blockUI.stop();
      console.log('Error occure while add custom tag. Error is ', err);
    }
  }

  //Add New Result In Lab
  addNewresultLab(){
    try{

      if(this.addResulttestDate == ""){
        this.formValidation = true;
        return false;
      }

      if(this.addResultlabResult==""){
        this.formValidation = true;
        return false;
      }

      if(this.addResultlabVisibility==""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      let body_param = {        
        "result_date" : moment(this.addResulttestDate).format('YYYY/MM/DD'),
        "result_time" : this.convert_24_to_12(this.addResultlabTime), //this.addResultlabTime + " " + this.labTimeZone,
        "result" : this.addResultlabResult,
        "visibility" : this.addResultlabVisibility
      }

      let data = {
        "id" : Number(this.labsInfo.id),
        "data" : body_param
      }

      this._APIservices.addlab_Result(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          $("#labsTestAddModal").modal('hide');
          this.notificationService.success('Lab', "Lab/Test data added successfully", { 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          this.loadLabList();
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      console.log("Error occure while add new lab. Error is ", err);
    }
  }

  //Delete lab & test
  deleteLab(){
    try{
      this.blockUI.start('please wait...');
      $("#deleteLab").modal('hide');
      let data = {
        "id": Number(this.deletelab_id)
      }
      this._APIservices.delete_labTest(data, this.headers).subscribe(res =>{
        if(res.body.status == "1" || res.body.status == 1){          
          this.loadLabList();
          this.notificationService.success('Lab', "Lab/Test removed successfully", {
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
        this.notificationService.error('Error', err_res.message, {
          timeOut: 3000,
          showProgressBar: false,
          pauseOnHover: false,
          clickToClose: false
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while delete lab. Error is ', err);
    }
  }

  // Delete lab & test Result
  deleteResult(){
    try{

      $("#deleteconfirmationModal").modal('hide');
      let data = {
        "id": Number(this.deletelabresultid),
        "my_labs_test_id":Number(this.deletelabid)
      }

      this._APIservices.delete_labTestResult(data, this.headers).subscribe(res =>{
        if(res.body.status == "1" || res.body.status == 1){
          this.loadLabList();
        }        
      }, err =>{
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message,{
          timeOut: 3000,
          showProgressBar: false,
          pauseOnHover: false,
          clickToClose: false
        });
      });
    } catch(err){
      console.log("Error occure while delete lab. Error is ", err);
    }
  }

  confirmClosed(){
    $("#confirmationModal").modal('hide');
    $("#labTestAddModal").modal('hide');
    this.labsTestResultClosed();
    $("#labsTestEditModal").modal('hide');
    $("#labsTestAddModal").modal('hide');
  }

  openDeleteResultConfirm(deletelabid,deletelabresultid){
    this.deletelabid = deletelabid;
    this.deletelabresultid=deletelabresultid;
    $("#deleteconfirmationModal").modal('show');
  }

  openDeleteConfirm(deletelab_id){
    this.deletelab_id = deletelab_id;
    $("#deleteLab").modal('show');
  }

  setTime(time){
    try{
      return 'at '  +  moment.utc(time).format('hh:mm A');
    } catch(e){
      console.log("Error occure while set time. Error is ", e);
    }
  }

  onDateChanged(event){
    this.testDate = (moment(event).format('YYYY/MM/DD'));
  }

  onEditDateChanged(event){
    this.editResulttestDate = (moment(event).format('YYYY/MM/DD'));
  }

  onDateChanged1(event){
    this.addResulttestDate = (moment(event).format('YYYY/MM/DD'));
  }

}
