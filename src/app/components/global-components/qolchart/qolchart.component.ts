import { Component, OnInit, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var AmCharts : any;

@Component({
  selector: 'qolchart',
  templateUrl: './qolchart.component.html',
  styleUrls: ['./qolchart.component.css']
})
export class QolchartComponent implements OnInit {

	@BlockUI() blockUI: NgBlockUI;


  public qolid: string;

	public totalSocialScore: number = 0;
  public totalMentalScore: number = 0;
  public totalPhysicalScore: number = 0;
  public timeline: boolean = false;
  public about: boolean = false;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cdr.detectChanges();
    this.loadPhysicalChart(this.totalPhysicalScore)
    this.loadMentalChart(this.totalMentalScore)
    this.loadSocialChart(this.totalSocialScore)
  }


  getCss(){
    if(this.about){
      return 'aboutDiv'
    }else if(this.timeline){
      return 'chartDivSmall'
    }

  }



  


  // Load Physical Chart
  loadPhysicalChart(totalPhysicalScore: number){
    // this.blockUI.start('please wait...');
    var gaugePhysicalChart = AmCharts.makeChart( "chartdivPhysical" + this.qolid, {
      "type": "gauge",
      "theme": "light",
      "creditsPosition": "bottom-left",
      "hideCredits":true,
      "axes": [ {
        "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "valueInterval": 1,
        "bands": [ 
           {
          "color": "#cc4748",
          "endValue": 2.5,
          "innerRadius": "50%",
          "startValue": 0
          },{
          "color": "#fdd400",
          "innerRadius": "50%",
          "endValue": 3.75,
          "startValue": 2.5
        }, {
          "color": "#84b761",
          "endValue": 5,
          "innerRadius": "50%",
          "startValue": 3.75
        } ],
        "bottomText": "0 AVG",
        "bottomTextYOffset": -20,
        "endValue": 5
      } ],
      "arrows": [ {} ]
    } );
    
    setTimeout(()=>{
      var value = (Math.round(this.totalPhysicalScore * 100))/100;
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
    setTimeout(()=>{
      // this.blockUI.stop();
    },1200);
  }

  // Mental Chart
  loadMentalChart(totalMentalScore: number){
    // this.blockUI.start('please wait...');
    var gaugeMentalChart = AmCharts.makeChart( "chartdivMental" + this.qolid, {

      "type": "gauge",
      "creditsPosition": "bottom-left",
      "hideCredits":true,
      "theme": "light",
      "axes": [ {
        "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "valueInterval": 1,
        "bands": [ 
           {
          "color": "#cc4748",
          "endValue": 2.5,
          "innerRadius": "50%",
          "startValue": 0
          },{
          "color": "#fdd400",
          "innerRadius": "50%",
          "endValue": 3.75,
          "startValue": 2.5
        }, {
          "color": "#84b761",
          "endValue": 5,
          "innerRadius": "50%",
          "startValue": 3.75
        } ],
        "bottomText": "0 AVG",
        "bottomTextYOffset": -20,
        "endValue": 5
      } ],
      "arrows": [ {} ]
    } );
    setTimeout(()=>{
      var value = (Math.round(this.totalMentalScore * 100))/100;
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
    setTimeout(()=>{
      // this.blockUI.stop();
    },1200);
  }

  // Socail Chart
  loadSocialChart(totalSocialScore: number){
    // this.blockUI.start('please wait...');
    var gaugeSocialChart = AmCharts.makeChart( "chartdivSocial" + this.qolid, {

      "type": "gauge",
      "theme": "light",
      "creditsPosition": "bottom-left",
      "hideCredits":true,
      "axes": [ {
        "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "valueInterval": 1,
        "bands": [ 
           {
          "color": "#cc4748",
          "endValue": 2.5,
          "innerRadius": "50%",
          "startValue": 0
          },{
          "color": "#fdd400",
          "innerRadius": "50%",
          "endValue": 3.75,
          "startValue": 2.5
        }, {
          "color": "#84b761",
          "endValue": 5,
          "innerRadius": "50%",
          "startValue": 3.75
        } ],
        "bottomText": "0 AVG",
        "bottomTextYOffset": -20,
        "endValue": 5
      } ],
      "arrows": [ {} ]
    } );

    setTimeout(()=>{
      var value = (Math.round(this.totalSocialScore * 100))/100;

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
    setTimeout(()=>{
      // this.blockUI.stop();
    },1200);
  }

}
