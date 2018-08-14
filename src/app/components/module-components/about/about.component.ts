import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { QolchartComponent } from '../../global-components/qolchart/qolchart.component';

declare var $ : any;
declare var jQuery : any;
/*declare let jsPDF;*/
//declare var FusionCharts: any;
import * as moment from 'moment';
var jsPDF = require('jspdf');
/*require('jspdf-autotable');*/
declare var AmCharts : any;


@Component({
  selector: 'aq-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent extends HeadersProvider implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild(QolchartComponent)
  private qolchartcomp: QolchartComponent;

  private myBioBlock : boolean = true;
  private myBioBlock1 : boolean = false;
  private myBioStory:boolean = true;
  private myBioStoryEdit :boolean = false;
  private editstoryStatus:boolean = false;
  private myInterestBlock : boolean = true;
  private myInterestBlock1 : boolean = false;
  private myInsuranceBlock : boolean = true;
  private myInsuranceBlock1 : boolean = false;
  private aboutData: any = [];

  private health_insuranceDummy :any;
  private myInterestList: any = [];
  private userProfile: any = [];
  private inviteuserList: any = [];
  private inviteusername: string = "";
  private inviteuseremail: string = "";
  private inviteuserdescription: string = "";
  private careTeam : any ;
  private userbioOld :string = "";
  //private type : any = "line";
  private treatmentChart: any = [];
  private hospitilizationChart: any = [];
  private doctorVisitModal : boolean = false;
  private mySavedSheet : boolean = true;
  private myCurrentSheet : boolean = false;
  private activeDoctorSheet: string = "current";
  private health_data: any = [];
  private myEditStoryOld :any;
  private userbio: string = "";
  private myEditStory : string = "";
  private doctorvisit_chartList: any = [];
  private showingFeelingList: any = [];
  private showingqol_surveys: any = [];
  private showingtreatmentList: any = [];  
  private showingsymptomsList: any = [];
  private showinghospitalization: any = [];
  private showingweightList: any = [];
  private feeling_filter: string = "since_joining";
  private qol_survey_filter: string = "since_joining";
  private my_treatment_filter: string = "since_joining";
  private my_symptom_filter: string = "since_joining";
  private my_hospitalization_filter: string = "since_joining";
  private my_weight_filter: string = "since_joining";
  private mySavedSheetist: any = [];
  private savesheetPage: number = 1;
  private searchString: string = "";
  private totalSocialScore: number = 0;
  private totalMentalScore: number = 0;
  private totalPhysicalScore: number = 0;
  private closePopup: boolean;
  private deleteConfirm: boolean;
  private deleteUserId: number;
  private pageScroll:any;
  private sheetName: string = "";
  private showSheetPopUp:any;
  private cSatScoreChartPhysical :any;
  private userRole : any = "";
  private doctorVisitSheetId : number = 0;
  private formValidation : boolean = false;
  private viewSheetName : string = "";
  private mySearchSheet : any = [];
  private isShowControls : boolean = true;
  private arrKG : any = [];
  private arrLBS : any = [];
  private isDisplayKGChart : boolean = true;

  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService
    ) {
    super();
    
    this.myInterestList=[
    {
      'interest':"Donating",
      'checked':false
    },
    {
      'interest':"Fundraising",
      'checked':false
    },
    {
      'interest':"Volunteering",
      'checked':false
    },
    {
      'interest':"Reading",
      'checked':false
    }];

    this.doctorvisit_chartList=[];
    this.userRole = this._localStorage.get('role');
  }

  ngOnInit() {
    this.careTeam = $('#careTeamModal');
    this.loadAbout();
    this.getLoginuserProfile();

    if(this.userRole != 'care_member') {
      this.loadInviteuserList();
    }

    this.load_feelings();
    this.loadWeights();
    this.loadChartList();
    this.loadQollist();

    this.loadhealth();    
    this.loadsavesheet();

    this.showSheetPopUp = document.getElementById('saveSheetModal');

    var selector = '.nav-stacked li';
    $(selector).on('click', function(){
      $(selector).removeClass('rightCeret');
      $(this).addClass('rightCeret');
    });
  }

  //Get About user
  loadAbout(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.get_api_view_about({}, this.headers).subscribe(suc => {
        if(suc.body.status==1 || suc.body.status=="1"){
          this.aboutData = suc.body.data;
          this.myEditStory = (this.aboutData.my_story || "");
          this.userbio = (this.aboutData.bio || "");
          for(let items of this.myInterestList){
            for(let item of this.aboutData.user_interested_in){
              if(items.interest==item){
                items.checked=true;
              }
            }
          }
        }
        this.blockUI.stop();
      },
      err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    } catch(err){
      this.blockUI.stop();
      console.log('Error occure while load about. Error is ', err);
    }
  }

  //Load save sheet
  loadsavesheet(){
    try{
      this.blockUI.start('please wait...');
      let data = {
        'search_word':this.searchString,
        'page': 1,
        'per_page': 10,
        'offset': 0,
      }

      this._APIservices.get_doctor_visit_sheets(data, this.headers).subscribe(suc => {
        if(suc.body.status==1 || suc.body.status=="1"){
          this.mySavedSheetist = suc.body.data;
          this.blockUI.stop();
        }
      },
      err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    } catch(err){
      this.blockUI.stop();
      console.log('Error occure while load save sheet. Error is ', err);
    }
  }

  loadMoreSaveSheet(){
    try{
      let data={
        'search_word':this.searchString,
        'page':this.savesheetPage,
        'per_page':10,
        'offset':0,
      }
      this._APIservices.get_doctor_visit_sheets(data, this.headers).subscribe(suc => {
        if(suc.body.status==1 || suc.body.status=="1"){
          this.mySavedSheetist = this.mySavedSheetist.concat(suc.body.data);
        }
      },
      err=>{
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    } catch(err){
      console.log('Error occure while load save sheet. Error is ', err);
    }
  }

  // Scroll page
  onScrollDown() {
    this.savesheetPage=this.savesheetPage+1;
    this.loadMoreSaveSheet();
  }

  resetSheet(){
    if(this.searchString == ""){
      this.mySearchSheet = [];
      this.savesheetPage = 1;
      this.loadsavesheet();
    } else{
      let data = {
        'search_word':this.searchString,
        'page': 1,
        'per_page': 10,
        'offset': 0,
      }

      this._APIservices.get_doctor_visit_sheets(data, this.headers).subscribe(suc => {
        if(suc.body.status == 1 || suc.body.status == "1"){
          this.mySearchSheet = suc.body.data;
        }
      },
      err=>{
        var err_res = JSON.parse(err._body);
        console.log('Error occure while search data. Error is ', err_res.message);
      });
    }
  }

  // Search Doctor Visit Sheet
  searchSheet(){
    this.mySearchSheet = [];
    this.savesheetPage=1;
    this.loadsavesheet();
  }

  deleteSaveSheetConfirm(id){
    this.doctorVisitSheetId = id;
    $('#deleteSheetModal').modal('show');
  }

  // Delete save sheet
  deleteSaveSheet(){
    try{
      this.blockUI.start('please wait...');
      $('#deleteSheetModal').modal('hide');
      let data={
        'id':this.doctorVisitSheetId
      }
      this._APIservices.delete_doctorsavesheet(data, this.headers).subscribe(suc => {
        if(suc.body.status == "1" || suc.body.status == 1){
          this.doctorVisitSheetId = 0;
          this.loadsavesheet();
          this.blockUI.stop();
        }
      },
      err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    } catch(err){
      this.blockUI.stop();
      console.log('Error occure while delete save sheet. Error is ', err);
    }
  }

  //Load Doctor Visit Chart
  loadChartList(){
    try{
      let body_param = {
        'my_treatment_filter':this.my_treatment_filter,
        'my_symptom_filter':this.my_symptom_filter,
        'my_hospitalization_filter':this.my_hospitalization_filter,
      };
      this._APIservices.doctor_visit_chart(body_param, this.headers).subscribe(suc => {
        this.doctorvisit_chartList = suc.body.data;
        this.showingtreatmentList = this.doctorvisit_chartList.my_treatments.data;
        this.showingtreatmentList.show = true;
        this.showingsymptomsList = this.doctorvisit_chartList.my_symptoms.data;
        this.showingsymptomsList.show = true;
        this.showinghospitalization = this.doctorvisit_chartList.my_hospitalizations.data;
        this.showinghospitalization.show = true;
      },
      err=>{
        console.log(err);
    });
    }catch(err){
      console.log('Error occure while load chart list. Error is ', err);
    }
  }

  // Get health
  loadhealth(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.my_health_data({}, this.headers).subscribe(suc => {
        if(suc.body.status==1 || suc.body.status=="1"){
          this.health_data=suc.body.data;
          this.blockUI.stop();
        }
      },
      err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    } catch(err){
      this.blockUI.stop();
      console.log('Error occure while load health. Error is ', err);
    }
  }

  // Get User Profile
  getLoginuserProfile(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.get_patient_profile({}, this.headers).subscribe(suc => {
        this.userProfile=suc.body.data;
        this.health_insuranceDummy = this.userProfile.health_insurance;
        this.blockUI.stop();
      },
      err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        console.log(err_res);
        this.notificationService.error('Error', err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while load loggedin user profile. Error is ', err);
    }
  }

  // Load Invited Users List
  loadInviteuserList(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.list_sent_invitations({}, this.headers).subscribe(suc => {
        if(suc.body.status==1 || suc.body.status=="1"){
          for(let i=0; i < suc.body.data.length; i++)
          {
              if(suc.body.data[i].first_name == suc.body.data[i].last_name)
              {
                suc.body.data[i].last_name = "";
              }
          }          
          this.inviteuserList=suc.body.data;
        }
        this.blockUI.stop();
      },
      err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    } catch(err){
      this.blockUI.stop();
      console.log('Error occure while load invite user list. Error is ', err);
    }
  }

  //Invite User To Care Team
  inviteUser(){
    try{

      this.notificationService.remove();

      if(this.inviteusername==""){
        this.notificationService.error("Error",'Please enter name ', {timeOut: 2000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
        return false;
      }

      if(this.inviteuseremail==""){
       this.notificationService.error("Error",'Please enter email ', {timeOut: 2000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
      }

      var emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if(!(emailfilter.test(this.inviteuseremail))){
        this.notificationService.error("Error",'Please enter correct email format', {timeOut: 2000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
        return false;
      }

      if(this.inviteuserdescription==""){
       this.notificationService.error("Error",'Please enter description ', {timeOut: 2000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
      }

      this.blockUI.start('please wait...');
      let body_param = {
        "to_name": this.inviteusername,
        "to_email" : this.inviteuseremail,
        "subject": this.userProfile.first_name +' '+this.userProfile.last_name + " has invited you to join his Care Team",
        "message": this.inviteuserdescription
      }

      this._APIservices.invite_to_care_member({'data' : body_param }, this.headers).subscribe(suc => {
        if(suc.body.status == "1" || suc.body.status == 1){
          this.notificationService.success('Success', "Invitation sent successfully.", { 
            timeOut: 3000, 
            showProgressBar: true, 
            pauseOnHover: true, 
            clickToClose: true 
          });
          this.loadInviteuserList();
          this.careTeamClosed();          
          this.blockUI.stop();
        }
        else if(suc.body.status == "0" || suc.body.status == 0){
            var err_res = suc.body.message;
            this.blockUI.stop(); 
            this.notificationService.error('Error', err_res, { 
              timeOut: 3000, 
              showProgressBar: true, 
              pauseOnHover: true, 
              clickToClose: true 
            });
        }        
      },
      err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body.message);
        this.notificationService.error('Error', err_res, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
        this.careTeamClosed();
      });
    } catch(err){
      this.blockUI.stop();      
      console.log('Error occure while invite user. Error is ', err);
      this.careTeamClosed();
    }
    this.careTeamClosed();
  }

  // Delete Invited user
  deleteInvitedUser(){
    try{
      let body_param = {
        "id": this.deleteUserId
      };

      this._APIservices.delete_careteam_member(body_param, this.headers).subscribe(suc => {
        this.closeDeleteConfirm();
        this.loadInviteuserList();
      },
      err=>{
        console.log(err);
      });
    } catch(err){
      console.log('Error occure while delete invite user. Error is ', err);
    }
  }

  goBioEdit(){
    this.myBioBlock = false;
    this.myBioBlock1 = true;
    this.userbio = (this.aboutData.bio || "");
    this.userbioOld = (this.userbio || "");
  }

  goBio(){
    this.userbio = (this.userbioOld || "");
    this.myBioBlock1 = false;
    this.myBioBlock = true;
  }

  UpdateBio(){

    this.blockUI.start('please wait...');
    this.myBioBlock1 = false;
    this.myBioBlock = true;
    let userbiovDetails:any;
    if(this.userbio != "")
    {
      userbiovDetails = (this.userbio || "");
      userbiovDetails=userbiovDetails.replace(/^\s+/g, '');
      userbiovDetails=userbiovDetails.replace(/\s+$/g, '');
      this.userbio = (userbiovDetails || "");
      if(this.userbio.length > 150){        
       this.userbio = (this.userbioOld || "");
        this.aboutData.bio = (this.userbioOld || "");
        // this.aboutData.bio = this.userbioOld;
        this.notificationService.error("Error",'Bio is too long (maximum is 150 characters)', {timeOut: 2000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
        this.blockUI.stop();
        return false;
      }
    }

    try{

      let body_param = {
        "bio": this.userbio,
        "my_story":this.myEditStory
      };

      this._APIservices.getBioStoryAPI(body_param, this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.aboutData.bio = this.userbio;
          this.blockUI.stop();
        }        
      },err=>{
        this.blockUI.stop();
        console.log(err);
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while update bio. Error is ", err);
    }
  }

  goInterestEdit(){
    this.myInterestBlock = false;
    this.myInterestBlock1 = true;
  }

  goMystory(){
    this.myEditStory = this.myEditStoryOld;
    this.editstoryStatus = false;
    this.myBioStory=true;
    this.myBioStoryEdit = false;
  }

  goInterest(){
    this.myInterestBlock1 = false;
    this.myInterestBlock = true;
  }

  goInsuranceEdit(){
    this.myInsuranceBlock = false;
    this.myInsuranceBlock1 = true;
    if(this.userProfile.health_insurance == "")
    {
      this.health_insuranceDummy = "Select Health Insurance";
    }
    else{
      this.health_insuranceDummy = this.userProfile.health_insurance;
    }
  }

  // EditBioStory
  editstory(){
    this.myBioStory=false;
    this.myBioStoryEdit = true;
    this.editstoryStatus = true;
    this.myEditStory = this.aboutData.my_story;
    this.myEditStoryOld = this.myEditStory;
  }

  UpdateBioStory(){
    this.blockUI.start('please wait...');
    this.myBioStory = true;
    this.myBioStoryEdit = false;
    try{
      let body_param = {
        "bio": this.userbio,
        "my_story":this.myEditStory
      };

      this._APIservices.getBioStoryAPI(body_param, this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.aboutData.my_story = this.myEditStory;
          this.blockUI.stop();
        }        
      }, err=>{
        this.blockUI.stop();
        console.log(err);
      });
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while update bio story. Error is ', err);
    }
  }

  goInsurance(){
    this.myInsuranceBlock1 = false;
    this.myInsuranceBlock = true;
  }

  careTeamOpen(){
    this.inviteusername="";
    this.inviteuseremail="";
    this.inviteuserdescription="";    
  }

  closePopUpModel(){
    $('#doctorVisitModal').modal('hide');
  }

  careTeamClosed(){
    $('#confirmationModal').modal('hide');
    $('#careTeamModal').modal('hide');
  }

  prompt_cancel(){
    $('#confirmationModal').modal('show');
  }

  doctorVisitOpen(){
    this.doctorVisitModal = true;
  }

  doctorVisitClosed(){

    this.doctorVisitModal = false;
  }

  doctorCurrentTab(){
    this.activeDoctorSheet="current";
    this.mySavedSheet = true;
    this.myCurrentSheet = false;
  }

  doctorSavedTab(){
    this.activeDoctorSheet="save";
    this.myCurrentSheet = true;
    this.mySavedSheet = false;
  }

  // Update Insurance
  updateInsurance(){

    if(this.health_insuranceDummy == "" || this.health_insuranceDummy == "Select Health Insurance")
    {
      this.notificationService.error("Error",'Please Select Health Insurance', {timeOut: 2000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    } else{
      this.userProfile.health_insurance = this.health_insuranceDummy;
    }

    this.blockUI.start('please wait...');
    try{

      let data = {
        'data' : {'health_insurance' :this.userProfile.health_insurance}
      }

      this._APIservices.update_insurance(data, this.headers).subscribe(suc => {
        if(suc.body.status == 1 || suc.body.status == "1"){
          this.loadAbout();
          this.goInsurance();
          this.blockUI.stop();
        }
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
    } catch(err){
      this.blockUI.stop();
      console.log('Error occure while update insurance. Error is ', err);
    }
  }

  // Update Interest List
  updateInterest(){
    try{
      this.blockUI.start('please wait...');
      let interest=[]
      for(let item of this.myInterestList){
        if(item.checked==true){
          interest.push(item.interest);
        }
      }
      if(interest.length == 0){
        this.notificationService.error("Error",'Please Select at least one Interest', {timeOut: 2000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});        
        this.blockUI.stop(); // Stop blocking
        return false;
      }else{
      this.goInterest();
      let data= {
        'data' :{'interested_in' :interest }
      }

      this._APIservices.update_interested(data, this.headers).subscribe(suc => {
        if(suc.body.status == 1 || suc.body.status == "1"){
          this.loadAbout();
          this.blockUI.stop();
        }
      },
      err=>{
        var err_res = JSON.parse(err._body);
        this.blockUI.stop();
        this.notificationService.error('Error', err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }
    } catch(err){
      this.blockUI.stop();
      console.log('Error occure while update interest. Error is ', err);
    }
  }

  viewPdf(){
    this.blockUI.start('Downloading...');
    this.isShowControls = false;
    this.doctorCurrentTab();
    setTimeout(()=>{
      this.downLoadPdf();
    },1000);
  }

  downLoadPdf(){
    try{

      if(this.isShowControls == false){
        setTimeout(()=>{
          this.doctorSavedTab();
        },1000);
      }
      this.blockUI.start('Downloading...');
      const elementToPrint = document.getElementById('pdfdownload');
      var positionInfo = elementToPrint.getBoundingClientRect();
      var height = (positionInfo.height || 3471);
      var width = (positionInfo.width || 549.984375);
      const pdf = new jsPDF('p', 'mm', [width, height]);      
      pdf.addHTML(elementToPrint, () => {
        if(this.isShowControls == true){
          pdf.save('visitsheet.pdf');
        } else{
          var string = pdf.output('datauristring');
          var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
          var x = window.open();
              x.document.open();
              x.document.write(iframe);
              x.document.close();
        }
      });
      this.isShowControls = true;       
      this.blockUI.stop(); 
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while downloading PDF. Error is ", e);
    }    
  }

  // Physical Chart
  loadPhysicalChart(){
    this.blockUI.start('please wait...');
    var gaugePhysicalChart = AmCharts.makeChart( "chartdivPhysical", {
      "type": "gauge",
      "theme": "light",
      "creditsPosition": "bottom-left",
      "hideCredits":true,
      "axes": [ {
        "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "valueInterval": 25,
        "bands": [ 
           {
          "color": "#cc4748",
          "endValue": 50,
          "innerRadius": "50%",
          "startValue": 0
          },{
          "color": "#fdd400",
          "innerRadius": "50%",
          "endValue": 75,
          "startValue": 50
        }, {
          "color": "#84b761",
          "endValue": 100,
          "innerRadius": "50%",
          "startValue": 75
        } ],
        "bottomText": "0 AVG",
        "bottomTextYOffset": -20,
        "endValue": 100
      } ],
      "arrows": [ {} ]
    } );
    
    setTimeout(()=>{
      var value = this.totalPhysicalScore;
      if (gaugePhysicalChart) {
        if (gaugePhysicalChart.arrows) {
          if (gaugePhysicalChart.arrows[0]) {
            if (gaugePhysicalChart.arrows[0].setValue) {
              gaugePhysicalChart.arrows[0].setValue(value);
              gaugePhysicalChart.axes[0].setBottomText(value + " AVG");
            }
          }
        }
      }
    },1200);
    this.blockUI.stop();
  }

  //Mental Chart
  loadMentalChart(){
    this.blockUI.start('please wait...');
    var gaugeMentalChart = AmCharts.makeChart( "chartdivMental", {
      "type": "gauge",
      "creditsPosition": "bottom-left",
      "hideCredits":true,
      "theme": "light",
      "axes": [ {
        "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "valueInterval": 25,
        "bands": [ 
           {
          "color": "#cc4748",
          "endValue": 50,
          "innerRadius": "50%",
          "startValue": 0
          },{
          "color": "#fdd400",
          "innerRadius": "50%",
          "endValue": 75,
          "startValue": 50
        }, {
          "color": "#84b761",
          "endValue": 100,
          "innerRadius": "50%",
          "startValue": 75
        } ],
        "bottomText": "0 AVG",
        "bottomTextYOffset": -20,
        "endValue": 100
      } ],
      "arrows": [ {} ]
    } );
    setTimeout(()=>{
      var value = this.totalMentalScore;
      if (gaugeMentalChart) {
        if (gaugeMentalChart.arrows) {
          if (gaugeMentalChart.arrows[0]) {
            if (gaugeMentalChart.arrows[0].setValue) {
              gaugeMentalChart.arrows[0].setValue(value);
              gaugeMentalChart.axes[0].setBottomText(value + " AVG");
            }
          }
        }
      }
    },1200);
    this.blockUI.stop();
    
  }

  // Socail Chart
  loadSocialChart(){
    this.blockUI.start('please wait...');
    var gaugeSocialChart = AmCharts.makeChart( "chartdivSocial", {
      "type": "gauge",
      "theme": "light",
      "creditsPosition": "bottom-left",
      "hideCredits":true,
      "axes": [ {
        "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "valueInterval": 25,
        "bands": [ 
           {
          "color": "#cc4748",
          "endValue": 50,
          "innerRadius": "50%",
          "startValue": 0
          },{
          "color": "#fdd400",
          "innerRadius": "50%",
          "endValue": 75,
          "startValue": 50
        }, {
          "color": "#84b761",
          "endValue": 100,
          "innerRadius": "50%",
          "startValue": 75
        } ],
        "bottomText": "0 AVG",
        "bottomTextYOffset": -20,
        "endValue": 100
      } ],
      "arrows": [ {} ]
    } );

    setTimeout(()=>{
      var value = this.totalSocialScore;
      if (gaugeSocialChart) {
        if (gaugeSocialChart.arrows) {
          if (gaugeSocialChart.arrows[0]) {
            if (gaugeSocialChart.arrows[0].setValue) {
              gaugeSocialChart.arrows[0].setValue(value);
              gaugeSocialChart.axes[0].setBottomText(value + " AVG");
            }
          }
        }
      }
    },1200);
    this.blockUI.stop();
  }

  noHide(){
    this.closePopup = false;
  }

  yesdelete(){
    this.closePopup = false;
    this.careTeamClosed();
  }

  openDeleteConfirm(userID){
    this.deleteUserId=userID;
    this.deleteConfirm = true;
  }

  closeDeleteConfirm(){
   this.deleteConfirm = false;
  }

  saveSheetOpen(){
    this.sheetName = "";
    $("#saveSheetModal").modal('show');
    this.showSheetPopUp.style.display = "block";
  }

  saveSheetName() {

    if(this.sheetName != "") {
      if(this.sheetName.length > 100){
        this.formValidation = true;
        return false;
      }
    } else {
      this.formValidation = true;
      return false;
    }

    try{
      this.blockUI.start('please wait...'); 
      this.showSheetPopUp.style.display = "none";
      $("#saveSheetModal").modal('hide');

      let body_param = {
        "name": this.sheetName        
      };

      this._APIservices.createDoctorVisitSheet({'data': body_param }, this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.doctorSavedTab();
          this.notificationService.success('Sheet', "Sheet saved successfully.",{
            timeOut: 2000, 
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: false 
          });
          this.loadsavesheet();          
          this.blockUI.stop();
        }
      },err=>{
        this.blockUI.stop();
        this.showSheetPopUp.style.display = "none";
        console.log(err);
      });
    }catch(err){
      this.blockUI.stop();
      this.showSheetPopUp.style.display = "none";
      console.log("Error occure while saving sheet. Error is ", err);
    }
  }

  stopWritting(){
    try{
      if(!this.isEmpty(this.userbio)){

        if(this.userbio.length >= 150){
          console.log('maximum character');
          return false;
        }
      }
    } catch(e){
      console.log('Error occure while stop writting. Error is ', e)
    }
  }

  openFirstTime(){
    if(this.doctorVisitModal == false){
      this.doctorVisitModal = true;
      $('#doctorVisitModal').modal('show');
    }    
  }

  // load feeling graph
  load_feelings(){

    try{
      let body_param = {
        "filter" : this.feeling_filter
      }
      this._APIservices.get_feelings(body_param, this.headers).subscribe(suc =>{
        let arrFeelings = [];
        if(suc.body.status == "1" || suc.body.status == 1){
          this.showingFeelingList = suc.body.data;
          this.showingFeelingList.show = true;
          let arrMyFeelings = suc.body.cal.key;
          if(arrMyFeelings.length > 0){
            arrMyFeelings.map((item, index)=>{
              let value = JSON.stringify(item).replace("{",'').replace("}",'');
              let date = moment(value.split(":")[0]).format("MMMM YYYY");
              let severity =  value.split(":")[1];
              let number = (10 * parseInt(severity.replace(/[|&;$%@"<>()+,]/g, "")));
              let bulletcolor = ''
              if(number == 10){
                bulletcolor = '#E73C2C'
              } else if (number == 20){
                bulletcolor = '#FFA500'
              } else if (number == 30){
                bulletcolor = '#cada93'
              } else if (number == 40){
                bulletcolor = '#B9D55A'
              } else if (number == 50){
                bulletcolor = '#0000A0'
              }
              arrFeelings.push({ date: date, visits: number, bulletcolor : bulletcolor});
            });

            var chart = AmCharts.makeChart("chartdivFeeling", {
              "type": "serial",
              "creditsPosition": "bottom-left",
              "hideCredits":true,
              "theme": "light",
              //"dataDateFormat": "MM",
              "marginRight": 80,
              "autoMarginOffset": 50,
              "marginTop": 7,
              "dataProvider": arrFeelings,
              "valueAxes": [{
                minimum: 0,
                maximum: 50,
                strictMinMax: true,
                labelsEnabled: false,
                gridAlpha: 0,
                tickLength: 0,
                guides: [{
                  value: 50,
                  tickLength: 5,
                  lineAlpha: .15,
                  label: "Very Good",
                  lineColor: "#0000A0"
                },{
                  value: 40,
                  tickLength: 5,
                  lineAlpha: .15,
                  label: "Good",
                  lineColor: "#B9D55A"
                },{
                  value: 30,
                  tickLength: 5,
                  lineAlpha: .15,
                  label: "Neutral",
                  lineColor: "#cada93"
                },{
                  value: 20,
                  tickLength: 5,
                  lineAlpha: .15,
                  label: "Bad",
                  lineColor: "#FFA500"
                },{
                  value: 10,
                  tickLength: 5,
                  lineAlpha: .15,
                  label: "Very Bad",
                  lineColor: "#E73C2C"
                }]
              }],
              "mouseWheelZoomEnabled": false,
              "graphs": [{
                "id": "g1",
                "balloonText": "[[value]]",
                "bulletBorderThickness": 1,
                "lineColorField": "bulletcolor",
                "lineThickness" : 2,
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "title": "red line",
                "valueField": "visits",
                "useLineColorForBulletBorder": true,
                "balloon":{
                  "borderThickness": 3,
                  "horizontalPadding": 17,
                  "offsetX": 50,
                  "offsetY": 8
                },
                "balloonFunction": function(graphDataItem, graph) {
                  var value = graphDataItem.values.value;
                  if (value == 10) {
                    return 'Very Bad'
                  } else if (value == 20 ) {
                    return "Bad";
                  } else if (value == 30 ) {
                    return "Neutral";
                  } else if (value == 40 ) {
                    return "Good";
                  }else if (value == 50 ) {
                    return "VeryGood";
                  }
                }         
              }],
              "chartCursor": {
                "limitToGraph":"g1"
              },
              "categoryField": "date",
            });
          } else{
            arrFeelings = [];
          }
        }
        this.blockUI.stop();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while load feeling list. Error is ", err);
    }
  }

  // Get Weights List
  loadWeights(){
    try{
      this.blockUI.start('please wait...');
      let body_param = {
        "filter":this.my_weight_filter,
      };
      this._APIservices.get_Weights(body_param, this.headers).subscribe(suc =>{
        let weightList = suc.body.data;
        this.showingweightList = suc.body.data;
        this.showingweightList.show = true;
        this.arrKG = [];
        this.arrLBS = [];
        if(weightList.length > 0){
          let oWeights = suc.body.data.reverse();
          oWeights.map((item, index)=>{
            let date = new Date(moment(item.weight_date).format("YYYY-MM-DD"));
            date.setDate(date.getDate());
            if(item.weight_type === "kg"){
              this.arrKG.push({ date: date, visits: item.weight_count });
            } else{
              this.arrLBS.push({ date: date, visits: item.weight_count });
            }
          }); 
        }

        AmCharts.makeChart("chartdiv", {
          "type": "serial",
          "creditsPosition": "bottom-left",
          "hideCredits":true,
          "theme": "light",
          "dataDateFormat": "MM",
          "marginRight": 80,
          "autoMarginOffset": 50,
          "marginTop": 7,
          "dataProvider": this.arrKG,
           "valueAxes": [{
              "axisAlpha": 0.2,
              "dashLength": 1,
              "position": "left"
           }],
           "mouseWheelZoomEnabled": false,
           "graphs": [{
              "id": "g1",
              "balloonText": "[[value]]",
              "bulletBorderThickness": 1,
              "lineColor": "#4bc0c0",
              "lineThickness" : 2,
              "bullet": "round",
              "bulletBorderAlpha": 1,
              "bulletColor": "#FFFFFF",
              "hideBulletsCount": 50,
              "title": "red line",
              "valueField": "visits",
              "useLineColorForBulletBorder": true,
              "balloon":{
                "borderThickness": 3,
                "horizontalPadding": 17,
                "offsetX": 50,
                "offsetY": 8
              }
            }],
           "chartCursor": {
             "limitToGraph":"g1"
           },
           "categoryField": "date",
           "categoryAxis": {
              "gridThickness": 2,
              "parseDates": true,
              "minPeriod": "DD",
              "axisColor": "#DADADA",
              "dashLength": 1,
              "minorGridEnabled": true
            }
          });

        AmCharts.makeChart("chartdivLbs", {
          "type": "serial",
          "creditsPosition": "bottom-left",
          "hideCredits":true,
          "theme": "light",
          "dataDateFormat": "MM",
          "marginRight": 80,
          "autoMarginOffset": 50,
          "marginTop": 7,
          "dataProvider": this.arrLBS,
          "valueAxes": [{
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left"
          }],
          "mouseWheelZoomEnabled": false,
          "graphs": [{
            "id": "g1",
            "balloonText": "[[value]]",
            "bulletBorderThickness": 1,
            "lineColor": "#FF6600",
            "lineThickness" : 2,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "red line",
            "valueField": "visits",
            "useLineColorForBulletBorder": true,
            "balloon":{
              "borderThickness": 3,
              "horizontalPadding": 17,
              "offsetX": 50,
              "offsetY": 8
              }           
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
           "categoryField": "date",
           "categoryAxis": {
              "gridThickness": 2,
              "parseDates": true,
              "minPeriod": "DD",
              "axisColor": "#DADADA",
              "dashLength": 1,
              "minorGridEnabled": true
            }
          });

        this.blockUI.stop();
      },err=>{
        var err_res = JSON.parse(err._body);
        console.log("Error occure while load weight graph. Error is ", err_res.message)
      });
    }catch(err){
      this.blockUI.stop();  
      console.log("Error occure while load weight graph. Error is ", err)
    }
  }

  //display_kg_graph
  display_kg_graph(){
    try{
      this.isDisplayKGChart = true;
       let body_param = {
        "filter":this.my_weight_filter
      };
      this._APIservices.get_Weights(body_param, this.headers).subscribe(suc =>{
        if(suc.body.data.length > 0){
          let oWeights = suc.body.data.reverse();
          this.arrKG = [];
          oWeights.map((item, index)=>{
            let date = new Date(moment(item.weight_date).format("YYYY-MM-DD"));
            date.setDate(date.getDate());
            if(item.weight_type === "kg"){
              this.arrKG.push({ date: date, visits: item.weight_count });
            }
          });         
        }

        AmCharts.makeChart("chartdiv", {
          "type": "serial",
          "creditsPosition": "bottom-left",
          "hideCredits":true,
          "theme": "light",
          "dataDateFormat": "MM",
          "marginRight": 80,
          "autoMarginOffset": 50,
          "marginTop": 7,
          "dataProvider": this.arrKG,
          "valueAxes": [{
              "axisAlpha": 0.2,
              "dashLength": 1,
              "position": "left"
          }],
          "mouseWheelZoomEnabled": false,
          "graphs": [{
            "id": "g1",
            "balloonText": "[[value]]",
            "bulletBorderThickness": 1,
            "lineColor": "#4bc0c0",
            "lineThickness" : 2,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "red line",
            "valueField": "visits",
            "useLineColorForBulletBorder": true,
            "balloon":{
              "borderThickness": 3,
              "horizontalPadding": 17,
              "offsetX": 50,
              "offsetY": 8
            }
          }],
         "chartCursor": {
           "limitToGraph":"g1"
         },
         "categoryField": "date",
         "categoryAxis": {
           "gridThickness": 2,
           "parseDates": true,
           "minPeriod": "DD",
           "axisColor": "#DADADA",
           "dashLength": 1,
           "minorGridEnabled": true
          }
        });
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        console.error("Error occure while load weights. Error is ", err_res.message);
      });
    } catch(e){
      console.error("Error occure while display KG graph. Error is ", e);
    }
  }

  //display_lbs_graph
  display_lbs_graph(){
    try{
      this.isDisplayKGChart = false; 
       let body_param = {
        "filter":this.my_weight_filter
      };

      this._APIservices.get_Weights(body_param, this.headers).subscribe(suc =>{
        if(suc.body.data.length > 0){
          let oWeights = suc.body.data.reverse();
          this.arrLBS = [];
          oWeights.map((item, index)=>{
            let date = new Date(moment(item.weight_date).format("YYYY-MM-DD"));
            date.setDate(date.getDate());
            if(item.weight_type === "lbs"){
              this.arrLBS.push({ date: date, visits: item.weight_count });
            }
          });         
        }
        
        AmCharts.makeChart("chartdivLbs", {
          "type": "serial",
          "creditsPosition": "bottom-left",
          "hideCredits":true,
          "theme": "light",
          "dataDateFormat": "MM",
          "marginRight": 80,
          "autoMarginOffset": 50,
          "marginTop": 7,
          "dataProvider": this.arrLBS,
          "valueAxes": [{
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left"
          }],
          "mouseWheelZoomEnabled": false,
          "graphs": [{
            "id": "g1",
            "balloonText": "[[value]]",
            "bulletBorderThickness": 1,
            "lineColor": "#FF6600",
            "lineThickness" : 2,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "red line",
            "valueField": "visits",
            "useLineColorForBulletBorder": true,
            "balloon":{
              "borderThickness": 3,
              "horizontalPadding": 17,
              "offsetX": 50,
              "offsetY": 8
            }           
          }],
          "chartCursor": {
            "limitToGraph":"g1"
          },
          "categoryField": "date",
          "categoryAxis": {
            "gridThickness": 2,
            "parseDates": true,
            "minPeriod": "DD",
            "axisColor": "#DADADA",
            "dashLength": 1,
            "minorGridEnabled": true
          }
        });
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        console.error("Error occure while load weights. Error is ", err_res.message);
      });  
    } catch(e){
      console.error("Error occure while display KG graph. Error is ", e);
    }
  }

  loadQollist(){
    try{
      this.blockUI.start('please wait...');
      let data={
        'filter':this.qol_survey_filter,
      }
      this._APIservices.get_qol_scorelist(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.showingqol_surveys = suc.body.data;
          this.showingqol_surveys.show = true;
          this.qolchartcomp.totalSocialScore = 0;
          this.qolchartcomp.totalMentalScore = 0;
          this.qolchartcomp.totalPhysicalScore = 0;
          this.qolchartcomp.qolid = "about";
          this.qolchartcomp.about = true;

          this.qolchartcomp.totalSocialScore= Number(suc.body.social_avg);
          this.qolchartcomp.totalMentalScore= Number(suc.body.mental_avg);
          this.qolchartcomp.totalPhysicalScore= Number(suc.body.physical_avg);

          setTimeout(()=>{
            this.qolchartcomp.loadPhysicalChart(this.qolchartcomp.totalPhysicalScore);
            this.qolchartcomp.loadMentalChart(this.qolchartcomp.totalMentalScore);
            this.qolchartcomp.loadSocialChart(this.qolchartcomp.totalSocialScore);
            this.qolchartcomp.ngOnInit()
            this.blockUI.stop();
          },1500);
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
      console.log("Error occure while load QOL list. Error is  ",err);
    }
  }
}
