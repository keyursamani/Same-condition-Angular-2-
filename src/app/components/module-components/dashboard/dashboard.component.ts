import { SCNotificationsRemindersService } from '../../common-components/services/notifications-reminders.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
import * as en from 'date-fns/locale/fr';
import * as enLocale from 'date-fns/locale/en';
import {getYear} from 'date-fns';
import * as _ from 'lodash';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CalanderComponent } from '../../global-components/calander/calander.component';

declare var $ : any;
declare var jQuery : any;

var countryjson = require('./../../../../common/utilities/country.json');
var statejson = require('./../../../../common/utilities/state.json');

@Component({
  selector: 'ms-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent extends HeadersProvider implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    editProfileModel: any;
    myNameBlock: any;
    myNameBlock1: any;
    myBirthBlock: any;
    myBirthBlock1: any;
    profileEditModel: any;
    uploadPhotoModal: any;
    likeEditModel: any;
    editnameS : boolean = false;
    userProfile: any = [];
    showfeedList: any = [];
    aboutData: any = [];
    tempEditprofile: string = "";
    selectedFile: any;
    getLikeusers: any = [];
    myInterestList: any = [];
    conditionfilter: string = "";
    // Date of birth
    total_years: any;
    total_days: any;
    current_month: string = "";
    current_day: string = "";
    current_year: string = "";
    date: any;
    editBirthdayS :boolean = false;
    editsexS :boolean = false;
    editethinityS :boolean = false;
    editRaceS :boolean = false;
    editlocationS :boolean = false;
    ShowInbox : boolean;
    DummyFirstname : string = "";
    DummyLastname : string = "";
    DummyBirthdate : string = "";
    DummySex : string = "";
    Dummypronoun : string = "";
    DummygenderIdentity :string = "";
    DummyRace : string = "";
    Dummyother :string = "";
    DummyFaith : string = "";
    DummyCountry : string = "";
    DummyState : string = "";
    DummyCity : string = "";
    birthdayToShow: string = "";
    userProfilePhysRes: any = {
        'physicians_researcher' : {
            'med_school' : '',
            'degree_url' : '',
            'license_url' : '',
            'degree_earned_detail' : {
                'name' : ''
            }
        }
    };
    editProfilePhysRes: any;
    editDegree: boolean = false;
    editYear: boolean = false;
    editBio: boolean;
    editDoc: boolean;
    editUrl: boolean;
    editPractice: boolean;
    editPracticeLocation: boolean;
    degree_id: number;
    searchDegreeKeyword: string = "";
    searchDegreeItems: any = [];
    showDegreeList: boolean = false;
    searchPracticeKeyword: string = "";
    searchPracticeItems: any = [];
    showPracticeList: boolean = false;
    practice_id: number;
    searchConditionKeyword: string = "";
    searchConditionItems: any = [];
    showConditionList: boolean = false;
    condition_id: number;
    year_completed: number;
    /*months: any;
    days: any;*/
    years: any = [];
    bio: any = "";
    fieldArray: Array<any> = [];
    newAttribute: any = "";
    url_form: any;
    oldValueDegree: any;
    oldValuePractice: any;
    oldValueYear: any;
    fileArray: Array<any> = [];
    fileUpload: Array<any> = [];
    newAttributeFile: any = {};
    file_form: any;
    deleteAttachmentId: any = [];
    docVisibilityOldValue: any;
    updateDocVisibilityValue: any = [];
    attachment_limit: boolean = false;
    attachment_upload: boolean = false;
    userRole: any;
    degree_visibility: string;
    license_visibility: string;
    name_of_clinical_facility: string = "";
    location_of_clinical_facility: string = "";
    currently_practicing_visibility: string = "";
    loader: boolean = false;
    myconditions: any;
    acronym: string;
    //dob_month: any;
    //dob_day: any;
    //dob_year: any;
    age: any;

    formValidation : boolean = false;
    birthDate : any = Date();
    dateValue:any;
    editBloodType :boolean = false;
    Dummy_blood_type_marker : string = "";
    Dummy_blood_type_factor : string = ""
    states : any = [];
    disableCity : boolean = true;
    countries : any = [];

    constructor(public _router: Router, public _APIservices: SCApi, private notificationService: NotificationsService,private scNotificationsRemindersService: SCNotificationsRemindersService){
        super();
        this.date = new Date();
        for(var i = 1910; i <= getYear(this.date); i++){
          this.years.push(i);
        }
        this.userRole = this._localStorage.get('role');
    }

    ngOnInit() {
        this.countries = countryjson;
        this.getDate_info('', '');

        this.myNameBlock = document.getElementById('nameDiv');
        this.myNameBlock1 = document.getElementById('nameEdit');

        this.myBirthBlock = document.getElementById('birthDiv');
        this.myBirthBlock1 = document.getElementById('birthEdit');

        this.editProfileModel = document.getElementById('profileModal');
        this.profileEditModel = document.getElementById('ProfileInfoModal');
        this.uploadPhotoModal = document.getElementById('uploadPhotoModal');

        if(this.userRole == 'patient' || this.userRole == 'care_member') {
            this.getLoginuserProfile();
        } else {
            this.getProfilePhysicianResearcher();
        }

        this.editProfilePhysRes = document.getElementById('profilePhysRes');
        this.url_form = document.getElementById('url_form');
        this.file_form = document.getElementById('file_form');
        this.newAttributeFile = null;
        this.scNotificationsRemindersService.userProfile$.subscribe(data=>{
          this.userProfile = data;
        });

        this.getstate_by_conunty("US");
    }

    // Get Total Days
    getDaysInMonth(m, y) {
        this.total_days = [];
        var days = new Date(y, m, 0).getDate();
        for (var i = 1; i <= days; i++) {
            this.total_days.push(i);
        }
    }

    // Get Date Info
    getDate_info(month, year) {
        this.current_month = month.length ? month : new Date().getMonth() + 1;
        var current_year = new Date().getFullYear();
        this.getDaysInMonth(this.current_month, (year.length ? year : current_year));
    }

    getLoginuserProfile() {
        this.loader = true;
        try {
            this._APIservices.get_patient_profile({}, this.headers).subscribe(suc => {
                this.loader = false;
                this.userProfile = suc.body.data;
                this.disableCity = (this.userProfile.country == "Select your country" && this.userProfile.state == "Select your state");
                this.DummyFirstname = (this.userProfile.first_name || "");
                this.DummyLastname = (this.userProfile.last_name || "");
                this.DummySex = this.userProfile.sex;
                this.Dummypronoun = this.userProfile.preferred_pronoun;
                this.DummygenderIdentity = this.userProfile.gender_identity;
                this.Dummyother = this.userProfile.gender_identity_other;
                this.DummyRace = this.userProfile.race;
                this.DummyFaith = this.userProfile.faith;
                this.DummyCountry = this.userProfile.country;
                this.DummyState = this.userProfile.state;
                this.DummyCity = this.userProfile.city;
                this.Dummy_blood_type_marker = this.userProfile.blood_type_marker;
                this.Dummy_blood_type_factor = this.userProfile.blood_type_factor;

                this.birthdayToShow = moment(this.userProfile.birthday, 'YYYY/MM/DD').format('MMMM Do, YYYY');
                if(this.userProfile.gender_identity=='Other'){
                    this.ShowInbox = true;
                }
                var check = moment(this.userProfile.birthday, 'YYYY/MM/DD');
                let month = check.format('M');
                let day = check.format('D');
                let year = check.format('YYYY');
                this.current_month = month;
                this.current_year = year;
                this.current_day = day;
                this.getDate_info(this.current_month, this.current_year);
                var dob = new Date(this.userProfile.birthday);
                this.birthDate = dob;
                this.calculateAge(dob);
                this.getstate_by_conunty(this.userProfile.country);
            }, err => {
                var err_res = JSON.parse(err._body);
                this.notificationService.error('Error',err_res.message, {
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
            });
        } catch (err) {
            console.log(err);
        }
    }

    changesgender(data){
        this.userProfile.gender_identity = data;
        if(this.userProfile.gender_identity=='Other'){
            this.ShowInbox = true;
        }
        else{
            this.ShowInbox = false;
        }
    }

    goProfile() {
        this._router.navigate(['/app/profile']);
    }

    openProfileModal() {
        this.editProfileModel.style.display = "block";
        this.getLoginuserProfile();
    }

    closeProfileModal() {
        this.editnameS = false;
        this.editBirthdayS = false;
        this.editsexS = false;
        this.editethinityS = false;
        this.editRaceS = false;
        this.editlocationS = false;
        this.editProfileModel.style.display = "none";
    }

    goNameEdit() {
        this.DummyFirstname = this.userProfile.first_name;
        this.DummyLastname = this.userProfile.last_name;
        this.editnameS = true;
    }

    gonameeditcancel(){
        this.formValidation = false;
        this.userProfile.first_name = this.DummyFirstname;
        this.userProfile.last_name =this.DummyLastname;
        this.editnameS = false;
    }

    gonameeditupdate(){
        try{

            if(this.userProfile.first_name == ""){
                this.formValidation = true;
                return false;
            }

            if(this.userProfile.last_name == ""){
                this.formValidation = true;
                return false;
            }

            this.blockUI.start('please wait...');
            let body_param = {
              'first_name' : (this.userProfile.first_name || ""),
              'last_name' : (this.userProfile.last_name || ""),
              'birthday' : (this.userProfile.birthday || ""),
              'sex': (this.userProfile.sex || ""),
              'gender_identity' : (this.userProfile.gender_identity || ""),
              'gender_identity_other' : (this.userProfile.gender_identity_other || ""),
              'race' : (this.userProfile.race || ""),
              'faith' : (this.userProfile.faith || ""),
              'country' : (this.userProfile.country || ""),
              'state' : (this.userProfile.state || ""),
              'city' : (this.userProfile.city || ""),
              'zipcode' : (this.userProfile.zipcode || "")
            };
            this._APIservices.update_user_profile({'data' : body_param}, this.headers).subscribe(suc =>{
                if(suc.body.status == "1" || suc.body.status == 1){
                    this.notificationService.success('Name', "Updated successfully.",{
                      timeOut: 3000,
                      showProgressBar: false,
                      pauseOnHover: false,
                      clickToClose: false
                    });
                    this.editnameS = false;
                    this.getLoginuserProfile();
                    this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                }
                this.blockUI.stop();
            },err=>{
                console.log(err);
                this.blockUI.stop();
            });
        } catch(err){
            this.blockUI.stop();
            console.log("Error occure while update user name. Error is ",err);
        }
    }

    goBirthdayEditCancel(){
        this.DummyBirthdate = this.userProfile.birthday;
        this.editBirthdayS = false;
    }

    goBirthdayEditUpdate(){
        this.loader = true;
        try{
            if(this.birthDate == undefined){
               this.notificationService.error("Error",'Please complete birthday field', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
               return false;
            }

            this.blockUI.start('please wait...');
        
            let dob_moment = moment(this.birthDate).format('YYYY/MM/DD');
            let body_param = {
              'first_name' : (this.userProfile.first_name || ""),
              'last_name' : (this.userProfile.last_name || ""),
              'birthday' : (dob_moment || ""),
              'sex': (this.userProfile.sex || ""),
              'gender_identity' : (this.userProfile.gender_identity || ""),
              'gender_identity_other' : (this.userProfile.gender_identity_other || ""),
              'race' : (this.userProfile.race || ""),
              'faith' : (this.userProfile.faith || ""),
              'country' : (this.userProfile.country || ""),
              'state' : (this.userProfile.state || ""),
              'city' : (this.userProfile.city || ""),
              'zipcode' : (this.userProfile.zipcode || "")
            };
            this._APIservices.update_user_profile({'data':body_param}, this.headers).subscribe(suc =>{
                if(suc.body.status == "1" || suc.body.status == 1){
                    this.notificationService.success('Birthday', "Updated successfully.",{
                      timeOut: 3000,
                      showProgressBar: false,
                      pauseOnHover: false,
                      clickToClose: false
                    });
                    this.editBirthdayS = false;
                    this.getLoginuserProfile();
                    this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                }
                this.blockUI.stop();
            },err=>{
                this.blockUI.stop();
                console.log(err);
            });
        }catch(err){
            this.blockUI.stop();
            console.log(err);
        }
    }

    editsexSCancel(){
        this.userProfile.sex = this.DummySex;
        this.userProfile.gender_identity_other =this.Dummyother;
        this.userProfile.gender_identity = this.DummygenderIdentity;
        this.userProfile.preferred_pronoun = this.Dummypronoun;
        this.editsexS = false;
    }

    editsexSCancelSave(){
        if(this.userProfile.sex == ""){
            this.notificationService.error('Error','Please select your sex',{
                timeOut: 3000,
                showProgressBar: false,
                pauseOnHover: false,
                clickToClose: false
            });
            return false;
        }

        if(this.userProfile.gender_identity == ""){
            this.notificationService.error('Error','Please select your gender Identity',{
                timeOut: 3000,
                showProgressBar: false,
                pauseOnHover: false,
                clickToClose: false
            });
            return false;
        }

        if(this.userProfile.gender_identity == "Other"){
            if(this.userProfile.gender_identity_other == ""){
                this.notificationService.error('Error','Please enter your other gender identity',{
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
                return false;
            }
        }

        this.blockUI.start('please wait...');
        this.editsexS = false;
        try{
            let body_param = {
                'first_name' : (this.userProfile.first_name || ""),
                'last_name' : (this.userProfile.last_name || ""),
                'birthday' : (this.userProfile.birthday || ""),
                'sex': (this.userProfile.sex || ""),
                'gender_identity' : (this.userProfile.gender_identity || ""),
                'gender_identity_other' : (this.userProfile.gender_identity_other || ""),
                'race' : (this.userProfile.race || ""),
                'faith' : (this.userProfile.faith || ""),
                'country' : (this.userProfile.country || ""),
                'state' : (this.userProfile.state || ""),
                'city' : (this.userProfile.city || ""),
                'zipcode' : (this.userProfile.zipcode || "")
            };
            this.DummySex = this.userProfile.sex;
            this.Dummyother = this.userProfile.gender_identity_other;
            this.DummygenderIdentity = this.userProfile.gender_identity;
            this.Dummypronoun = this.userProfile.preferred_pronoun;
            this._APIservices.update_user_profile({'data':body_param}, this.headers).subscribe(suc=>{
                if(suc.body.status == "1" || suc.body.status == 1){
                    this.notificationService.success('Gender', "Updated successfully.",{
                      timeOut: 3000,
                      showProgressBar: false,
                      pauseOnHover: false,
                      clickToClose: false
                    });
                    this.getLoginuserProfile();
                    this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                }
                this.blockUI.stop();

            },err=>{
                this.blockUI.stop();
                console.log(err);
            });
        }catch(err){
            this.blockUI.stop();
            console.log(err);
        }
    }

    editRaceSCancel(){
        this.userProfile.race = this.DummyRace;
        this.editRaceS = false;
    }

    editRaceSSave(){
        this.blockUI.start("please wait...");
        this.editRaceS = false;
        try{
            let body_param = {
                'first_name' : (this.userProfile.first_name || ""),
                'last_name' : (this.userProfile.last_name || ""),
                'birthday' : (this.userProfile.birthday || ""),
                'sex': (this.userProfile.sex || ""),
                'gender_identity' : (this.userProfile.gender_identity || ""),
                'gender_identity_other' : (this.userProfile.gender_identity_other || ""),
                'race' : (this.userProfile.race || ""),
                'faith' : (this.userProfile.faith || ""),
                'country' : (this.userProfile.country || ""),
                'state' : (this.userProfile.state || ""),
                'city' : (this.userProfile.city || ""),
                'zipcode' : (this.userProfile.zipcode || "")
            };
            this.DummyRace = this.userProfile.race;
            this._APIservices.update_user_profile({'data':body_param}, this.headers).subscribe(suc =>{
                if(suc.body.status == "1" || suc.body.status == 1){
                    this.notificationService.success('Race', "Updated successfully.",{
                      timeOut: 3000,
                      showProgressBar: false,
                      pauseOnHover: false,
                      clickToClose: false
                    });
                    this.getLoginuserProfile();
                    this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                }
                this.blockUI.stop();
            },err=>{
                this.blockUI.stop();
                console.log(err);
            });
        }catch(err){
            this.blockUI.stop();
            console.log(err);
        }
    }

    editethinitySave(){
        this.blockUI.start('please wait...');
        this.editethinityS = false;
        try{
            let body_param = {
              'first_name' : (this.userProfile.first_name || ""),
              'last_name' : (this.userProfile.last_name || ""),
              'birthday' : (this.userProfile.birthday || ""),
              'sex': (this.userProfile.sex || ""),
              'gender_identity' : (this.userProfile.gender_identity || ""),
              'gender_identity_other' : (this.userProfile.gender_identity_other || ""),
              'race' : (this.userProfile.race || ""),
              'faith' : (this.userProfile.faith || ""),
              'country' : (this.userProfile.country || ""),
              'state' : (this.userProfile.state || ""),
              'city' : (this.userProfile.city || ""),
              'zipcode' : (this.userProfile.zipcode || "")
            };
            this.DummyFaith = this.userProfile.faith;
            this._APIservices.update_user_profile({'data':body_param}, this.headers).subscribe(suc=>{
                if(suc.body.status == "1" || suc.body.status == 1){
                    this.notificationService.success('Ethnicity', "Updated successfully.",{
                      timeOut: 3000,
                      showProgressBar: false,
                      pauseOnHover: false,
                      clickToClose: false
                    });
                    this.getLoginuserProfile();
                    this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                }
                this.blockUI.stop();
            },err=>{
                this.blockUI.stop();
                console.log(err);
            });
        }catch(err){
            this.blockUI.stop();
            console.log(err);
        }
    }

    editethinitySCancel(){
        this.userProfile.faith = this.DummyFaith;
        this.editethinityS = false;
    }

    dateset(date){
        console.log(date);
    }

    editlocationSCancel(){
        this.userProfile.country = this.DummyCountry;
        this.userProfile.state = this.DummyState;
        this.userProfile.city = this.DummyCity;
        this.editlocationS = false;
    }

    editlocationSUpdate(){

        if(this.userProfile.country=="Select your country"){
            this.notificationService.error('Error','Please select Country',{ timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false });
            return false;
        }

        if(this.userProfile.state == "Select your state"){
            this.notificationService.error('Error','Please select state',{ timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false });
            return false;
        }

        this.editlocationS = false;
        try{
            this.blockUI.start('please wait...');
            let body_param = {
              'first_name' : (this.userProfile.first_name || ""),
              'last_name' : (this.userProfile.last_name || ""),
              'birthday' : (this.userProfile.birthday || ""),
              'sex': (this.userProfile.sex || ""),
              'gender_identity' : (this.userProfile.gender_identity || ""),
              'gender_identity_other' : (this.userProfile.gender_identity_other || ""),
              'race' : (this.userProfile.race || ""),
              'faith' : (this.userProfile.faith || ""),
              'country' : (this.userProfile.country || ""),
              'state' : (this.userProfile.state || ""),
              'city' : (this.userProfile.city || ""),
              'zipcode' : (this.userProfile.zipcode || ""),
            };
            this.DummyCountry = this.userProfile.country;
            this.DummyState= this.userProfile.state;
            this.DummyCity = this.userProfile.city;
            this._APIservices.update_user_profile({'data':body_param}, this.headers).subscribe(suc=>{
                this.notificationService.success('Location', "Updated successfully.",{
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
                this.userProfile = suc.body.data;
                this.editlocationS = false;
                this.getLoginuserProfile();
                this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                this.blockUI.stop();
            }, err=>{

                this.blockUI.stop();
                console.log(err);
              });
        } catch(err){
            this.blockUI.stop();
            console.log(err);
        }
    }

    // Open Profile Picture Model
    profileOpenModal() {
        console.log(this.userProfile);
        this.tempEditprofile = "";
        this.tempEditprofile = this.userProfile.photo_url;
        if (this.userProfile.photo_url)
          this.profileEditModel.style.display = "block";
        else
          this.uploadPhotoModal.style.display = "block";
    }

    // Close Profile Picture Models
    profileCloseModal() {
        this.profileEditModel.style.display = "none";
    }

    // Close Upload Picture Model
    uploadPhotoCloseModal() {
      this.uploadPhotoModal.style.display = "none";
    }

    // Close Upload Picture Model
    closeUploadPhotoModal() {
      this.uploadPhotoModal.style.display = "none";
    }

    // Change Profile Picture
    selectChangeImage(fileInput: any) {
      this.selectedFile = [];
        let fileList: FileList = fileInput.target.files;
        this.selectedFile = fileInput.target.files[0];
        if(this.validateFile(this.selectedFile.name)){
            this.convertFileToBase64AndSet(fileList);
        }else{
            this.notificationService.error("Error",
            "File is not valid.",
             { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false });
        }
    }

    validateFile(name: String) {
        var ext = name.substring(name.lastIndexOf('.') + 1);

        if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpeg' || ext.toLowerCase() == 'jpg'|| ext.toLowerCase() == 'gif' ) {
            return true;
        }
        else {
            return false;
        }
    }

    // Image Convert To Base64
    convertFileToBase64AndSet(fileList: FileList) {
        if (fileList.length > 0) {
            var reader = new FileReader();
            reader.onloadend = (e: Event) => {
                this.tempEditprofile = reader.result;
            }

            reader.readAsDataURL(fileList[0]);
        }
    }

    // Update Profile Picture
    updateProfilePicture() {
        try {

            if(this.selectedFile == undefined){
                this.uploadPhotoCloseModal();
                return false;
            }

            this.blockUI.start('please wait...');
            if (this.tempEditprofile != '') {
                let body_param = {
                    "photo": this.selectedFile,
                    'Authentication-Token': this.getToken().AuthToken
                };
                this._APIservices.update_profile_picture(body_param, this.headers).subscribe(suc => {
                    if (suc.body.status == 1 || suc.body.status == "1") {
                        this.userProfile.photo_url = suc.body.data.photo_url;
                        this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                        this.selectedFile = [];
                    }
                    this.notificationService.success('Profile Photo', "Updated successfully.",{
                      timeOut: 3000,
                      showProgressBar: false,
                      pauseOnHover: false,
                      clickToClose: false
                    });
                    this.profileCloseModal();
                    this.uploadPhotoCloseModal();
                    this.blockUI.stop();
                 }, err => {
                    this.blockUI.stop();
                    console.log(err);
                });
            }
        } catch (err) {
            this.blockUI.stop();
            console.log(err);
        }
    }

    // Remove Profile Picture
    removeProfilePicture() {
        try {
            this.blockUI.start('please wait...');
            this._APIservices.remove_profile_picture({}, this.headers).subscribe(suc => {
                if (suc.body.status == 1 || suc.body.status == "1") {
                    this.notificationService.success('Profile Photo', "Removed successfully.",{
                      timeOut: 3000,
                      showProgressBar: false,
                      pauseOnHover: false,
                      clickToClose: false
                    });
                    this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                    this.userProfile.photo_url = suc.body.data.photo_url;
                    this.userProfilePhysRes.photo_url = suc.body.data.photo_url;
                    this.profileCloseModal();
                    this.stopBlockUI();
                }
            },err => {
                this.blockUI.stop();
                console.log(err);
            });
        } catch (err) {
            this.blockUI.stop();
            console.log(err);
        }
    }

    getProfilePhysicianResearcher(){
        this.loader = true;
        try{
            this._APIservices.get_profile_physician_researcher({}, this.headers).subscribe(suc =>{
                this.userProfilePhysRes = suc.body.data;
                if(this.userProfilePhysRes.physicians_researcher){
                    this.userRole = this.userProfilePhysRes.role;
                }
                this.userProfile = suc.body.data;
                var degree_earned = this.userProfilePhysRes.physicians_researcher.degree_earned_detail.name;
                var matches = degree_earned.match(/\b(\w)/g);
                this.acronym = matches.join('');
                this.fieldArray = JSON.parse(this.userProfilePhysRes.physicians_researcher.license_approval_urls);
                this.loader = false;
            },err=>{
                this.loader = false;
                var err_res = JSON.parse(err._body);
                this.notificationService.error('Error',err_res.message,{
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
            });
        }catch(err){
            console.log(err);
        }
    }

    openProfilePhysResModal() {
        try{
            this._APIservices.get_profile_physician_researcher({}, this.headers).subscribe(suc =>{

                this.userProfilePhysRes = suc.body.data;
                this.searchDegreeKeyword = this.userProfilePhysRes.physicians_researcher.degree_earned_detail ? this.userProfilePhysRes.physicians_researcher.degree_earned_detail.name : "";
                this.searchPracticeKeyword = this.userProfilePhysRes.physicians_researcher.current_practice_detail ? this.userProfilePhysRes.physicians_researcher.current_practice_detail.name : "";
                this.oldValueDegree = this.searchDegreeKeyword;
                this.oldValuePractice = this.searchPracticeKeyword;
                this.year_completed = this.userProfilePhysRes.physicians_researcher.year_completed;
                this.oldValueYear = this.year_completed;
                this.bio = this.userProfilePhysRes.bio;
                this.fieldArray = JSON.parse(this.userProfilePhysRes.physicians_researcher.license_approval_urls);
                this.fileArray = this.userProfilePhysRes.physicians_researcher.documents;
                this.docVisibilityOldValue = this.fileArray;
                this.name_of_clinical_facility = this.userProfilePhysRes.physicians_researcher.name_of_clinical_facility;
                this.location_of_clinical_facility = this.userProfilePhysRes.physicians_researcher.location_of_clinical_facility;
                this.degree_visibility = this.userProfilePhysRes.physicians_researcher.degree_visibility;
                this.license_visibility = this.userProfilePhysRes.physicians_researcher.license_visibility;
                this.currently_practicing_visibility = this.userProfilePhysRes.physicians_researcher.currently_practicing_visibility;
                if (this.fileArray.length >= 5){
                    this.attachment_limit = true;
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
            console.log(err);
        }
    }

    cancelEditDegree(){
        this.searchDegreeKeyword = this.userProfilePhysRes.physicians_researcher.degree_earned_detail.name;
        this.editDegree = false;
    }

    cancelEditYear(){
        this.year_completed = this.userProfilePhysRes.physicians_researcher.year_completed;
        this.editYear = false;
    }

    cancelEditBio(){
        this.bio = this.userProfilePhysRes.bio;
        this.editBio = false;
    }

    cancelEditUrl(){
        this.fieldArray = JSON.parse(this.userProfilePhysRes.physicians_researcher.license_approval_urls);
        this.editUrl = false;
    }

    cancelEditDoc(){
        this.fileArray = this.userProfilePhysRes.physicians_researcher.documents;
        this.editDoc = false;
    }

    cancelEditPractice(){
        this.searchPracticeKeyword = this.userProfilePhysRes.physicians_researcher.current_practice_detail.name;
        this.editPractice = false;
    }

    cancelEditPracticeLocation(){
        this.name_of_clinical_facility = this.userProfilePhysRes.physicians_researcher.name_of_clinical_facility;
        this.location_of_clinical_facility = this.userProfilePhysRes.physicians_researcher.location_of_clinical_facility;
        this.editPracticeLocation = false;
    }

    updateDegree(){
        this.blockUI.start('please wait...');
        this.loader = true;
        if (this.oldValueDegree == this.searchDegreeKeyword){
            this.showDegreeList = false;
            this.editDegree = false;
            return false;
        } else if (this.degree_id == undefined && this.searchDegreeKeyword){
            let param = {
                "name": this.searchDegreeKeyword,
            };

            this._APIservices.post_degrees({'body': param}, this.headers).subscribe(suc =>{
                if(suc.body.status=='1' || suc.body.status==1){
                    this.searchDegreeKeyword = suc.body.data.name;
                    this.degree_id = suc.body.data.id;
                    this.showDegreeList = false;
                    this.editDegree = false;
                    this.postDegree();
                }
                this.stopBlockUI();
            }, err=>{
                this.blockUI.stop();
                this.loader = false;
                var err_res = JSON.parse(err._body);
                this.notificationService.error('Error',err_res.message,{
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
            });
        } else {
            this.showDegreeList = false;
            this.editDegree = false;
            this.postDegree();
            this.stopBlockUI();
        }
    }

    postDegree(){
        try{
            let data = {
                'degree_earned_id': this.degree_id,
                'Authentication-Token' : this.getToken().AuthToken
            }

            this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                if(suc.body.status==1 || suc.body.status=="1"){
                    this.showDegreeList = false;
                    this.editDegree = false;
                    this.getProfilePhysicianResearcher();
                }
            },err=>{
                this.loader = false;
                var err_res = JSON.parse(err._body);
                this.notificationService.error('Error',err_res.message,{
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
            });
        }catch(err){
            this.loader = false;
            console.log(err);
        }
    }

    updateYear(){
        this.loader = true;
        if (this.oldValueYear ==  this.year_completed){
            this.editYear = false;
            return false;
        }

        try{
            this.blockUI.start('please wait...');
            let data = {
                'year_completed': this.year_completed,
                'Authentication-Token' : this.getToken().AuthToken
            }

            this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                if(suc.body.status==1 || suc.body.status=="1"){
                    this.editYear = false;
                    this.getProfilePhysicianResearcher();
                }
                this.stopBlockUI();
            },err=>{
                this.blockUI.stop();
                this.loader = false;
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
            this.loader = false;
            console.log(err);
        }
    }

    updateUrl(){
        this.blockUI.start('please wait...');
        this.loader = true;
        try{
            let data = {
                'license_approval_urls': JSON.stringify(this.fieldArray),
                'Authentication-Token' : this.getToken().AuthToken
            }
            this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                if(suc.body.status == 1 || suc.body.status == "1"){
                    this.editUrl = false;
                    this.getProfilePhysicianResearcher();
                }
                this.stopBlockUI();
            },err=>{
                this.blockUI.stop();
                this.loader = false;
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
            this.loader = false;
            console.log(err);
        }
    }

    updateBio(){
        this.blockUI.start('please wait...');
        this.loader = true;
        try{
            let data = {
                'bio' : this.bio,
                'Authentication-Token' : this.getToken().AuthToken
            }

            this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                if(suc.body.status==1 || suc.body.status=="1"){
                    this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                    this.editBio = false;
                    //this.getProfilePhysicianResearcher();
                }
                this.stopBlockUI();
            },err=>{
                this.blockUI.stop();
                this.loader = false;
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
            this.loader = false;
            console.log(err);
        }
    }

    updateDoc(){
        this.blockUI.start('please wait...');
        this.loader = true;
        let newVisibility = _.intersectionWith(this.docVisibilityOldValue, this.fileArray, _.isEqual);
        for (let newValue of newVisibility){
            if(newValue.id != undefined){
                this.updateDocVisibilityValue.push({'id':newValue.id, 'visibility':newValue.visibility});
            }
        }

        try{
            let data = {
                'visibility_attachments': this.updateDocVisibilityValue,
            }

            this._APIservices.update_physician_researcher_visibility_atttachment({'body':data}, this.headers).subscribe(suc =>{
                if(suc.body.status==1 || suc.body.status=="1"){
                    this.editDoc = false;
                    this.getProfilePhysicianResearcher();
                }
                this.stopBlockUI();
            }, err=>{
                this.blockUI.stop();
                this.loader = false;
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
            this.loader = false;
            console.log(err);
        }

        if(this.attachment_upload == true){
            this.blockUI.start('please wait...');
            this.loader = true;

            try{
                let data = {
                    'attachments' : this.fileArray,
                    'Authentication-Token' : this.getToken().AuthToken
                }

                this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                    if(suc.body.status==1 || suc.body.status=="1"){
                        this.attachment_upload = false;
                        this.editDoc = false;
                        this.getProfilePhysicianResearcher();
                    }
                    this.stopBlockUI();
                },err=>{
                    this.blockUI.stop();
                    this.loader = false;
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
                this.loader = false;
                console.log(err);
            }
        }

        if (this.deleteAttachmentId.length != 0){
            this.blockUI.start('please wait...');
            this.loader = true;
            try{

                let data = {
                    'delete_attachment_ids': this.deleteAttachmentId.toString(),
                    'Authentication-Token' : this.getToken().AuthToken
                }

                this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                    if(suc.body.status==1 || suc.body.status=="1"){
                        this.deleteAttachmentId = [];
                        this.editDoc = false;
                        this.getProfilePhysicianResearcher();
                    }
                    this.stopBlockUI();
                }, err=>{
                    this.blockUI.stop();
                    this.loader = false;
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
                this.loader = false;
                console.log(err);
            }
        }
    }

    updatePractice(){
        this.blockUI.start('please wait...');
        this.loader = true;
        if (this.oldValuePractice == this.searchPracticeKeyword){
            this.showPracticeList = false;
            this.editPractice = false;
            try{

                let data = {
                    'currently_practicing_visibility': this.currently_practicing_visibility,
                    'Authentication-Token' : this.getToken().AuthToken
                };

                this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                    if(suc.body.status == 1 || suc.body.status == "1"){
                        this.getProfilePhysicianResearcher();
                    }
                    this.stopBlockUI();
                },err=>{
                    this.blockUI.stop();
                    this.loader = true;
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
                this.loader = true;
                console.log(err);
            }
            return false;
        } else if (this.practice_id == undefined && this.searchPracticeKeyword){

            this.blockUI.start('please wait...');
            let param = {
                "name": this.searchPracticeKeyword,
            };

            this._APIservices.post_degrees({'body': param}, this.headers).subscribe(suc =>{
                if(suc.body.status=='1' || suc.body.status==1){
                    this.searchPracticeKeyword = suc.body.data.name;
                    this.practice_id = suc.body.data.id;
                    this.showPracticeList = false;
                    this.editPractice = false;
                    this.postPractice();
                }
                this.stopBlockUI();
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
        } else {
            this.postPractice();
            this.stopBlockUI();
        }
    }

    postPractice(){
        try{
            this.blockUI.start('please wait...');
            let data = {
                'current_practice_id': this.practice_id,
                'currently_practicing_visibility': this.currently_practicing_visibility,
                'Authentication-Token' : this.getToken().AuthToken
            }

            this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                if(suc.body.status==1 || suc.body.status=="1"){
                    this.showPracticeList = false;
                    this.editPractice = false;
                    this.getProfilePhysicianResearcher();
                }
                this.stopBlockUI();
            },err=>{
                this.blockUI.stop();
                this.loader = false;
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
            this.loader = false;
            console.log(err);
        }
    }

    searchDegrees(searchDegree: string){
        this.loader = true;
        this.degree_id = undefined;
        if (searchDegree == ""){
            this.showDegreeList = false;
            this.loader = false;
            return false;
        }

        try{
            this.degree_id = undefined;
            let data = {
                'searchDegreeKeyword': searchDegree
            };

            this._APIservices.search_degrees(data, this.headers).subscribe(suc =>{
                if(suc.body.status == 1 || suc.body.status == "1"){
                    this.loader = false;
                    this.showDegreeList = true;
                    this.searchDegreeItems = suc.body.data;
                    if(this.searchDegreeItems.length == 0){
                        this.showDegreeList = false;
                        this.notificationService.remove();
                        this.notificationService.alert('Warning','Degree not found! But will be posted once submitted.',{
                            timeOut: 5000,
                            showProgressBar: false,
                            pauseOnHover: false,
                            clickToClose: false
                        });
                    }
                }
            },err=>{
                this.loader = false;
                this.showDegreeList = false;
                this.searchDegreeItems=[];
                var err_res = JSON.parse(err._body);
                this.notificationService.error('Error',err_res.message,{
                    timeOut: 5000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
            });
        } catch(err){
            this.loader = false;
            this.showDegreeList = false;
            this.searchDegreeItems=[];
            var err_res = JSON.parse(err._body);
            this.notificationService.error('Error',err_res.message,{
                timeOut: 3000,
                showProgressBar: false,
                pauseOnHover: false,
                clickToClose: false
            });
        }
    }

    selectDegree(item){
        this.degree_id = item.id;
        this.searchDegreeKeyword = item.name;
        this.showDegreeList = false;
    }

    searchPractices(searchPractice: string){
        this.loader = true;
        this.practice_id = undefined;
        if (searchPractice == ""){
            this.showPracticeList = false;
            this.loader = false;
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
                  this.loader = false;
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
                  this.loader = false;
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
            this.loader = false;
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

    addFieldValue(){
        var url_regex = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})";
        if (this.newAttribute == undefined || !this.newAttribute.match(url_regex)){
            this.notificationService.error("Error",'Please enter a valid URL', {timeOut: 4000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
            return false;
        }

        this.fieldArray.push({"url":this.newAttribute, "visibility": "all_users"});
        this.newAttribute = null;
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

    deleteFileValue(event, index) {
        if(this.fileArray[index].id){
            this.deleteAttachmentId.push(this.fileArray[index].id);
        }

        this.fileArray.splice(index, 1);
        this.fileUpload.splice(index, 1);
        if (this.fileArray.length < 5){
            this.attachment_limit = false;
        }
    }

    onAttach(event){
        const files = event.target.files || event.srcElement.files;
        const file = files[0];
        var file_regex = '([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg|.pdf|.PNG|.JPG|.JPEG|.PDF)$';
        if(!file.name.match(file_regex)){
            this.notificationService.error("Error",'Unable to attach. File format not accepted', {timeOut: 5000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
            return false;
        }

        this.fileArray.push({attachment_url: '/'+file.name+'?', 'visibility':'all_users', 'is_upload': true, 'file': file});
        this.fileUpload.push(file);
        this.newAttributeFile = "";
        this.attachment_upload = true;
        if (this.fileArray.length >= 5){
            this.attachment_limit = true;
        }
    }

    physDegreeUpdate(){
        try{
            let data = {
                'degree_visibility' : this.degree_visibility,
                'Authentication-Token' : this.getToken().AuthToken
            }

            this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                if(suc.body.status==1 || suc.body.status=="1"){
                }
            },err=>{
                this.loader = false;
                var err_res = JSON.parse(err._body);
                this.notificationService.error('Error',err_res.message,{
                    timeOut: 3000,
                    showProgressBar: false,
                    pauseOnHover: false,
                    clickToClose: false
                });
            });
        }catch(err){
            console.log(err);
        }
    }

    physLicenseUpdate(){
        try{
            let data = {
                'license_visibility' : this.license_visibility,
                'Authentication-Token' : this.getToken().AuthToken
            }

            this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                if(suc.body.status==1 || suc.body.status=="1"){
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
            console.log(err);
        }
    }

    updatePracticeLocation(){
        this.blockUI.start('please wait...');
        this.loader = true;
        try{
            let data = {
                'name_of_clinical_facility' : this.name_of_clinical_facility,
                'location_of_clinical_facility' : this.location_of_clinical_facility,
                'Authentication-Token' : this.getToken().AuthToken
            }

            this._APIservices.update_physician_researcher(data, this.headers).subscribe(suc =>{
                if(suc.body.status==1 || suc.body.status=="1"){
                    this.editPracticeLocation = false;
                    this.getProfilePhysicianResearcher();
                }
                this.stopBlockUI();
            }, err=>{
                this.blockUI.stop();
                this.loader = false;
                var err_res = JSON.parse(err._body);
                this.notificationService.error(
                  'Error',
                  err_res.message,
                  { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false }
                )
            });
        }catch(err){
            this.blockUI.stop();
            this.loader = false;
            console.log(err);
        }
    }

    openModalCondition(){
        this.showConditionList = false;
        this.condition_id = undefined;
    }

     closeProfilePhysResModal() {
        this.editDegree = false;
        this.editYear = false;
        this.editBio = false;
        this.editDoc = false;
        this.editUrl = false;
        this.editPractice = false;
        this.editPracticeLocation = false;
        this.showConditionList = false;
        this.searchConditionKeyword = '';
        document.getElementById("cstom_height").style.height = "195px";
    }

    searchCondition(){
        try{
            let data = {
              'search_word': this.searchConditionKeyword
            };
            this._APIservices.search_conditions_tag(data, this.headers)
            .subscribe(
              suc=>{
                if(suc.body.status==1 || suc.body.status=="1"){
                  this.showConditionList = true;
                  document.getElementById("cstom_height").style.height = "295px";
                  this.searchConditionItems = suc.body.data;
                  if(this.searchConditionItems.length == 0){
                      alert('1')
                    this.showConditionList = false;
                    document.getElementById("cstom_height").style.height = null;
                    this.searchConditionKeyword = '';
                  }
                }
              },
              err=>{
                this.showConditionList = false;
                this.searchConditionItems=[];
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
            this.showConditionList = false;
            this.searchConditionItems=[];
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

    selectCondition(item){
        this.condition_id = item.id;
        this.searchConditionKeyword = item.name;
        this.showConditionList = false;
        document.getElementById("cstom_height").style.height = null;
    }

    add_to_profile(){
      try{
        let data = {
            'id':this.condition_id,
            'Authentication-Token': this.getToken().AuthToken
        }
        this._APIservices.add_new_tag_profile(data, this.headers)
        .subscribe(
            suc=>{
                $('#add-condition').modal('hide');
                this.searchConditionKeyword = "";
                this.condition_id = null;
                this.getProfilePhysicianResearcher();
                this.notificationService.success(
                    'Success',
                    'Condition successfully tagged on your profile.',
                    { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false }
                );
                setTimeout(function() {
                    document.getElementById("cstom_height").style.height = "195px";
                }, 300);
            },
            err=>{
                var err_res = JSON.parse(err._body);
                this.searchConditionKeyword = "";
                this.condition_id = null;
                this.notificationService.error(
                    'Error',
                    'Condition was already tagged on your profile. Please choose another tag.',
                    { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false }
                )
            }
        );
      }catch(err){
          console.log(err);
      }
    }

    deleteCondition(id){
        try{
        let data= {
          'id' :Number(id)
        }

        this._APIservices.remove_tag(data, this.headers)
          .subscribe(
            suc=>{
              if(suc.body.status==1 || suc.body.status=="1"){
                this.getProfilePhysicianResearcher();
                this.notificationService.success(
                    'Success',
                    'Condition successfully untagged on your profile.',
                    { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false }
                );
              }
          },
          err=>{
              var err_res = JSON.parse(err._body);
              this.notificationService.error(
                'Error',
                err_res.message,
                { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false }
              )
          });
      }catch(err){
          console.log(err);
      }
    }

    calculateAge(dob){
        var today = new Date();
        var age = today.getFullYear() - dob.getFullYear();
        var ageMonth = today.getMonth();
        var ageDay = today.getDate();
        if ((dob.getMonth() > today.getMonth()) && (dob.getDate() > today.getDate())) {
            age = age - 1;
        }
        this.age = age;
    }

    stopBlockUI(){
      this.blockUI.stop();
    }

    read_Date(e){
        console.log('Date', e);
        this.birthDate = (moment(e).format('YYYY-MM-DD'));
    }

    editBloodTypeCancel(){
        this.editBloodType = false;
        this.userProfile.blood_type_factor = this.Dummy_blood_type_factor;
        this.userProfile.blood_type_marker = this.Dummy_blood_type_marker;
    }

    editBloodTypeCancelSave(){
        if(this.userProfile.blood_type_marker == ""){
            this.notificationService.error('Error','Please select your blood group',{
                timeOut: 3000,
                showProgressBar: false,
                pauseOnHover: false,
                clickToClose: false
            });
            return false;
        }

        if(this.userProfile.blood_type_factor == ""){
            this.notificationService.error('Error','Please select your blood factor',{
                timeOut: 3000,
                showProgressBar: false,
                pauseOnHover: false,
                clickToClose: false
            });
            return false;
        }

        this.blockUI.start('please wait...');
        this.editsexS = false;
        try{
            let body_param = {
                'first_name' : (this.userProfile.first_name || ""),
                'last_name' : (this.userProfile.last_name || ""),
                'birthday' : (this.userProfile.birthday || ""),
                'sex': (this.userProfile.sex || ""),
                'gender_identity' : (this.userProfile.gender_identity || ""),
                'gender_identity_other' : (this.userProfile.gender_identity_other || ""),
                'race' : (this.userProfile.race || ""),
                'faith' : (this.userProfile.faith || ""),
                'country' : (this.userProfile.country || ""),
                'state' : (this.userProfile.state || ""),
                'city' : (this.userProfile.city || ""),
                'zipcode' : (this.userProfile.zipcode || ""),
                'blood_type_marker' : (this.userProfile.blood_type_marker || ""),
                'blood_type_factor' : (this.userProfile.blood_type_factor || ""),
            };
            this.Dummy_blood_type_factor = this.userProfile.blood_type_factor;
            this.Dummy_blood_type_marker = this.userProfile.blood_type_marker;
            this._APIservices.update_user_profile({'data':body_param}, this.headers).subscribe(suc=>{
                if(suc.body.status == "1" || suc.body.status == 1){
                    this.notificationService.success('Blood Type', "Updated successfully.",{
                      timeOut: 3000,
                      showProgressBar: false,
                      pauseOnHover: false,
                      clickToClose: false
                    });
                    this.getLoginuserProfile();
                    this.scNotificationsRemindersService.get_Login_user_Profile(this.headers);
                }
                this.editBloodType = false;
                this.blockUI.stop();

            },err=>{
                this.blockUI.stop();
                console.log(err);
            });
        }catch(err){
            this.blockUI.stop();
            console.log(err);
        }
    }

    getstate_by_conunty(deviceValue){
        try{
            this.states = statejson.filter((item, index) => item.country == deviceValue);
        } catch(e){
            console.error("Error occur while get state. Error is ", e);
        }
    }

    enableCity(){
        try{
            if(this.userProfile.state != "Select your state"){
                this.disableCity = false;
            } else{
                this.disableCity = true;
                this.userProfile.city = "";
            }
        } catch(e){
            console.log("Error occure while enable city. Error is ", e);
        }
    }
}
