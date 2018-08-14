import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { getYear } from 'date-fns';
import * as en from 'date-fns/locale/fr';
import * as enLocale from 'date-fns/locale/en';
import * as moment from 'moment';

declare var $ : any;
declare var jQuery : any;
declare var window: any;
declare var FB: any;

var countryjson = require('./../../../../common/utilities/country.json');
var statejson = require('./../../../../common/utilities/state.json');
var monthjson = require('./../../../../common/utilities/month.json');

@Component({
  selector: 'aq-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent extends HeadersProvider implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  element: HTMLImageElement;
  resdata: any;

  patientModel: any;
  userTypeModel: any;
  userPatienteModel: any;
  userResearcherModel: any;
  userPhysicianModel: any;
  userPhysSchoolDetails: any;
  userResMoreDetails: any;
  userPhysExtraDetails: any;
  userResForm: any;
  userPhysMoreDetails: any;
  userPhysForm: any;
  first_name: string = "";
  last_name:string = "";
  email:string = "";
  username:string = "";
  password:string = "";
  useremail: string = "";
  userpassword: string = "";
  birthday:Date = new Date();
  isremeber:boolean = false;
  firstCalendarDay: any;
  date: Date = new Date();
  degree: any;
  year_completed: any;
  year_completed_phys: any;
  bio: any = "";
  months: any;
  days: any = [];
  years: any = [];
  years_phys: any = [];
  license_approval_urls: any;
  urls: any = [];
  fieldArray: Array<any> = [];
  fieldArrayLicense: Array<any> = [];
  fieldArrayDegree: Array<any> = [];
  newAttribute: any = '';
  newAttributeLicense: any = '';
  newAttributeDegree: any = {};
  fileArray: Array<any> = [];
  newAttributeFile: any = '';
  url_form: any;
  file_form: any;
  url_form_phys: any;
  url_form_phys_license: any;
  url_form_phys_degree: any;
  file_form_phys: any;
  file_form_phys_license: any;
  file_form_phys_degree: any;
  conditionfilter: string = "";
  searchDegreeKeyword: string = "";
  searchDegreeItems: any = [];
  showDegreeList: boolean = false;
  degree_id: number;
  disableBtn: boolean;
  post_degree: string;
  countries: any;
  country_license: string = "";
  state_license: string = "";
  newAttributeFileLicense: any = '';
  fileArrayLicense: Array<any> = [];
  newAttributeFileDegree: any = '';
  fileArrayDegree: Array<any> = [];
  searchPracticeKeyword: string = "";
  searchPracticeItems: any = [];
  showPracticeList: boolean = false;
  practice_id: number;
  location_of_clinical_facility: any;
  name_of_clinical_facility: any;
  signup_successful: any;
  med_school: string = "";
  myVar:boolean;

  loginPatientForm: boolean = true;
  loginPhysResForm: boolean = false;
  loginBtn: boolean = true;
  resetPasswordBtn: boolean = false;
  resendBtn: boolean = false;
  forgetPasswordForm: boolean = false;
  resetPasswordSuccess: boolean = false;
  resetPasswordSuccessBtn: boolean = false;
  resetPasswordFail: boolean = false;
  patientRole: boolean = true;
  emailPatient: any;
  emailPhysRes: any;
  emailReset: any;
  rememberMe: boolean;
  encodedPassword: any;
  decodedPassword: any;
  loader: boolean;

  dob_month: any;
  dob_day: any;
  dob_year: any;

  userRole : string = "patient"
  invitation_token : string = "";
  states : any = [];

  constructor(
    private _router:Router, 
    private _APIservices:SCApi, 
    private notificationService: NotificationsService, 
    private activatedRoute: ActivatedRoute
    ) {
    super();

    if (this._localStorage.get('profile') && this._localStorage.get('profile').hasOwnProperty('AuthToken'))
      this._router.navigate(['/app/dashboard/timeline']);

    //bind month from json
    this.months = monthjson;

    for(var i = 1; i <= 31; i++){
      this.days.push(i);
    }

    for(var i = 1910; i <= getYear(this.date); i++){
      this.years.push(i);
    }

    for(var i = 1950; i <= getYear(this.date); i++){
      this.years_phys.push(i);
    }

    //bind country from json
    this.countries = countryjson;

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = () => {
      FB.init({
        appId            : '1463731190384773',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10'
      });
      FB.AppEvents.logPageView();
    };
  }

  ngOnInit() {

    this.userRole = (this.activatedRoute.snapshot.queryParams["role"] || 'patient');
    this.invitation_token = (this.activatedRoute.snapshot.queryParams["invitation_token"] || '');

    this.userTypeModel=document.getElementById('signUpModal');
    this.userPatienteModel=document.getElementById('signUpPatient');

    this.userResearcherModel = document.getElementById('signUpResearcher');
    this.userResMoreDetails = document.getElementById('researcherMoreDetails');
    this.userResForm = document.getElementById('researcherForm');
    
    this.userPhysicianModel = document.getElementById('signUpPhysician');
    this.userPhysSchoolDetails = document.getElementById('physicianSchoolDetails');
    this.userPhysMoreDetails = document.getElementById('physicianMoreDetails');
    this.userPhysExtraDetails = document.getElementById('physicianExtraDetails');
    this.userPhysForm = document.getElementById('physicianForm');

    this.url_form = document.getElementById('url_form');
    this.file_form = document.getElementById('file_form');

    this.url_form_phys = document.getElementById('url_form_phys');
    this.url_form_phys_license = document.getElementById('url_form_phys_license');
    this.url_form_phys_degree = document.getElementById('url_form_phys_degree');
    this.file_form_phys = document.getElementById('file_form_phys');
    this.file_form_phys_license = document.getElementById('file_form_phys_license');
    this.file_form_phys_degree = document.getElementById('file_form_phys_degree');

    this.signup_successful = document.getElementById('signup_successful');
    this.disableBtn = false;

    this.emailPatient = document.getElementById('emailPatient');
    this.emailPhysRes = document.getElementById('emailPhysRes');
    this.emailReset = document.getElementById('emailReset');

    if (window.FB) {
      window.FB.XFBML.parse();
    }
    
    if(this._localStorage.get('rememberMe') === true){
      let email:any = this._localStorage.get('email');
      let password:any = this._localStorage.get('password');
      this.decodedPassword = window.atob(password);
      this.useremail = email;
      this.userpassword = this.decodedPassword;
      this.rememberMe = true;
    }

    this.loader = false;
  }

  openSelectTypemodel(){
    this.first_name="";
    this.last_name="";
    this.email="";
    this.username="";
    this.password="";
    this.birthday = new Date();
    this.dob_month = 'undefined';
    this.dob_day = 'undefined';
    this.dob_year = 'undefined';
    this.year_completed = 'undefined';
    this.year_completed_phys = 'undefined';
    this.userTypeModel.style.display = "block";
    this.rememberMe = false;
    this.bio = "";
    this.urls = [];
    this.conditionfilter = "";
    this.searchDegreeKeyword = "";
    this.searchDegreeItems = [];
    this.showDegreeList = false;
    this.searchPracticeKeyword = "";
    this.searchPracticeItems = [];
    this.showPracticeList = false;
    this.state_license = "";
    this.country_license = '';
    this.med_school = "";
    this.newAttribute = "";
    this.fieldArray = [];
    this.fileArray = [];
    this.newAttributeFile = "";
    this.newAttributeFileLicense = "";
    this.newAttributeFileDegree = "";
    this.fileArrayLicense = [];
    this.fileArrayDegree = [];
    this.fieldArrayLicense = [];
    this.location_of_clinical_facility = "";
    this.name_of_clinical_facility = "";
    this.file_form_phys_license.style.display = "block";
    this.file_form_phys_degree.style.display = "block";
  }

  closeSelectTypemodel(){
    $("#confirmationModalFeeling").modal('show');
  }

  noHide(){
    $("#confirmationModalFeeling").modal('hide');
  }

  yesdelete(){
    $("#confirmationModalFeeling").modal('hide');
    this.userPatienteModel.style.display = "none";
    this.userTypeModel.style.display = "none";
    this.userResearcherModel.style.display = "none";
    this.userPhysicianModel.style.display = "none";
  }

  openPatientModal(){
    this.openSelectTypemodel();
    this.userTypeModel.style.display = "none";
    this.userPatienteModel.style.display = "block";
    this.userResearcherModel.style.display = "none";
    this.userPhysicianModel.style.display = "none";
    this.signup_successful.style.display = "none";
  }

  closePatientModal(){
    $("#confirmationModalFeeling").modal('show');
  }

  closeResearcherModal(){
    $("#confirmationModalFeeling").modal('show');
  }

  closePhysicianModal(){
    $("#confirmationModalFeeling").modal('show');
  }

  openResearcherModal(){
    this.openSelectTypemodel();
    this.userTypeModel.style.display = "none";
    this.userPatienteModel.style.display = "none";

    this.userResearcherModel.style.display = "block";
    this.userResForm.style.display = "block";
    this.userResMoreDetails.style.display = "none";

    this.userPhysicianModel.style.display = "none";
    this.userPhysForm.style.display = "none";
    this.userPhysMoreDetails.style.display = "none";

    this.signup_successful.style.display = "none";
  }

  researcherMoreDetails(){
    this.userResMoreDetails.style.display = "block";
    this.userResForm.style.display = "none";
  }

  openPhysicianModal(){
    this.openSelectTypemodel();
    this.userTypeModel.style.display = "none";
    this.userPatienteModel.style.display = "none";
    
    this.userResearcherModel.style.display = "none";
    this.userResForm.style.display = "none";
    this.userResMoreDetails.style.display = "none";

    this.userPhysicianModel.style.display = "block";
    this.userPhysForm.style.display = "block";
    this.userPhysSchoolDetails.style.display = "none";
    this.userPhysMoreDetails.style.display = "none";
    this.userPhysExtraDetails.style.display = "none";

    this.signup_successful.style.display = "none";
  }

  physicianSchoolDetails(){
    this.userPhysSchoolDetails.style.display = "block";
    this.userPhysMoreDetails.style.display = "none";
    this.userPhysExtraDetails.style.display = "none";
    this.userPhysForm.style.display = "none";
  }

  physicianMoreDetails(){
    this.userPhysSchoolDetails.style.display = "none";
    this.userPhysMoreDetails.style.display = "block";
    this.userPhysExtraDetails.style.display = "none";
    this.userPhysForm.style.display = "none";
  }

  physicianExtraDetails(){
    this.userPhysSchoolDetails.style.display = "none";
    this.userPhysExtraDetails.style.display = "block";
    this.userPhysMoreDetails.style.display = "none";
  }

  closeSuccessModal(){
    this.signup_successful.style.display = "none";
    this.first_name="";
    this.last_name="";
    this.email="";
    this.username="";
    this.password="";
    this.useremail="";
    this.userpassword="";
    this.birthday=new Date();
    this.isremeber=false;
    this.bio = "";
    this.urls = [];
    this.conditionfilter = "";
    this.searchDegreeKeyword = "";
    this.searchDegreeItems = [];
    this.showDegreeList = false;
    this.searchPracticeKeyword = "";
    this.searchPracticeItems = [];
    this.showPracticeList = false;
    this.state_license = "";
    this.country_license = "";
    this.med_school = "";
    this.newAttribute = "";
    this.fieldArray = [];
    this.fileArray = [];
    this.newAttributeFile = "";
    this.newAttributeFileLicense = "";
    this.newAttributeFileDegree = "";
    this.fileArrayLicense = [];
    this.fileArrayDegree = [];
    this.fieldArrayLicense = [];
    this.location_of_clinical_facility = "";
    this.name_of_clinical_facility = "";
    this.file_form_phys_license.style.display = "block";
    this.file_form_phys_degree.style.display = "block";
  }
    
  addFieldValue(){
    var url_regex = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})";
    if (this.newAttribute == undefined || !this.newAttribute.match(url_regex)){
      this.notificationService.error("Error",'Please enter a valid URL', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }

    this.fieldArray.push({"url":this.newAttribute, "visibility": "all_users"});
    this.newAttribute = "";
    if (this.fieldArray.length >= 5){
      this.url_form.style.display = "none";
    }
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
    if (this.fieldArray.length < 5){
      this.url_form.style.display = "block";
    }
  }

  newAttributeFileChange(){
    this.fileArray.push(this.newAttributeFile);
    this.newAttributeFile = {};
    if (this.fileArray.length >= 5){
      this.file_form.style.display = "none";
    }
  }

  deleteFileValue(index) {
    this.fileArray.splice(index, 1);
    if (this.fileArray.length < 5){
      this.file_form.style.display = "block";
    }
  }

  onAttach(event){
    const files = event.target.files || event.srcElement.files;
    const file = files[0];
    var file_regex = '([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg|.pdf)$';
    if(!file.name.match(file_regex)){
      this.notificationService.error("Error",'Unable to attach. File format not accepted', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    this.fileArray.push({'visibility':'all_users','is_upload': true,'file':file});
    this.newAttributeFile = null;
    if (this.fileArray.length >= 5){
      this.file_form.style.display = "none";
    }
  }

  addFieldValuePhys(){
    var url_regex = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})";
    if (this.newAttribute == undefined || !this.newAttribute.match(url_regex)){
      this.notificationService.error("Error",'Please enter a valid URL', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    this.fieldArray.push({"url":this.newAttribute, "visibility": "all_users"});
    this.newAttribute = "";
    if (this.fieldArray.length >= 5){
      this.url_form_phys.style.display = "none";
    }
  }

  addFieldValuePhysLicense(){
    var url_regex = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})";
    if (this.newAttributeLicense == undefined || !this.newAttributeLicense.match(url_regex)){
      this.notificationService.error("Error",'Please enter a valid URL', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    this.fieldArrayLicense.push({"url":this.newAttributeLicense, "visibility": "all_users"});
    this.newAttributeLicense = "";
    if (this.fieldArrayLicense.length >= 5){
      this.url_form_phys_license.style.display = "none";
    }
  }

  deleteFieldValuePhys(index) {
    this.fieldArrayLicense.splice(index, 1);
    if (this.fieldArrayLicense.length < 5){
      this.url_form_phys_license.style.display = "block";
    }
  }

  newAttributeFileChangePhys(){
    this.fileArray.push(this.newAttributeFile);
    this.newAttributeFile = null;
    if (this.fileArray.length >= 5){
      this.file_form_phys.style.display = "none";
    }
  }

  deleteFileValuePhys(index) {
    this.fileArray.splice(index, 1);
    if (this.fileArray.length < 5){
      this.file_form_phys.style.display = "block";
    }
  }

  onAttachPhys(event){
    const files = event.target.files || event.srcElement.files;
    const file = files[0];
    var file_regex = '([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg|.pdf)$';
    if(!file.name.match(file_regex)){
      this.notificationService.error("Error",'Unable to attach. File format not accepted', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    this.fileArray.push({'visibility':'all_users','is_upload': true,'file':file});
    this.newAttributeFile = null;
    if (this.fileArray.length >= 5){
      this.file_form_phys.style.display = "none";
    }
  }

  onAttachPhysLicense(event){
    const files = event.target.files || event.srcElement.files;
    const file = files[0];
    var file_regex = '([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg|.pdf)$';
    if(!file.name.match(file_regex)){
      this.notificationService.error("Error",'Unable to attach. File format not accepted', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    this.fileArrayLicense = file;
    this.newAttributeFileLicense = null;
    this.file_form_phys_license.style.display = "none";
  }

  deleteFileValuePhysLicense(){
    this.fileArrayLicense = [];
    this.file_form_phys_license.style.display = "block";
  }

  onAttachPhysDegree(event){
    const files = event.target.files || event.srcElement.files;
    const file = files[0];
    var file_regex = '([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg|.pdf)$';
    if(!file.name.match(file_regex)){
      this.notificationService.error("Error",'Unable to attach. File format not accepted', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    this.fileArrayDegree = file;
    this.newAttributeFileDegree = null;
    this.file_form_phys_degree.style.display = "none";
  }

  deleteFileValuePhysDegree(){
    this.fileArrayDegree = [];
    this.file_form_phys_degree.style.display = "block";
  }

  searchDegrees(searchDegree: string){
    this.degree_id = undefined;
    if (searchDegree == ""){
      this.showDegreeList = false;
      return false;
    }
    try{
      this.degree_id = undefined;
      let data = {
        'searchDegreeKeyword': searchDegree
      };
      this._APIservices.search_degrees(data, this.headers)
      .subscribe(
        suc=>{
          if(suc.body.status==1 || suc.body.status=="1"){
            this.showDegreeList = true;
            this.searchDegreeItems = suc.body.data;
            if(this.searchDegreeItems.length == 0){
              this.showDegreeList = false;
              this.notificationService.remove();
              this.notificationService.alert(
                'Warning',
                'Degree not found! But will be posted once submitted.',
                {
                  timeOut: 5000, showProgressBar: false, pauseOnHover: false, clickToClose: false
                }
              );
            }
          }
        },
        err=>{
          console.log(err);
          this.showDegreeList = false;
          this.searchDegreeItems=[];
          var err_res = JSON.parse(err._body);
          this.notificationService.error(
            'Error',
            err_res.message,
            {
              timeOut: 5000, showProgressBar: false, pauseOnHover: false, clickToClose: false
            }
          );
        }
      );
    } catch(err){
      this.showDegreeList = false;
      this.searchDegreeItems=[];
      var err_res = JSON.parse(err._body);
      this.notificationService.error(
        'Error',
        err_res.message,
        {
          timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false
        }
      );
    }
  }

  selectDegree(item){
    this.degree_id = item.id;
    this.searchDegreeKeyword = item.name;
    this.showDegreeList = false;
  }

  searchPractices(searchPractice: string){
    this.practice_id = undefined;
    if (searchPractice == ""){
      this.showPracticeList = false;
      return false;
    }
    try{
      this.practice_id = undefined;
      let data = {
        'searchPracticeKeyword': searchPractice
      };
      this._APIservices.search_currently_practicing(data, this.headers)
      .subscribe(
        suc=>{
          if(suc.body.status==1 || suc.body.status=="1"){
            this.showPracticeList = true;
            this.searchPracticeItems = suc.body.data;
            if(this.searchPracticeItems.length == 0){
              this.showPracticeList = false;
              this.notificationService.remove();
              this.notificationService.alert(
                'Warning',
                'Practice not found! But will be posted once submitted.',
                {
                  timeOut: 5000, showProgressBar: false, pauseOnHover: false, clickToClose: false
                }
              );
            }
          }
        },
        err=>{
          console.log(err);
          this.showPracticeList = false;
          this.searchPracticeItems=[];
          var err_res = JSON.parse(err._body);
          this.notificationService.error(
            'Error',
            err_res.message,
            {
              timeOut: 5000, showProgressBar: false, pauseOnHover: false, clickToClose: false
            }
          );
        }
      );
    } catch(err){
      this.showPracticeList = false;
      this.searchPracticeItems=[];
      var err_res = JSON.parse(err._body);
      this.notificationService.error(
        'Error',
        err_res.message,
        {
          timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false
        }
      );
    }
  }

  selectPractice(item){
    this.practice_id = item.id;
    this.searchPracticeKeyword = item.name;
    this.showPracticeList = false;
  }

  doLogin(){
    this.loader = true;
    this.disableBtn = true;
    if(this.useremail==""){
       this.notificationService.error("Error",'Please enter username or  email', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       this.disableBtn = false;
       this.loader = false;
       return false;
    }
    if(this.userpassword==""){
       this.notificationService.error("Error",'Please enter a password', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       this.disableBtn = false;
       this.loader = false;
       return false;
    }
    var emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if(!(emailfilter.test(this.useremail))){
      this.notificationService.error("Error",'Please enter a valid email', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      this.disableBtn = false;
      this.loader = false;
      return false;
    }
    if(this.rememberMe == true){
      this._localStorage.set('mypassword', this.userpassword);
      this._localStorage.set('rememberMe', true);
      this._localStorage.set('email', this.useremail);
      this.encodedPassword = window.btoa(this.userpassword);
      this._localStorage.set('password', this.encodedPassword);
    } else {
      this._localStorage.remove('email');
      this._localStorage.remove('password');
      //this._localStorage.set('mypassword', this.userpassword);
      this._localStorage.remove('rememberMe');
    }
    this.myVar = true;
    let body_param = {
      "email":this.useremail,
      "password":this.userpassword
    };
    this._APIservices.api_signin({'body':body_param}, this.headers).subscribe(suc =>{
      this.resdata = suc.body;
      if(this.resdata.status == '1' || this.resdata.status == 1){
        if (
          (this.patientRole && this.resdata.data.role == "patient") || 
          (!this.patientRole && ((this.resdata.data.role == "researcher" || this.resdata.data.role == "physician")))
        )
        {
          this._localStorage.set('email', this.useremail);
          this._localStorage.set('id', this.resdata.data.id);
          this._localStorage.set('role', this.resdata.data.role);
          this._localStorage.set('signInWithFacebook', false);
          this._localStorage.set('profile',{ AuthToken: this.resdata.data.authentication_token });
          this.userPatienteModel.style.display = "none";
          if(this.resdata.data.role == "researcher"){
            this._router.navigate(['/app/dashboard/researcher']);
          }else if(this.resdata.data.role == "physician") {
            this._router.navigate(['/app/dashboard/physician']);
          }else{
            this._router.navigate(['/app/dashboard']);
          }
          this.myVar = false;
          $("#loginModal").modal("hide");
        }
        else
        {
          this.loader = false;
          this.disableBtn = false;
          var message = (this.patientRole) ? "Only patient can Login from here. If you are a Physician/Researcher, you should Login from Researcher & Physician Login."
                                       : "Only Researcher & Physician can Login from here. If you are a patient, you should login from Patient Login."
          this.notificationService.error('Error',message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        }
        
      }
    }, err=>{
      var err_res = JSON.parse(err._body);
      this.loader = false;
      this.disableBtn = false;
      this.notificationService.error('Error',err_res.message,{ 
        timeOut: 3000, 
        showProgressBar: false, 
        pauseOnHover: false, 
        clickToClose: false 
      });
    });
  }

  doPatientsignup(){
    if(this.first_name==""){
      this.notificationService.error("Error",'Please enter firstname', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }

    if(this.last_name==""){
      this.notificationService.error("Error",'Please enter  lastname', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }if(this.email==""){
      this.notificationService.error("Error",'Please enter email', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }

    var emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if(!(emailfilter.test(this.email))){
      this.notificationService.error("Error",'Please enter correct email format', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    if(this.password==""){
       this.notificationService.error("Error",'Please enter password', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    
    if(this.dob_month == undefined || this.dob_day == undefined || this.dob_year == undefined){
      this.notificationService.error("Error",'Please complete birthday field', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }

    if(this.rememberMe == true){
      this._localStorage.set('rememberMe', true);
      this._localStorage.set('email', this.useremail);
      this.encodedPassword = window.btoa(this.userpassword);
      this._localStorage.set('password', this.encodedPassword);
    } else {
      this._localStorage.remove('email');
      this._localStorage.remove('password');
      this._localStorage.remove('rememberMe');
    }

    this.blockUI.start('please wait...')
    // let dateofbirth=moment(this.birthday).format('YYYY/MM/DD');
    let dob_day = ('0' + this.dob_day).slice(-2);
    let dob = new Date(this.dob_year+'/'+this.dob_month+'/'+dob_day);
    let dob_moment = moment(dob).format('YYYY/MM/DD');
    
    let body_param = {
      "first_name": (this.first_name || ""),
      "last_name":(this.last_name || ""),
      "email":(this.email || ""),
      "password":(this.password || ""),
      "role": (this.userRole == undefined || this.userRole == '') ? 'patient' : this.userRole,
      "birthday":(dob_moment || "")
    };
    
    if(!this.isEmpty(this.invitation_token)){
      body_param["invitation_token"] = this.invitation_token;
    }

    this._APIservices.api_patient_signup({'body':body_param}, this.headers).subscribe(suc =>{
      this.resdata = suc.body;
      if(this.resdata.status == '1' || this.resdata.status == 1){
        this.userTypeModel.style.display = "none";
        this.userPatienteModel.style.display = "none";
        this.userResearcherModel.style.display = "none";
        this.userResForm.style.display = "none";
        this.userResMoreDetails.style.display = "none";
        this.userPhysicianModel.style.display = "none";
        this.userPhysForm.style.display = "none";
        this.userPhysMoreDetails.style.display = "none";
        this.userPhysExtraDetails.style.display = "none";
        this.signup_successful.style.display = "block";
        this.disableBtn = false;
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

  doResearcherAddDetails(){
    if(this.first_name==""){
       this.notificationService.error("Error",'Please enter firstname', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    if(this.last_name==""){
       this.notificationService.error("Error",'Please enter  lastname', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }if(this.email==""){
       this.notificationService.error("Error",'Please enter email', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    var emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if(!(emailfilter.test(this.email))){
      this.notificationService.error("Error",'Please enter correct email format', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    if(this.password==""){
       this.notificationService.error("Error",'Please enter password', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    } else if(this.password.length < 7){
      this.notificationService.error("Error",'Password must be 7 or more characters', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    this.researcherMoreDetails();
  }

  doResearcherSignup(){
    this.disableBtn = true;

    if(this.rememberMe === true){
      this._localStorage.set('rememberMe', true);
      this._localStorage.set('email', this.useremail);
      this.encodedPassword = window.btoa(this.userpassword);
      this._localStorage.set('password', this.encodedPassword);
    } else {
      this._localStorage.remove('email');
      this._localStorage.remove('password');
      this._localStorage.remove('rememberMe');
    }

    this.blockUI.start('please wait...');
    if (this.degree_id == undefined && this.searchDegreeKeyword){
      let param = {
        "name": this.searchDegreeKeyword,
      };

      this._APIservices.post_degrees({'body': param}, this.headers).subscribe(suc =>{
        this.resdata = suc.body;
        if(this.resdata.status == '1' || this.resdata.status == 1){
          this.degree_id = this.resdata.data.id;
        }
      },err=>{
        this.blockUI.stop();
        this.disableBtn = false;
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }
    
    let data = {
      "first_name": this.first_name,
      "last_name": this.last_name,
      "email": this.email,
      "password": this.password,
      "role": 'researcher',
      "degree_earned_id": this.degree_id,
      "year_completed": this.year_completed,
      "bio": this.bio,
      "license_approval_urls": JSON.stringify(this.fieldArray),
      "attachments": this.fileArray
    };

    this._APIservices.api_researcher_signup(data, this.headers).subscribe(suc =>{
      this.resdata = suc.body;
      if(this.resdata.status == '1' || this.resdata.status == 1){
        this.userTypeModel.style.display = "none";
        this.userPatienteModel.style.display = "none";
        this.userResearcherModel.style.display = "none";
        this.userResForm.style.display = "none";
        this.userResMoreDetails.style.display = "none";
        this.userPhysicianModel.style.display = "none";
        this.userPhysForm.style.display = "none";
        this.userPhysMoreDetails.style.display = "none";
        this.userPhysExtraDetails.style.display = "none";
        this.signup_successful.style.display = "block";
        this.disableBtn = false;
      }
      this.blockUI.stop();
    },err=>{
      this.blockUI.stop();
      this.disableBtn = false;
      var err_res = JSON.parse(err._body);
      this.notificationService.error('Error',err_res.message,{ 
        timeOut: 3000, 
        showProgressBar: false, 
        pauseOnHover: false, 
        clickToClose: false 
      });

      if(err_res.message == 'Email has already been taken'){
        this.userResForm.style.display = "block";
        this.userResMoreDetails.style.display = "none";
      }
    });
  }

  doPhysicianSchoolDetails(){
    if(this.first_name==""){
       this.notificationService.error("Error",'Please enter firstname', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    if(this.last_name==""){
       this.notificationService.error("Error",'Please enter  lastname', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }if(this.email==""){
       this.notificationService.error("Error",'Please enter email', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    var emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if(!(emailfilter.test(this.email))){
      this.notificationService.error("Error",'Please enter correct email format', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    if(this.password==""){
       this.notificationService.error("Error",'Please enter password', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    } else if(this.password.length < 7){
      this.notificationService.error("Error",'Password must be 7 or more characters', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    this.physicianSchoolDetails();
  }

  doPhysicianAddDetails(){
    if(this.med_school == ""){
       this.notificationService.error("Error",'Please enter the school you have attended', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    if(this.degree_id == undefined && !this.searchDegreeKeyword){
       this.notificationService.error("Error",'Please enter your degree earned', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       this.disableBtn = false;
       return false;
    }
    if(this.year_completed_phys == undefined){
       this.notificationService.error("Error",'Please enter the year you completed your degree', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    if(this.fileArrayDegree.length == 0){
       this.notificationService.error("Error",'Please upload your supporting documents for your degree', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    this.physicianMoreDetails();
  }

  doPhysicianExtraDetails(){
    if(this.country_license == undefined || this.country_license == ''){
       this.notificationService.error("Error",'Please enter Country of License', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    if(this.state_license==""){
       this.notificationService.error("Error",'Please enter State of License', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    if(this.fileArrayLicense.length == 0){
       this.notificationService.error("Error",'Please upload your supporting documents for your license ', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       return false;
    }
    this.physicianExtraDetails();
  }

  doPhysicianSignup(){
    this.disableBtn = true;
    if(this.practice_id == undefined && !this.searchPracticeKeyword){
       this.notificationService.error("Error",'Please enter your current practice', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       this.disableBtn = false;
       return false;
    }
    if(this.location_of_clinical_facility == undefined || this.location_of_clinical_facility == ''){
       this.notificationService.error("Error",'Please enter location of clinical facility', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       this.disableBtn = false;
       return false;
    }
    if(this.name_of_clinical_facility == undefined || this.name_of_clinical_facility == ""){
       this.notificationService.error("Error",'Please enter name of clinical facility', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
       this.disableBtn = false;
       return false;
    }
    if(this.fileArray.length == 0){
      this.notificationService.error("Error",'Please upload documents or image', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      this.disableBtn = false;
      return false; 
    }

    if(this.rememberMe == true){
      this._localStorage.set('rememberMe', true);
      this._localStorage.set('email', this.useremail);
      this.encodedPassword = window.btoa(this.userpassword);
      this._localStorage.set('password', this.encodedPassword);
    } else {
      this._localStorage.remove('email');
      this._localStorage.remove('password');
      this._localStorage.remove('rememberMe');
    }

    if (this.degree_id == undefined && this.searchDegreeKeyword){
      let param = {
        "name": this.searchDegreeKeyword,
      };

      this._APIservices.post_degrees({'body': param}, this.headers).subscribe(suc =>{
        this.resdata = suc.body;
        if(this.resdata.status == '1' || this.resdata.status == 1){
          this.degree_id = this.resdata.data.id;
        }
      },err=>{
        this.disableBtn = false;
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }

    if (this.practice_id == undefined && this.searchPracticeKeyword){

      let param = {
        "name": this.searchPracticeKeyword,
      };

      this._APIservices.post_currently_practicing({'body': param}, this.headers).subscribe(suc =>{
        this.resdata = suc.body;
        if(this.resdata.status == '1' || this.resdata.status == 1){
          this.practice_id = this.resdata.data.id;
        }
      },err=>{
        this.disableBtn = false;
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }

    let data = {
      "first_name": this.first_name,
      "last_name": this.last_name,
      "email": this.email,
      "password": this.password,
      "role": 'physician',
      "current_practice_id": this.practice_id,
      "year_completed": this.year_completed_phys,
      "degree_earned_id": this.degree_id,
      "med_school": this.med_school,
      "state_license": this.state_license,
      "bio": this.bio,
      "license_approval_urls": JSON.stringify(this.fieldArrayLicense),
      "degree": this.fileArrayDegree,
      "license": this.fileArrayLicense,
      "location_of_clinical_facility": this.location_of_clinical_facility,
      "name_of_clinical_facility": this.name_of_clinical_facility,
      "attachments": this.fileArray
    };
    
    this._APIservices.api_physician_signup(data, this.headers).subscribe(suc =>{
      this.resdata = suc.body;
      if(this.resdata.status == '1' || this.resdata.status == 1){
        this.userTypeModel.style.display = "none";
        this.userPatienteModel.style.display = "none";
        this.userResearcherModel.style.display = "none";
        this.userResForm.style.display = "none";
        this.userResMoreDetails.style.display = "none";
        this.userPhysicianModel.style.display = "none";
        this.userPhysForm.style.display = "none";
        this.userPhysMoreDetails.style.display = "none";
        this.userPhysExtraDetails.style.display = "none";
        this.signup_successful.style.display = "block";
        this.disableBtn = false;
      }
    },err =>{
      this.disableBtn = false;
      var err_res = JSON.parse(err._body);
      this.notificationService.error('Error',err_res.message,{ 
        timeOut: 3000, 
        showProgressBar: false, 
        pauseOnHover: false, 
        clickToClose: false 
      });

      if(err_res.message == 'Email has already been taken'){
        this.userPhysForm.style.display = "block";
        this.userPhysExtraDetails.style.display = "none";
      }
    });
  }

  keyDownLogin(event){
    if(event.keyCode == 13) {
      this.doLogin();
    }
  }

  openLoginModal(role){
    this.loginBtn = true;
    this.forgetPasswordForm = false;
    this.resetPasswordBtn = false;
    this.resendBtn = false;
    this.resetPasswordSuccess = false;
    this.resetPasswordSuccessBtn = false;
    this.resetPasswordFail = false;
    if (role == true){
      this.loginPatientForm = true;
      this.loginPhysResForm = false;
      $('#emailPatient').focus();
    } else {
      this.loginPatientForm = false;
      this.loginPhysResForm = true;
      $('#emailPhysRes').focus();
    }
  }
  
  patientLoginForm(event){
    event.target.classList.add('active');
    event.target.parentElement.parentElement.childNodes[3].firstElementChild.classList.remove('active1');
    this.loginPatientForm = true;
    this.loginPhysResForm = false;
    this.loginBtn = true;
    this.forgetPasswordForm = false;
    this.resetPasswordBtn = false;
    this.resendBtn = false;
    this.resetPasswordSuccess = false;
    this.resetPasswordSuccessBtn = false;
    this.resetPasswordFail = false;
    this.patientRole = true;
    $('#emailPatient').focus();
  }

  patientPhysResForm(event){
    event.target.classList.add('active1');
    event.target.parentElement.parentElement.childNodes[1].firstElementChild.classList.remove('active');
    this.loginPatientForm = false;
    this.loginPhysResForm = true;
    this.loginBtn = true;
    this.forgetPasswordForm = false;
    this.resetPasswordBtn = false;
    this.resendBtn = false;
    this.resetPasswordSuccess = false;
    this.resetPasswordSuccessBtn = false;
    this.resetPasswordFail = false;
    this.patientRole = false;
    $('#emailPhysRes').focus();
  }

  forgetPassword(){
    this.loginPatientForm = false;
    this.loginPhysResForm = false;
    this.loginBtn = false;
    this.forgetPasswordForm = true;
    this.resetPasswordBtn = true;
    this.resendBtn = false;
    this.resetPasswordSuccess = false;
    this.resetPasswordSuccessBtn = false;
    this.resetPasswordFail = false;
    this.email = "";
    $('#emailReset').focus();
  }

  backToLoginForm(role){
    if (role == true){
      this.loginPatientForm = true;
      this.loginPhysResForm = false;
  
    } else {
      this.loginPatientForm = false;
      this.loginPhysResForm = true;
  
    }
    this.loginBtn = true;
    this.forgetPasswordForm = false;
    this.resetPasswordBtn = false;
    this.resendBtn = false;
    this.resetPasswordSuccess = false;
    this.resetPasswordSuccessBtn = false;
    this.resetPasswordFail = false;
  }

  resetPassword(){
    this.disableBtn = true;
    var emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if(this.email == undefined){
      this.notificationService.error("Error",'Email field is required', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      this.disableBtn = false;
      return false;
    } else if(!(emailfilter.test(this.email))){
      this.notificationService.error("Error",'Please enter a valid email', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      this.disableBtn = false;
      return false;
    }
    let data = {
      "email": this.email
    }

    this._APIservices.post_reset_password(data, this.headers).subscribe(suc =>{
      this.resdata = suc.body;
      if(this.resdata.status == '1' || this.resdata.status == 1){
        this.loginPatientForm = false;
        this.loginPhysResForm = false;
        this.loginBtn = false;
        this.forgetPasswordForm = false;
        this.resetPasswordBtn = false;
        this.resendBtn = false;
        this.resetPasswordSuccess = true;
        this.resetPasswordSuccessBtn = true;
        this.resetPasswordFail = false;
      } else if (this.resdata.status =='0' || this.resdata.status == 0){
        this.resetPasswordFail = true;
      }
      this.disableBtn = false;
    },err=>{
      var err_res = JSON.parse(err._body);
      this.resetPasswordFail = true;
      this.disableBtn = false;
    });
  }

  resendEmail(){
    this.disableBtn = true;

    let data = {
      "email": this.email
    }

    this._APIservices.post_reset_password(data, this.headers).subscribe(suc =>{
      this.resdata = suc.body;
      if(this.resdata.status == '1' || this.resdata.status == 1){
        this.loginPatientForm = false;
        this.loginPhysResForm = false;
        this.loginBtn = false;
        this.forgetPasswordForm = false;
        this.resetPasswordBtn = false;
        this.resendBtn = false;
        this.resetPasswordSuccess = true;
        this.resetPasswordSuccessBtn = true;
        this.resetPasswordFail = false;
      } else if (this.resdata.status =='0' || this.resdata.status == 0){
        this.resetPasswordFail = true;
      }
      this.disableBtn = false;
    },err =>{
      var err_res = JSON.parse(err._body);
      this.resetPasswordFail = true;
      this.disableBtn = false;
    });
  }

  keyDownEmailReset(event){
    if(event.keyCode == 13) {
      this.resetPassword();
    }
  }

  get_access_token_facebook() {
    try{
      this.blockUI.start('please wait...');
      FB.getLoginStatus((response)=> {
        if (response.status === 'connected'){
          let access_token = response.authResponse.accessToken;
          this.get_facebook_user_info();
          this.sign_in_with_facebook(access_token);
        } else{
          FB.login((response)=> {
            if (response.authResponse){
              let access_token = response.authResponse.accessToken;
              this.get_facebook_user_info();
              this.sign_in_with_facebook(access_token);
            } else{
              console.log("Error occure while login with signin with facebook. Error is ", response);
            }
          }, { scope: 'email, user_friends' });
        }        
      });
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while get facebook access token. Error is ", e);
    }
  }

  sign_in_with_facebook(access_token){
    try{
      this.blockUI.start('please wait...');
      let data = {
        'access_token' : (access_token || ''),
        'role' : 'patient'
      }
      this._APIservices.sign_in_with_facebook({'body'  : data}).subscribe(suc =>{
      if(suc.body.status == '1' || suc.body.status == 1){
        this._localStorage.set('role', suc.body.data.role);
        this._localStorage.set('id', suc.body.data.id);
        this._localStorage.set('signInWithFacebook', true);
        this._localStorage.set('profile',{ AuthToken: suc.body.data.authentication_token });
        this.userPatienteModel.style.display = "none";
        this._router.navigate(['/app/dashboard']);
        this.myVar = false;
        $("#loginModal").modal("hide");
        this.blockUI.stop();
      }
    },err =>{
      this.blockUI.stop();
      var err_res = JSON.parse(err._body);
    });
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while signin with Facebook. Error is ", e);
    }
  }

  get_facebook_user_info(){
    try{
      FB.api('/me', { fields: "id, about, age_range, picture, birthday, context, email, first_name, gender, hometown, link, location, middle_name, name, timezone, website, work"},
        (response)=> {
          this._localStorage.set('email', response.email);
          console.log('get_facebook_user_info', JSON.stringify(response));
        });
    } catch(e){
      console.log("Error occure while getting logged in user profile. Error is ", e);
    }
  }

  getstate_by_conunty(countryCode){
    try{
      this.states = statejson.filter((item, index) => item.country == countryCode);
      console.log('states', JSON.stringify(this.states));
      if(this.states.length == 0){
        this.state_license = '';
      }
    } catch(e){
      console.error("Error occur while get state. Error is ", e);
    }
  }
}
