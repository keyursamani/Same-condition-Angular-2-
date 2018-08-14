import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $ : any;
declare var jQuery : any;
declare var AmCharts : any;

@Component({
  selector: 'aq-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.scss']
})

export class WeightComponent extends HeadersProvider implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  private Noweight : any;
  private weightList: any = [];
  private weightFilter: string = "3_months";
  private addWeight : any ;
  private selectedDate: any = [];
  private selectDate: string = "";
  private placeholder: string = "Today";
  private weightcount: string = "";
  private weighttype: string = "lbs";
  private calculatemeasure: string = "Metric";
  private calculateweight: string = "";
  private calculateft: string = "";
  private calculatein: string = "";
  private cachesculateresult: string = "";
  private visibility: string = "";
  private calculateweightkg: string = "";
  private calculateheightcm: string = "";
  private submitCalculate: any = [];
  private closePopup: any;
  private deleteConfirm: any;
  private weightid: number;
  private editWeightModel: any;
  private editselectDate: any = "";
  private submiteditselectDate: string = "";
  private editweightcount: string = "";
  private editweighttype: string = "";
  private editWeightId: number;
  private totalBMIfirst: any;
  private totalBMIsecond: any;
  public dateValue: any;
  private formValidation : boolean = false;
  private isDisplayKGChart : boolean = true;
  private kg_charts : any = [];
  private arrKG : any = [];
  private arrLBS : any = [];
 
  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService
    ) {
    super();
  }

  ngOnInit() {
    this.loadWeights();
    this.Noweight = false;
    this.addWeight = document.getElementById('addWeightModal');
    this.closePopup = document.getElementById('confirmationModal');
    this.deleteConfirm = document.getElementById('deleteconfirmationModal');
    this.editWeightModel=document.getElementById('editWeightModal');
    var date = new Date("2011-05-10"),
    locale = "en-us",
    month = date.toLocaleString(locale, { month: "long" });
  }

  // Get Weights List
  loadWeights(){
    try{
      this.blockUI.start('please wait...');
      let body_param = {
        "filter":this.weightFilter
      };

      this._APIservices.get_Weights(body_param, this.headers).subscribe(suc =>{
        this.arrKG = [];
        this.arrLBS = [];
        if(suc.body.data.length > 0){
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

        var chart = AmCharts.makeChart("chartdiv", {
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

        var chart1 = AmCharts.makeChart("chartdivLbs", {
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
        
        this.weightList = suc.body.data.reverse();
        this.visibility = "only_me";
        this.blockUI.stop();
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        console.error("Error occure while load weights. Error is ", err_res.message);
      });
    }catch(err){
      this.blockUI.stop();
      console.error("Error occure while load weights. Error is ", err);
    }
  }

  //Delete Weights
  deleteWeights(){
    try{
      this.blockUI.start('please wait...')
      let body_param = {
        "id": this.weightid
      }
      this._APIservices.delete_weight(body_param, this.headers).subscribe(suc =>{
        this.closeDeleteConfirm();
        this.loadWeights();
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
      console.log("Error occure while delete weights. Error is ", err);
    }
  }

  // Select  Date
  onDateChangeddiagnose(event){
    if(event.epoc==0){
      this.selectedDate="";
      this.selectDate="";
    }else{
      this.selectedDate =moment(event).format('YYYY/MM/DD');
      this.selectDate=moment(event).format('YYYY/MM/DD');
    }
  }

  // Add wight
  addWeights(){
    try{
      this.notificationService.remove();
      if(this.weightcount == ""){
        this.formValidation = true;
        return false;
      }
      if(this.weighttype == ""){
        this.formValidation = true;
        return false;
      }
      this.blockUI.start('please wait...');
      let body_param = {
        "weight_count":this.weightcount,
        "weight_type":this.weighttype,
        "weight_date": (this.selectDate == "" || this.selectDate == undefined) ? (moment(new Date()).format('YYYY/MM/DD')) : this.selectDate
      }
      this._APIservices.api_addweight({'body':body_param}, this.headers).subscribe(suc =>{
        this.addWeightClosed();
        this.loadWeights();
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
      console.log("Error occure while add weight. Error is ", err);
    }
  }

  // Select Measurement
  selectMeasure(event){
    this.calculatemeasure = event;
    this.clearFirstAndSecondBMI();
    this.calculateweight = '';
    if(this.calculatemeasure == 'Customary'){
      this.calculateft = '';
      this.calculatein = '';
    } else {
      this.calculateheightcm = '';
    }
  }

  clearFirstAndSecondBMI(){
    this.totalBMIfirst = '';
    this.totalBMIsecond = '';
  }

  // Calculate BMI
  calculateBMI(){
    try{
      this.notificationService.remove();
      if(this.calculatemeasure == ""){
        this.notificationService.error('Error','Please select measurement ',{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
        return false;
      }

      if(this.calculatemeasure == 'Customary'){
        if(!this.calculateweight || !this.calculateft || !this.calculatein){
          this.clearFirstAndSecondBMI();
          return false;
        }
        this.submitCalculate = {
          "measurement_system":this.calculatemeasure,
          "weight_lbs":Number(this.calculateweight),
          "height_ft":Number(this.calculateft),
          "height_in":Number(this.calculatein)
        }
      }else{
        if(!this.calculateweight || !this.calculateheightcm){
          this.clearFirstAndSecondBMI();
          return false;
        }
        this.submitCalculate = {
          "measurement_system":this.calculatemeasure,
          "weight_kg":Number(this.calculateweight),
          "height_cm":Number(this.calculateheightcm)
        }
      }

      this.blockUI.start('please wait...');
      this._APIservices.get_calculate(this.submitCalculate, this.headers).subscribe(suc =>{
        this.cachesculateresult = suc.body.data;
        var result = this.cachesculateresult;
        if(result != null){
          var x = Number(this.cachesculateresult);
          this.totalBMIfirst= Math.trunc(x);
          var  str = x.toString();
          if( str.indexOf('.') != -1 ){ //check if has decimal
            this.totalBMIsecond= parseFloat(Math.abs(x).toString().split('.')[1]);
          }
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
      console.log("Error occure while calculate BMI. Error is ",err);
    }
  }

  // Update Visibility
  updateVisibility(value){
    try{
      this.blockUI.start('please wait...');
      let body_param = {
        "visibility":value,
        "Authentication-Token": this.getToken().AuthToken
      }
      this._APIservices.update_visibility(body_param, this.headers).subscribe(suc =>{
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
      console.log(err);
    }
  }

  // Weight Filtering
  weightFiltering(filter: string){
    this.weightFilter=filter;
    this.loadWeights();
  }

  addWeightOpen(){
    this.placeholder = 'Today';
    this.selectedDate="";
    this.selectDate="";
    this.weightcount="";
    this.weighttype="lbs";
    this.addWeight.style.display = "block";
    this.formValidation = false;
  }

  addWeightClosed(){
    this.addWeight.style.display = "none";
  }

  noHide(){
    this.closePopup.style.display = "none";
  }

  confirmClosed(){
    this.closePopup.style.display = "none";
    this.addWeightClosed();
    this.closeEditWeight();
  }

  confirmOpen(){
    this.closePopup.style.display = "block";
  }

  openDeleteConfirm(weightid){
    this.weightid=weightid;
    this.deleteConfirm.style.display = "block";
  }

  closeDeleteConfirm(){
    this.deleteConfirm.style.display = "none";
  }

  editWeightOpen(allInfo){
    this.editWeightId=allInfo.id;
    this.submiteditselectDate=allInfo.weight_date;
    this.editweightcount=allInfo.weight_count;
    this.editweighttype=allInfo.weight_type;
    this.editWeightModel.style.display = "block";
    this.editselectDate = new Date(allInfo.weight_date);
  }

  closeEditWeight(){
    this.editWeightModel.style.display = "none";
  }

  // Select  Date
  onDateEditWeight(event){
    if(event.epoc==0){
      this.editselectDate="";
      this.submiteditselectDate="";
    }else{
      this.editselectDate =moment(event).format('YYYY/MM/DD');
      this.submiteditselectDate=moment(event).format('YYYY/MM/DD');
    }
  }

  // Update weight
  updateWeights(){
    try{
      this.notificationService.remove();
      if(this.editselectDate==""){
          this.notificationService.error('Error','Please select weight date',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
      }
      if(this.editweightcount==""){
          this.notificationService.error('Error','Please enter weight count',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
      }
      if(this.editweighttype==""){
        this.notificationService.error('Error','Please select weight type',{ 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
        return false;
      }

      this.blockUI.start('please wait...');
      let body_param = {
        "weight_count":this.editweightcount,
        "weight_type":this.editweighttype,
        "weight_date":this.submiteditselectDate
      }
      this._APIservices.api_updateweight({"id":Number(this.editWeightId),'body':body_param}, this.headers).subscribe(suc =>{
        this.closeEditWeight();
        this.loadWeights();
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
      console.log(err);
    }
  }

  //display_kg_graph
  display_kg_graph(){
    try{
      this.isDisplayKGChart = true;
       let body_param = {
        "filter":this.weightFilter
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
        "filter":this.weightFilter
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
}
