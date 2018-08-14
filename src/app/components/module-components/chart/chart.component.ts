import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { QolchartComponent } from '../../global-components/qolchart/qolchart.component';

declare var $ : any;
declare var jQuery : any;
declare var AmCharts : any;

@Component({
  selector: 'aq-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent extends HeadersProvider implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @ViewChild(QolchartComponent)
  private qolchartcomp: QolchartComponent;

  private feeling_filter: string = "6_months";
  private qol_survey_filter: string = "6_months";
  private my_treatment_filter: string = "6_months";
  private my_symptom_filter: string = "6_months";
  private my_hospitalization_filter: string = "6_months";
  private my_weight_filter: string = "6_months";
  private doctorvisit_chartList: any = [];
  private showingqol_surveys: any = [];
  private showingtreatmentList: any = [];
  private showingsymptomsList: any = [];
  private showinghospitalization: any = [];
  private feelingChart: any = [];
  private treatmentChart: any = [];
  private hospitilizationChart: any = [];
  private totalSocialScore: number = 0;
  private totalMentalScore: number = 0;
  private totalPhysicalScore: number = 0;
  private hideElement: boolean = false;
  private hideElementWeight: boolean = false;
  private feelingLastUpdated : any = Date.now();
  private qolLastUpdated : any = Date.now();
  private treatmentLastUpdated : any = Date.now();;
  private hospitalizationLastUpdated : any = Date.now();
  private isDisplayKGChart : boolean = true;
  private arrKG : any = [];
  private arrLBS : any = [];

  private arrFeelings : any = [];
  private hideElementFeelings: boolean = false;

  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService
    ) {
    super();
  }

  ngOnInit() {
    //this.loadChartList();
    this.loadWeights();
    this.load_feelings();
    this.loadQollist();
  }

  // QOL serveys Filter
  qolFilter(value){
    this.qol_survey_filter=value;
    this.loadChartList();
  }

  // load feeling graph
  load_feelings(){

    try{
      let body_param = {
        "filter" : this.feeling_filter
      }
      this._APIservices.get_feelings(body_param, this.headers).subscribe(suc =>{
        this.arrFeelings = [];
        if(suc.body.status == "1" || suc.body.status == 1){
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
              this.arrFeelings.push({ date: date, visits: number, bulletcolor : bulletcolor});
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
              "dataProvider": this.arrFeelings,
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
            this.arrFeelings = [];
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

  // Load Doctor Visit Chart
  loadChartList(){
    try{
        let body_param = {
          'feeling_filter':this.feeling_filter,
          'qol_survey_filter':this.qol_survey_filter,
          'my_treatment_filter':this.my_treatment_filter,
          'my_symptom_filter':this.my_symptom_filter,
          'my_hospitalization_filter':this.my_hospitalization_filter,
          'my_weight_filter':this.my_weight_filter,
        };
        this._APIservices.doctor_visit_chart(body_param, this.headers)
          .subscribe(
            suc=>{
              this.doctorvisit_chartList = suc.body.data;    
              this.feelingLastUpdated = this.doctorvisit_chartList.feelings.last_updated;
              this.qolLastUpdated = this.doctorvisit_chartList.qol_surveys.last_updated;
          },
          err=>{
            console.log(err);
          });
    }catch(err){
        console.log(err);
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

          this.qolchartcomp.qolid = "Charts"
          this.qolchartcomp.totalSocialScore= Number(suc.body.social_avg);
          this.qolchartcomp.totalMentalScore= Number(suc.body.mental_avg);
          this.qolchartcomp.totalPhysicalScore= Number(suc.body.physical_avg);

        

          setTimeout(()=>{
            this.qolchartcomp.loadPhysicalChart(this.qolchartcomp.totalPhysicalScore);
            this.qolchartcomp.loadMentalChart(this.qolchartcomp.totalMentalScore);
            this.qolchartcomp.loadSocialChart(this.qolchartcomp.totalSocialScore);

            this.hideElement = false;
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

}
