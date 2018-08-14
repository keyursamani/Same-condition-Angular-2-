import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
import {Pipe} from "@angular/core";
import {PipeTransform} from "@angular/core";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $ : any;
declare var jQuery : any;

@Component({
  selector: 'aq-hospitilization',
  templateUrl: './hospitilization.component.html',
  styleUrls: ['./hospitilization.component.scss']
})

export class HospitilizationComponent extends HeadersProvider implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  private getHospitalizationList: any;
  private hospitalinfo: any;
  private date: any;  
  private editadmittedDate2 : any;
  private today:any;
  private editUpdatDischarge : string;
  private showSuggest:boolean;
  private admittedDate: any = "";
  private dischargeDate: any = "";
  private editUpdateAdmit :any;
  private editHospitalInfo:any = [];
  private donotLoad:boolean = false;
  private okay : boolean;
  private editdischargeDate2 : any;
  private pageT: any = 1;
  private perpage:any = 10;
  private NohospitalList : any = true;
  private hospitalizatonReason: string = "";
  private hospitalizatonTags:any;
  private hospitalizatonNotes: string = "";
  private hospitalizatonVisibility: string = "";
  private searchTagList: any = [];
  private editstatus : string;
  private savedID : number;
  private searchtTagString: boolean = false;
  private hospatalizeTagList: any = [];
  private tagsSearchname: string;
  private hospitalizatonDischarge: boolean = false;
  private addHospitalizeParams: any;
  private mydate :any;
  private editHospitalizatonVisibility: string = "";
  private editHospitalizatonNotes: string = "";
  private editHospitalizatonDischarge: boolean = false;
  private editHospitalizatonReason:string = "";
  private editadmittedDate: any;
  private editdischargeDate: any = "";
  private tmodel:any;
  private tmodel1:any;
  private formValidation:boolean = false;
  private closePopup: boolean;
  
  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService
    ) {
    super();

    this.date = new Date();
  }

  ngOnInit() {
    this.loadHospitalizations();

    
    // stop copy paste code into textbox
    $(document).ready(()=> {
      var ctrlDown = false,
          ctrlKey = 17,
          cmdKey = 91,
          vKey = 86,
          cKey = 67;

      $(document).keydown((e)=> {
          if (e.keyCode == ctrlKey || e.keyCode == cmdKey){
            ctrlDown = true;
          } 
      }).keyup((e)=> {
          if (e.keyCode == ctrlKey || e.keyCode == cmdKey){
            ctrlDown = false;
          } 
      });

      $(".no-copy-paste").keydown((e)=> {
          if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)){
            if(this.editHospitalizatonNotes.length > 150){
              return false;
            }
          } 
      });
    });
    
  }

  // Get Hospitalizations List
  loadHospitalizations(){
    this.pageT = 1;
    this.donotLoad = false;
    this.perpage = 10;

    try{
      this.blockUI.start('please wait...');
      let body_param = {
        "page" : 1,
        "per_page": 10,
        "offset": 0
      };

      this._APIservices.get_Hospitalizations(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.getHospitalizationList = suc.body.data;
          if(this.getHospitalizationList.length == 0){
            this.NohospitalList = true;
          } else{
            this.NohospitalList = false;
          }
        }       

        this.editstatus = localStorage.getItem('edithospital');
        if(this.editstatus == 'true'){
          this.savedID = JSON.parse(localStorage.getItem('editHospitalizedid'));

          for(let items of this.getHospitalizationList){
            if(items.id == this.savedID ){
              this.editHospitalisedOpen(items);
            }
          }
        }
        this.blockUI.stop();
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
      console.log("Error occure while load hospitilization list. Error is ", err);
    }
  }

  omit_special_char(event){
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  stopWritting(){
    try{
      if(!this.isEmpty(this.hospitalizatonNotes)){

        if(this.hospitalizatonNotes.length >= 150){
          console.log('maximum character');
          return false;
        }
      }
    } catch(e){
      console.log('Error occure while stop writting. Error is ', e)
    }
  }

  loadHospitalizationsMore(){
    this.pageT++;
    try{

      this.blockUI.start('please wait...');
      let body_param = {
        "page" : this.pageT,
        "per_page": this.perpage,
        "offset": 0
      };

      this._APIservices.get_Hospitalizations(body_param, this.headers).subscribe(suc =>{
        if(suc.body.data.length == 0){
          this.donotLoad = true;
        } else{
          this.getHospitalizationList = this.getHospitalizationList.concat(suc.body.data);
        }
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
      console.log("Error occure while load more hospitilization. Error is ", err);
    }
  }

  onScrollDown() {
    if(!this.donotLoad){
      this.loadHospitalizationsMore();
    }
  }

  // Delete Hospitalization
  deleteHospitalised(){
    try{
      this.blockUI.start('please wait...');
      $("#hospitalisedDeleteModal").modal('hide');
      let body_param = {
        "id" : this.hospitalinfo.id
      };

      this._APIservices.delete_Hospitalizations(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.loadHospitalizations();
          this.notificationService.success("Hospitalization", 'removed Successfully',{
            timeOut: 2000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 1000
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
      console.log("Error occure while edit hospitilization. Error is ", err);
    }
  }

  addHospitalised(){
    try{

      this.notificationService.remove();
      if(this.hospitalizatonReason == ""){
        this.formValidation = true;
        return false;
      }

      if(this.hospatalizeTagList.length <= 0){
        this.formValidation = true;
        return false;
      }

      if(this.admittedDate == ""){
        this.formValidation = true;
        return false;
      }

      if(this.dischargeDate == "" && this.hospitalizatonDischarge == false){
        this.formValidation = true;
        return false;
      }

      if(this.hospitalizatonNotes.length > 150){
        this.formValidation = true;
        return false;
      }

      if(this.hospitalizatonVisibility == ""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      let tagList=[];
      for(let items of this.hospatalizeTagList){
        tagList.push({'id':items.id,'name':items.name,'type':items.purpose_type});
      }

      if(this.hospitalizatonDischarge == true){
        this.addHospitalizeParams = {
          "reason" :this.hospitalizatonReason,
          "tags" : tagList,
          "date_of_admission" : moment(this.admittedDate).format('YYYY/MM/DD'),
          "notes" : this.hospitalizatonNotes.trim(),
          "discharged" :false,
          "date_of_discharged" : "",
          "visibility" : this.hospitalizatonVisibility
        }
      } else{
        this.addHospitalizeParams = {
          "reason" :this.hospitalizatonReason,
          "tags" : tagList,
          "date_of_admission" :  moment(this.admittedDate).format('YYYY/MM/DD'),
          "notes" : this.hospitalizatonNotes.trim(),
          "discharged" : true,
          "date_of_discharged" :  moment(this.dischargeDate).format('YYYY/MM/DD'),
          "visibility" : this.hospitalizatonVisibility
        }
      }

      this._APIservices.add_Hospitalizations({'body':this.addHospitalizeParams}, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.notificationService.success("Hospitalization",'Added Successfully',{
            timeOut: 2000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 1000
          });
          $("#hospitalisedAddModal").modal('hide');
          this.loadHospitalizations();
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
      console.log("Error occure while add hospitilized", err);
    }
  }

  /*  Hospitalised Modal */
  addHospitalisedOpen(){
    this.hospitalizatonReason="";
    this.hospatalizeTagList=[];
    this.hospitalizatonNotes="";
    this.admittedDate="";
    this.dischargeDate="";
    this.mydate = '';
    this.tmodel = '';
    this.tmodel1 = '';
    this.hospitalizatonVisibility="all_users";
    this.hospitalizatonDischarge=false;
    $("#hospitalisedAddModal").modal('show');
    this.formValidation = false;
  }

  //cleanup code after verified
  addHospitalisedClosed(){
    $("#confirmationModal").modal('show');
  }

  noHide(){
    $("#confirmationModal").modal('hide');
    $("#hospitalisedAddModal").modal('show');
  }

  yesdelete(){
    this.tagsSearchname = '';
    this.searchtTagString = false;
    this.searchTagList = [];
    $("#confirmationModal").modal('hide');
    $("#hospitalisedAddModal").modal('hide');
  }

  closeHospitilization(){
    this.tagsSearchname = '';
    this.searchtTagString = false;
    this.searchTagList = [];
    $('#hospitalisedAddModal').modal('hide');
  }

  searchTags(searchString: string){
    this.showSuggest = true;
    if(searchString == ""){
      this.searchtTagString = false;
      this.searchTagList = [];
      return false;
    }

    try{
      let body_param = {
        "search_word" : searchString
      }

      this._APIservices.usersList_TagsPurpose(body_param, this.headers).subscribe(suc =>{
        this.searchtTagString = true;
        this.searchTagList = suc.body.data;
        for(let items of this.searchTagList){
        }
        if(this.searchTagList.length<0){
          this.searchtTagString=false;
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
      console.log("Error occure while search tags. Error is ", err);
    }
  }

  closeprediction(){
    this.tagsSearchname = '';
    this.showSuggest = false;
    this.searchtTagString = false;
  }

  updateHopitalizaed(){
    try{

      if(this.editHospitalizatonReason == ""){
        this.formValidation = true;
        return false;
      }

      if(this.hospatalizeTagList.length<=0){
        this.formValidation = true;
        return false;
      }

      if(this.editadmittedDate == "" || this.editadmittedDate == null){
        this.formValidation = true;
        return false;
      }

      if(this.editdischargeDate == "" && this.editHospitalizatonDischarge == false){
        this.formValidation = true;
        return false;
      }

      if(this.editHospitalizatonNotes.length > 150){
        this.formValidation = true;
        return false;
      }

      if(this.editHospitalizatonVisibility == ""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      let tagList = [];
      for(let items of this.hospatalizeTagList){
        tagList.push({'id':items.id,'name':items.name,'type':items.purpose_type});
      }

      if(this.editHospitalizatonDischarge == true){
        if(!this.editUpdateAdmit){
          this.editUpdateAdmit = this.editadmittedDate2;
        }

        this.addHospitalizeParams = {
          "id": Number(this.editHospitalInfo.id),
          "reason" :this.editHospitalizatonReason,
          "tags" : tagList,
          "date_of_admission" :  moment(this.editUpdateAdmit).format('YYYY/MM/DD'),
          "notes" : this.editHospitalizatonNotes,
          "discharged" :false,
          "date_of_discharged" : "",
          "visibility" : this.editHospitalizatonVisibility
        }
      } else{
        if(!this.editUpdatDischarge){
          this.editUpdatDischarge = this.editdischargeDate2;
        }

        if(!this.editUpdateAdmit){
          this.editUpdateAdmit = this.editadmittedDate2;
        }

        this.addHospitalizeParams = {
          "id":  Number(this.editHospitalInfo.id),
          "reason" :this.editHospitalizatonReason,
          "tags" : tagList,
          "date_of_admission" :  moment(this.editUpdateAdmit).format('YYYY/MM/DD'),
          "notes" : this.editHospitalizatonNotes,
          "discharged" : true,
          "date_of_discharged" : moment(this.editUpdatDischarge).format('YYYY/MM/DD'),
          "visibility" : this.editHospitalizatonVisibility
        }
      }

      this._APIservices.update_Hospitalizations({'id':Number(this.editHospitalInfo.id),'body':this.addHospitalizeParams}, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.notificationService.success("Hospitalization",'updated Successfully',{
            timeOut: 2000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 1000
          });
          this.editHospitalisedClosed();
          this.loadHospitalizations();
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
      console.log("Error occure while update hospitilization. Error is ", err);
    }
  }

  selectHospitalizeTag(tagInfo){
    this.okay = true;
    this.tagsSearchname = "";
    this.searchtTagString = false;
    this.showSuggest = false;
    if(this.hospatalizeTagList.length <= 0){
      tagInfo.name = tagInfo.name.toUpperCase();
      this.hospatalizeTagList.push(tagInfo);
    }else{
      for(let items of this.hospatalizeTagList){
        if(items.id==tagInfo.id){
          this.okay = false;
        }
      }

      if(this.okay){
        tagInfo.name = tagInfo.name.toUpperCase();
        this.hospatalizeTagList.push(tagInfo);
      }
    }
  }

  removeHospitalizeTag(index){

    this.hospatalizeTagList.splice(index,1);
  }

  hospitalizeDischarge(value: boolean){

    this.hospitalizatonDischarge = value;
  }

  edithospitalizeDischarge(value: boolean){

    this.editHospitalizatonDischarge = value;
  }

  editHospitalisedOpen(hospitalDetail){
    this.editHospitalInfo = hospitalDetail;
    this.editHospitalizatonVisibility = hospitalDetail.visibility;
    this.editHospitalizatonNotes = hospitalDetail.notes;
    this.editHospitalizatonReason = hospitalDetail.reason;
    this.editadmittedDate2 = hospitalDetail.date_of_admission;
    this.editadmittedDate = moment(this.editadmittedDate2).format("YYYY/MM/DD"); //{ date: { month:  new Date(this.editadmittedDate2).getMonth()+ 1, day:  new Date(this.editadmittedDate2).getDate(),year: new Date(this.editadmittedDate2).getFullYear() } };

    if(hospitalDetail.discharged == true){
      this.editHospitalizatonDischarge = false;
      this.editdischargeDate2 = hospitalDetail.date_of_discharged;
      //this.editdischargeDate = { date: { month:  new Date(this.editdischargeDate2).getMonth()+ 1, day:  new Date(this.editdischargeDate2).getDate(),year: new Date(this.editdischargeDate2).getFullYear() } };
      this.editdischargeDate = moment(this.editdischargeDate2).format("YYYY/MM/DD"); //{ date: { month:  new Date(this.editdischargeDate2).getMonth()+ 1, day:  new Date(this.editdischargeDate2).getDate(),year: new Date(this.editdischargeDate2).getFullYear() } };
    }else{
      this.editHospitalizatonDischarge = true;
      this.editdischargeDate = "";
    }

    this.hospatalizeTagList=[];
    for(let items of hospitalDetail.tags){
      this.hospatalizeTagList.push({'id':items.id,'name':items.name,'purpose_type':items.type});
    }

    //this.editHospitalisation.style.display = "block";
    $("#hospitalisedEditModal").modal('show');
  }

  editHospitalisedClosed(){
    $("#hospitalisedEditModal").modal('hide');
    localStorage.setItem("edithospital",'false');
  }

  deleteHospitalisedOpen(hospitalinfo){
    this.hospitalinfo = hospitalinfo;
    $("#hospitalisedDeleteModal").modal('show');
  }

  onDateChanged(event){
    if(event.epoc == 0){
      this.admittedDate = "";
    }else{
      this.admittedDate=event;
      this.dischargeDate = event;
    }
  }

  onDateChangedDischarge(event){
    if(event.epoc == 0){
      this.admittedDate = "";
    }else{
      this.hospitalizatonDischarge = false;
      this.dischargeDate = event;
    }
  }

  onDateAdmited(event){
    if(event.epoc == 0){
      this.admittedDate = "";
    }else{
      this.admittedDate = event.jsdate;
    }
  }

  onDateChangedEditADMITDischarge(event){
    if(event.epoc == 0){
      this.admittedDate="";
    }else{
      this.editadmittedDate = event;
      this.editUpdateAdmit  = this.editadmittedDate;
    }
  }

  onDateChangedEditDischarge(event){
    if(event.epoc == 0){
      this.admittedDate="";
    }else{
      this.editdischargeDate = event;
      this.editUpdatDischarge = this.editdischargeDate;
    }
  }

  editStopWritting(){
    try{
      if(!this.isEmpty(this.editHospitalizatonNotes)){

        if(this.editHospitalizatonNotes.length >= 150){
          console.log('maximum character');
          return false;
        }
      }
    } catch(e){
      console.log('Error occure while stop writting. Error is ', e)
    }
  }

  setVisibility(status, hospitilizationId){
    try{
      let data = {
        'id':hospitilizationId,
        'data' : {'visibility' : status}
      }

      this._APIservices.edit_visibility(data, this.headers).subscribe(suc =>{
        if(suc.body.status==1 || suc.body.status=="1"){
          this.loadHospitalizations();
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
    } catch(e){
      console.log("Error occure while set visibility. Error is ", e);
    }
  }

}
