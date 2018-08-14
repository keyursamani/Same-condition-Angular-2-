import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { QolchartComponent } from '../../global-components/qolchart/qolchart.component';

declare var $ : any;
declare var jQuery : any;
declare var AmCharts : any;

@Component({
  selector: 'aq-qolserveys',
  templateUrl: './qolserveys.component.html',
  styleUrls: ['./qolserveys.component.scss']
})

export class QolserveysComponent extends HeadersProvider implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(QolchartComponent)
  private qolchartcomp: QolchartComponent;

  private questionList: any = [];
  private socialList: any = [];
  private physicalList: any = [];
  private mentalList: any = [];
  private visibility: string = "all_users";
  private selectedDate: string = "";
  private submitDate: string = "";
  private placeholder: string = "Today";
  private searchTagList: any = [];
  private showSuggest: boolean = false;
  private searchtTagString: boolean = false;
  private tagsSearchname: string = "";
  private TagList: any = [];
  private qolScoreList: any  = [];
  private filterstring: any = "3_months";
  private deleteQolid: number = 0;
  private totalSocialScore: number = 0;
  private totalMentalScore: number = 0;
  private totalPhysicalScore: number = 0;
  private tempquestionList: any = [];
  private formValidation : boolean = false;
  private isSocialRatingRequired : boolean = false;
  private isMentalRatingRequired : boolean = false;
  private isPhysicalRatingRequired : boolean = false;
  private page : number = 1;
  public dateValue : any;

  //constructor
  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService
    ) {
    super();
  }

  //ngOnInit
  ngOnInit() {
    this.loadQollist();
    this.loadQuestiolist();
    console.log(this.qolchartcomp)
  }

  // Load QOL Question list
  loadQollist(){
    try{

      this.blockUI.start('please wait...');
      let data={
        'filter':this.filterstring,
      }
      this._APIservices.get_qol_scorelist(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.qolScoreList = suc.body.data;

          this.qolchartcomp.totalSocialScore = 0;
          this.qolchartcomp.totalMentalScore = 0;
          this.qolchartcomp.totalPhysicalScore = 0;
          this.qolchartcomp.qolid = "survey"

          this.qolchartcomp.totalSocialScore= Number(suc.body.social_avg);
          this.qolchartcomp.totalMentalScore= Number(suc.body.mental_avg);
          this.qolchartcomp.totalPhysicalScore= Number(suc.body.physical_avg);

            this.qolchartcomp.loadPhysicalChart(this.qolchartcomp.totalPhysicalScore);
            this.qolchartcomp.loadMentalChart(this.qolchartcomp.totalMentalScore);
            this.qolchartcomp.loadSocialChart(this.qolchartcomp.totalSocialScore);
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
      console.log("Error occure while load QOL list. Error is  ",err);
    }
  }

  // QOL Collapse
  accordianQol(qol){
    if(qol.show==true){
      qol.show=false;
    }else{
      qol.show=true;
    }
  }

  // filter QOL
  filterQol(value){
    //this.donotLoad = false;
    this.page = 1;
    this.filterstring = value;
    this.loadQollist();
  }

  // Load QOL Question list
  loadQuestiolist(){
    try{
      this.blockUI.start('please wait...');
      this._APIservices.qol_List({}, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.questionList = suc.body.data;
          this.tempquestionList = suc.body.data;
          this.socialList = this.questionList.Social;
          this.physicalList = this.questionList.Physical;
          this.mentalList = this.questionList.Mental;
        }
        this.blockUI.stop();
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
      console.log("Error occure while load question list. Error is ", err);
    }
  }

  selectTag(tagInfo){
    this.tagsSearchname="";
    this.searchtTagString=false;
    this.showSuggest = false;
    if(this.TagList.length<=0){
      this.TagList.push(tagInfo);
    }else{
      for(let items of this.TagList){
        if(items.id != tagInfo.id){
         this.TagList.push(tagInfo);
        }
      }
    }
  }

  removeTag(index){
    this.TagList.splice(index,1);
  }

  selectPhysical(index,value){
    this.physicalList[index].selected = value;
    this.physicalList[index].checked = true;
    this.isPhysicalRatingRequired = false;
  }

  selectMental(index,value){
    this.mentalList[index].selected = value;
    this.mentalList[index].checked = true;
    this.isMentalRatingRequired = false;
  }

  selectSocial(index,value){
    this.socialList[index].selected = value;
    this.socialList[index].checked = true;
    this.isSocialRatingRequired = false;
  }

  // Select  Date
  onDateChangeddiagnose(event){
    if(event.epoc == 0){
      this.selectedDate = moment(Date.now()).format('YYYY/MM/DD');
      this.submitDate = moment(Date.now()).format('YYYY/MM/DD');
    }else{
      this.selectedDate = moment(event).format('YYYY/MM/DD');
      this.submitDate = moment(event).format('YYYY/MM/DD');
    }
  }

  // Search Tags
  searchTags(searchString: string){
    try{
      if(searchString == ""){
        this.showSuggest = false;
      }else{
        this.showSuggest = true;
        let body_param = {
          "search_word" : searchString
        }
        this._APIservices.usersList_TagsPurpose(body_param, this.headers).subscribe(suc =>{
          this.searchtTagString = true;
          this.searchTagList = suc.body.data;
          if(this.searchTagList.length < 0){
            this.searchtTagString = false;
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
      }
    }catch(err){
      console.log("Error occure while search tag. Error is", err);
    }
  }

  cleartTag(){
    this.showSuggest = false;
    this.tagsSearchname = "";
    this.searchTagList = [];
  }

  deleteQOLOpen(id){
    this.deleteQolid = id;
    $('#deleteQOLModal').modal('show');
  }

  addQOLOpen(){
    this.selectedDate = moment(Date.now()).format('YYYY/MM/DD');
    this.submitDate = this.selectedDate;
    this.TagList = [];
    this.questionList = [];
    this.questionList = this.tempquestionList;
    this.physicalList = [];
    this.mentalList = [];
    this.socialList = [];
    this.visibility = "all_users";

    for(let items of this.tempquestionList.Physical){
      items.checked = false;
      items.selected = "";
      this.physicalList.push(items);
    }

    for(let items of this.tempquestionList.Mental){
      items.checked = false;
      items.selected = "";
      this.mentalList.push(items);
    }

    for(let items of this.tempquestionList.Social){
      items.checked = false;
      items.selected = "";
      this.socialList.push(items);
    }
    
    $('#addQOLModal').modal('show');    
    this.formValidation = false;
  }

  addserveys(){
    try{                     
      if(this.selectedDate == ""){
        this.formValidation = true;
        return false;
      }

      let scoreArray = [];
      let tempSocial = [];
      let tempphysical = [];
      let tempMental = [];
      for(let item of this.socialList){
        if(item.checked == true){
          tempSocial.push({'quality_of_life_id':item.id,'score':item.selected});
          scoreArray.push({'quality_of_life_id':item.id,'score':item.selected});
        }
      }

      for(let item of this.physicalList){
        if(item.checked == true){
          tempphysical.push({'quality_of_life_id':item.id,'score':item.selected});
          scoreArray.push({'quality_of_life_id':item.id,'score':item.selected});
        }
      }

      for(let item of this.mentalList){
        if(item.checked == true){
          tempMental.push({'quality_of_life_id':item.id,'score':item.selected});
          scoreArray.push({'quality_of_life_id':item.id,'score':item.selected});
        }
      }

      if(tempSocial.length < this.socialList.length){
        this.formValidation = true;
        this.isSocialRatingRequired = true;
        return false;
      }

      if(tempMental.length < this.mentalList.length){
        this.isMentalRatingRequired = true;
        return false;
      }

      if(tempphysical.length < this.physicalList.length){
        this.isPhysicalRatingRequired = true;
        return false;
      }

      this.blockUI.start('please wait...');
      $('#addQOLModal').modal('hide');
      let tagLists = [];
      for(let items of this.TagList){
        tagLists.push({'id':items.id,'name':items.name,'type':items.purpose_type});
      }

      let data = {
        'scores':scoreArray,
        'score_date':this.submitDate,
        'tags':tagLists,
        'visibility': this.visibility,
      }

      this._APIservices.api_addqol({'body':data}, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){         
          this.selectedDate = "";
          this.loadQollist();
        }
        this.blockUI.stop();
      }, err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.selectedDate = "";
        this.notificationService.error('Error',err_res.message,{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      this.selectedDate = "";
      console.log("Error occure while add surveys. Error is ", err);
    }
  }

  // Delete QOL
  deleteQolList(){
    try{
      this.blockUI.start('please wait...');
      $('#deleteQOLModal').modal('hide');
      let data = {
        'id':this.deleteQolid
      }
      this._APIservices.delete_qolserveys(data, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){          
          this.loadQollist();
        }
        this.blockUI.stop();
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
      console.log("Error occure while delete qol list. Error is ",err);
    }
  }

  

  confirmClosed(){
    $('#confirmationModal').modal('hide');
    $('#addQOLModal').modal('hide');
  }

  set_visibility(event, id){
    try{
      this.blockUI.start('please wait...');
      let data = {
        'id': id,
        'data' : {'visibility' : event}
      }
      this._APIservices.update_qol_visibility(data, this.headers).subscribe(suc =>{
        if(suc.body.status == 1 || suc.body.status == "1"){
          //TODO:
        }
        this.blockUI.stop();
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
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while set visibility. Error is ", e);
    }
  }

  onScrollDown(){
    this.page++;
    console.log('page', this.page);
    this.loadMoreQollist();
    return;
  }

  // Load QOL Question list
  loadMoreQollist(){
    try{
      let data={
        'filter':this.filterstring,
        'page':this.page,
        'per_page': 10,
        'offset':0
      }
      this._APIservices.get_qol_scorelist(data, this.headers).subscribe(suc =>{
        if(suc.body.data.length==0){

          //this.donotLoad = true;
        } else {
          this.qolScoreList = this.qolScoreList.concat(suc.body.data);
          //this.qolScoreList = suc.body.data;
          this.qolchartcomp.totalSocialScore = 0;
          this.qolchartcomp.totalMentalScore = 0;
          this.qolchartcomp.totalPhysicalScore = 0;

          for(let items of this.qolScoreList){
            items.scores.Social
            this.qolchartcomp.totalSocialScore= Number(this.qolchartcomp.totalSocialScore)+ Number(items.scores.Social);
            this.qolchartcomp.totalMentalScore= Number(this.qolchartcomp.totalMentalScore)+ Number(items.scores.Mental);
            this.qolchartcomp.totalPhysicalScore= Number(this.qolchartcomp.totalPhysicalScore)+ Number(items.scores.Physical);
          }
          this.qolchartcomp.qolid = "survey"
          this.qolchartcomp.loadPhysicalChart(this.totalPhysicalScore);
          this.qolchartcomp.loadMentalChart(this.totalMentalScore);
          this.qolchartcomp.loadSocialChart(this.totalSocialScore);          

        }
        this.blockUI.stop();
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
