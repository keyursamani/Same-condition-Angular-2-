import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
import {SCNotificationsRemindersService} from '../../common-components/services/notifications-reminders.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { QolchartComponent } from '../../global-components/qolchart/qolchart.component';

declare var $ : any;

@Component({
  selector: 'aq-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent extends HeadersProvider implements OnInit {
  
  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(QolchartComponent)
  private qolchartcomps: QueryList<QolchartComponent>;


  private userProfile: any = [];
  private getLikeusers: any = [];
  private updateFilterStrign: string = "";
  private showfeedList: any;
  private showfeedList1: any;
  private loadmoreComment : boolean;
  private commentsText : string;
  private donotLoad : boolean = false;
  private pageT :number = 1;
  private dummyCID : number;
  private dummyFID : number;
  private dummyi  : number;
  private dummyJ  : number;
  private perpage:number = 10;
  private getCommentdataList : any = [];
  private myfocus :boolean;
  private aboutData : any = [];
  private temp :any = [];
  private CommentspageNumber : number;
  private checks :any;
  private totalSocialScore: number;
  private totalMentalScore: number;
  private totalPhysicalScore: number;
  private treatmentId : number = 0;
  private ActionsT : string = "";
  private current_user_id : number;
  private qolcharts : number = 0;
  private qolscores : any = [];
  private qolid : any = [];

  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService,
    private scNotificationsRemindersService: SCNotificationsRemindersService,
    ) {

    super();
  }

  ngOnInit() {
    this.getLoginuserProfile();
    this.current_user_id = Number(this._localStorage.get('id'))
  }
  ngAfterViewInit(){
    this.loadFeeds();
    this.loadAbout();
    this.scNotificationsRemindersService.userProfile$.subscribe(data=>{
      this.userProfile = data;
    });
    this.qolchartcomps.changes.subscribe(() => {
    })
  }

  //Get Feed List
  loadFeeds(){
    this.pageT = 1;
    this.donotLoad = false;
    this.perpage = 10;
    try{
      this.blockUI.start('please wait...');
      let body_param = {
        "filter": this.updateFilterStrign,
        "page" : 1,
        "per_page": 10,
        "offset": 0
      };
      this._APIservices.get_api_feeds(body_param, this.headers).subscribe(suc => {
        this.showfeedList=[];
        this.showfeedList=suc.body.data;
        for(var i =0;i<this.showfeedList.length;i++){
          this.showfeedList[i].getCommentdataList = [];
          if(this.showfeedList[i].foreign_type=="Feeling"){
            this.showfeedList[i].feed_data.feeling_in_number =  this.showfeedList[i].feed_data.feeling_in_number*20;
          }else if(this.showfeedList[i].foreign_type==='QualityOfLifeScoreDate'){
            this.qolscores.push(this.showfeedList[i].feed_data.scores)
            this.qolid.push(this.showfeedList[i].feed_data.id)
          }
        }
        if(this.qolchartcomps.length > this.qolcharts){
            this.setChartData()
            this.qolcharts = this.qolchartcomps.length
          }
          this.blockUI.stop();
        },
        err=>{
          this.blockUI.stop();
          var err_res = JSON.parse(err._body);
          console.log(err_res);
          this.notificationService.error('Error',err_res.message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        });
      }catch(err){
        this.blockUI.stop();
        console.log('Error occured while load feeds. Error is ', err);
      }
  }

  loadMoreFeeds(){
    this.pageT++;
    try{
      let body_param = {
        "filter": this.updateFilterStrign,
        "page" : this.pageT,
        "per_page": this.perpage,
        "offset": 0
      };
      this._APIservices.get_api_feeds(body_param, this.headers).subscribe(suc => {
        if(suc.body.data.length==0){

          this.donotLoad = true;
        } else {

          this.showfeedList1=suc.body.data;

          for(var i =0;i<this.showfeedList1.length;i++){
            this.showfeedList1[i].getCommentdataList = [];
            if(this.showfeedList1[i].foreign_type=="Feeling"){
            this.showfeedList1[i].feed_data.feeling_in_number =  this.showfeedList1[i].feed_data.feeling_in_number*20;
            }else if(this.showfeedList1[i].foreign_type==='QualityOfLifeScoreDate'){
              
              this.qolscores.push(this.showfeedList1[i].feed_data.scores)
              this.qolid.push(this.showfeedList1[i].feed_data.id)

            }
          }
          if(this.qolchartcomps.length > this.qolcharts){
            this.setChartData()
            this.qolcharts = this.qolchartcomps.length
          }

          this.showfeedList = this.showfeedList.concat(this.showfeedList1);
          // this.setChartData()
        }
        }, err=>{
          var err_res = JSON.parse(err._body);
            this.notificationService.error('Error', err_res.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
        });
      }catch(err){
        console.log("Error occured while load more feeds. Error is ", err);
      }
  }

  setChartData(){
    var i = 0;
    this.qolchartcomps.forEach(QolchartComponent => {
        QolchartComponent.qolid = this.qolid[i] == undefined ? 0 : this.qolid[i].toString();
        QolchartComponent.totalPhysicalScore = this.qolscores[i] == undefined ? 0 : this.qolscores[i].Physical;        
        QolchartComponent.totalMentalScore = this.qolscores[i] == undefined ? 0 :this.qolscores[i].Mental;
        QolchartComponent.totalSocialScore = this.qolscores[i] == undefined ? 0 :this.qolscores[i].Social;
        QolchartComponent.timeline = true;
        QolchartComponent.ngOnInit()
        i++

    });
  }

  onScrollDown() {
    if(!this.donotLoad)
      this.loadMoreFeeds();
  }

  focused(id){
    //console.log(id);
  }

  ShowCommentData(id:number,i:number,count){
    this.showfeedList[i].shocomments = true;   
    //get_Comments
    try{

      let data={
        'id':id,
        'filter':'all',
        'page':0,
        'per_page':10,
        'offset':0,
      }

      this._APIservices.get_Comments(data, this.headers).subscribe(suc => {

        this.showfeedList[i].getCommentdataList = [];
        this.showfeedList[i].pageNumber = 2;
        this.showfeedList[i].getCommentdataList = suc.body.data;
        if(count>10){
          this.loadmoreComment = true;
        }
        // this.checks =  count/10 ;
        // console.log(this.checks); 
        // this.temp = this.checks.toString().split(".");
        // console.log('chekedbrother',this.temp);
        // console.log('lastarray',this.temp[1]);
        // if(this.temp[1]==undefined || this.temp[1]=='undefined'){
        //   this.CommentspageNumber = this.temp[0];
        //   console.log('FINAL PAGE SEND NUMBER',this.CommentspageNumber);
        // }
        // else{
        //   if(this.temp[1]>0){
        //   this.CommentspageNumber = this.temp[0]++;
        //   console.log('FINAL PAGE SEND NUMBER',this.CommentspageNumber);
        //   }
        // }
        // }                 
        },err=>{
          var err_res = JSON.parse(err._body);
          console.log(err_res);
        });
      }catch(err){
        console.log('Error occure while show comment data. Error is ', err);
      }
    }

    LoadMoreCommentFun(id,number,i){
          this.showfeedList[i].pageNumber++;
          this.RefreshMoreCommentData(id,number++,i);
    }

    loadAbout(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.get_api_view_about({}, this.headers)
        .subscribe(
          suc=>{

            if(suc.body.status==1 || suc.body.status=="1"){
                this.aboutData=suc.body.data;
                
                
                //console.log('ABOUTDATA',this.aboutData);
              // for(let items of this.myInterestList){
              //   for(let item of this.aboutData.user_interested_in){
              //     if(items.interest==item){
              //       items.checked=true;
              //     }
              //   }
              // }
            }

            this.blockUI.stop();

        },
        err=>{
          this.blockUI.stop();
          console.log(err);
            var err_res = JSON.parse(err._body);
            this.notificationService.error(
              'Error',
              err_res.message,
              { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false }
            )
        });
    }catch(err){
      this.blockUI.stop();
      console.log(err);
    }
  }
  
  RefreshCommentData(id:number,i,pgnumber){
    this.showfeedList[i].shocomments = true;
      try{
          let data={
            'id':id,
            'filter':'latest',
            'page':0,
            'per_page':10,
            'offset':0,
          }
          this._APIservices.get_Comments(data, this.headers)
              .subscribe(
                suc=>{
                this.showfeedList[i].getCommentdataList = [];
                this.showfeedList[i].pageNumber = 2;
                this.showfeedList[i].getCommentdataList = suc.body.data;
              },
              err=>{
                  var err_res = JSON.parse(err._body);
                  console.log(err_res);
              });
      }catch(err){
        console.log(err);
      }
  }

  RefreshMoreCommentData(id:number,pgnumber,i){
    try{
        let data={
          'id':id,
          'filter':'all',
          'page':pgnumber,
          'per_page':10,
          'offset':0,
        }
        this._APIservices.get_Comments(data, this.headers)
            .subscribe(
              suc=>{
              if(suc.body.data.length==0){
                this.loadmoreComment = false;
              }
             // this.getCommentdataList = suc.body.data;
              this.showfeedList[i].getCommentdataList = this.showfeedList[i].getCommentdataList.concat(suc.body.data);
            },
            err=>{
                var err_res = JSON.parse(err._body);
                console.log(err_res);
            });
    }catch(err){
      console.log(err);
    }
  }

  commentDeltepopup(CID:number,FID:number,i,j){
    this.dummyCID = CID;
    this.dummyFID = FID;
    this.dummyi = i;
    this.dummyJ = j;
    //this.deleteCommentsModal.style.display = "block"; //RMS:comment
    $("#deleteCommentsModal").modal('show');
  }

  //RMS: comment function as no longer needed
  /*
  DoNotDelete(){
    this.deleteCommentsModal.style.display = "none";
  }
  */

  deltedCommensts(){
    //this.deleteCommentsModal.style.display = "none";
    $("#deleteCommentsModal").modal('hide');
    this.showfeedList[this.dummyi].comments_count--;
    this.showfeedList[this.dummyi].getCommentdataList.splice(this.dummyJ,1);
    this.checks =  this.showfeedList[this.dummyi].comments_count/10 ;
    this.temp = this.checks.toString().split(".");
    if(this.temp[1]==undefined || this.temp[1]=='undefined'){
      this.CommentspageNumber = this.temp[0];
    } else {
      if(this.temp[1]>0){
        this.CommentspageNumber = this.temp[0]++;
      }
    }

    try{
      let data={
        "id": this.dummyCID,
        "feed_id": this.dummyFID
      }
      this._APIservices.Delete_FeedComments(data, this.headers).subscribe(suc => {
        //this.RefreshCommentData(this.dummyFID,this.dummyi,this.CommentspageNumber);
      },err=>{
        console.log(err);
      });
      } catch(err){
        console.log('Error occure while delete comment. Error is ', err);
      }
  }

  filterSearch(value: string){
    this.updateFilterStrign=value;
    this.loadFeeds();
  }

  likedOpenModal(feed_id){
    this.getLikeuser(feed_id);
    this.getLikeusers=[];
    //this.likeEditModel.style.display = "block";
    $("#likedInfoModal").modal('show');
  }

  //RMS: comment code as this function is not necessary
  /*
  likedCloseModal(){
    this.likeEditModel.style.display = "none";
  }
  */

  // Get feed like user list
  getLikeuser(feedid:number){
    try{
        let data= {
            'feed_id' :feedid,
            'page'  : 0,
            'per_page': 10,
            'offset' : 0,
        }

      this._APIservices.get_api_feedlike(data, this.headers)
        .subscribe(
          suc=>{
            if(suc.body.status==1 || suc.body.status=="1"){
                this.getLikeusers=suc.body.data;
            }
            //this.profileCloseModal();

        },
        err=>{
          console.log(err);
            // var err_res = JSON.parse(err._body);
            // this.notificationService.error(
            //   'Error',
            //   err_res.message,
            //   { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false }
            // )
        });
    }catch(err){
        console.log(err);
    }
  }

  Fbfeedisibility(event,id){
     try{
              let body_param = {
                "visibility": event,
                "id":id,
                'Authentication-Token' : this.getToken().AuthToken
              };
              this._APIservices.FBfeedVisibility(body_param, this.headers)
                .subscribe(
                  suc=>{
                },
                err=>{
                  console.log(err);
                });

          }catch(err){
              console.log(err);
          }
  }

  updateLikes(feed,i){
    if(feed.is_liked){
      this.showfeedList[i].is_liked = false;
      this.showfeedList[i].likes_count--;
      try{
        let body_param = {
          "feed_id":feed.id
        };
        this._APIservices.FBfeedUnLikeUpdate(body_param, this.headers).subscribe(res => {
          //window.prompt('res', JSON.stringify(res));
          if(res.body.status == "1" || res.body.status == 1){
            this.scNotificationsRemindersService.get_notification_count(this.headers);
            this.scNotificationsRemindersService.get_reminder_count(this.headers);
          }
        },
        err=>{
          console.log(err);
        });
      } catch(err){
        console.log('Error occure while update likes. Error is ', err);
      }
    }
    else{
      this.showfeedList[i].is_liked = true;
      this.showfeedList[i].likes_count++;
      if(this.showfeedList[i].first_user_liked=='null' || this.showfeedList[i].first_user_liked=='' ||this.showfeedList[i].first_user_liked==null){
        this.showfeedList[i].first_user_liked = [];
        this.showfeedList[i].first_user_liked.first_name = 'You';
        this.showfeedList[i].first_user_liked.last_name = '';
      }

      try{
        let body_param = {
          "feed_id":feed.id
        };

        this._APIservices.FBfeedLikeUpdate(body_param, this.headers).subscribe(res => {
          if(res.body.status == "1" || res.body.status == 1){
            this.scNotificationsRemindersService.get_notification_count(this.headers);
            this.scNotificationsRemindersService.get_reminder_count(this.headers);
          }
        },
        err=>{
          console.log(err);
        });
      } catch(err){
        console.log('Error occure while update likes. Error is ', err);
      }
    }
  }

  setFeedActinoValue(){
    this.ActionsT = "";
    for(var i=0;i<this.showfeedList.length;i++){
      if(this.showfeedList[i].hasOwnProperty('actions')){
        delete this.showfeedList[i].actions
    }
    }
  }

  fbActionDelete(){
    try{
      try{
        this.blockUI.start('please wait...');
        $('#confirmationModal').modal('hide');
        let body_param = {
          "id": (this.treatmentId || 0)
        };
        this._APIservices.FBfeedDelete(body_param, this.headers).subscribe(suc => {
          this.loadFeeds();
          this.blockUI.stop();
        },
        err=>{
          console.log(err);
        });

      } catch(err){
        console.log('Error occure while FB action. Error is ', err);
      }
    } catch(e){
      console.log('Error occure while delete feeds. Error is ', e);
    }
  }

  fbAction(event,id,type,feed){
    if(event=='edit'){
      if(type=="Hospitalization"){
        localStorage.setItem("editHospitalizedid",feed.feed_data.id);
        localStorage.setItem("edithospital",'true');
        this._router.navigate(['/app/dashboard/hospitilization']);
      }
      if(type=="MyCondition"){
        localStorage.setItem("editconditionDATA",JSON.stringify(feed.feed_data));
        localStorage.setItem("editconditionDATASTATUS",'true');
        this._router.navigate(['/app/dashboard/condition']);
      }
    }
    else if(event == 'delete'){
      this.treatmentId = id;
      $('#confirmationModal').modal('show');
    }   
  }

  //Get User Profile
  onSearchChange(searchValue : string,id:number ) { 
    this.commentsText = searchValue; 
  }

  SendComment(id:number,text:string,i,CommentCount){

    if(this.isEmpty(text)){
      return false;
    }
    
    if(text.trim()===''){
      return false;
    }

    this.showfeedList[i].comments_count++;
    this.showfeedList[i].getCommentdataList.push({'comment':text.trim(),'user_profile':{'first_name':this.userProfile.first_name,'last_name':this.userProfile.last_name}});
    this.showfeedList[i].shocomments = true;
    this.checks =  this.showfeedList[i].comments_count/10 ;    
    this.temp = this.checks.toString().split(".");
    if(this.temp[1]==undefined || this.temp[1]=='undefined'){
      this.CommentspageNumber = this.temp[0];
    }
    else{
      if(this.temp[1]>0){
        this.CommentspageNumber = this.temp[0]++;
      }
    }
    
    this.showfeedList[i].commentsText='';
    try{
      let body_param = {
        "feed_id":id,
        "attachments":'',
        "comment":text.trim(),
        "tag_user_ids":'',
        'Authentication-Token' : this.getToken().AuthToken
      };

      this._APIservices.sendCommentFeeds(body_param, this.headers).subscribe(suc => {
        this.RefreshCommentData(id,i,this.CommentspageNumber);
        //this.getCommentdataList = [];
        //this.getCommentdataList = suc.body.data;
      },
      err=>{
        console.log(err);
      });

    }catch(err){
      console.log('Error ocure while send comment. Error is ', err);
    }
  }

  getLoginuserProfile(){

    try{
      this.blockUI.start('please wait...');
      let data = {};
      this._APIservices.get_patient_profile(data, this.headers).subscribe(suc  => {
       this.userProfile =  suc.body.data;
        // var check = moment(this.userProfile.birthday, 'YYYY/MM/DD');
        // let month = check.format('M');
        // let day   = check.format('D');
        // let year  = check.format('YYYY');
        // this.current_month = month;
        // this.current_year = year;
        // this.current_day=day;
        // this.getDate_info(this.current_month, this.current_year);
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
    }catch(err){
      this.blockUI.stop();
      console.log('Error occure while get logged in user profile. Error is ', err);
    }
  }
}
