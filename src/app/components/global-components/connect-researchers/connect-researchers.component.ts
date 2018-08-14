import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { fstat } from 'fs';
import { Router,ActivatedRoute  } from '@angular/router';
declare var $ : any;
declare var jQuery : any;
var countryjson = require('./../../../../common/utilities/country.json');

@Component({
  selector: 'app-connect-researchers',
  templateUrl: './connect-researchers.component.html',
  styleUrls: ['./connect-researchers.component.scss']
})
export class ConnectResearchersComponent extends HeadersProvider implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  pageSymp:any;
  perpageSymp:any;
  donotLoadSymp:boolean;
  PhysicianspageT:any;
  PhysiciansperPage:any;
  ResearchpageT: any;
  Researchperpage:any;
  allResearchChekedFlag:any;
  publicationResearchChekedFlag:any;
  filterString:any;
  researchsList:any;
  PatientList:any;
  physiciansList:any;
  SearchResearchName:any;
  loadMoreResearchAvalibale:boolean;
  patientTabflag:boolean;
  physiciansTabflag:boolean;
  researchersTabflag:boolean;
  placeHolder:string;
  minage:number;
  maxage:number;
  gederAny:boolean;
  genderMale:boolean;
  genderFemale:boolean;
  genderIdentity:any;
  conditionList:any;
  AllConditionFlag:boolean;
  MyconditionFlag:boolean;
  interests:any;
  AnyInterestFlag:boolean;
  chkdonating:boolean;
  chkFundRaising:boolean;
  chkVolunteering:boolean;
  chkReading:boolean;
  lstInterests:string;
  selectedCountry:any;
  StateCityNameList:any;
  stillmorePhysiciansflag:boolean=true;
  searchPhysiciansType:any;
  medical_degree_popup:any;
  currentPhysicianList:any;
  selectedCurrentPhysicianList:any;
  savedSearchpageT:any;
  savedSearchperPage:any;
  lstSavedSearches:any;
  loadMoreSavedSearches:any;
  searchPhysicianWithMedicalDegree:any;
  physicianWithMedicalDegreelist:any;
  selectedPhysicianWithMedicalDegreelist:any;
  sortBy: string;
  IstrackPage: number;
  mySymptomsList:any;
  AllSymptomsFlag:boolean;
  MysymptpmsFlag:boolean;
  getheadersymptomList:any;
  donotLoadMySymp:boolean;
  arraySymptoms:string;
  mySympComp:boolean;

  myTreatmentIds:any;
  alltraeatmentsFlag:any;
  mytraeatmentsFlag:any;
  showMytreatment:any;
  selectedMYtreatments:any;
  selectedMYtreatmentsCount:number;
  selectedMYtreatmenslistValue:string;
  selectedMconditionslistValue:string;
  selected_search:string = "";
  deletesearchId:number;  
  searchTypeDelete:string= "";
  SearchConditionsString:string;
  SearchAllTreatmentString:string="";
  SearchAllTreatmentsList:any;
  SearchConditionList:any;
  SelectedSearchConditionList:any;
  TreatmentDDPageCounter:number;
  TreatmentShowMoreButtonFlag:boolean;
  conditionCheckBoxShowMoreButtonFlag:boolean;
  selectedSearchAllTreatments:any;
  SearchsymptomsString:string;
  SearchsymptomsList:any;
  SelectedSearchsymptomsList:any;
  myconditionIdsCheckbox:any;
  conditioncheckbocShowMoreButtonFlag:boolean;
  conditioncheckboxDDPageCounter:number;
  showconditionCheckBoxList:any;
  selectedConditionCheckBox:any;
  selectedMYconditionCount:number;
  firstSympMinAge:number;
  firstSyyDiagnosedminyear:number;
  firstSyyDiagnosedmaxyear:number;
  firstSympMaxAge:number;
  firstSympAnyChecked:boolean;
  firstSyDiagnosedChecked:boolean;
  firstSyNotDiagnosedChecked:boolean;
  mySymptomIds:any;
  allsymptomsFlag:any;
  mysymptomsFlag:any;
  showMysymptoms:any;
  selectedMYsymptoms:any;
  selectedMYsymptomsCount:number;
  selectedMYsymptomslistValue:string;
  SearchAllSymptomsString:string="";
  SearchAllSymptomsList:any;
  SymptomsDDPageCounter:number;
  SymptomsShowMoreButtonFlag:boolean;
  selectedSearchAllSymptoms:any;
  selectedphysiciansCountry:any;
  entercitystatenamelist:any;
  alreadyselectedcitystatenamephysication:any;
  patientSortstring:any;
  physiciansortstring:any;
  researchSortString:any;
  alreadyselectedStateCity:any;
  countries : any = [];
  placeHolderTitle:any;
  alluserlist:any;
  searchName:string;
  saveSearchPopUp:any;
  filterpatient1flag: string;
  filterpatient2flag: string;
  filterpatient3flag: string;
  filterpatient4flag: string;
  filterpatient5flag: string;
  filterpatient6flag: string;
  filterpatient7flag: string;
  filterpatient8flag: string;
  filterpatient1: string;
  filterpatient2: string;
  filterpatient3: string;
  filterpatient4: string;
  filterpatient5: string;
  filterpatient6: string;
  filterpatient7: string;
  filterpatient8: string;
  toogelflag:boolean;
  filter1flag: string;
  filter1: string;
  filter3flag: string;
  filter3: string;
  filter2flag: string;
  filter2: string;
  constructor(public _router:Router,private APIservices:SCApi, private NotificationService: NotificationsService) {  
    super();   
  }
  
  ngOnInit() {
    this.toogelflag=false;
    this.filter1 = "floating-c form collapse";
    this.filter1flag = "collapsed";
    this.filter2 = "floating-c form collapse";
    this.filter2flag = "collapsed";
    this.filter3 = "floating-c form collapse";
    this.filter3flag = "collapsed";
    this.filterpatient2flag = "collapsed";
    this.filterpatient1flag = "collapsed";
    this.filterpatient2flag = "collapsed";
    this.filterpatient3flag = "collapsed";
    this.filterpatient4flag = "collapsed";
    this.filterpatient5flag = "collapsed";
    this.filterpatient6flag = "collapsed";
    this.filterpatient7flag = "collapsed";
    this.filterpatient8flag = "collapsed";
    this.filterpatient1 = "floating-c form collapse";
    this.filterpatient2 = "floating-c form collapse";
    this.filterpatient3 = "floating-c form collapse";
    this.filterpatient4 = "floating-c form collapse";
    this.filterpatient5 = "floating-c form collapse";
    this.filterpatient6 = "floating-c form collapse";
    this.filterpatient7 = "floating-c form collapse";
    this.filterpatient8 = "floating-c form collapse";
    this.alluserlist=[];
    this.countries = countryjson;
    this.alreadyselectedcitystatenamephysication=[];
    this.patientSortstring="newest";
    this.physiciansortstring="newest";
    this.researchSortString="newest";
    this.entercitystatenamelist="";
    this.selectedphysiciansCountry="";
    this.selectedSearchAllSymptoms=[];
    this.SymptomsShowMoreButtonFlag=true;
    this.selectedMYsymptoms=[];
    this.SearchAllSymptomsList=[];
    this.mySymptomIds=[];
    this.allsymptomsFlag=true;
    this.mysymptomsFlag=false;
    this.showMysymptoms=[];
    this.selectedMYsymptomsCount=0;
    this.selectedMYsymptomslistValue="";
    this.firstSympMinAge=null;
    this.firstSyyDiagnosedminyear=null;
    this.firstSyyDiagnosedmaxyear=null;
    this.firstSympMaxAge=null;
    this.firstSympAnyChecked=false;
    this.firstSyDiagnosedChecked=false;
    this.firstSyNotDiagnosedChecked=false;
    this.selectedConditionCheckBox=[];
    this.SearchsymptomsString="";
    this.selectedSearchAllTreatments=[];
    this.SelectedSearchsymptomsList=[];
    this.conditioncheckboxDDPageCounter=1;
    this.showconditionCheckBoxList=[];
    this.medical_degree_popup = document.getElementById('medical_degree_popup');
    this.AllConditionFlag=true;
    this.TreatmentShowMoreButtonFlag=true;
    this.MyconditionFlag=false;
    this.AnyInterestFlag=false;
    this.lstInterests = "";
    this.chkdonating=false;
    this.chkFundRaising=false;
    this.chkVolunteering=false;
    this.chkReading=false;    
    this.AllConditionFlag=false;
    this.PhysiciansperPage=10;
    this.PhysicianspageT=1;
    this.ResearchpageT=1;
    this.Researchperpage=10;
    this.pageSymp=1;
    this.perpageSymp=15;   
    this.allResearchChekedFlag=true;
    this.publicationResearchChekedFlag=false;
    this.filterString="all";
    this.SearchResearchName ="";
    this.loadMoreResearchAvalibale=true;
    this.patientTabflag=true;
    this.physiciansTabflag=false;
    this.researchersTabflag=false;
    this.placeHolder="Enter patients name";
    this.placeHolderTitle="Search by patient name";
    this.minage=12;
    this.maxage=100;
    this.StateCityNameList="";
    this.alreadyselectedStateCity=[];
    this.selectedCountry="";
    this.genderIdentity="Any";
    this.searchPhysiciansType="";
    this.selectedCurrentPhysicianList=[];
    this.SelectedSearchConditionList=[];
    this.SearchConditionList=[];
    this.savedSearchpageT=1;
    this.savedSearchperPage=10;
    this.loadMoreSavedSearches=true;
    this.lstSavedSearches = [];
    this.selectedMYtreatments=[];
    this.SearchAllTreatmentsList=[];
    this.SearchConditionsString="";
    this.loadResearchers();
    this.loadPatient();
    this.loadMyCondition();
    this.currentPhysicianList=[];
    this.physicianWithMedicalDegreelist=[];
    this.selectedPhysicianWithMedicalDegreelist=[];
    this.sortBy = "newest_to_oldest";
    this.IstrackPage = 1;
    this.mySymptomsList = [];
    this.AllSymptomsFlag = false;
    this.MysymptpmsFlag =false;
    this.getheadersymptomList = [];
    this.arraySymptoms = "";
    this.mySympComp = false;
    this.loadPhysicians();
    this.getMySymptoms();
    this.getAllSymptoms();
    this.myTreatmentIds=[];
    this.loadMyTreatments();
    this.alltraeatmentsFlag=true;
    this.conditioncheckbocShowMoreButtonFlag=true;
    this.mytraeatmentsFlag=false;
    this.showMytreatment=[];
    this.selectedMYtreatmentsCount=0;
    this.selectedMYtreatmenslistValue="";
    this.TreatmentDDPageCounter=1;
   this.myconditionIdsCheckbox=[];
   this.loadMyCondtionforCheckBox();
   this.AllConditionFlag=true;
   this.searchName = "";
   this.saveSearchPopUp = document.getElementById('saveSearchModal');
  }
  selectname(item){
    alert(item)
  }
  tabpatients(){
    this.patientTabflag=true;
    this.physiciansTabflag=false;
    this.researchersTabflag=false;
    this.placeHolder="Enter patient name";
    this.placeHolderTitle="Search by patient name";
    this.loadPatient();
  }

  anyChecked(newObj){
    this.firstSympAnyChecked=true;
    this.firstSyDiagnosedChecked=false;
    this.firstSyNotDiagnosedChecked=false;
  }
  diagnosedChecked(){
    this.firstSympAnyChecked=false;
    this.firstSyDiagnosedChecked=true;
    this.firstSyNotDiagnosedChecked=false;
  }

  notDiagnosedChecked(){
    this.firstSympAnyChecked=false;
    this.firstSyDiagnosedChecked=false;
    this.firstSyNotDiagnosedChecked=true;
  }
  // search Patients with my condition
  loadMyCondition(){
    this.APIservices.my_symptomconditions_listIds(this.headers).subscribe(suc=>{
      if(suc.body.status == "1" || suc.body.status == 1){
        this.conditionList  = [];
              for(var i =0;i<suc.body.data.length;i++){
                this.conditionList.push(suc.body.data[i].id);
              }
      }
    },
    err=>{

    })
    
  }

  loadmyFirstTenConditionList(){
    this.conditioncheckbocShowMoreButtonFlag=true;
    this.conditioncheckboxDDPageCounter=1;
      let counter=0;
      this.showconditionCheckBoxList=[];
    if(this.myconditionIdsCheckbox.length<10){
      this.conditioncheckbocShowMoreButtonFlag=false;
      counter=this.myconditionIdsCheckbox.length;
    }else{
      counter=10;
    }
    for(var i=0;i<counter;i++){
      this.showconditionCheckBoxList.push(this.myconditionIdsCheckbox[i]);
    }

    for(var i=0;i<counter;i++){
      this.showconditionCheckBoxList[i].checked=false;
    }
  }

  loadmyFirstTenTreatmentsList(){
    this.TreatmentShowMoreButtonFlag=true;
    this.TreatmentDDPageCounter=1;
      let counter=0;
      this.showMytreatment=[];
    if(this.myTreatmentIds.length<10){
      this.TreatmentShowMoreButtonFlag=false;
      counter=this.myTreatmentIds.length;
    }else{
      counter=10;
    }
    for(var i=0;i<counter;i++){
      this.showMytreatment.push(this.myTreatmentIds[i]);
    }

    for(var i=0;i<counter;i++){
      this.showMytreatment[i].checked=false;
    }
  }
  myteratmentsSelected(item){
    if(item){      
      this.alltraeatmentsFlag=false;
    }else{
      this.alltraeatmentsFlag=true;
    }
    
  }
  SearchConditions(){
    if(this.SearchConditionsString.length>0){
      let body_param = {
        "search_word":this.SearchConditionsString
      }
      this.APIservices.list_conditions(body_param,this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          if(this.SearchConditionsString.length>0){
          this.SearchConditionList=[];
          for(var i=0;i<suc.body.data.length;i++){
            if(this.SelectedSearchConditionList.findIndex(x => x.id === suc.body.data[i].id) == -1){
              this.SearchConditionList.push(suc.body.data[i]);
            }
          }
        }else{
          this.SearchConditionList=[];
        }
        }
      },
      err=>{
  
      })
    }else{
      this.SearchConditionList=[];
    }
  }
  Searchsymptoms(){
    if(this.SearchsymptomsString.length>0){
      let body_param = {
        "search_word":this.SearchsymptomsString
      }
      this.APIservices.search_symptoms(body_param,this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          if(this.SearchsymptomsString.length>0){
          this.SearchsymptomsList=[];
          for(var i=0;i<suc.body.data.length;i++){
            if(this.SelectedSearchsymptomsList.findIndex(x => x.id === suc.body.data[i].id) == -1){
              this.SearchsymptomsList.push(suc.body.data[i]);
            }
          }
        }else{
          this.SearchsymptomsList=[];
        }
        }
      },
      err=>{
  
      })
    }else{
      this.SearchsymptomsList=[];
    }
  }
  SearchAllTreatments(){
    if(this.SearchAllTreatmentString.length>0){
      let body_param = {
        "search_word":this.SearchAllTreatmentString
      }
      this.APIservices.list_conditions(body_param,this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          if(this.SearchAllTreatmentString.length>0){
          this.SearchAllTreatmentsList=[];
          for(var i=0;i<suc.body.data.length;i++){
             if(this.selectedSearchAllTreatments.findIndex(x => x.id === suc.body.data[i].id) == -1){
              this.SearchAllTreatmentsList.push(suc.body.data[i]);
            }
          }
        }else{
          this.SearchConditionList=[];
        }
        }
      },
      err=>{
  
      })
    }else{
      this.SearchConditionList=[];
    }
  }
  removeCondition(item){
    if(this.SelectedSearchConditionList.findIndex(x => x.id === item.id) !== -1){
      let index =this.SelectedSearchConditionList.findIndex(x => x.id === item.id);
      this.SelectedSearchConditionList.splice(index, 1);
      this.SearchConditions();
    }
  }
  addconditionList(item){
    if(this.SelectedSearchConditionList.findIndex(x => x.id === item.id) == -1){
      this.SelectedSearchConditionList.push(item);
      document.querySelector('#Search_Conditions_popup').classList.remove('in');
      this.SearchConditions();
    }
  }
  addsymptomsList(item){
    if(this.SelectedSearchsymptomsList.findIndex(x => x.id === item.id) == -1){
      this.SelectedSearchsymptomsList.push(item);
      document.querySelector('#Search_symptoms_popup').classList.remove('in');
      this.Searchsymptoms();
    }
  }
  removesymptomsList(item){
    if(this.SelectedSearchsymptomsList.findIndex(x => x.id === item.id) !== -1){
      let index =this.SelectedSearchsymptomsList.findIndex(x => x.id === item.id);
      this.SelectedSearchsymptomsList.splice(index, 1);
      this.Searchsymptoms();
    }
  }
  removeAllTreatments(item){
    if(this.selectedSearchAllTreatments.findIndex(x => x.id === item.id) !== -1){
      let index =this.selectedSearchAllTreatments.findIndex(x => x.id === item.id);
      this.selectedSearchAllTreatments.splice(index, 1);
      this.SearchAllTreatments();
    }
  }
  addAllTreatmentsList(item){
    if(this.selectedSearchAllTreatments.findIndex(x => x.id === item.id) == -1){
      this.selectedSearchAllTreatments.push(item);
      document.querySelector('#Search_treatments_popup').classList.remove('in');
      this.SearchAllTreatments();
    }
  }
  allteratmentSelected(item){
    if(item){
      this.mytraeatmentsFlag=false;
    }else{
      this.mytraeatmentsFlag=true;
    }
  }
  allconditionSelected(item){
    if(item){
      this.MyconditionFlag=true;
      this.AllConditionFlag=false;
    }else{
      this.MyconditionFlag=false;
      this.AllConditionFlag=true;
     
    }
  }
  myconditionSelected(item){
    if(item){      
      this.AllConditionFlag=true;
      this.MyconditionFlag=false;

    }else{
      this.AllConditionFlag=false;
      this.MyconditionFlag=true;
     
    }
    
  }

  loadMoreConditionCheckBox(){
    let counter=0;
    let statring=10* this.conditioncheckboxDDPageCounter;
    this.conditioncheckboxDDPageCounter++;
    if( this.conditioncheckboxDDPageCounter*10>=this.myconditionIdsCheckbox.length){
      counter=this.myconditionIdsCheckbox.length;
      this.conditioncheckbocShowMoreButtonFlag=false;
    }else{
      counter=this.conditioncheckboxDDPageCounter*10;
    }
    for(var i=statring;i<counter;i++){
      let temp=this.myconditionIdsCheckbox[i];
      temp.checked=false;
      this.showconditionCheckBoxList.push(temp);
    }
  }

  loadMoreTreatments(){
    let counter=0;
    let statring=10* this.TreatmentDDPageCounter;
    this.TreatmentDDPageCounter++;
    if( this.TreatmentDDPageCounter*10>=this.myTreatmentIds.length){
      counter=this.myTreatmentIds.length;
      this.TreatmentShowMoreButtonFlag=false;
    }else{
      counter=this.TreatmentDDPageCounter*10;
    }
    for(var i=statring;i<counter;i++){
      let temp=this.myTreatmentIds[i];
      temp.checked=false;
      this.showMytreatment.push(temp);
    }
  }
    // search Patients with my condition
    loadMyTreatments(){
      this.APIservices.search_treatmentWithOutwords(this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.myTreatmentIds=suc.body.data;
          this.loadmyFirstTenTreatmentsList();
        }
      },
      err=>{
  
      })
      
    }

     // search Patients with my condition
     loadMyCondtionforCheckBox(){
      this.APIservices.my_symptomconditions_listIds(this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.myconditionIdsCheckbox=suc.body.data;
          this.loadmyFirstTenConditionList();
        }
      },
      err=>{
  
      })
      
    }
    handleChange(val: boolean, index: number){
      this.showMytreatment[index].checked = !val;
      if(!val){
        if( this.selectedMYtreatments.findIndex(x => x.id ===this.showMytreatment[index].id) == -1){
          this.selectedMYtreatments.push(this.showMytreatment[index]);
        }
      }else{
        if(this.selectedMYtreatments.findIndex(x => x.id ===this.showMytreatment[index].id) != -1){
          let indexValue=this.selectedMYtreatments.findIndex(x => x.id ===this.showMytreatment[index].id);
          this.selectedMYtreatments.splice(indexValue, 1);
        }
      }
      this.selectedMYtreatmentsCount=this.selectedMYtreatments.length;
      this.selectedMYtreatmenslistValue="";
      for(var i=0;i<this.selectedMYtreatmentsCount;i++){
        if((this.selectedMYtreatmentsCount-1)==i ){
          this.selectedMYtreatmenslistValue= this.selectedMYtreatmenslistValue+ this.selectedMYtreatments[i].name;
        } else{
          this.selectedMYtreatmenslistValue= this.selectedMYtreatmenslistValue+ this.selectedMYtreatments[i].name +",";
        }
      }
    }
    handleChangeCondition(val: boolean, index: number){
      this.showconditionCheckBoxList[index].checked = !val;
      if(!val){
        if( this.selectedConditionCheckBox.findIndex(x => x.id ===this.showconditionCheckBoxList[index].id) == -1){
          this.selectedConditionCheckBox.push(this.showconditionCheckBoxList[index]);
        }
      }else{
        if(this.selectedConditionCheckBox.findIndex(x => x.id ===this.showconditionCheckBoxList[index].id) != -1){
          let indexValue=this.selectedConditionCheckBox.findIndex(x => x.id ===this.showconditionCheckBoxList[index].id);
          this.selectedConditionCheckBox.splice(indexValue, 1);
        }
      }
      this.selectedMYconditionCount=this.selectedConditionCheckBox.length;
      this.selectedMconditionslistValue="";
      for(var i=0;i<this.selectedMYconditionCount;i++){
        if((this.selectedMYconditionCount-1)==i ){
          this.selectedMconditionslistValue= this.selectedMconditionslistValue+ this.selectedConditionCheckBox[i].name;
        } else{
          this.selectedMconditionslistValue= this.selectedMconditionslistValue+ this.selectedConditionCheckBox[i].name +",";
        }
      }
    }
    changeCheckbox(item) {
       this.showMytreatment[item].checked = !this.showMytreatment[item].checked;
    }

  showAutoCompletePopup(popupId, show) {
    if(show){
      document.querySelector('#'+popupId).classList.add('in');
  }else{
    document.querySelector('#'+popupId).classList.remove('in');
  }
  }
  
  showAutoCompletePopupfilter(popupId, show) {
    if(show){
      this.toogelflag=false;
      document.querySelector('#'+popupId).classList.add('in');
  }else{
    this.toogelflag=true;
    document.querySelector('#'+popupId).classList.remove('in');
  }
  }

  addMcurrentPhysician(item){
    
        if(this.selectedCurrentPhysicianList.findIndex(x => x.id ==item.id)== -1){
          this.selectedCurrentPhysicianList.push(item);
          this.searchPhysiciansType="";
          this.searchPhysician();
          this.loadPhysicians();
        }         
  }
  searchPhysician(){
    if(this.searchPhysiciansType.length>0){
        let body_param = {
          "search_word":this.searchPhysiciansType,
        }
        this.APIservices.getcurrently_practicings(body_param,this.headers).subscribe(suc=>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.currentPhysicianList=[];
            this.currentPhysicianList=suc.body.data;
           
          }
        },
        err=>{
    
        }); 
    }
    else{
      this.currentPhysicianList=[];
    }
   
  }

  removeSelectedPhysician(index){
    this.selectedCurrentPhysicianList.splice(index, 1);
    this.loadPhysicians();

  }
  
  private handleKeyDown(event: any)
{
    if (event.keyCode == 13)
    {
      this.alreadyselectedStateCity.push(this.StateCityNameList);
      this.StateCityNameList="";
      this.loadPatient();
    }
}
  //remove selected medical degree 
  removeMedicalDegree(item){
    if(this.selectedPhysicianWithMedicalDegreelist.findIndex(x => x.id === item.id) !== -1){
      let index =this.selectedPhysicianWithMedicalDegreelist.findIndex(x => x.id === item.id);
      this.selectedPhysicianWithMedicalDegreelist.splice(index, 1);
      this.physicianWithMedicalDegree();
      this.loadPhysicians();
  }
  }
  //add selected medical degree
  addMedicalDegree(item){
    if(this.selectedPhysicianWithMedicalDegreelist.findIndex(x => x.id === item.id) == -1){
      this.selectedPhysicianWithMedicalDegreelist.push(item);
      document.querySelector('#medical_degree_popup').classList.remove('in');
      this.physicianWithMedicalDegree();
      this.loadPhysicians();
    }
  }
  loadPhysicians(){
    let type_of_physician_ids:any;
    let degree_earned_ids:any;
    let name:any;
    let country_code:any;
    let StateCityNameList:any;

    if(this.SearchResearchName.length>0){
      name=this.SearchResearchName;
    }else{
      name=null;
    }
    this.physiciansList=[];
    this.PhysicianspageT=1;
    if(this.selectedCurrentPhysicianList.length>0){
      type_of_physician_ids= this.selectedCurrentPhysicianList.map(o => {
        return { id: o.id};
      });
    }else{
      type_of_physician_ids=null;
    }
    if(this.selectedPhysicianWithMedicalDegreelist.length>0){
      degree_earned_ids = this.selectedPhysicianWithMedicalDegreelist.map(o => {
        return { id: o.id};
      });
    }else{
      degree_earned_ids=null;
    }
    if(this.selectedphysiciansCountry.length>0 && this.alreadyselectedcitystatenamephysication.length>0 ){
      country_code=this.selectedphysiciansCountry;
      StateCityNameList=this.alreadyselectedcitystatenamephysication;
    }else{
      country_code=null
      StateCityNameList=null;
    }
    let body_param = { 
      "degree_earned_ids":degree_earned_ids,
      "type_of_physician_ids":type_of_physician_ids,
      "name":name,
      "page":   this.PhysicianspageT,
      "per_page" : this.PhysiciansperPage,
      "offset": 0,
      "sort_by":this.physiciansortstring,
      "country_code":country_code,
      "city_states":StateCityNameList
    }
    this.APIservices.getphysicians(body_param, this.headers).subscribe(res=>{
     if(res.body.status===1 ||res.body.status==="1"){
       if(res.body.data.length>0){
          this.physiciansList=res.body.data;
         for(var i=0;i<this.physiciansList.length;i++){
              if(this.physiciansList[i].city!=null){
                let city=this.physiciansList[i].city+",";
                this.physiciansList[i].city=city;
              }
              if(this.physiciansList[i].state!=null ){
                let state=this.physiciansList[i].state+",";
                this.physiciansList[i].state=state;
              }
              if(this.physiciansList[i].current_practice_detail!==null){
                this.physiciansList[i].current_practice_detail=this.physiciansList[i].current_practice_detail.name;
              }else{
                this.physiciansList[i].current_practice_detail="";
              }
         }
       }else{
          this.stillmorePhysiciansflag=false;
       }
     }

    });
  }
   // load medical degree
   physicianWithMedicalDegree(){
    if(this.searchPhysicianWithMedicalDegree.length>0){
      let body_param = {
        "search_word":this.searchPhysicianWithMedicalDegree,
      }
      this.APIservices.getDegrees(body_param,this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          this.physicianWithMedicalDegreelist=[];
          for(var i=0;i<suc.body.data.length;i++){
            if(this.selectedPhysicianWithMedicalDegreelist.findIndex(x => x.id === suc.body.data[i].id) == -1){
              this.physicianWithMedicalDegreelist.push(suc.body.data[i]);
            }
          }
          
        }
      },
      err=>{
  
      })
    }else{
      this.physicianWithMedicalDegreelist=[];
    }
   
  }

  //load more Physicians list
  loadMorePhysicians(){
    let type_of_physician_ids:any;
    let degree_earned_ids:any;
    let country_code:any;
    let StateCityNameList:any;
    if(this.selectedCurrentPhysicianList.length>0){
      type_of_physician_ids=this.selectedCurrentPhysicianList;
    }else{
      type_of_physician_ids=null;
    }
    let name:any;
    if(this.SearchResearchName.length>0){
      name=this.SearchResearchName;
    }else{
      name=null;
    }
    if(this.selectedPhysicianWithMedicalDegreelist.length>0){
      degree_earned_ids = this.selectedPhysicianWithMedicalDegreelist.map(o => {
        return { id: o.id};
      });
    }else{
      degree_earned_ids=null;
    }
    if(this.selectedCurrentPhysicianList.length>0){
      type_of_physician_ids= this.selectedCurrentPhysicianList.map(o => {
        return { id: o.id};
      });
    }else{
      type_of_physician_ids=null;
    }
    if(this.selectedphysiciansCountry.length>0 && this.alreadyselectedcitystatenamephysication.length>0 ){
      country_code=this.selectedphysiciansCountry;
      StateCityNameList=this.alreadyselectedcitystatenamephysication;
    }else{
      country_code=null
      StateCityNameList=null;
    }
    this.PhysicianspageT++;
    let body_param = {
      "degree_earned_ids":degree_earned_ids,
      "type_of_physician_ids":type_of_physician_ids,
      "name":name,
      "page":   this.PhysicianspageT,
      "per_page" : this.PhysiciansperPage,
      "offset": 0,
      "sort_by":this.physiciansortstring,
      "country_code":country_code,
      "city_states":StateCityNameList
    }
    this.APIservices.getphysicians(body_param, this.headers).subscribe(res=>{
     if(res.body.status===1 ||res.body.status==="1"){
       if(res.body.data.length>0){
         let tphysiciansList=res.body.data;
         for(var i=0;i<tphysiciansList.length;i++){
          if(tphysiciansList[i].city!=null){
            let city=tphysiciansList[i].city+",";
            tphysiciansList[i].city=city;
          }
          if(tphysiciansList[i].state!=null ){
            let state=tphysiciansList[i].state+",";
            tphysiciansList[i].state=state;
          }
          if(tphysiciansList[i].current_practice_detail!==null){
            tphysiciansList[i].current_practice_detail=tphysiciansList[i].current_practice_detail.name;
          }else{
            tphysiciansList[i].current_practice_detail="";
          }

         }

         this.physiciansList= this.physiciansList.concat(tphysiciansList);
       }else{
        this.stillmorePhysiciansflag=false;
       }
     }

    });
  }

  getAllSymptoms(){
    this.pageSymp = 1;
    this.donotLoadSymp = true;
    this.perpageSymp = 15; 
    let body_param;
    // while(this.donotLoadSymp == true)
    // {
      try{
        
          body_param = {
            "page" : 1,
            "per_page": 15,
            "offset": 0,
            "search_word":"",
            "condition_ids":[]
          };      
        
        this.APIservices.get_CommunitySymptoms(body_param, this.headers).subscribe(suc=>{
          this.getheadersymptomList=this.getheadersymptomList.concat(suc.body.data);
          if(suc.body.data.length==0){
            this.donotLoadSymp = false;
          }         
        }, err=>{
          var err_res = JSON.parse(err._body);
          this.NotificationService.error('Error',err_res.message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          })
        });
      }catch(err){
        console.log(err);
      }
    //   this.pageSymp++;
    // }
  }
 
  genderAnyChecked(){
    this.gederAny=true;
    this.genderMale=false;
    this.genderFemale=false;
  }
  genderMaleChecked(){
    this.genderMale=true;
    this.gederAny=false;
    this.genderFemale=false;
  }
  genderFemaleChecked(){
    this.genderFemale=true;
    this.gederAny=false;
    this.genderMale=false;
  }
  saveSearchOpen(){
    this.searchName = "";
    $("#saveSearchModal").modal('show');
    this.saveSearchPopUp.style.display = "block";
  }

  saveSearchPatient(){
    this.blockUI.start('please wait...'); 
    this.saveSearchPopUp.style.display = "none";
    $("#saveSearchModal").modal('hide');
    let search_type:string="patient";    
    let treatment_ids:any;
    this.loadMoreResearchAvalibale=true;
    let name:any;
    let age:any;
    let symptom_ids:any;
    let gender:string;
    let gender_identity:string;
    this.ResearchpageT=1;
    this.Researchperpage=10;
    let Mycondition:any
    let country_code:string;
    let StateCityNameList:any;
    if(this.selectedMYtreatments.length==0 && this.selectedSearchAllTreatments.length==0 ){
      treatment_ids=null;
     
    }else{
      treatment_ids = this.selectedMYtreatments.map(o => {
        return { id: o.id};
      });
      let temp=this.selectedSearchAllTreatments.map(o => {
        return { id: o.id};
      });
      treatment_ids=treatment_ids.concat(temp);
    }
    if(this.selectedMYsymptoms.length==0 && this.selectedSearchAllSymptoms.length==0 ){
      symptom_ids=null;
     
    }else{
      symptom_ids = this.selectedMYsymptoms.map(o => {
        return { id: o.id};
      });
      let temp=this.selectedSearchAllSymptoms.map(o => {
        return { id: o.id};
      });
      symptom_ids=symptom_ids.concat(temp);
    }
    if(this.selectedCountry.length>0 && this.StateCityNameList.length>0 ){
      country_code=this.selectedCountry;
      StateCityNameList=this.StateCityNameList.split(",");
    }else{
      country_code=null
      StateCityNameList=null;
    }
    if(this.MyconditionFlag){
      Mycondition=this.conditionList;
    }else{
      Mycondition=null;
    }
    if(this.SearchResearchName.length>0){
      name=this.SearchResearchName;
    }else{
      name=null;
    }
    if( (this.minage !==12 ||this.maxage !==100) && this.minage<this.maxage){
      age =this.minage.toString()+"-"+this.maxage.toString();
    }else{
      age=null;
    } 
    if(this.genderIdentity !=="Any"){
      gender_identity=this.genderIdentity
    }else{
      gender_identity=null;
    }
    if(!this.gederAny){
        if(this.genderFemale){
          gender="Female";
        }else{
          gender="Male";
        }
    }else{
      gender=null;
    }
    if(!this.AnyInterestFlag){         
      debugger;
      this.lstInterests = "[";
      var isFirst = false;
      if(this.chkdonating)
      {
        this.lstInterests = this.lstInterests + '"' + "Donating" + '"';
        isFirst = true;
      }
      if(this.chkFundRaising){

        this.lstInterests = this.lstInterests + (isFirst == true ? ',"' + "Fundraising" + '"' : '"' + "Fundraising" + '"');
        if(!isFirst){
          isFirst = true;
        }
      }
      if(this.chkVolunteering){

        this.lstInterests = this.lstInterests + (isFirst == true ? ',"' + "Volunteering" + '"' : '"' + "Volunteering" + '"');
        if(!isFirst){
          isFirst = true;
        }
      }
      if(this.chkReading){
        this.lstInterests = this.lstInterests + (isFirst == true ? ',"' + "Reading" + '"' : '"' + "Reading" + '"'); 
        if(!isFirst){
          isFirst = true;
        }
      }

      if(isFirst){
          this.lstInterests = this.lstInterests + (']');
      }
      else{
        this.lstInterests = this.lstInterests + ('""]');
      }          
    }else{
    
      this.lstInterests = "";
     }
       
     let condition_id:any;
     if(this.selectedConditionCheckBox.length==0 &&this.SelectedSearchConditionList.length==0){
      condition_id=null;
     }else{
      condition_id = this.SelectedSearchConditionList.map(o => {
        return { id: o.id};
      });
      let temp=this.selectedConditionCheckBox.map(o => {
        return { id: o.id};
      });
      if(temp.length>0 && this.showconditionCheckBoxList[0].checked){    
        let index=temp.findIndex(x => this.showconditionCheckBoxList[0].id);
      if(this.firstSympMinAge!=null&& this.firstSyyDiagnosedminyear!=null&&this.firstSyyDiagnosedmaxyear!=null&&this.firstSympMaxAge!=null &&index!=-1 ){
        temp[index].age_first_symptom=this.firstSympMinAge.toString()+"-"+ this.firstSympMaxAge.toString();
        temp[index].age_when_diagnosed=this.firstSyyDiagnosedminyear.toString()+"-"+ this.firstSyyDiagnosedmaxyear.toString();
        if(this.firstSyDiagnosedChecked){
          temp[index].diagnosed_status=true;
        }else{
          temp[index].diagnosed_status=false;
        }
        condition_id = condition_id.concat(temp);
      }else{
        condition_id = condition_id.concat(temp); 
      }
      }else{
        condition_id = condition_id.concat(temp); 
      }
      
     }

    this.PatientList=[];
    let body_param = { 
      "search_name":this.searchName,
      "search_type":"patient",
      "condition_id":condition_id,
      "treatment_ids":treatment_ids,      
      "sort_by":"newest",
      "name":name,
      "agerange":age,
      "gender":gender,
      "gender_identity":gender_identity,
      "interests":this.lstInterests,
      "symptom_ids":symptom_ids,
      "country_code":country_code,
      "city_states":StateCityNameList
    }
    this.APIservices.SavePatientSearch(body_param, this.headers).subscribe(res=>{
      if(res.body.status===1 ||res.body.status==="1"){      
            this.NotificationService.success('Search', "Search saved successfully.",{
              timeOut: 2000, 
              showProgressBar: false,
              pauseOnHover: false,
              clickToClose: false 
            });
            this.blockUI.stop();
           // this.GetSavedSearches("patient");
          }
        },    
        err=>{
          var err_res = JSON.parse(err._body);
          this.blockUI.stop();
          this.NotificationService.error('Error', err_res.message, { 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
        });
    });
    //this.loadPatient();  
  }
  loadPatient(){
    let treatment_ids:any;
    this.loadMoreResearchAvalibale=true;
    let name:any;
    let age:any;
    let symptom_ids:any;
    let gender:string;
    let gender_identity:string;
    this.ResearchpageT=1;
    this.Researchperpage=10;
    let Mycondition:any
    let country_code:string;
    let StateCityNameList:any;
    if(this.selectedMYtreatments.length==0 && this.selectedSearchAllTreatments.length==0 ){
      treatment_ids=null;
     
    }else{
      treatment_ids = this.selectedMYtreatments.map(o => {
        return { id: o.id};
      });
      let temp=this.selectedSearchAllTreatments.map(o => {
        return { id: o.id};
      });
      treatment_ids=treatment_ids.concat(temp);
    }
    if(this.selectedMYsymptoms.length==0 && this.selectedSearchAllSymptoms.length==0 ){
      symptom_ids=null;
     
    }else{
      symptom_ids = this.selectedMYsymptoms.map(o => {
        return { id: o.id};
      });
      let temp=this.selectedSearchAllSymptoms.map(o => {
        return { id: o.id};
      });
      symptom_ids=symptom_ids.concat(temp);
    }
    if(this.selectedCountry.length>0 && this.alreadyselectedStateCity.length>0 ){
      country_code=this.selectedCountry;
      StateCityNameList=this.alreadyselectedStateCity;
    }else{
      country_code=null
      StateCityNameList=null;
    }
    if(this.MyconditionFlag){
      Mycondition=this.conditionList;
    }else{
      Mycondition=null;
    }
    if(this.SearchResearchName.length>0){
      name=this.SearchResearchName;
    }else{
      name=null;
    }
    if( (this.minage !==12 ||this.maxage !==100) && this.minage<this.maxage){
      age =this.minage.toString()+"-"+this.maxage.toString();
    }else{
      age=null;
    } 
    if(this.genderIdentity !=="Any"){
      gender_identity=this.genderIdentity
    }else{
      gender_identity=null;
    }
    if(!this.gederAny){
        if(this.genderFemale){
          gender="Female";
        }else{
          gender="Male";
        }
    }else{
      gender=null;
    }
    if(!this.AnyInterestFlag){         
      this.lstInterests = "[";
      var isFirst = false;
      if(this.chkdonating)
      {
        this.lstInterests = this.lstInterests + '"' + "Donating" + '"';
        isFirst = true;
      }
      if(this.chkFundRaising){

        this.lstInterests = this.lstInterests + (isFirst == true ? ',"' + "Fundraising" + '"' : '"' + "Fundraising" + '"');
        if(!isFirst){
          isFirst = true;
        }
      }
      if(this.chkVolunteering){

        this.lstInterests = this.lstInterests + (isFirst == true ? ',"' + "Volunteering" + '"' : '"' + "Volunteering" + '"');
        if(!isFirst){
          isFirst = true;
        }
      }
      if(this.chkReading){
        this.lstInterests = this.lstInterests + (isFirst == true ? ',"' + "Reading" + '"' : '"' + "Reading" + '"'); 
        if(!isFirst){
          isFirst = true;
        }
      }

      if(isFirst){
          this.lstInterests = this.lstInterests + (']');
      }
      else{
        this.lstInterests = this.lstInterests + ('""]');
      }          
    }else{
    
      this.lstInterests = "";
     }

     let condition_id:any;
     if(this.selectedConditionCheckBox.length==0 &&this.SelectedSearchConditionList.length==0){
      condition_id=null;
     }else{
      condition_id = this.SelectedSearchConditionList.map(o => {
        return { id: o.id};
      });
      let temp=this.selectedConditionCheckBox.map(o => {
        return { id: o.id};
      });
      if(temp.length>0 && this.showconditionCheckBoxList[0].checked){    
        let index=temp.findIndex(x => this.showconditionCheckBoxList[0].id);
      if(this.firstSympMinAge!=null&& this.firstSyyDiagnosedminyear!=null&&this.firstSyyDiagnosedmaxyear!=null&&this.firstSympMaxAge!=null &&index!=-1 ){
        temp[index].age_first_symptom=this.firstSympMinAge.toString()+"-"+ this.firstSympMaxAge.toString();
        temp[index].age_when_diagnosed=this.firstSyyDiagnosedminyear.toString()+"-"+ this.firstSyyDiagnosedmaxyear.toString();
        if(this.firstSyDiagnosedChecked){
          temp[index].diagnosed_status=true;
        }else{
          temp[index].diagnosed_status=false;
        }
        condition_id = condition_id.concat(temp);
      }else{
        condition_id = condition_id.concat(temp); 
      }
      }else{
        condition_id = condition_id.concat(temp); 
      }
      
     }

    this.PatientList=[];
    let body_param = { 
      "condition_id":condition_id,
      "treatment_ids":treatment_ids,
      "page":   this.ResearchpageT,
      "per_page" : this.Researchperpage,
      "offset": 0,
      "sort_by":this.patientSortstring,
      "name":name,
      "agerange":age,
      "gender":gender,
      "gender_identity":gender_identity,
      "interests":this.lstInterests,
       "symptom_ids":symptom_ids,
      "country_code":country_code,
      "city_states":StateCityNameList
    }
    this.APIservices.getPatients(body_param, this.headers).subscribe(res=>{
     if(res.body.status===1 ||res.body.status==="1"){
       if(res.body.data.length>0){
          this.PatientList=res.body.data;
          for(var i=0;i<this.PatientList.length;i++){
              if(this.PatientList[i].my_conditions.length>0){
                  let tempCondition=this.PatientList[i].my_conditions;
                  let tconditionVal="";
                  for(var j=0;j<tempCondition.length;j++){
                      if((j+1)%2==0){
                        tconditionVal=tconditionVal+"," +tempCondition[j].name+"<br/>";
                      }else{                      
                        tconditionVal=tconditionVal+tempCondition[j].name;
                      }
                  }
                  this.PatientList[i].my_conditions=tconditionVal;
              }
          }
       }else{

       }
     }

    });
  }
  loadMorePatient(){
    this.loadMoreResearchAvalibale=true;
    let name:any;
    let  age:any;
    let gender:string;
    this.ResearchpageT++;
    let gender_identity:any;
    this.Researchperpage=10;
    let Mycondition:any;
    let treatment_ids:any;
    if(this.selectedMYtreatments.length==0 && this.selectedSearchAllTreatments.length==0 ){
      treatment_ids=null;
     
    }else{
      treatment_ids = this.selectedMYtreatments.map(o => {
        return { id: o.id};
      });
      let temp=this.selectedSearchAllTreatments.map(o => {
        return { id: o.id};
      });
      treatment_ids=treatment_ids.concat(temp);
    }
    if(this.MyconditionFlag){
      Mycondition=this.conditionList;
    }else{
      Mycondition=null;
    }
    if(!this.gederAny){
      if(this.genderFemale){
        gender="Female";
      }else{
        gender="Male";
      }
  }else{
    gender=null;
  }
    if(this.SearchResearchName.length>0){
      name=this.SearchResearchName;
    }else{
      name=null;
    }
    if(this.genderIdentity !=="Any"){
      gender_identity=this.genderIdentity
    }else{
      gender_identity=null;
    }
    if( (this.minage !==12 ||this.maxage !==100) && this.minage<this.maxage){
      age =this.minage.toString()+"-"+this.maxage.toString();
    }else{
      age=null;
    }
    let country_code:string;
    let StateCityNameList:any;
    if(this.selectedCountry.length>0 && this.alreadyselectedStateCity.length>0 ){
      country_code=this.selectedCountry;
      StateCityNameList=this.alreadyselectedStateCity;
    }else{
      country_code=null
      StateCityNameList=null;
    }
    if(this.AllSymptomsFlag){
      this.getAllSymptoms();
      for(let i =0;i<this.getheadersymptomList.length;i++)
      {
        if(i == (this.getheadersymptomList.length -1))
        {
          this.arraySymptoms = this.arraySymptoms.concat(this.getheadersymptomList[i].id); 
        }
        else{
          this.arraySymptoms = this.arraySymptoms.concat(this.getheadersymptomList[i].id + ","); 
        }
          
      }        
  }    
  else if(this.MysymptpmsFlag){
      for(let i =0;i<this.getheadersymptomList.length;i++)
      {
        if(i == (this.getheadersymptomList.length -1))
        {
          this.arraySymptoms = this.arraySymptoms.concat(this.getheadersymptomList[i].symptom_id); 
        }
        else{
          this.arraySymptoms = this.arraySymptoms.concat(this.getheadersymptomList[i].symptom_id + ","); 
        }
      }        
  }
  let condition_id:any;
  if(this.SelectedSearchConditionList.length>0){
   condition_id = this.SelectedSearchConditionList.map(o => {
     return { id: o.id};
   });
  }else{
   condition_id=null;
  }
  if(this.SelectedSearchsymptomsList.length>0){
    for(let i =0;i<this.SelectedSearchsymptomsList.length;i++)
    {
        this.arraySymptoms = this.arraySymptoms.concat(this.SelectedSearchsymptomsList[i].id + ","); 
    }
  }
    this.researchsList=[];
    let body_param = {
      "condition_id":condition_id,
      "treatment_ids":treatment_ids,
      "page":   this.ResearchpageT,
      "per_page" : this.Researchperpage,
      "offset": 0,
      "sort_by":this.patientSortstring,
      "name":name,
      "agerange":age,
      "gender":gender,
      "gender_identity":gender_identity,
      "symptom_ids":this.arraySymptoms,
      "country_code":country_code,
      "city_states":StateCityNameList
    }
    this.APIservices.getPatients(body_param, this.headers).subscribe(res=>{
     if(res.body.status===1 ||res.body.status==="1"){
       if(res.body.data.length>0){
          
          for(var i=0;i<res.body.data.length;i++){
              if(res.body.data[i].my_conditions.length>0){
                  let tempCondition=res.body.data[i].my_conditions;
                  let tconditionVal="";
                  for(var j=0;j<tempCondition.length;j++){
                      if((j+1)%2==0){
                        tconditionVal=tconditionVal+"," +tempCondition[j].name+"<br/>";
                      }else{                      
                        tconditionVal=tconditionVal+tempCondition[j].name;
                      }
                  }
                  res.body.data[i].my_conditions=tconditionVal;
              }
          }
          this.PatientList= this.PatientList.concat(res.body.data);
       }else{
            this.loadMoreResearchAvalibale=false;
       }
     }

    });
  }
  tabphysicians(){
    this.placeHolder="Enter physician name";
    this.placeHolderTitle="Search by Physician name";
    this.patientTabflag=false;
    this.physiciansTabflag=true;
    this.researchersTabflag=false;
    this.loadPhysicians();
  
  }
  tabresearchers(){
    this.placeHolder="Enter researcher name";
    this.placeHolderTitle="Search by Researcher name";
    this.patientTabflag=false;
    this.physiciansTabflag=false;
    this.researchersTabflag=true;
    this.loadResearchers();
  }
  searchButton(){
    if(this.researchersTabflag){
      this.loadResearchers();
    }else if(this.patientTabflag){
      this.loadPatient();
    }else if(this.physiciansTabflag){
      this.loadPhysicians();
    }
  }
  loadResearchers(){
    this.loadMoreResearchAvalibale=true;
    let name:any;
    this.ResearchpageT=1;
    this.Researchperpage=10;
    if(this.SearchResearchName.length>0){
      name=this.SearchResearchName;
    }else{
      name=null;
    }
    this.researchsList=[];
    if(this.publicationResearchChekedFlag)
    {
      this.filterString="with_publications";
    }else{
      this.filterString="all";
    }
    let body_param = {
      "page":   this.ResearchpageT,
      "per_page" : this.Researchperpage,
      "offset": 0,
      "filter":this.filterString,
      "sort_by":this.researchSortString ,
      "name":name
    }
    this.APIservices.getResearchers(body_param, this.headers).subscribe(res=>{
     if(res.body.status===1 ||res.body.status==="1"){
       if(res.body.data.length>0){
          this.researchsList=res.body.data;
       }else{

       }
     }

    });
  }
  

  loadMoreResearchers(){
    let name:any;
    this.ResearchpageT++;
    if(this.SearchResearchName.length>0){
      name=this.SearchResearchName;
    }else{
      name=null;
    }
    if(this.publicationResearchChekedFlag)
    {
      this.filterString="with_publications";
    }else{
      this.filterString="all";
    }
    let body_param = {
      "page":   this.ResearchpageT,
      "per_page" : this.Researchperpage,
      "offset": 0,
      "filter":this.filterString,
      "sort_by":this.researchSortString ,
      "name":name
    }
    this.APIservices.getResearchers(body_param, this.headers).subscribe(res=>{
     if(res.body.status===1 ||res.body.status==="1"){
       if(res.body.data.length>0){
        this.researchsList= this.researchsList.concat(res.body.data);
       }else{
        this.loadMoreResearchAvalibale=false;
       }
     }

    });
  }
  allResearchCheked(){
    this.allResearchChekedFlag=!this.allResearchChekedFlag;
    if(this.allResearchChekedFlag){
      this.publicationResearchChekedFlag=false;
    }else{
      this.publicationResearchChekedFlag=true;
    }
   
    this.loadResearchers();
  }
  publicationResearchCheked(){
    this.publicationResearchChekedFlag=!this.publicationResearchChekedFlag;
    if( this.publicationResearchChekedFlag){
      this.allResearchChekedFlag=false;
    }else{
      this.allResearchChekedFlag=true;
    }
   
    this.loadResearchers();

  }

  GetSavedSearches(searchType)
  {
    this.lstSavedSearches = [];
    this.loadMoreSavedSearches = true;
    if(searchType == null){
      searchType = 'patient';
    }

    let body_param = {
      "page": this.savedSearchpageT,
      "per_page" : this.savedSearchperPage,
      "offset": 0,
      "search_type":searchType    
    }
    this.APIservices.getSavedSearches(body_param, this.headers).subscribe(res=>{
     if(res.body.status===1 ||res.body.status==="1"){
       if(res.body.data.length>0){
        this.lstSavedSearches= this.lstSavedSearches.concat(res.body.data);
       }else{
        this.loadMoreSavedSearches=false;
       }
     }

    });
  }

  LoadMoreSavedSearch(searchType){
      this.loadMoreSavedSearches = true;
      if(searchType == null){
        searchType = 'patient';
      }
      this.savedSearchpageT++;
      let body_param = {
        "page": this.savedSearchpageT,
        "per_page" : this.savedSearchperPage,
        "offset": 0,
        "search_type":searchType    
      }
      this.APIservices.getSavedSearches(body_param, this.headers).subscribe(res=>{
      if(res.body.status===1 ||res.body.status==="1"){
        if(res.body.data.length>0){
          this.lstSavedSearches= this.lstSavedSearches.concat(res.body.data);
        }else{
          this.loadMoreSavedSearches=false;
        }
      }

      });
  }

  onScrollDownSearches(searchType){
    if(this.loadMoreSavedSearches){      
        this.LoadMoreSavedSearch(searchType);      
    }
  }

  changeMySymp(checkboxType){
    if(checkboxType == "My"){      
        this.AllSymptomsFlag = this.MysymptpmsFlag;
        this.MysymptpmsFlag = !this.MysymptpmsFlag;            
    }
    else if(checkboxType == "All"){      
        this.MysymptpmsFlag = this.AllSymptomsFlag;
        this.AllSymptomsFlag = !this.AllSymptomsFlag;                    
    }
  }
  deleteSearchOpen(savedSearch){
    this.selected_search = savedSearch.name;
    this.deletesearchId = savedSearch.id;
    this.searchTypeDelete = savedSearch.search_type;
    $("#deleteSearchOpen").modal("show");
  }

  DeleteSavedSearch(){
    try{
      this.blockUI.start("please wait...");
      $("#deleteSearchOpen").modal('hide');
      let body_param = {
        "id":this.deletesearchId
      }

      this.APIservices.delete_Search(body_param, this.headers).subscribe(suc =>{
        if(suc.body.status == "1" || suc.body.status == 1){          
          this.NotificationService.success('Saved search',"Saved Search deleted Successfully",{
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          this.GetSavedSearches(this.searchTypeDelete);          
          setTimeout(()=>{
            this.blockUI.stop();  
          },1500);
        }
      },err=>{
        this.blockUI.stop();
        var err_res = JSON.parse(err._body);
        this.NotificationService.error('Error',err_res.message,{ 
          timeOut: 1500, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        });
      });
    }catch(err){
      this.blockUI.stop();
      console.log("Error occure while delete search. Error is ", err);
    }
  }

  // Symptoms filter -----------------------------------------------------
  allsymptomsSelected(item){
    if(item){
      this.mysymptomsFlag=false;
    }else{
      this.mysymptomsFlag=true;
    }
  }

  mysymptomsSelected(item){
    if(item){      
      this.allsymptomsFlag=false;
    }else{
      this.allsymptomsFlag=true;
    }    
  }

  handleChangeSymptoms(val: boolean, index: number){
    this.showMysymptoms[index].checked = !val;
    if(!val){
      if( this.selectedMYsymptoms.findIndex(x => x.id ===this.showMysymptoms[index].id) == -1){
        this.selectedMYsymptoms.push(this.showMysymptoms[index]);
      }
    }else{
      if(this.selectedMYsymptoms.findIndex(x => x.id ===this.showMysymptoms[index].id) != -1){
        let indexValue=this.selectedMYsymptoms.findIndex(x => x.id ===this.showMysymptoms[index].id);
        this.selectedMYsymptoms.splice(indexValue, 1);
      }
    }
    this.selectedMYsymptomsCount=this.selectedMYsymptoms.length;
    this.selectedMYsymptomslistValue="";
    for(var i=0;i<this.selectedMYsymptomsCount;i++){
      if((this.selectedMYsymptomsCount-1)==i ){
        this.selectedMYsymptomslistValue= this.selectedMYsymptomslistValue+ this.selectedMYsymptoms[i].symptom_name.name;
      } else{
        this.selectedMYsymptomslistValue= this.selectedMYsymptomslistValue+ this.selectedMYsymptoms[i].symptom_name.name +",";
      }
    }
  }

  loadMoreSymptoms(){
    this.getMySymptoms();
  }

  showAutoCompletePopupSymptoms(popupId, show) {
    if(show){
      document.querySelector('#'+popupId).classList.add('in');
  }else{
    document.querySelector('#'+popupId).classList.remove('in');
  }
  if(this.searchPhysiciansType.length==0){
    this.selectedCurrentPhysicianList=[];
  }
  }

  SearchAllSymptoms(){
    if(this.SearchAllSymptomsString.length>0){
      let body_param = {
        "search_word":this.SearchAllSymptomsString
      }
      this.APIservices.search_symptoms(body_param,this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          if(this.SearchAllSymptomsString.length>0){
          this.SearchAllSymptomsList=[];
          for(var i=0;i<suc.body.data.length;i++){
             if(this.selectedSearchAllSymptoms.findIndex(x => x.id === suc.body.data[i].id) == -1){
              this.SearchAllSymptomsList.push(suc.body.data[i]);
            }
          }
        }else{
          this.SearchConditionList=[];
        }
        }
      },
      err=>{
  
      })
    }else{
      this.SearchConditionList=[];
    }
  }

  loadmyFirstTenSymptomsList(){
    this.SymptomsShowMoreButtonFlag=true;
    this.SymptomsDDPageCounter=1;
      let counter=0;      
    if(this.mySymptomIds.length<10){
      this.SymptomsShowMoreButtonFlag=false;
      counter=this.mySymptomIds.length;
    }else{
      
      counter=10;
    }
    for(var i=0;i<counter;i++){
      this.showMysymptoms.push(this.mySymptomIds[i]);
    }

    for(var i=0;i<counter;i++){
      this.showMysymptoms[i].checked=false;
    }
  }

  getMySymptoms(){
    this.donotLoadMySymp = true;    
      try{      
        let body_param = {
          "date_sort":this.sortBy,
          "is_tracking":true,
          "page":this.IstrackPage,
          "per_page":10,
          "offset":0,
        };
        this.APIservices.symptomtrackinglist(body_param, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){            
            this.mySymptomIds=suc.body.data;  
            this.loadmyFirstTenSymptomsList();                                      
            this.IstrackPage++;
            if(suc.body.data.length==0){
              this.donotLoadMySymp = false;
            }  
          }
        },err=>{
          var err_res = JSON.parse(err._body);        
          console.log("Error occure while load symptoms list. Error is ", err_res.message);        
        });
      }catch(err){      
        console.log("Error occure while load symptoms list. Error is ", err);
      }
  }

  addAllSymptomsList(item){
    if(this.selectedSearchAllSymptoms.findIndex(x => x.id === item.id) == -1){
      this.selectedSearchAllSymptoms.push(item);
      document.querySelector('#Search_symptoms_popup').classList.remove('in');
      this.SearchAllSymptoms();
    }
  }

  removeAllSymptoms(item){
    if(this.selectedSearchAllSymptoms.findIndex(x => x.id === item.id) !== -1){
      let index =this.selectedSearchAllSymptoms.findIndex(x => x.id === item.id);
      this.selectedSearchAllSymptoms.splice(index, 1);
      this.SearchAllSymptoms();
    }
  }

  // -------------------------------------------------------
  onScrollDown(){
      if(this.researchersTabflag &&this.loadMoreResearchAvalibale ){
        this.loadMoreResearchers();
      }else if(this.patientTabflag){
        this.loadMorePatient();
      }else if(this.physiciansTabflag && this.stillmorePhysiciansflag){
        this.loadMorePhysicians()
      }
  }

  movetoconnectFollowing(){
    this._router.navigate(['/global/ConnectResearchers/ConnectResearchFollowing']);
  }
  movetoconnectmessage(){
    this._router.navigate(['/global/message']);
  }

  follow(id){
    let data={
      'follower_id':Number(id)
    }
    this.APIservices.follow_User({'body':data}, this.headers).subscribe(suc =>{
      if(suc.body.status == "1" || suc.body.status == 1){            
        if(this.researchersTabflag  ){
          this.loadResearchers();
        }else if(this.patientTabflag){
          this.loadPatient();
        }else if(this.physiciansTabflag ){
          this.loadPhysicians()
        }
      }
    },err=>{
      var err_res = JSON.parse(err._body);        
      console.log("Error occure while load symptoms list. Error is ", err_res.message);        
    });
  }
  unfollw(id){
    let data={
      'follower_id':id
    }
    this.APIservices.unfollow_User(data, this.headers).subscribe(suc =>{
      if(suc.body.status == "1" || suc.body.status == 1){            
        if(this.researchersTabflag  ){
          this.loadResearchers();
        }else if(this.patientTabflag){
          this.loadPatient();
        }else if(this.physiciansTabflag ){
          this.loadPhysicians()
        }
      }
    },err=>{
      var err_res = JSON.parse(err._body);        
      console.log("Error occure while load symptoms list. Error is ", err_res.message);        
    });
  }
  removecitystate(index){
    this.alreadyselectedStateCity.splice(index, 1);
    this.loadPatient();
  }
  removecitystatephysication(index){
    this.alreadyselectedcitystatenamephysication.splice(index, 1);
    this.loadPhysicians();
  }
  addcitysate(event: any){
    if (event.keyCode == 13)
    {
      this.alreadyselectedcitystatenamephysication.push(this.entercitystatenamelist);
      this.entercitystatenamelist="";
      this.loadPhysicians();
    }
  }
  restephysicians(){
    this.searchPhysiciansType="";
    this.currentPhysicianList=[];
    this.selectedCurrentPhysicianList=[];
    this.physicianWithMedicalDegreelist=[];
    this.selectedPhysicianWithMedicalDegreelist=[];
    this.selectedphysiciansCountry="";
    this.searchPhysicianWithMedicalDegree="";
    this.selectedphysiciansCountry="";
    this.alreadyselectedcitystatenamephysication=[];
    this.loadPhysicians();
  }

  resetPatient(){
    this.minage=12;
    this.maxage=100;
    this.selectedCountry="";
    this.StateCityNameList="";
    this.selectedMYsymptomslistValue="";
    this.selectedMYsymptoms=[];
    this.selectedMYsymptomsCount=0;
    this.selectedMYconditionCount=0;
    this.allsymptomsFlag=true;
    this.mysymptomsFlag=false;
    this.AllConditionFlag=true;
    this.MyconditionFlag=false;
    this.selectedSearchAllSymptoms=[];
    this.gederAny=false;
    this.genderMale=false;
    this.genderFemale=false;
    this.AnyInterestFlag=false;
    this.chkdonating=false;
    this.chkFundRaising=false;
    this.chkVolunteering=false;
    this.chkReading=false;
    this.selectedMYtreatmentsCount=0;
    this.selectedMYtreatmenslistValue="";
    this.alltraeatmentsFlag=true;
    this.selectedMYtreatments=[];
    this.selectedSearchAllTreatments=[];
    this.SearchAllTreatmentString="";
    this.SearchAllSymptomsString="";
    this.mytraeatmentsFlag=false;
    this.genderIdentity="Any";
    this.selectedMconditionslistValue="";
    this.selectedConditionCheckBox=[];
    this.SearchConditionsString="";
    this.SelectedSearchConditionList=[];
    this.SearchConditionList=[];
    this.showMytreatment=[];
    this.SearchAllSymptomsList=[];
    this.SearchAllTreatmentsList=[];
    this.alreadyselectedStateCity=[];
    this.loadPatient();
  }
  resetPatientSymptoms(){
    this.selectedMYsymptomslistValue="";
    this.selectedMYsymptoms=[];
    this.selectedMYsymptomsCount=0;
    this.allsymptomsFlag=true;
    this.mysymptomsFlag=false;
    this.selectedSearchAllSymptoms=[];
    this.SearchAllSymptomsString="";
    this.SearchAllSymptomsList=[];
    this.loadPatient();
    
  }
  resetPatienttreatments(){
    this.selectedMYtreatmentsCount=0;
    this.selectedMYtreatmenslistValue="";
    this.alltraeatmentsFlag=true;
    this.mytraeatmentsFlag=false;
    this.selectedMYtreatments=[];
    this.selectedSearchAllTreatments=[];
    this.SearchAllTreatmentString="";
    this.showMytreatment=[];
    this.SearchAllTreatmentsList=[];
    this.loadPatient();
  
  }
  resetPatientcondition(){
    this.selectedMYconditionCount=0;
    this.selectedMconditionslistValue="";
    this.selectedConditionCheckBox=[]
    this.AllConditionFlag=true;
    this.MyconditionFlag=false;
    this.SelectedSearchConditionList=[];
    this.SearchConditionsString="";
    this.SearchConditionList=[];
    this.loadPatient();
  }
  searchUser(){
    if(this.SearchResearchName.length>0){
      let body_param = {
        "search_word":this.SearchResearchName
      }
      this.APIservices.list_users(body_param,this.headers).subscribe(suc=>{
        if(suc.body.status == "1" || suc.body.status == 1){
          if(this.SearchResearchName.length>0){
          this.alluserlist=suc.body.data;
        }else{
          this.alluserlist=[];
          this.searchButton();
        }
        }
      },
      err=>{
  
      })
    }else{
      this.alluserlist=[];
      this.searchButton();
    }
    
  }
  setfilterPhy(index) {
    if (index == 1) {
    this.filter2 = "floating-c form collapse";
    this.filter2flag = "collapsed";
    this.filter3 = "floating-c form collapse";
    this.filter3flag = "collapsed";
      if (this.filter1flag.length > 0) {
        this.filter1flag = "";
        this.filter1 = "floating-c form collapse in";
      } else {
        this.filter1flag = "collapsed";
        this.filter1 = "floating-c form collapse";
      }
    }
    else if (index == 2) {
      this.filter1 = "floating-c form collapse";
    this.filter1flag = "collapsed";
    this.filter3 = "floating-c form collapse";
    this.filter3flag = "collapsed";
      if (this.filter2flag.length > 0) {
        this.filter2flag = "";
        this.filter2 = "floating-c form collapse in";
      } else {
        this.filter2flag = "collapsed";
        this.filter2 = "floating-c form collapse";
      }
    }else if (index == 3) {
      this.filter1 = "floating-c form collapse";
      this.filter1flag = "collapsed";
      this.filter2 = "floating-c form collapse";
      this.filter2flag = "collapsed";
  
      if (this.filter3flag.length > 0) {
        this.filter3flag = "";
        this.filter3 = "floating-c form collapse in";
      } else {
        this.filter3flag = "collapsed";
        this.filter3= "floating-c form collapse";
      }
    }
   
  }
  setfilter(index) {
    if (index == 1) {
      this.filterpatient2 = "floating-c form collapse";
      this.filterpatient3 = "floating-c form collapse";
      this.filterpatient4 = "floating-c form collapse";
      this.filterpatient5 = "floating-c form collapse";
      this.filterpatient6 = "floating-c form collapse";
      this.filterpatient7 = "floating-c form collapse";
      this.filterpatient8 = "floating-c form collapse";
      this.filterpatient2flag = "collapsed";
      this.filterpatient3flag = "collapsed";
      this.filterpatient4flag = "collapsed";
      this.filterpatient5flag = "collapsed";
      this.filterpatient6flag = "collapsed";
      this.filterpatient7flag = "collapsed";
      this.filterpatient8flag = "collapsed";
      if (this.filterpatient1flag.length > 0) {
        this.filterpatient1flag = "";
        this.filterpatient1 = "floating-c form collapse in";
      } else {
        this.filterpatient1flag = "collapsed";
        this.filterpatient1 = "floating-c form collapse";
      }
    } else if (index == 2) {
      this.filterpatient1 = "floating-c form collapse";
      this.filterpatient3 = "floating-c form collapse";
      this.filterpatient4 = "floating-c form collapse";
      this.filterpatient5 = "floating-c form collapse";
      this.filterpatient6 = "floating-c form collapse";
      this.filterpatient7 = "floating-c form collapse";
      this.filterpatient8 = "floating-c form collapse";
      this.filterpatient1flag = "collapsed";
      this.filterpatient3flag = "collapsed";
      this.filterpatient4flag = "collapsed";
      this.filterpatient5flag = "collapsed";
      this.filterpatient6flag = "collapsed";
      this.filterpatient7flag = "collapsed";
      this.filterpatient8flag = "collapsed";
      if (this.filterpatient2flag.length > 0) {
        this.filterpatient2flag = "";
        this.filterpatient2 = "floating-c form collapse in";
      } else {
        this.filterpatient2flag = "collapsed";
        this.filterpatient2 = "floating-c form collapse";
      }
    } else if (index == 3) {
      this.filterpatient1 = "floating-c form collapse";
      this.filterpatient2 = "floating-c form collapse";
      this.filterpatient4 = "floating-c form collapse";
      this.filterpatient5 = "floating-c form collapse";
      this.filterpatient6 = "floating-c form collapse";
      this.filterpatient7 = "floating-c form collapse";
      this.filterpatient8 = "floating-c form collapse";
      this.filterpatient1flag = "collapsed";
      this.filterpatient2flag = "collapsed";
      this.filterpatient4flag = "collapsed";
      this.filterpatient5flag = "collapsed";
      this.filterpatient6flag = "collapsed";
      this.filterpatient7flag = "collapsed";
      this.filterpatient8flag = "collapsed";
      if (this.filterpatient3flag.length > 0) {
        this.filterpatient3flag = "";
        this.filterpatient3 = "floating-c form collapse in";
      } else {
        this.filterpatient3flag = "collapsed";
        this.filterpatient3 = "floating-c form collapse";
      }
    } else if (index == 4) {
      this.filterpatient1 = "floating-c form collapse";
      this.filterpatient2 = "floating-c form collapse";
      this.filterpatient3 = "floating-c form collapse";
      this.filterpatient5 = "floating-c form collapse";
      this.filterpatient6 = "floating-c form collapse";
      this.filterpatient7 = "floating-c form collapse";
      this.filterpatient8 = "floating-c form collapse";
      this.filterpatient1flag = "collapsed";
      this.filterpatient2flag = "collapsed";
      this.filterpatient3flag = "collapsed";
      this.filterpatient5flag = "collapsed";
      this.filterpatient6flag = "collapsed";
      this.filterpatient7flag = "collapsed";
      this.filterpatient8flag = "collapsed";
      if (this.filterpatient4flag.length > 0) {
        this.filterpatient4flag = "";
        this.filterpatient4 = "floating-c form collapse in";
      } else {
        this.filterpatient4flag = "collapsed";
        this.filterpatient4 = "floating-c form collapse";
      }
    }
    else if (index == 5) {
      this.filterpatient1 = "floating-c form collapse";
      this.filterpatient2 = "floating-c form collapse";
      this.filterpatient3 = "floating-c form collapse";
      this.filterpatient4 = "floating-c form collapse";
      this.filterpatient6 = "floating-c form collapse";
      this.filterpatient7 = "floating-c form collapse";
      this.filterpatient8 = "floating-c form collapse";
      this.filterpatient1flag = "collapsed";
      this.filterpatient2flag = "collapsed";
      this.filterpatient3flag = "collapsed";
      this.filterpatient4flag = "collapsed";
      this.filterpatient6flag = "collapsed";
      this.filterpatient7flag = "collapsed";
      this.filterpatient8flag = "collapsed";
      if (this.filterpatient5flag.length > 0) {
        this.filterpatient5flag = "";
        this.filterpatient5 = "floating-c form collapse in";
      } else {
        this.filterpatient5flag = "collapsed";
        this.filterpatient5 = "floating-c form collapse";
      }
    }
    else if (index == 6) {
      this.filterpatient1 = "floating-c form collapse";
      this.filterpatient2 = "floating-c form collapse";
      this.filterpatient3 = "floating-c form collapse";
      this.filterpatient4 = "floating-c form collapse";
      this.filterpatient5 = "floating-c form collapse";
      this.filterpatient7 = "floating-c form collapse";
      this.filterpatient8 = "floating-c form collapse";
      this.filterpatient1flag = "collapsed";
      this.filterpatient2flag = "collapsed";
      this.filterpatient3flag = "collapsed";
      this.filterpatient4flag = "collapsed";
      this.filterpatient5flag = "collapsed";
      this.filterpatient7flag = "collapsed";
      this.filterpatient8flag = "collapsed";
      if (this.filterpatient6flag.length > 0) {
        this.filterpatient6flag = "";
        this.filterpatient6 = "floating-c form collapse in";
      } else {
        this.filterpatient6flag = "collapsed";
        this.filterpatient6 = "floating-c form collapse";
      }
    }
    else if (index == 7) {
      this.filterpatient1 = "floating-c form collapse";
      this.filterpatient2 = "floating-c form collapse";
      this.filterpatient3 = "floating-c form collapse";
      this.filterpatient4 = "floating-c form collapse";
      this.filterpatient5 = "floating-c form collapse";
      this.filterpatient6 = "floating-c form collapse";
      this.filterpatient8 = "floating-c form collapse";
      this.filterpatient1flag = "collapsed";
      this.filterpatient2flag = "collapsed";
      this.filterpatient3flag = "collapsed";
      this.filterpatient4flag = "collapsed";
      this.filterpatient6flag = "collapsed";
      this.filterpatient5flag = "collapsed";
      this.filterpatient8flag = "collapsed";
      if (this.filterpatient7flag.length > 0) {
        this.filterpatient7flag = "";
        this.filterpatient7 = "floating-c form collapse in";
      } else {
        this.filterpatient7flag = "collapsed";
        this.filterpatient7 = "floating-c form collapse";
      }
    }
    else if (index == 8) {
      this.filterpatient1 = "floating-c form collapse";
      this.filterpatient2 = "floating-c form collapse";
      this.filterpatient3 = "floating-c form collapse";
      this.filterpatient4 = "floating-c form collapse";
      this.filterpatient6 = "floating-c form collapse";
      this.filterpatient7 = "floating-c form collapse";
      this.filterpatient5 = "floating-c form collapse";
      this.filterpatient1flag = "collapsed";
      this.filterpatient2flag = "collapsed";
      this.filterpatient3flag = "collapsed";
      this.filterpatient4flag = "collapsed";
      this.filterpatient6flag = "collapsed";
      this.filterpatient7flag = "collapsed";
      this.filterpatient5flag = "collapsed";
      if (this.filterpatient8flag.length > 0) {
        this.filterpatient8flag = "";
        this.filterpatient8 = "floating-c form collapse in";
      } else {
        this.filterpatient8flag = "collapsed";
        this.filterpatient8 = "floating-c form collapse";
      }
    }

  }
   onFocusOutFilter(btnId:string, divId:string){    
  }
  // onFocusOutFilter(btnId:string, divId:string){    
  //   document.getElementById(btnId).setAttribute('aria-expanded', 'false');
  //   document.getElementById(divId).setAttribute('aria-expanded', 'false');
  //   document.getElementById(divId).setAttribute('class', 'collapse floating-c');
  //   document.getElementById(btnId).setAttribute('class', 'collapsed ');
  // }
}
