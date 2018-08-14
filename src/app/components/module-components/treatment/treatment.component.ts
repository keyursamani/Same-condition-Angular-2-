import { Component, OnInit, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $ : any;
declare var jQuery : any;

@Component({
  selector: 'aq-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.scss']
})
export class TreatmentComponent extends HeadersProvider implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  checkBoxChk : string = "false";
  addTreatment : any ;
    private Notreatment : any = false;
    private treatmentSearchBlock : any ;
    private treatmentSearchBlock1 : any ;
    private evaluationModal : any ;
    private dosageScheduleModal : any ;
    private treatmentList: any = [];
    private searchtTreatmentString: boolean;
    private treatmentSearchname: string;
    private newTreatmentname: string = "";
    private pageT :number;
    private perpage:number;
    private treatmentYesField : any ;
    private treatmentNoField : any ;
    private dosageBtnModal : any ;
    private treatmentReasonShow : any;
    private treatmentReasonHide : any;
    private editTreatmentYesField : any ;
    private editTreatmentNoField : any ;
    private treatmentNoDefferent : any ;
    private treatmentYesDefferent : any ;
    private editEvaluationDosage : any ;
    private reasonShowBtn : any;
    private reasonGoPopupBtn : any ;
    private dosageDefferentModal : any ;
    private selectTreatmentInfo: any = [];
    private myTreatmentList: any = [];
    private myTreatmentFilterList: any = [];
    private treatmentFilterString: string = "";
    private requiredDosage: string = "";
    private currentDate: any = new Date();
    private currentStiltreatment: string = "";
    private selectDifferentschedule:string = "";
    private startdosageSchedule: any;
    private current_dosageamount: string = "";
    private current_dosage: string = "";
    private current_schedule_number: string = "";
    private current_schedule_frequency: string = "";
    private i_take_as_needed: boolean = false;
    private current_schedule_detail: string = "";
    private different_start_taking_dosage_schedule: any;
    private most_recent_dosage_amount: string = "";
    private most_recent_dosage: string = "mg";
    private i_did_treatment_as_needed: string = 'false';
    private most_recent_schedule_number: string = "";
    private most_recent_schedule_frequency: string = "Per Day";
    private my_schedule_was_same: boolean = false;
    private my_dosage_was_same: boolean = false;
    private addTreatmentInfo: any = [];
    private mostRecentSchedule: any;
    private stopRecentSchedule: any;
    private why_did_stop: string = "";
    private why_did_stop_other: string = "";
    private anything_else_different: any = "";
    private different_initial_dosage_amount: string = "";
    private different_initial_dosage: string = "mg";
    private different_initial_schedule_number: string = "";
    private different_initial_schedule_frequency: string = "Per Day";
    private finalSubmitData: any = [];
    private Edit_startdosageSchedule: any = "";
    private Edit_current_dosageamount: string = "";
    private Edit_current_dosage: string = "";
    private Edit_current_schedule_number: string = "";
    private Edit_current_schedule_frequency: string = "";
    private Edit_i_take_as_needed: boolean  = false;
    private Edit_current_schedule_detail: string = "";
    private Edit_currentStiltreatment: string = "";
    private Edit_TreatmentInfo: any = [];
    private Edit_most_recent_schedule_frequency: string = "";
    private Edit_mostRecentSchedule: any = "";
    private Edit_stopRecentSchedule:any = "";
    private Edit_most_recent_dosage_amount:string = "";
    private Edit_most_recent_dosage: string = "";
    private Edit_most_recent_schedule_number:string = "";
    private Edit_anything_else_different: any = "";
    private Edit_different_initial_dosage_amount: string  = "";
    private Edit_different_initial_dosage: string = "";
    private Edit_different_initial_schedule_number: string = "";
    private Edit_different_initial_schedule_frequency: string = "";
    private Edit_different_start_taking_dosage_schedule: string = "";
    private Edit_selectDifferentschedule: string = "";
    private Edit_i_did_treatment_as_needed: string = 'false';
    private Edit_why_did_stop: string = "";
    private addEvaluationDate: any;
    private addEffectiveness: string = "";
    private addSideeffect: string = "";
    private addTaketreatment: string = "";
    private addHardtreatment: string = "";
    private adduPositive_effects: boolean;
    private addYouradvice: string  = "";
    private addCost: any = "";
    private addCurrency: string = "";
    private addCostFrequency: any = "";
    private addVisibility: string = "";
    private sendEvaluation: any;
    private evaluationEditModal:any;
    private donotLoad :boolean = false;
    private editEffectiveness: string = "";
    private editSideeffect: string = "";
    private editTaketreatment: string = "";
    private editHardtreatment: string = "";
    private edituPositive_effects: boolean  = undefined;
    private editYouradvice: string = "";
    private editCurrency: string = "";
    private editCostFrequency: string = "";
    private editVisibility: string = "";
    private editEvaluationDate: any = moment(new Date()).format("YYYY/MM/DD");
    private evaluationTreatmentid: any = [];
    private editCost: string = "";
    private treatmentStatus: string = "current";
    private pastTratment: boolean = false;
    private submitEdit_mostRecentSchedule: any = "";
    private submitEdit_stopRecentSchedule: any = "";
    private editYesTreatment : any ;
    private editingTreatModal2 : any ;
    private defferentNoDivNew : any ;
    private defferentYesDivNew : any ;
    private editSelectDifferentschedule: boolean = undefined;
    private EditstartdosageSchedule: any = "";
    private submitEditstartdosageSchedule: any = "";
    private Editcurrent_dosageamount: string = "";
    private Editcurrent_dosage: string = "";
    private Editcurrent_schedule_number: string = "";
    private Editcurrent_schedule_frequency: string = "";
    private Editi_take_as_needed: boolean = false;
    private Editcurrent_schedule_detail: string = "";
    private Editdifferent_start_taking_dosage_schedule: any = "";
    private submiEditdifferent_start_taking_dosage_schedule: string = "";
    private Editdifferent_initial_dosage: string = "";
    private Editmy_dosage_was_same: boolean = false;
    private Editdifferent_initial_schedule_number: string = "";
    private Editdifferent_initial_schedule_frequency: string = "";
    private Editmy_schedule_was_same: boolean = false;
    private Editanything_else_different: string = "";
    private Editdifferent_initial_dosage_amount : string = "";
    private submitEditdifferent_start_taking_dosage_schedule: string = "";
    public selected_treatment: string = '';
    public datePlaceholder: string = 'Today'
    public GLOBAL_MEDIUM_TIMEOUT : number = 500;
    private treatmentId : number = 0;
    private evaluationId : number = 0;
    private dosage_or_schedule_Id : number = 0;
    private formValidation : boolean = false;
    private reportTreatmentStopDate: any = new Date();
    private type : string = "";
    private treatmentName : string = '';
    private searchConditionString : string = "";
    private searchConditionList: any = [];
    private searchString: boolean = false;
    private selectedMycondtion: any = [];
    private purposeId : number = 0;
    private reasonOther : boolean = false;
    private reportreasonShowBtn : boolean = false;
    public select_treatment_name: string = '';
    public select_dosage_name: string = '';
    public suggestion_name_list: any = [];
    public empty_tag: boolean = false;
    public noScroll: boolean = false;
    private treatment_started_at : any = new Date();
    private invalidDateSelection : boolean = false;
    private searchList:boolean = false;
    public dateValue : any;

    dosageBrandName : string = "";
    search_dosage_list : any = [];
    add_new_brand : boolean = false;
    new_brand : string = '';

    different_dosage_BrandName : string = "";
    different_new_brand : string = '';

    most_recent_BrandName : string = "";
    most_recent_new_brand : string = '';
    treatment_brand_id : number = 0;
    different_treatment_brand_id : number = null;
    show_changes : boolean = false;

    //constructor
    constructor(public _router:Router,
      public _APIservices:SCApi,
      private notificationService: NotificationsService,
      private renderer: Renderer2
      ) {
      super();
      this.different_start_taking_dosage_schedule = this.currentDate;
      this.addEvaluationDate=this.currentDate;      
      this.different_initial_schedule_frequency = "Per Day";
      this.different_initial_dosage="mg";
      this.my_dosage_was_same=false;
    }

    ngOnInit() {
      this.pageT = 1;
      this.perpage = 10;
      this.searchtTreatmentString=false;      
      this.treatmentSearchBlock = document.getElementById('treatmentSearchField');
      this.treatmentSearchBlock1 = document.getElementById('treatmentTextField');
      this.evaluationModal = document.getElementById('treatmentEvaluationModal');
      this.evaluationEditModal = document.getElementById('treatmentEvaluationEditModal');
      this.dosageBtnModal = document.getElementById('dosageScheduleBox');
      this.treatmentReasonShow = document.getElementById('reasonHide');
      this.treatmentReasonHide = document.getElementById('reasonShow');
      this.treatmentYesField = document.getElementById('dosageScheduleYes');
      this.treatmentNoField = document.getElementById('dosageScheduleNo');
      this.reasonShowBtn = document.getElementById('reasonShowBtn');
      this.reasonGoPopupBtn = document.getElementById('reasonGoPopupBtn');
      this.dosageDefferentModal = document.getElementById('dosageDeferentModal');
      this.treatmentYesDefferent = document.getElementById('defferentYesDiv');
      this.treatmentNoDefferent = document.getElementById('defferentNoDiv');
      this.editEvaluationDosage = document.getElementById('editDosageSchedule');
      this.addTreatment = document.getElementById('treatmentAddModal');
      this.dosageScheduleModal = document.getElementById('dosageScheduleModal');
      this.editTreatmentYesField = document.getElementById('editdosageScheduleYes');
      this.editTreatmentNoField = document.getElementById('editdosageScheduleNo');
      this.editYesTreatment = document.getElementById('editingYesModal');
      this.editingTreatModal2 = document.getElementById('editingTreatModal2Open');
      this.defferentYesDivNew = document.getElementById('defferentYesDivNew');
      this.defferentNoDivNew = document.getElementById('defferentNoDivNew');
      this.treatmentSearchname="";
      this.filterTreatment("current");
    }

    // Filter Past & Current
    filterTreatment(treatmentStatus){
      this.treatmentStatus = treatmentStatus;
      this.loadTreatmentFilterList();
      this.loadTreatmentList();
    }

    // Load Treatment List
    loadTreatmentList(){
      this.pageT = 1;
      this.perpage = 10;
      try{
        this.blockUI.start('please wait...');
        let body_param = {
          "my_treatment_id" : this.treatmentFilterString,
          "page": 1,
          "per_page": 10,
          "offset": 0,
          'treatment_status': this.treatmentStatus
        }

        this._APIservices.get_treatmentlist(body_param, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.blockUI.stop();
            this.myTreatmentList = suc.body.data;
            
            if(this.myTreatmentList.length == 0){
              this.Notreatment = true;
            }

            this.pastTratment = false;
            if(this.myTreatmentList.length==0 && this.treatmentStatus=="past"){
              this.pastTratment=true;
            }
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
      }catch(err){
        this.blockUI.stop();
        console.log("Error occured while load  treatements. Error is ", err);
      }
    }

    loadTreatmentListMore(){
      this.pageT++;
      try{
          let body_param = {
            "my_treatment_id" : this.treatmentFilterString,
            "page" : this.pageT,
            "per_page": this.perpage,
            "offset": 0,
            "treatment_status": this.treatmentStatus
          }
          this._APIservices.get_treatmentlist(body_param, this.headers).subscribe(suc =>{
            if(suc.body.data.length == 0){
              this.donotLoad = true;
            }
            else{
              this.myTreatmentList = this.myTreatmentList.concat(suc.body.data);
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

    onScrollDown() {
      if(!this.donotLoad){
        this.loadTreatmentListMore();
      }
    }

    // Load Treatment Filter List
    loadTreatmentFilterList(){
      try{
        let body = {
          'treatment_status':  this.treatmentStatus
        }

        this._APIservices.get_treatmentfilterlist(body, this.headers).subscribe(suc =>{
          this.myTreatmentFilterList = suc.body.data;
        }, err=>{
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

    // filter Treatment
    treatmentFilter(value: string){
      this.treatmentFilterString = value;
      this.loadTreatmentList();
    }

    // Treatment Collapse
    accordianTreatment(treatment){
      this.treatmentId = treatment.id;
      if(treatment.show==true){
        treatment.show=false;
      }else{
        treatment.show=true;
      }
    }

    // Search Treatment
    searchTreatment(treatmentSearch){
      try{
        if(treatmentSearch.length > 0){

          let body_param = {
            "search_word" : treatmentSearch
          }
          this.searchList = false;
          this._APIservices.search_treatment(body_param, this.headers).subscribe(suc =>{
            this.selectTreatmentInfo = [];
            this.searchtTreatmentString = true;
            this.treatmentList = suc.body.data;
            if(this.treatmentList.length == 0){
              this.searchtTreatmentString = false;
              this.searchList = true;
            }
          },err=>{
            var err_res = JSON.parse(err._body);
            if(err_res.status == 404){
              this.treatmentList = [];
              this.searchtTreatmentString = true;
            }else{
              this.notificationService.error('Error',err_res.message,{ 
                timeOut: 3000, 
                showProgressBar: false, 
                pauseOnHover: false, 
                clickToClose: false 
              });
            }
          });
        } else{
          this.treatmentList = [];
          this.searchtTreatmentString = true;
        }
      }catch(err){
        console.log(err);
      }
    }

    // Add New Treatment
    addnewTreatment(){
      try{

        if(this.newTreatmentname == ""){
          this.notificationService.error('Error','Please Enter Treatment Name',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        let body_param = {
          "name" : this.newTreatmentname,
          "Authentication-Token": this.getToken().AuthToken
        };

        this._APIservices.addnew_Treatment(body_param, this.headers).subscribe(suc=>{
          this.addTreatmentClosed();
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

    // Add New Treatment In Our Profile
    addTreatmentOurProfile(){
      try{

        if(this.selectTreatmentInfo == ""){
          this.formValidation = true;
          return false;
        }

        if(this.requiredDosage == ""){
          this.formValidation = true;
          return false;
        }

        this.blockUI.start('please wait...');
        this.addTreatmentClosed();
        let body_param = {
          "id" : this.selectTreatmentInfo.id,
          'data' : { "require_dosage": this.requiredDosage },
        };

        this._APIservices.addtreatment_ourprofile(body_param, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.blockUI.stop();
            this.notificationService.success('Treatment',suc.body.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
            this.loadTreatmentList()
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
      }catch(err){
        this.blockUI.stop();
        console.log(err);
      }
    }

    selectTreatment(treatmentInfo){
      this.selectTreatmentInfo=treatmentInfo;
      this.treatmentSearchname=treatmentInfo.name;
      this.searchtTreatmentString=false;
    }

    addTreatmentOpen(){
      this.searchList = false;
      this.requiredDosage = "";
      this.formValidation = false;
      this.treatmentSearchname = "";
      this.newTreatmentname = "";
      this.my_schedule_was_same = false;
      this.searchtTreatmentString = false;
      this.addTreatment.style.display = "block";
      this.treatmentSearchBlock1.style.display = "none";
      this.treatmentSearchBlock.style.display = "block";
    }

     addTreatmentClosed(){
      this.addTreatment.style.display = "none";      
     }

    goTreatmentSearchField(){
      this.treatmentSearchBlock.style.display = "none";
      this.treatmentSearchBlock1.style.display = "block";
    }

    goTreatmentTextField(){
      this.treatmentSearchBlock1.style.display = "none";
      this.treatmentSearchBlock.style.display = "block";
    }

    evaluationModalOpen(allInfo){
      this.formValidation = false;
      this.addEvaluationDate=this.currentDate;
      this.editEvaluationDate = "";
      this.addEffectiveness="";
      this.addSideeffect="";
      this.addTaketreatment="";
      this.addHardtreatment="";
      //this.adduPositive_effects = null;
      this.addYouradvice="";
      this.addCost="";
      this.addCurrency="";
      this.addCostFrequency="";
      this.addVisibility="";
      this.addTreatmentInfo=allInfo;
      this.evaluationModal.style.display = "block";
      this.treatmentName = (allInfo.treatment_name.name || '');
      this.renderer.addClass(document.body, 'noScroll')
    }

    evaluationModalClosed(){
      this.evaluationModal.style.display = "none";
      this.renderer.removeClass(document.body, 'noScroll')
    }

    dosageScheduleOpen(){

      if(this.currentStiltreatment==""){
        this.formValidation = true;
        return false;
      }

      this.blockUI.start('please wait...');
      this.formValidation = false;
      this.currentStiltreatment=this.currentStiltreatment;        
      this.dosageBtnModal.style.display = "none";
      this.dosageScheduleModal.style.display = "block";

      if(this.currentStiltreatment=="true"){
        this.goTreatmentYesField();
      }else{
        this.goTreatmentNoField();
      }
      this.blockUI.stop();
    }

    dosageScheduleClosed(){
      this.dosageScheduleModal.style.display = "none";
      this.renderer.removeClass(document.body, 'noScroll')

    }

    dosageBtnOpen(allInfo){
      this.formValidation = false;
      this.Edit_why_did_stop = "";
      this.startdosageSchedule = null;
      this.current_dosageamount="";
      this.current_dosage="mg";
      this.current_schedule_number="";
      this.current_schedule_frequency="Per Day";
      this.i_take_as_needed=false;
      this.current_schedule_detail="";
      this.currentStiltreatment="";
      this.addTreatmentInfo=allInfo;
      this.most_recent_schedule_frequency="Per Day";
      this.currentStiltreatment="";
      this.my_schedule_was_same=false;
      this.my_dosage_was_same=false;
      // No model
      this.mostRecentSchedule = null;
      this.stopRecentSchedule = null;
      this.most_recent_dosage_amount="";
      this.most_recent_dosage="mg";
      this.most_recent_schedule_number="";
      this.most_recent_schedule_frequency="Per Day";
      this.anything_else_different="";
      this.different_initial_dosage_amount="";
      this.different_initial_dosage="mg";
      this.different_initial_schedule_number="";
      this.different_initial_schedule_frequency="Per Day";
      this.different_start_taking_dosage_schedule = null;
      this.selectDifferentschedule="";
      this.dosageBtnModal.style.display = "block";
      this.selected_treatment = this.addTreatmentInfo.treatment_name.name;
      this.dosageBrandName = "";
      this.new_brand = "";
      this.noScroll = true;
      this.renderer.addClass(document.body, 'noScroll')
    }

    dosageBtnClosed(){
      this.dosageBtnModal.style.display = "none";
      this.noScroll = false;
      this.renderer.removeClass(document.body, 'noScroll')

    }

    goTreatmentYesField(){
      this.treatmentNoField.style.display = "none";
      this.treatmentYesField.style.display = "block";
    }

    goTreatmentNoField(){
      this.treatmentYesField.style.display = "none";
      this.treatmentNoField.style.display = "block";
    }

    goEditTreatmentYesField(){
      this.editTreatmentNoField.style.display = "none";
      this.editTreatmentYesField.style.display = "block";
    }

    goEditTreatmentNoField(){
      //this.treatmentYesField.style.display = "none";
      this.editTreatmentNoField.style.display = "block";
    }

    closeEditTreatmentNoField(){
      //this.treatmentYesField.style.display = "none";
      this.editTreatmentNoField.style.display = "none";
    }

    goTreatmenReasonShow(){
      this.reasonShowBtn.style.display = "none";
      this.reasonGoPopupBtn.style.display = "block";
      this.treatmentReasonShow.style.display = "none";
      this.treatmentReasonHide.style.display = "block";
    }

    goTreatmenReasonHide(){
      this.treatmentReasonHide.style.display = "none";
      this.treatmentReasonShow.style.display = "block";
    }

    dosageDefferentOpen(){
      this.different_start_taking_dosage_schedule = null;
      this.dosageScheduleModal.style.display = "none";
      this.dosageDefferentModal.style.display = "block";
    }

    dosageDefferentClosed(){
      this.dosageDefferentModal.style.display = "none";
      this.noScroll = false;
      this.renderer.removeClass(document.body, 'noScroll');
    }

    goTreatmentYesDefferent(){
      this.treatmentYesDefferent.style.display = "none";
      this.treatmentNoDefferent.style.display = "block";
    }

    goTreatmentNoDefferent(){
      this.treatmentNoDefferent.style.display = "none";
      this.treatmentYesDefferent.style.display = "block";
    }

    // Select Schedule
    selectSchedule(value){
      if(value=="true"){
        this.show_changes = true;
        this.goTreatmentYesDefferent();
      }else{
        this.goTreatmentNoDefferent();
      }
    }

    // Add dosage yes
    dossageAddyes(){
      try{
        if(this.startdosageSchedule==""){
          this.notificationService.error('Error','Please select when did you start your treatment',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.current_dosageamount == ""){
          this.formValidation = true;
          return false;
        }

        if(this.current_dosage == ""){
          this.notificationService.error('Error','Please select current dosage frequency',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.current_schedule_number=="" && this.i_take_as_needed == false){
          this.notificationService.error('Error','Please enter schedule for this dosage',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.current_schedule_frequency==""){
          this.notificationService.error('Error','Please select schedule  frequency for this dosage',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        this.formValidation = false;
        this.different_dosage_BrandName  = '';
        this.dosageDefferentOpen();
      }catch(err){
        console.log(err);
      }
    }

    finalSubmitTreatment(){
      try{
        if(this.selectDifferentschedule==""){
          this.notificationService.error('Error','Please select different added schdule',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.different_initial_dosage_amount=="" && this.selectDifferentschedule=="true"){
          this.formValidation = true;
          return false;
        }

        if(this.different_initial_dosage=="" && this.selectDifferentschedule=="true"){
          this.notificationService.error('Error','Please select your dosage',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.different_initial_schedule_number=="" && this.selectDifferentschedule=="true"){
          this.formValidation = true;
          return false;
        }

        if(this.different_initial_schedule_frequency=="" && this.selectDifferentschedule=="true"){
          this.notificationService.error('Error','Please select your schedule frequency',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }
        this.blockUI.start('please wait...');
        if(this.selectDifferentschedule == "true"){
          this.finalSubmitData ={
            'is_taking':this.currentStiltreatment,
            'start_current_dosage_schedule': moment(this.startdosageSchedule).format('YYYY/MM/DD'),
            'current_dosage_amount':this.current_dosageamount,
            'current_dosage':this.current_dosage,
            'current_schedule_number':this.current_schedule_number,
            'current_schedule_frequency':this.current_schedule_frequency,
            'i_take_as_needed':String(this.i_take_as_needed),
            'anything_else':this.current_schedule_detail,
            'different_initial_dosage_amount':this.different_initial_dosage_amount,
            'different_initial_dosage': this.different_initial_dosage,
            'different_start_taking_dosage_schedule': moment(this.different_start_taking_dosage_schedule).format('YYYY/MM/DD'),
            'my_dosage_was_same':String(this.my_dosage_was_same),
            'my_schedule_was_same':String(this.my_schedule_was_same),
            'anything_else_different':this.anything_else_different,
            'is_different':this.selectDifferentschedule,
            'treatment_brand_id' : this.treatment_brand_id,
            'different_initial_schedule_frequency':this.different_initial_schedule_frequency,
            'different_initial_schedule_number':this.different_initial_schedule_number,
            'different_treatment_brand_id' : this.different_treatment_brand_id
          }
        }else{
          this.finalSubmitData ={
            'is_taking':this.currentStiltreatment,
            'start_current_dosage_schedule': moment(this.startdosageSchedule).format('YYYY/MM/DD'),
            'current_dosage_amount':this.current_dosageamount,
            'current_dosage':this.current_dosage,
            'current_schedule_number':this.current_schedule_number,
            'current_schedule_frequency':this.current_schedule_frequency,
            'i_take_as_needed':String(this.i_take_as_needed),
            'anything_else':this.current_schedule_detail,
            'is_different':this.selectDifferentschedule,
            'treatment_brand_id' : this.treatment_brand_id
          }
        }
        this._APIservices.addschedule_treatment({'id':Number(this.addTreatmentInfo.id),'body':this.finalSubmitData}, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.show_changes = false;
            this.noScroll = false;
            this.blockUI.stop();
            this.renderer.removeClass(document.body, 'noScroll');
            this.Editdifferent_start_taking_dosage_schedule = null;
            this.different_start_taking_dosage_schedule = null
            this.notificationService.success('Add',suc.body.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });

            this.loadTreatmentList();
            this.dosageDefferentClosed();
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
      }catch(err){
        this.blockUI.stop();
        console.log(err);
      }
    }

    whyDisyoustop(value,status){
      if(status==0){
        this.reasonOther = false;
        this.why_did_stop=value;
        this.reasonShowBtn.style.display = "none";
      }else{
        this.reasonOther = true;
        this.why_did_stop="";
        this.reasonShowBtn.style.display = "block";
      }
    }

    // Add Desage for No
    addDosageNo(){
      try{

        if(this.currentStiltreatment==""){
          this.notificationService.error('Error','Please select  most recent shedule for this treatment',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.stopRecentSchedule==""){
          this.notificationService.error('Error','Please select you stop your most recent shedule',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }
        if(this.most_recent_dosage_amount==""){
          this.formValidation = true;
          return false;
        }

        if(this.most_recent_dosage==""){
          this.notificationService.error('Error','Please select your most dosage frequency',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.most_recent_schedule_number==""){
          this.formValidation = true;
          return false;
        }

        if(this.most_recent_schedule_frequency==""){
          this.formValidation = true;
          return false;
        }

        this.blockUI.start('please wait...');
        let data = {
          'is_taking':this.currentStiltreatment,
          'start_most_recent_dosage_schedule':moment(this.mostRecentSchedule).format('YYYY/MM/DD'),
          'most_recent_dosage_amount' :this.most_recent_dosage_amount,
          'most_recent_dosage' :this.most_recent_dosage,
          'most_recent_schedule_number':this.most_recent_schedule_number,
          'most_recent_schedule_frequency':this.most_recent_schedule_frequency,
          'i_did_treatment_as_needed' :this.i_did_treatment_as_needed,
          'stop_dosage_schedule' :moment(this.stopRecentSchedule).format('YYYY/MM/DD'),
          'why_did_stop' :this.why_did_stop,
          'anything_else' :this.current_schedule_detail,
        }

        this._APIservices.addschedule_treatment({'id':Number(this.addTreatmentInfo.id),'body':data}, this.headers).subscribe(suc=>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.blockUI.stop();
            this.why_did_stop = "";
            this.mostRecentSchedule = null;
            this.stopRecentSchedule = null;
            this.notificationService.success('Treatment',suc.body.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
            this.loadTreatmentList();
            this.dosageScheduleClosed();
          }
        }, err=>{
          this.blockUI.stop();
          var err_res = JSON.parse(err._body);
          this.notificationService.error('Error',"Please select, Why did you stop doing this treatment?",{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
        });
      }catch(err){
        this.blockUI.stop();
        console.log("Error occure while add dosage number. Error is ",err);
      }
    }

    selectEffective(value: string){
      this.addEffectiveness=value;
    }

    selectEffects(value: string){
      this.addSideeffect=value;
    }

    selectEvaluationTreatment(value: string){
      this.addTaketreatment=value;
    }

    selectHardTreatment(value: string){
      this.addHardtreatment=value;
    }

    selectEditEffective(value: string){
      this.editEffectiveness=value;
    }

    selectEditEffects(value: string){
      this.editSideeffect=value;
    }

    selectEditEvaluationTreatment(value: string){
      this.editTaketreatment=value;
    }

    selectEditHardTreatment(value: string){
      this.editHardtreatment=value;
    }

    addEvaluations(){
      try{

        if(this.addEffectiveness == ""){
          this.formValidation = true;
          return false;
        }
        
        if(this.addSideeffect == ""){
          this.formValidation = true;
          return false;
        }
        
        if(this.addTaketreatment == ""){
          this.formValidation = true;
          return false;
        }
        
        if(this.addHardtreatment == ""){
          this.formValidation = true;
          return false;
        }
        
        if(this.addCost != "" && this.addCurrency == ""){
          this.formValidation = true;
          return false;
        }

        if(this.adduPositive_effects == undefined){
          this.formValidation = true;
          return false;
        }

        this.blockUI.start('please wait...');
        if(this.addCost == ""){
          this.sendEvaluation = {
            "evalution_date": moment(this.addEvaluationDate).format('YYYY/MM/DD'),
            "effectiveness": this.addEffectiveness,
            "side_effects": this.addSideeffect,
            "adherence":this.addTaketreatment,
            "burden":  this.addHardtreatment,
            "unexpected_positive_effects": this.adduPositive_effects,
            "your_advice_tips": this.addYouradvice,
            "visibility": this.addVisibility == "" ? 'all_users' : this.addVisibility,
          }
        }else{
          this.sendEvaluation = {
            "evalution_date": moment(this.addEvaluationDate).format('YYYY/MM/DD'),
            "effectiveness": this.addEffectiveness,
            "side_effects": this.addSideeffect,
            "adherence":this.addTaketreatment,
            "burden":  this.addHardtreatment,
            "unexpected_positive_effects": this.adduPositive_effects,
            "your_advice_tips": this.addYouradvice,
            "cost": this.addCost,
            "cost_currency": this.addCurrency,
            "cost_frequency": this.addCostFrequency == "" ? 'week' : this.addCostFrequency,
            "visibility": this.addVisibility == "" ? 'all_users' : this.addVisibility,
          }
        }

        this._APIservices.addevaluation_treatment({'id':Number(this.addTreatmentInfo.id),'body':this.sendEvaluation}, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.blockUI.stop();
            this.notificationService.success('Evaluation',suc.body.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });

            this.loadTreatmentList();
            this.evaluationModalClosed();            
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
        console.log(err);
      }
    }

    // Evaluation Collapse
    accordianEvaluation(evaluation){
      if(evaluation.show==true){
        evaluation.show=false;
      }else{
        evaluation.show=true;
      }
    }

    deleteEvaluationConfirm(treatmentid,evaluationid){
      this.treatmentId = treatmentid;
      this.evaluationId = evaluationid;
      $('#deleteEvaluationConfirmModal').modal('show');
    }

    // Delete Evaluation
    deleteEvaluation(){
      try{
        this.blockUI.start('please wait...');
        $('#deleteEvaluationConfirmModal').modal('hide');
        let data = {
          "id":Number(this.treatmentId),
          "evalution_id":Number(this.evaluationId)
        }

        this._APIservices.delete_evaluation(data, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.blockUI.stop();
            this.notificationService.success('Evaluation deleted',suc.body.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
            this.loadTreatmentList();
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
      }catch(err){
        this.blockUI.stop();
        console.log('Error occure while delete evalution. Error is ', err);
      }
    }

    // Delete Dosage Schedule Confirm
    deleteDosageConfirm(treatmentid,dosage_or_schedule){
      this.treatmentId = treatmentid;
      this.dosage_or_schedule_Id = dosage_or_schedule.id;      
      $('#deleteDosageConfirmModal').modal('show');
    }

    // Delete Dosage Schedule
    deleteDosage(treatmentid,dosage_or_schedule_id){
      try{
        this.blockUI.start('please wait...');
        $('#deleteDosageConfirmModal').modal('hide');
        let data = {
          "id":Number(this.treatmentId),
          "dosage_or_schedule_id":Number(this.dosage_or_schedule_Id)
        }
        this._APIservices.delete_dosageSchedule(data, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.blockUI.stop();
            this.notificationService.success('Deleted',suc.body.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
            this.loadTreatmentList();
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
        console.log("Error occure while delete dosage. Error is ",err);
      }
    }

    deleteTreatmentConfirm(treatment){
      this.select_treatment_name = treatment.treatment_name.name;
      this.treatmentId = treatment.id;
      $('#confirmationModal').modal('show');
    }

    // Delete Treatment
    deleteTreatment(){
      try{

        this.blockUI.start('please wait...');
        $('#confirmationModal').modal('hide');
        let data = {
          "id":Number(this.treatmentId)
        }

        this._APIservices.delete_treatment(data, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.blockUI.stop();
            this.notificationService.success('Deleted',suc.body.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
            this.loadTreatmentList();
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
        console.log(err);
      }
    }

    // Open Edit Evaluation
    openEditEvaluation(allinfo){      
      this.editEffectiveness = (allinfo.effectiveness || "");
      this.editSideeffect = (allinfo.side_effects || "");
      this.editTaketreatment = (allinfo.adherence || "");
      this.editHardtreatment = (allinfo.burden || "");
      this.edituPositive_effects = (allinfo.unexpected_positive_effects || false);
      this.editYouradvice = (allinfo.your_advice_tips || "");
      this.editCurrency = (allinfo.cost_currency || "");
      this.editCostFrequency  = (allinfo.cost_frequency || "");
      this.editVisibility = (allinfo.visibility || "");
      this.editEvaluationDate = moment(allinfo.evalution_date).format('YYYY/MM/DD');
      this.evaluationTreatmentid = allinfo;
      this.editCost = (allinfo.cost || "");
      this.evaluationEditModal.style.display = "block";
      this.extractTreatment(allinfo.id);
    }

    extractTreatment(id){
      try{
        this.myTreatmentList.map((x, y)=>{
          x.my_treatment_evaluations.map((a, b)=>{
            if(a.id == id){
              if(typeof(x.treatment_name.name) != undefined){
                this.treatmentName = x.treatment_name.name;
              }              
            }
          });
        });
      } catch(e){
        console.log('Error occure while extract treatment. Error is ', e);
      }
    }

    // Close Edit Evaluation
    closeEditEvaluation(){
      this.evaluationEditModal.style.display="none";
    }

    // Update Evaluation
    updateEvaluations(){
      try{
        if(this.editEffectiveness == ""){
          this.notificationService.error('Error','Please select how would you rate the effectiveness',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.editSideeffect == ""){
          this.notificationService.error('Error','Please select how would you rate side effects',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.editTaketreatment == ""){
          this.notificationService.error('Error','Please select how often do you take this treatment',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.editHardtreatment == ""){
          this.notificationService.error('Error','Please select how hard is to do this treatment',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.edituPositive_effects == undefined){
          this.formValidation = true;
          return false;
        }

        if(this.editVisibility == ""){
          this.notificationService.error('Error','Please select user visibility',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.editCost != "" && this.editCurrency == ""){
          this.notificationService.error('Error','Please select currency',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.editCost != "" && this.editCostFrequency == ""){
          this.notificationService.error('Error','Please select frequency',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }
        
        this.blockUI.start('please wait...');
        if(this.editCost == ""){
          this.sendEvaluation = {
            "evalution_id":this.evaluationTreatmentid.id,
            "evalution_date": moment(this.editEvaluationDate).format('YYYY/MM/DD'),
            "effectiveness": this.editEffectiveness,
            "side_effects": this.editSideeffect,
            "adherence":this.editTaketreatment,
            "burden":  this.editHardtreatment,
            "unexpected_positive_effects": (this.edituPositive_effects || false),
            "your_advice_tips": this.editYouradvice,
            "visibility": this.editVisibility,
          }
        }else{
          this.sendEvaluation = {
            "evalution_id":this.evaluationTreatmentid.id,
            "evalution_date": moment(this.editEvaluationDate).format('YYYY/MM/DD'),
            "effectiveness": this.editEffectiveness,
            "side_effects": this.editSideeffect,
            "adherence":this.editTaketreatment,
            "burden":  this.editHardtreatment,
            "unexpected_positive_effects": (this.edituPositive_effects || false),
            "your_advice_tips": this.editYouradvice,
            "cost": this.editCost,
            "cost_currency": this.editCurrency,
            "cost_frequency": this.editCostFrequency,
            "visibility": this.editVisibility,
          }
        }

        this._APIservices.updateevaluation_treatment({'id':Number(this.evaluationTreatmentid.my_treatment_id),'body':this.sendEvaluation}, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.blockUI.stop();
            this.notificationService.success('Evaluation',suc.body.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
            this.loadTreatmentList();
            this.closeEditEvaluation();
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
      }catch(err){
        console.log(err);
      }
    }

    editEvaluationDosageOpen(allinfo){
      if(allinfo.is_taking == true){
        this.editYesTreatmentOpen();
      }else{
        this.goEditTreatmentNoField();
      }
      this.treatment_brand_id = (allinfo.treatment_brand_id || 0);
      this.different_treatment_brand_id = (allinfo.different_treatment_brand_id || null);
      this.submitEditstartdosageSchedule=moment(allinfo.start_current_dosage_schedule).format('YYYY/MM/DD');
      this.Editdifferent_start_taking_dosage_schedule = moment(allinfo.different_start_taking_dosage_schedule).format('YYYY/MM/DD');
      this.submitEditdifferent_start_taking_dosage_schedule=moment(allinfo.different_start_taking_dosage_schedule).format('YYYY/MM/DD');
      this.Editcurrent_dosageamount=allinfo.current_dosage_amount;
      this.Editcurrent_dosage=allinfo.current_dosage;
      this.Editcurrent_schedule_number=allinfo.current_schedule_number;
      this.Editcurrent_schedule_frequency=allinfo.current_schedule_frequency;
      this.Editi_take_as_needed=allinfo.i_take_as_needed;
      this.Editdifferent_initial_dosage=allinfo.different_initial_dosage;
      this.Editdifferent_initial_dosage_amount=allinfo.different_initial_dosage_amount;
      this.Editmy_dosage_was_same=allinfo.my_dosage_was_same;
      this.Editdifferent_initial_schedule_number=allinfo.different_initial_schedule_number;
      this.Editdifferent_initial_schedule_frequency=allinfo.different_initial_schedule_frequency;
      this.Editmy_schedule_was_same=allinfo.my_schedule_was_same;
      this.Editanything_else_different=allinfo.anything_else_different;
      this.Editcurrent_schedule_detail=allinfo.anything_else;
      this.editSelectDifferentschedule=allinfo.is_different;
      //this.different_dosage_BrandName = (allinfo.treatment_brand_name || '');
      this.different_dosage_BrandName = (allinfo.different_treatment_brand_name || '');
      this.most_recent_BrandName = (allinfo.treatment_brand_name || '');

      // Yes model
      this.Edit_startdosageSchedule=allinfo.start_current_dosage_schedule;
      this.Edit_current_dosageamount=allinfo.current_dosage_amount;
      this.Edit_current_dosage=allinfo.current_dosage;
      this.Edit_current_schedule_number=allinfo.current_schedule_number;
      this.Edit_current_schedule_frequency=allinfo.current_schedule_frequency;
      this.Edit_i_take_as_needed=allinfo.i_take_as_needed;
      this.Edit_current_schedule_detail=allinfo.anything_else;
      this.Edit_currentStiltreatment=allinfo.is_taking;
      this.Edit_TreatmentInfo=allinfo;
      this.Edit_most_recent_schedule_frequency=allinfo.most_recent_schedule_frequency;
      this.dosageBrandName = (allinfo.treatment_brand_name || '');
      

      // No model
      this.Edit_most_recent_dosage=allinfo.most_recent_dosage;
      this.Edit_most_recent_dosage_amount=allinfo.most_recent_dosage_amount;
      this.Edit_most_recent_schedule_number=allinfo.most_recent_schedule_number;
      this.Edit_most_recent_schedule_frequency=allinfo.most_recent_schedule_frequency;
      this.Edit_anything_else_different=allinfo.anything_else_different;
      this.Edit_different_initial_dosage_amount=allinfo.different_initial_dosage_amount;
      this.Edit_different_initial_dosage=allinfo.different_initial_dosage;
      this.Edit_different_initial_schedule_number=allinfo.different_initial_schedule_number;
      this.Edit_different_initial_schedule_frequency=allinfo.different_initial_schedule_frequency;
      this.Edit_different_start_taking_dosage_schedule=allinfo.different_start_taking_dosage_schedule;
      this.Edit_selectDifferentschedule=allinfo.is_different;
      this.Edit_i_did_treatment_as_needed= allinfo.i_did_treatment_as_needed;
      this.Edit_why_did_stop=allinfo.why_did_stop;

      this.Edit_mostRecentSchedule = (moment(allinfo.start_most_recent_dosage_schedule).format('MMMM DD, YYYY'));
      this.Edit_stopRecentSchedule = (moment(allinfo.stop_dosage_schedule).format('MMMM DD, YYYY'));

      this.submitEdit_mostRecentSchedule=moment(allinfo.start_most_recent_dosage_schedule).format('YYYY/MM/DD');
      this.submitEdit_stopRecentSchedule=moment(allinfo.stop_dosage_schedule).format('YYYY/MM/DD');
      
      this.EditstartdosageSchedule = allinfo.start_current_dosage_schedule;
      this.most_recent_BrandName = (allinfo.treatment_brand_name || '');
    }

    editEvaluationDosageClosed(){
      this.editEvaluationDosage.style.display = "none";
    }

    // Edit Desage for No
    editDosageNo(){
      try{
        if(this.submitEdit_mostRecentSchedule == ""){
          this.notificationService.error('Error','Please select  most recent shedule for this treatment',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.submitEdit_stopRecentSchedule == ""){
          this.notificationService.error('Error','Please select you stop your most recent shedule',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.Edit_most_recent_dosage_amount == ""){
          this.notificationService.error('Error','Please enter your most dosage amount',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.Edit_most_recent_dosage == ""){
          this.notificationService.error('Error','Please select your most dosage frequency',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.Edit_most_recent_schedule_number == ""){
          this.notificationService.error('Error','Please enter your recent schedule number',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        if(this.Edit_most_recent_schedule_frequency == ""){
          this.notificationService.error('Error','Please select your  recent schedule frequency',{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });
          return false;
        }

        this.blockUI.start('please wait...');
        let data = {
          'is_taking':this.Edit_currentStiltreatment,
          'start_most_recent_dosage_schedule':moment(this.submitEdit_mostRecentSchedule).format('YYYY/MM/DD'),
          'most_recent_dosage_amount' :this.Edit_most_recent_dosage_amount,
          'most_recent_dosage' :this.Edit_most_recent_dosage,
          'most_recent_schedule_number':this.Edit_most_recent_schedule_number,
          'most_recent_schedule_frequency':this.Edit_most_recent_schedule_frequency,
          'i_did_treatment_as_needed' :this.Edit_i_did_treatment_as_needed,
          'stop_dosage_schedule' :moment(this.submitEdit_stopRecentSchedule).format('YYYY/MM/DD'),
          'why_did_stop' :this.Edit_why_did_stop,
          'anything_else' :this.Edit_current_schedule_detail,
          'dosage_or_schedule_id':this.Edit_TreatmentInfo.id,
          'treatment_brand_id' : this.treatment_brand_id
        }

        this._APIservices.updateschedule_treatment({'id':Number(this.Edit_TreatmentInfo.my_treatment_id),'body':data}, this.headers).subscribe(suc =>{
          this.blockUI.stop();
          this.notificationService.success('Update',suc.body.message,{ 
            timeOut: 3000, 
            showProgressBar: false, 
            pauseOnHover: false, 
            clickToClose: false 
          });

          this.loadTreatmentList();
          this.closeEditTreatmentNoField();

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

    // Select Most Recent Schedule Date
    onDateChangedmostRecentSchedule(event){
      if(event.epoc==0){
        this.Edit_mostRecentSchedule="";
        this.submitEdit_mostRecentSchedule="";
      }else{
        this.Edit_mostRecentSchedule = moment(event).format('YYYY/MM/DD');
        this.submitEdit_mostRecentSchedule=moment(event).format('YYYY/MM/DD');
      }
    }

    // Select Recent Schedule Date
    onDateChangedRecentSchedule(event){
      if(event.epoc==0){
        this.Edit_mostRecentSchedule="";
        this.submitEdit_stopRecentSchedule="";
      }else{
          this.Edit_mostRecentSchedule = moment(event).format('YYYY/MM/DD');
          this.submitEdit_stopRecentSchedule=moment(event).format('YYYY/MM/DD')
      }
    }

    // Edit Treatment Why Did You Stop
    editwhyDidyoustop(value,status){
      if(status==0){
        this.Edit_why_did_stop=value;
        this.reasonShowBtn.style.display = "none";
      }else{
        this.Edit_why_did_stop="";
        this.reasonShowBtn.style.display = "block";
      }
    }

    // Edit  Dosage Start Schedule
    onDateEditstartSchedule(event){
      if(event.epoc==0){
        this.EditstartdosageSchedule="";
        this.submitEditstartdosageSchedule="";
      }else{
        this.EditstartdosageSchedule = moment(event).format('YYYY/MM/DD');
        this.submitEditstartdosageSchedule=moment(event).format('YYYY/MM/DD')
      }
    }

    editRecentSchedule(event){
      if(event.epoc==0){
        this.Editdifferent_start_taking_dosage_schedule = new Date();
        this.submitEditdifferent_start_taking_dosage_schedule = "";
      }else{
        this.Editdifferent_start_taking_dosage_schedule = moment(event).format('YYYY/MM/DD');
        this.submitEditdifferent_start_taking_dosage_schedule=moment(event).format('YYYY/MM/DD')
      }
    }

    editYesTreatmentOpen(){
      this.editYesTreatment.style.display = "block";
    }

    editYesTreatmentClosed(){
      this.editYesTreatment.style.display = "none";
    }

    editingTreatModal2Open(){
      this.editingTreatModal2.style.display = "block";
      this.editYesTreatment.style.display = "none";
    }

    editingTreatModal2Closed(){
      this.editingTreatModal2.style.display = "none";
    }

    goDefferentEdit(event){
      if(event==true || event=="true"){         
        this.defferentNoDivNew.style.display = "block";
      }else{
        this.defferentNoDivNew.style.display = "none";          
      }
      this.editSelectDifferentschedule=event;      
    }

    gotoOtherTreatment(event){
      if(event==true || event=="true"){         
        // this.defferentNoDivNew.style.display = "block";
      }else{
        // this.defferentNoDivNew.style.display = "none";          
      }
      // this.editSelectDifferentschedule=event;      
    }

    goDefferentNoDivNew(){
      this.defferentNoDivNew.style.display = "none";
      this.defferentYesDivNew.style.display = "block";
    }

    editTratmentFirst(){
      try{
        if(this.EditstartdosageSchedule == ""){
          this.formValidation = true;
          return false;
        }

        if(this.Editcurrent_dosageamount == ""){
          this.formValidation = true;
          return false;
        }

        if(this.Editcurrent_dosage == ""){
          this.formValidation = true;
          return false;
        }

        if(this.Editcurrent_schedule_number == "" && this.Editi_take_as_needed == false){
          this.formValidation = true;
          return false;
        }

        if(this.Editcurrent_schedule_frequency == ""){
          this.formValidation = true;
          return false;
        }

        this.editingTreatModal2Open();
        this.goDefferentEdit(this.editSelectDifferentschedule);
      }catch(err){
        console.log("Error occure while edit treatment. Error is ", err);
      }
    }

    finalSubmitEditTreatment(){
      try{
        if(this.editSelectDifferentschedule == undefined){
          this.formValidation = true;
          return false;
        }

        if(this.Editdifferent_initial_dosage_amount == null && this.editSelectDifferentschedule == true){
          this.formValidation = true;
          return false;
        }

        if(this.Editdifferent_initial_dosage == "" && this.editSelectDifferentschedule == true){
          this.formValidation = true;
          return false;
        }

        if(this.Editdifferent_initial_schedule_number == null && this.editSelectDifferentschedule == true){
          this.formValidation = true;
          return false;
        }

        if(this.Editdifferent_initial_schedule_frequency == null && this.editSelectDifferentschedule == true){
          this.formValidation = true;
          return false;
        }

        this.blockUI.start('please wait...');
        if(this.editSelectDifferentschedule == true){
          this.finalSubmitData = {
            'is_taking':this.editSelectDifferentschedule,
            'start_current_dosage_schedule': moment(this.submitEditstartdosageSchedule).format('YYYY/MM/DD'),
            'current_dosage_amount':this.Editcurrent_dosageamount,
            'current_dosage':this.Editcurrent_dosage,
            'current_schedule_number':this.Editcurrent_schedule_number,
            'current_schedule_frequency':this.Editcurrent_schedule_frequency,
            'i_take_as_needed':String(this.Editi_take_as_needed),
            'anything_else':this.Editcurrent_schedule_detail,
            'different_initial_dosage_amount':this.Editdifferent_initial_dosage_amount,
            'different_initial_dosage': this.Editdifferent_initial_dosage,
            'different_start_taking_dosage_schedule': moment(this.submitEditdifferent_start_taking_dosage_schedule).format('YYYY/MM/DD'),
            'my_dosage_was_same':String(this.Editmy_dosage_was_same),
            'my_schedule_was_same':String(this.Editmy_schedule_was_same),
            'anything_else_different':this.Editanything_else_different,
            'is_different':this.editSelectDifferentschedule,
            'different_initial_schedule_frequency':this.Editdifferent_initial_schedule_frequency,
            'different_initial_schedule_number':this.Editdifferent_initial_schedule_number,
            'dosage_or_schedule_id':this.Edit_TreatmentInfo.id
          }
        }else{
          this.finalSubmitData = {
            'is_taking':this.editSelectDifferentschedule,
            'start_current_dosage_schedule': moment(this.submitEditstartdosageSchedule).format('YYYY/MM/DD'),
            'current_dosage_amount':this.Editcurrent_dosageamount,
            'current_dosage':this.Editcurrent_dosage,
            'current_schedule_number':this.Editcurrent_schedule_number,
            'current_schedule_frequency':this.Editcurrent_schedule_frequency,
            'i_take_as_needed':String(this.Editi_take_as_needed),
            'anything_else':this.Editcurrent_schedule_detail,
            'is_different':this.editSelectDifferentschedule,
            'dosage_or_schedule_id':this.Edit_TreatmentInfo.id
          }
        }
        this._APIservices.updateschedule_treatment({'id':Number(this.Edit_TreatmentInfo.my_treatment_id),'body':this.finalSubmitData}, this.headers).subscribe(suc =>{
          if(suc.body.status == "1" || suc.body.status == 1){
            this.blockUI.stop();
            this.notificationService.success('Update',suc.body.message,{ 
              timeOut: 3000, 
              showProgressBar: false, 
              pauseOnHover: false, 
              clickToClose: false 
            });
            this.loadTreatmentList();
            this.editingTreatModal2Closed();
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
        console.log("Error occure while edit treatment. Error is ",err);
      }
    }

    //edit_visibility_evaluation
    edit_visibility_evaluation(event, id, evalution_id){
      try{
        this.blockUI.start('please wait...');
        let data = {
          'id': id,
          'data' : {'visibility' : event, 'evalution_id' : evalution_id}
        }
        this._APIservices.edit_visibility_evaluation(data, this.headers).subscribe(suc =>{
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
        console.log('Error occure while set visibility. Error is ', e);
      }
    }

    //edit_visibility_dosage_or_schedule
    edit_visibility_dosage_or_schedule(event, id, dosage_or_schedule_id){
      try{
        this.blockUI.start('please wait...');
        let data = {
          'id': id,
          'data' : {'visibility' : event, 'dosage_or_schedule_id' : dosage_or_schedule_id}
        }
        this._APIservices.edit_visibility_dosage_or_schedule(data, this.headers).subscribe(suc =>{
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
        console.log("Error occure while set visibility. Error is ", e);
      }
    }

    reportWhyDidYouStop(value, status){
      if(status==0){
        this.why_did_stop = value;
        this.reportreasonShowBtn = false;
      }else{
        this.why_did_stop="";
        this.reportreasonShowBtn = true;
      }
    }

    move_to_current(id, type){
      this.formValidation = false;
      this.invalidDateSelection = false;
      this.reportTreatmentStopDate = "";
      this.why_did_stop = "";
      this.treatmentId = id;
      this.type = type;
      $('#moveToCurentModal').modal('show');
    }

    start_stop_treatment_popup(id, type, treatment){
      this.treatment_started_at = treatment["treatment_started_at"];
      this.reportTreatmentStopDate = "";
      this.why_did_stop = "";
      this.why_did_stop_other = "";
      this.reasonShowBtn.style.display = "none";
      this.treatmentId = id;
      this.type = type;
      this.formValidation = false;
      this.invalidDateSelection = false;
      $('#reportStopModal').modal('show');
    }

    start_stop_treatment(){
      try{
        
        if(this.type == 'start'){
          
          if(this.reportTreatmentStopDate == "" || this.reportTreatmentStopDate == undefined){
            this.formValidation = true;
            return false;
          }
          if(this.why_did_stop == "" || this.why_did_stop == undefined){
            this.formValidation = true;
            return false;
          }

          let treatment_stoped_at = moment(this.reportTreatmentStopDate).format('YYYY/MM/DD');
          let treatment_started_at = moment(this.treatment_started_at).format('YYYY/MM/DD');
          if(treatment_stoped_at < treatment_started_at){
            this.formValidation = true;
            this.invalidDateSelection = true;
            return false;
          }
        } else{
          if(this.reportTreatmentStopDate == "" || this.reportTreatmentStopDate == undefined){
            this.formValidation = true;
            return false;
          }
        }

        this.blockUI.start('please wait...');
        $('#reportStopModal').modal('hide');
        $('#moveToCurentModal').modal('hide');
        let body_params = {};
        if(this.type == 'start'){
          body_params = {
            'is_current_treatment' : false,
            'treatment_stoped_at' : moment(this.reportTreatmentStopDate).format('YYYY/MM/DD'),            
            'why_did_stop' : (this.why_did_stop || "")
          }
        } else{
          body_params = {
            'is_current_treatment' : true,
            'treatment_started_at' : moment(this.reportTreatmentStopDate).format('YYYY/MM/DD'),
            'why_did_stop' : (this.why_did_stop || "")
          }
        }
        this._APIservices.start_stop_treatment({'id' : this.treatmentId, 'data' : body_params}, this.headers).subscribe(suc =>{
          if(suc.body.status == 1 || suc.body.status == "1"){
            this.blockUI.stop();
            this.loadTreatmentFilterList();
            this.loadTreatmentList();
          }
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
        console.log('Error occure while start and stop treatment. Error is ', e);
      }
    }

    list_tags_purpose_popup(id){
      this.searchConditionString = "#";
      this.treatmentId = id;
      this.suggestion_name_list = [];
      $('#tags-popup').modal('show');
    }

    list_tags_purpose(search_word){
      try{
        if(search_word.length > 1){
          this.empty_tag = false;
          let final_key = search_word.substr(1,search_word.length);
          let data = {
            'search_word' : final_key
          }
          this._APIservices.usersList_TagsPurpose(data, this.headers).subscribe(suc =>{
            if(suc.body.status == 1 || suc.body.status == "1"){
              this.searchString = true;
              this.searchConditionList = suc.body.data;            

              for(let item of this.searchConditionList.sort(this.dynamicSort("name"))){
                this.suggestion_name_list.push({'id':item.id, 'name': '#' + item.name});
              }
            }
          }, err=>{
            var err_res = JSON.parse(err._body);
            console.log('unknown error occure. Error is ', err_res);
          });
        } else{
          this.suggestion_name_list = [];
        }
      } catch(e){
        console.log('Error occure while list tags. Error is ', e);
      }
    }
    dynamicSort(property) {
      let sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      }
    }


    selectMycondition(item){
      this.selectedMycondtion = item;
      this.searchConditionString = item.name;
      this.searchString = false;
    }

    add_purpose(){
      try{
        if(this.selectedMycondtion.id == undefined){
          this.empty_tag = true;          
          return false;
        }
        this.empty_tag = false;

        this.blockUI.start('please wait...');
        $('#tags-popup').modal('hide');
        let data = {
          'purpose_id' : (this.selectedMycondtion.id || 0),
          'purpose_type' : 'Treatment'
        }
        this._APIservices.add_purpose({'id' : this.treatmentId, 'data' : data}, this.headers).subscribe(suc =>{
          if(suc.body.status == 1 || suc.body.status == "1"){
            this.blockUI.stop();
            this.loadTreatmentFilterList();
            this.loadTreatmentList();
          }
        }, err=>{
          this.blockUI.stop();
          var err_res = JSON.parse(err._body);
          console.log('unknown error occure. Error is ', err_res);
        });
      } catch(e){
        this.blockUI.stop();
        console.log('Error occcure while add purpose. Error is ', e);
      }
    }

    remove_purpose_confirm(id, purposeId){
      this.purposeId = purposeId;
      this.treatmentId = id;
      $('#removePurposeConfirmModal').modal('show');
    }

    remove_purpose(){
      try{
        this.blockUI.start('please wait...');
        $('#removePurposeConfirmModal').modal('hide');
        let data = {
          'id' : (this.treatmentId || 0),
          'purpose_id' : (this.purposeId || 0),
          'purpose_type' : 'Treatment'
        }
        this._APIservices.remove_purpose(data, this.headers).subscribe(suc =>{
          if(suc.body.status == 1 || suc.body.status == "1"){
            this.blockUI.stop();
            this.loadTreatmentFilterList();
            this.loadTreatmentList();
          }
        }, err=>{
          this.blockUI.stop();
          var err_res = JSON.parse(err._body);
          console.log('unknown error occure. Error is ', err_res);
        });
      } catch(e){
        console.log('Error occure while remove purpose. Error is ', e);
      }
    }

    addTreatmentClosedModel(){      
      $("#confirmationModalAdd").modal('show');
    }
  
    noHide(){
      $("#confirmationModalAdd").modal('hide');
      // $("#addAllSymptoms").modal('show');
      this.addTreatment.style.display = "block";
    }
  
    yesdelete(){
      this.addTreatment.style.display = "none";      
      $("#confirmationModalAdd").modal('hide');      
    }

    onDateChanged(event){
      this.startdosageSchedule = (moment(event).format('YYYY/MM/DD'));
    }

  clearModelValues(){
    this.current_schedule_number = "";
    this.Editcurrent_schedule_number = "";
  }

  removeIKeep(){
    this.i_take_as_needed = false;
    this.Editi_take_as_needed = false;
  }

  close_tag(){
    $("#tags-popup").modal('hide');
    this.suggestion_name_list = [];
  }

  remove_tag(){
    this.suggestion_name_list = [];
    this.searchConditionString = '#';
  }

    // Select Diagnose Date
  onDateChangeddiagnose(event){
    if(event.epoc==0){
      this.different_start_taking_dosage_schedule="";
    }else{
      this.different_start_taking_dosage_schedule = moment(event).format('YYYY/MM/DD');
    }
  }

  // Select Diagnose Date
  onDateChangeddiagnose1(event){
    if(event.epoc==0){
      this.addEvaluationDate="";
    }else{
      this.addEvaluationDate = moment(event).format('YYYY/MM/DD');
    }
  }

  onDateChangeddiagnose2(event){
    if(event.epoc==0){
      this.reportTreatmentStopDate="";
    }else{
      this.reportTreatmentStopDate = moment(event).format('YYYY/MM/DD');
    }
  }

  onDateChangedDosage(event){
    if(event.epoc==0){
      this.mostRecentSchedule="";
    }else{
      this.mostRecentSchedule = moment(event).format('YYYY/MM/DD');
    }
  }

  onDateChangedDosage1(event){
    if(event.epoc==0){
      this.stopRecentSchedule="";
    }else{
      this.stopRecentSchedule = moment(event).format('YYYY/MM/DD');
    }
  }

  search_dosage_brand(){
    try{
      this.add_new_brand = false;
      let data = {
        'id' : this.treatmentId
      }
      this._APIservices.list_brands(data, this.headers).subscribe(suc=>{
        if(suc.body.status == 1 || suc.body.status=="1"){
         this.search_dosage_list = suc.body.data;  
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        console.log("Error occure while search brand. Error is ", err_res.message);
      });
    } catch(e){
      console.error("Error occure while search for dosage brand. Error is ", e);
    }
  }

  select_my_brand(item){
    try{
      this.dosageBrandName = (item.name || "");
      this.treatment_brand_id = (item.id || 0);
      this.search_dosage_list = [];
    } catch(e){
      console.error("Error occure while select my brand. Error is ", e);
    }
  }

  select_different_brand(item){
    try{
      this.different_dosage_BrandName = (item.name || "");
      this.different_treatment_brand_id = (item.id || null);
      this.search_dosage_list = [];
    } catch(e){
      console.error("Error occure while select my brand. Error is ", e);
    }
  }

  select_recent_brand(item){
    try{
      this.most_recent_BrandName = (item.name || "");
      this.treatment_brand_id = (item.id || 0);
      this.search_dosage_list = [];
    } catch(e){
      console.error("Error occure while select my brand. Error is ", e);
    }
  }

  select_other(){
    this.dosageBrandName = "Other";
    this.search_dosage_list = [];
    this.add_new_brand = true;
  }

  select_different_other(){
    this.different_dosage_BrandName = "Other";
    this.search_dosage_list = [];
    this.add_new_brand = true;
  }

  select_recent_other(){
    this.most_recent_BrandName = "Other";
    this.search_dosage_list = [];
    this.add_new_brand = true;
  }


  reset_search(){
    if(this.new_brand == ""){
      this.dosageBrandName = '';
      this.search_dosage_list = [];
      this.add_new_brand = false;
    }/* else if(this.different_new_brand == ""){
      this.different_dosage_BrandName = '';
      this.search_dosage_list = [];
      this.add_new_brand = false;
    }*/
  }

  closeprediction(){
    this.dosageBrandName = '';
    this.search_dosage_list = [];
    this.add_new_brand = false;
  }

  close_different_prediction(){
    this.different_dosage_BrandName = '';
    this.search_dosage_list = [];
    this.add_new_brand = false;
  }

  close_recent_prediction(){
    this.most_recent_BrandName = '';
    this.search_dosage_list = [];
    this.add_new_brand = false;
  }

  add_my_new_brand(type){
    try{
      if(this.new_brand == ''){
        this.notificationService.error('Error', "Brand name cannot be blank", { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false });
        return false;
      }
      this.add_brand(this.new_brand, type);
    } catch(e){
      //TODO
    }
  }

  add_my_different_brand(type){
    try{
      if(this.different_new_brand == ''){
        this.notificationService.error('Error', "Brand name cannot be blank", { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false });
        return false;
      }
      this.add_brand(this.different_new_brand, type);
    } catch(e){
      //TODO
    }
  }

  add_recent_brand(type){
    try{
      if(this.most_recent_new_brand == ''){
        this.notificationService.error('Error', "Brand name cannot be blank", { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false });
        return false;
      }
      let data = this.add_brand(this.most_recent_new_brand, type);
    } catch(e){
      //TODO
    }
  }

  //Request to add treatment brand
  add_brand(name, type){
    try{
      this.blockUI.start('please wait...');
      let data = {
        'my_treatment_id' : this.treatmentId,
        'name' : (name || '')
      }
      this._APIservices.add_treatment_brand({'body' : data}, this.headers).subscribe(suc=>{
        if(suc.body.status == 1 || suc.body.status=="1"){
          this.dosageBrandName = (suc.body.data["name"] || '');
          this.different_dosage_BrandName = (suc.body.data["name"] || '');
          this.most_recent_BrandName = (suc.body.data["name"] || '');
          if(type === 1 ){
            this.treatment_brand_id = (suc.body.data["id"] || 0);
          }
          else if(type === 2 ){
            this.different_treatment_brand_id = (suc.body.data["id"] || 0);
          }
          
          this.add_new_brand = false;
          this.notificationService.success('Succcess', "Brand added successfully.", { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false });
          this.blockUI.stop();  
        }
      },err=>{
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error', err_res.message, { timeOut: 3000, showProgressBar: false, pauseOnHover: false, clickToClose: false });
        this.blockUI.stop();
      });
    } catch(e){
      console.error("Error occure while add brand. Error is ", e);
      this.blockUI.stop();
    }
  }

}
