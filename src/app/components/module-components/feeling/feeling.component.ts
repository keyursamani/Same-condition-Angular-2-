import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
import { Pipe } from "@angular/core";
import { PipeTransform } from "@angular/core";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $ : any;
declare var jQuery : any;
declare var AmCharts : any;

@Component({
  selector: 'aq-feeling',
  templateUrl: './feeling.component.html',
  styleUrls: ['./feeling.component.scss']
})
export class FeelingComponent extends HeadersProvider implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  private okay : boolean;
  private Nofeeling :boolean =  true;
  private showSuggest : boolean = true;
  private feelingTagList: any = [];
  private searchtTagString: boolean = false;
  private searchTagList: any = [];
  private pageT: any = 1;
  private showserabar : boolean = false;
  private perpage:any = 10;
  private tagsSearchname: string = "";
  private selectFeeling: number = 50;
  private friendTagList: any = [];
  private tagsFriendname: string = "";
  private searchtFriendTagString: boolean = false;
  private feelingreason: string = "";
  private donotLoad : boolean = false;
  private feelingvisibility: string = "all_users";
  private feelingString: string = "";
  private searchFriendTagList: any = [];
  private feelingList: any = [];
  private feelingFilter: string = "3_months";
  private deleteFeelinginfo: any = [];
  private selectedFile: any = [];
  private formValidation: boolean = false;

  //constructor
  constructor(public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService
    ) {
    super();
  }

  //ngOnInit
  ngOnInit() {
    this.loadFeelingList();
  }

  selectMyFeelinglabel(value: number){
    this.selectFeeling = value;
  }

  showTagssearch(){
    this.showserabar = true;
  }

  showbutton(){
    this.showserabar = false;
    this.tagsFriendname = "";
  }

  searchTags(searchString: string){
    this.showSuggest = true;
    if(searchString.length > 0)
    {
      try{
        let body_param = {
          "search_word" : searchString
        }
        
        this._APIservices.usersList_TagsPurpose(body_param, this.headers).subscribe(suc =>{
          this.searchtTagString = true;
          this.searchTagList = suc.body.data;
          if(this.searchTagList.length == 0){
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
    } else{
      this.searchTagList = [];
      this.searchtTagString=false;
    }
  }

  selectFeelingTag(tagInfo){
    this.okay = true;
    this.tagsSearchname = "";
    this.searchtTagString = false;
    if(this.feelingTagList.length <= 0){
      tagInfo.name = tagInfo.name.toUpperCase();
      this.feelingTagList.push(tagInfo);
    }else{
      for(let items of this.feelingTagList){
        if(items.id == tagInfo.id){
          this.okay = false;
        }
      }

      if(this.okay){
        tagInfo.name = tagInfo.name.toUpperCase();
        this.feelingTagList.push(tagInfo);
      }
    }
  }

  removeFeelingTag(index){
    this.feelingTagList.splice(index,1);
  }

  removeFriendTag(index){
    this.friendTagList.splice(index,1);
  }

  addFriendTag(friendinfo){
    this.okay = true;
    this.tagsFriendname = "";
    this.searchtFriendTagString = false;
    if(this.friendTagList.length <= 0){
      this.friendTagList.push(friendinfo);
    }else{
      for(let items of this.friendTagList){
        if(items.id == friendinfo.id){
          this.okay = false;
        }
      }

      if(this.okay){
        this.friendTagList.push(friendinfo);
      }
    }
  }

  noHide(){
    $("#confirmationModalFeeling").modal('hide');
    $("#addFeelingModal").modal('show');
  }

  yesdelete(){
    $("#confirmationModalFeeling").modal('hide');
    $("#addFeelingModal").modal('hide');
  }

  deleteFeelingOpen(feelinfo){
    this.deleteFeelinginfo=feelinfo;
    $("#deleteFeelingModal").modal('show');
  }

  addFeelingOpen(){
    this.friendTagList = []
    this.searchTagList = [];
    this.searchtTagString = false;
    this.tagsSearchname = "";
    this.selectFeeling = 50;
    this.friendTagList = [];
    this.feelingTagList = [];
    this.selectedFile = [];
    this.searchtFriendTagString = false;
    this.feelingreason = "";
    this.feelingvisibility = "all_users";
    this.searchFriendTagList = [];
    this.showserabar = false;
    $("#addFeelingModal").modal('show');
    this.formValidation = false;
  }

  addFeelingClosed(){
    this.showserabar = true;
    $("#confirmationModalFeeling").modal('show');
  }

  feelfilter(value: string){
    this.feelingFilter=value;
    this.loadFeelingList();
  }

  loadFeelingList(){
    this.pageT = 1;
    this.donotLoad = false;
    this.perpage = 10;
    this.blockUI.start("please wait...");
    try{
      let body_param = {
        "filter" : this.feelingFilter
      }

      this._APIservices.get_feelings(body_param, this.headers).subscribe(suc =>{
        let arrFeelings = [];
        if(suc.body.status == "1" || suc.body.status == 1){
          //console.log("this.feelingList", JSON.stringify(suc.body));
          this.feelingList = suc.body.data;
          let oFeelings = suc.body.cal.key;

          if(this.feelingList.length > 0){
            this.Nofeeling = false;
          } else{
            this.Nofeeling = true;
          }
          if(oFeelings.length > 0){
            oFeelings.map((item, index)=>{
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

            var chart = AmCharts.makeChart("chartdiv", {
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
            
          }
        }
        this.blockUI.stop();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.feelingList = [];
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while load feeling list. Error is ", err);
    }
  }

  loadFeelingListMore(){
    this.pageT++;
    try{
      let body_param = {
        "filter" : this.feelingFilter,
        "page" : this.pageT,
        "per_page": this.perpage,
        "offset": 0
      }

      this._APIservices.get_feelings(body_param, this.headers).subscribe(suc =>{
        if(suc.body.data.length == 0){
          this.donotLoad = true;
        } else{
          this.feelingList = this.feelingList.concat(suc.body.data);
        }
        this.blockUI.stop();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.feelingList = [];
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while load more feeling. Error is ", err);
    }
  }

  onScrollDown() {
    if(!this.donotLoad){
      this.loadFeelingListMore();
    }
  }

  searchTagfriend(searchname: string){
    try{
      let body_param = {
        "search_word" : searchname
      }

      this._APIservices.search_taguser(body_param, this.headers).subscribe(suc =>{
        this.searchtFriendTagString = true;
        this.searchFriendTagList = suc.body.data;
        if(this.searchFriendTagList.length < 0){
          this.searchtFriendTagString = false;
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        this.searchtTagString = false;
        this.searchFriendTagList = [];
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while search tag field. Error is ", err);
    }
  }

  //Change Profile Picture
  selectChangeImage(fileInput: any){
    let fileList: FileList = fileInput.target.files;
    this.selectedFile.push(fileInput.target.files[0]);
    console.log(this.selectedFile);
  }

  removeAttachment(index){
    this.selectedFile.splice(index,1);
  }

  closeprediction(){
    this.tagsSearchname = '';
    this.showSuggest = false;
    this.searchtTagString = false;
  }

  addNewFeeling(){
    if(this.selectFeeling == 0){
      this.formValidation = true;
      return false;
    }

    if(this.feelingvisibility == ""){
      this.formValidation = true;
      return false;
    }

    this.blockUI.start("please wait...");
    $("#addFeelingModal").modal('hide');
    if(this.selectFeeling >= 1 && this.selectFeeling < 20){
      this.feelingString = "very_bad";
    }  
    if(this.selectFeeling >= 21 && this.selectFeeling < 40){
      this.feelingString = "bad";
    } 
    if(this.selectFeeling >= 40 && this.selectFeeling < 60){
      this.feelingString="neutral";
    } 
    if(this.selectFeeling >= 60 && this.selectFeeling < 80){
      this.feelingString = "good";
    } 
    if(this.selectFeeling >= 80 && this.selectFeeling <= 100){
      this.feelingString = "very_good";
    }

    let tagFriend = [];
    for(let items of this.friendTagList){
      tagFriend.push(items.id)
    }

    let tagList = [];
    for(let items of this.feelingTagList){
      tagList.push({'id':items.id,'name':items.name,'type':items.purpose_type});
    }

    let data = {
      "feeling" : this.feelingString,
      "description" : this.feelingreason,
      "tags" : tagList,
      "tag_user_ids" : tagFriend.join(),
      "visibility" : this.feelingvisibility
    }

    this._APIservices.add_Feeling({'body':data}, this.headers).subscribe(suc =>{
      if(this.selectedFile.length <= 0){
        this.loadFeelingList();
        this.blockUI.stop();
      }else{
        this.addFeelingNext(suc.body.data.id);
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
  }

  addFeelingNext(feelingid){

    this.blockUI.start('please wait...');
    let data = {
      "id" :feelingid,
      "attachments" : this.selectedFile,
      'Authentication-Token': this.getToken().AuthToken
    }
    this._APIservices.add_Feelingnext(data, this.headers).subscribe(suc =>{
      if(suc.body.status == "1" || suc.body.status == 1){
        this.loadFeelingList();
        $("#addFeelingModal").modal('hide');
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
  }

  //Delete Feeling
  deleteFeeling(){
    try{

      this.blockUI.start("please wait...");
      $("#deleteFeelingModal").modal('hide');
      let body_param = {
        "id" : Number(this.deleteFeelinginfo.id)
      }
      this._APIservices.delete_feeling(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.loadFeelingList();
          this.blockUI.stop();
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        this.feelingList=[];
      });
    }catch(err){
      console.log("Error occure while delete feeling. Error is ", err);
    }
  }

  //set visibility
  setVisibility(status, id){
    try{
      this.blockUI.start("please wait...");
      let body_param = {
        "id" : id,
        "data"  : { 'visibility' : status }
      }
      this._APIservices.update_feelings(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.loadFeelingList();
          this.blockUI.stop();
        }
      },err=>{
        this.blockUI.stop();
      });
    } catch(e){
      this.blockUI.stop();
      console.log("Error occure while set visibility. Error is ", e);
    }
  }

  displayText(description){
    try{
      if(!this.isEmpty(description)){
        if(description.length > 30){
          return description.substring(0,50)  + '...';
        } else{
          return description;
        }
      }
    } catch(e){
      console.log("Error occure while display text. Error is ", e);
    }
  }

  toggleButton(id, isDisplay, btn){
    if(isDisplay == true){
      $('#td_viewMore_' + id).hide();
      $('#td_viewLess_' + id).show();
      $('#viewMore_'+id).hide();
      $('#viewLess_'+id).show();
    } else{
      $('#td_viewMore_' + id).show();
      $('#td_viewLess_' + id).hide();
      $('#viewMore_'+id).show();
      $('#viewLess_'+id).hide();
    }
  }
}
