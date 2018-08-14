import { SCNotificationsRemindersService } from '../../common-components/services/notifications-reminders.service';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';

declare var $ : any;
declare var jQuery : any;

@Component({
  selector: 'app-researcher',
  templateUrl: './researcher.component.html',
  styleUrls: ['./researcher.component.scss']
})

export class ResearcherComponent extends HeadersProvider implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  private userProfile: any = [];
  private userProfilePhysRes: any = [];
  private addProfileModal : any ;
  private editProfileModal : any ;
  private fileArray: Array<any> = [];
  private myPublications: any = [];
  private addPublicationTitle: any = "";
  private addPublicationUrl: any = "";
  private addSubmitPublication: boolean = false;
  private editPublicationTitle: any;
  private editPublicationUrl: any;
  private editSubmitPublication: boolean;
  private editId: number;
  private removeId: number;
  private removeType: number;
  private searchTagKeyword: string = "";
  private searchTagItems: any = [];
  private showTagList: boolean = false;
  private tag_id: number;
  private tags: any = [];
  private userRole : any = '';
  private degrees : any;

  constructor(public _router:Router,public _APIservices:SCApi,private notificationService: NotificationsService, private scNotificationsRemindersService: SCNotificationsRemindersService) {
    super();
    this.userRole = this._localStorage.get('role');
  }

  ngOnInit() {
    this.getLoginuserProfile();
    this.getProfilePhysicianResearcher();
    if(this.userRole == 'researcher'){
      this.getMyPublications();
    }
    this.addProfileModal = document.getElementById('addProfileModal');
    this.editProfileModal = document.getElementById('editProfileModal');
    
    this.scNotificationsRemindersService.userProfile$.subscribe(data=>{
      this.userProfile = data;
    });
  }

  getLoginuserProfile(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.get_patient_profile({}, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.userProfile = suc.body.data;
        }
        this.stopBlockUI();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 6000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while calling user profile. Error is ", err);
    }
  }

  profileAddModalOpen(){
    this.addProfileModal.style.display = "block";
  }

  profileAddModalClosed(){
    this.addProfileModal.style.display = "none";
  }

  profileEditModalOpen(){
    this.editProfileModal.style.display = "block";
  }

  profileEditModalClosed(){
    this.editProfileModal.style.display = "none";
  }

  getProfilePhysicianResearcher(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.get_profile_physician_researcher({}, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.userProfilePhysRes = suc.body.data;
          this.degrees = this.userProfilePhysRes.physicians_researcher.degree_url;
          this.fileArray = this.userProfilePhysRes.physicians_researcher.documents;
        }
        this.stopBlockUI();        
      }, err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 6000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while calling user profile. Error is ", err);
    }
  }

  getMyPublications(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.get_my_publications({}, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.myPublications = suc.body.data;
        }
        this.stopBlockUI();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 6000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while get publication. Error is ", err);
    }
  }

  postPublication(){

    if(this.addPublicationTitle == undefined || this.addPublicationTitle == '')
    {
      this.notificationService.error("Error","Title can't be blank", {timeOut: 6000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }
    var url_regex = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})";
    if (this.addPublicationUrl == undefined || !this.addPublicationUrl.match(url_regex)){
      this.notificationService.error("Error",'Please enter a valid URL', {timeOut: 6000, showProgressBar: true,pauseOnHover: true,clickToClose: true,maxLength: 1000});
      return false;
    }

    this.blockUI.start('please wait...');
    $('#addPublicationModal').modal('hide');
    let params = {
      'title' : this.addPublicationTitle,
      'link' : this.addPublicationUrl,
      'tags': this.tags,
      'is_submitted': this.addSubmitPublication
    };
    this._APIservices.post_publication({'data' : params}, this.headers).subscribe(suc =>{
      if(suc.body.status == "1" || suc.body.status == 1){
        this.tags = [];
        this.getMyPublications();        
      }
      this.stopBlockUI();
    },err=>{
      this.blockUI.stop();
      var err_res = JSON.parse(err._body);
      this.notificationService.error('Error',err_res.message,{ 
        timeOut: 6000, 
        showProgressBar: false, 
        pauseOnHover: false, 
        clickToClose: false 
      });
    });
  }

  editPublicationModel(event){
    let editPublication : any;
    let tags: any;
    for (editPublication of this.myPublications){
      if(editPublication.id == event.target.id){
        this.editPublicationTitle = editPublication.title;
        this.editPublicationUrl = editPublication.link;
        this.editSubmitPublication = editPublication.is_submitted;
        this.editId = editPublication.id;
        for (tags of editPublication.tags){
          this.tags.push({'id':tags.id, 'name': tags.name, 'type': tags.purpose_type});
        }
      }
    }
  }

  editPublication(){
    try{
      this.blockUI.start('please wait...');
      $('#editPublicationModal').modal('hide');
      let data = {
        'title' : this.editPublicationTitle,
        'link' : this.editPublicationUrl,
        'tags': this.tags,
        'is_submitted': this.editSubmitPublication,
      }

      let oPublication = {
        'id' : this.editId,
        'data' : data
      }

      this._APIservices.edit_publication(oPublication, this.headers).subscribe(suc =>{
        if(suc.body.status == 1 || suc.body.status == "1"){
          this.tags = [];
          this.getMyPublications();
        }
        this.stopBlockUI();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 6000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while update publiction details. Error is ", err);
    }
  }

  removePublication(event){
    try{
      this.blockUI.start('please wait...');
      this.removeId = event.target.id;
      this.removeType = event.target.dataset.delete;
      let data = {
        'id' : Number(this.removeId),
        'delete_type' : Number(this.removeType),
      }

      this._APIservices.delete_publication(data, this.headers).subscribe(suc =>{
        if(suc.body.status == 1 || suc.body.status == "1"){
          this.getMyPublications();
        }
        this.stopBlockUI();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 6000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while remove publication. Error is ", err);
    }
  }

  openModalPublication(){
    this.showTagList = false;
    this.searchTagKeyword = "";
    this.addPublicationTitle = "";
    this.addPublicationUrl = "";
    this.tags = [];
    this.addSubmitPublication = false;
  }

  searchTag(){
    try{
      if(this.searchTagKeyword == ''){
        this.showTagList = false;
        return false;
      }

      let data = {
        'search_word': this.searchTagKeyword
      };
      this._APIservices.list_tags_purpose(data, this.headers).subscribe(suc =>{
        if(suc.body.status==1 || suc.body.status=="1"){
          this.showTagList = true;
          this.searchTagItems = suc.body.data;
          if(this.searchTagItems.length == 0){
            this.showTagList = false;
          }
        }
      },err=>{
        this.showTagList = false;
        this.searchTagItems = [];
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message,{
          timeOut: 5000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false
        });
      });
    } catch(err){
      this.showTagList = false;
      this.searchTagItems=[];
      var err_res = JSON.parse(err._body);
      this.notificationService.error('Error',err_res.message,{
        timeOut: 6000, 
        showProgressBar: false, 
        pauseOnHover: false, 
        clickToClose: false
      });
    }
  }

  selectTag(item){
    if(this.tags.length <= 15){
      this.tags.push({'id':item.id, 'name': item.name, 'type': item.purpose_type});
      this.searchTagKeyword = "";
      this.showTagList = false;
    } else{
      this.notificationService.error('Error',"Cannot add more than 15 tags.",{ timeOut: 6000, showProgressBar: false, pauseOnHover: false, clickToClose: false });
    }
  }

  removeTag(event){
    let tag: any;
    for(tag of this.tags){
      if (tag.id = event.target.id){
        this.tags.splice(tag, 1);
      }
    }
  }

  handleClick(event){
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if(inside){
      console.log('inside');
    }else{
      console.log('outside');
    }
  }

  stopBlockUI(){
    this.blockUI.stop();
  }

}
