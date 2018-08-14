import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { AngularIsEmpty } from 'angularisempty'; 

declare var $ : any;
declare var window: any;

@Component({
  selector: 'calendar',
  templateUrl: './calander.component.html',
  styleUrls: ['./calander.component.css']
})

export class CalanderComponent implements OnInit , OnDestroy {

	private displayBox : boolean = false;
	private month_name = [{'id':'01','name':'January','val':'Jan'},{'id':'02','name':'February','val':'Feb'},{'id':'03','name':'March','val':'Mar'},{'id':'04','name':'April','val':'Apr'},{'id':'05','name':'May','val':'May'},{'id':'06','name':'June','val':'Jun'},{'id':'07','name':'July','val':'Jul'},{'id':'08','name':'August','val':'Aug'},{'id':'09','name':'Septeber','val':'Sep'},{'id':'10','name':'October','val':'Oct'},{'id':'11','name':'November','val':'Nov'},{'id':'12','name':'December','val':'Dec'}]
	private day = moment();
	private month : any;
	private weeks : any = [];
	private selected : any = "";
	private yearList : any = [];

	private myDate : string = "";
	private myDay : number = 1;
	private myMonth : string = '01';
	private myYear : string = '1950';

	private currentDate = moment(new Date()).format("YYYYMMDD");

	@Input() dateValue:any;
	@Input() isDisplayBirthdayBtn:boolean = false;
	@Input() isDisplaySaveBtn:boolean = false;
	@Input() myLeft:Number = 450;
	@Output() getDate: any = new EventEmitter();

	//constructor
	constructor() {
		//TODO: 
	}

	//ngOnInit
	ngOnInit() {
		this.get_year();
		let date = moment.utc(new Date()).toDate().toString().replace(/ *\([^)]*\) */g, "");
		//this.selected = this.removeTime(moment(date));
		this.month = moment(new Date());
		let start = moment(date);
		let end = moment(date);
		this.buildMonth(start, end);
		setTimeout(()=>{
			this.previous();
			this.next();
		},200);

		this.get_selected_month_year(this.selected);
		if(this.dateValue != undefined && this.dateValue != ''){
			this.set_component_date();
		} else{
			this.myDate = "";
			this.myMonth = (moment(new Date()).format('MM'));
			this.myYear = (moment(new Date()).format('YYYY'));
			this.selected = (moment(new Date()).format('DD MMM YYYY'));
		}

		//hide calender while click outside calender
		$(()=>{
			var $win = $(window);
			var $box = $(".test");
			var $log = $(".row");
			$win.on("click.Bst", (event)=>{
				if ($box.has(event.target).length == 0&& !$box.is(event.target)){
					this.displayBox = false;
				} else {
					//TODO:
				}
			});
		});
	}

	//ngOnChanges
	ngOnChanges(changes: any){
		if(AngularIsEmpty.isEmpty(this.dateValue)){
			this.myDate = "";
			this.myMonth = (moment(new Date()).format('MM'));
			this.myYear = (moment(new Date()).format('YYYY'));
			this.refresh_calander();
		} else{
			this.set_component_date();
		}
	}

	// build months
	buildMonth(start, month) {
		try{
			this.weeks = [];
			let done = false,
				date = start.clone(),
				monthIndex = date.month(),
				count = 0;

			while (!done) {
				this.weeks.push({
					days: this.buildWeek(date.clone(), month)
				});
				date.add(1, "w");
				done = count++ > 2 && monthIndex !== date.month();
				monthIndex = date.month();
			}
			//console.log('weeks2', JSON.stringify(this.weeks))
		} catch(e){
			console.error("Error occure while build months. Error is ", e);
		}		
	}

	// build weeks
	buildWeek(date, month) {
		try{

			let days = [];
			for (let i = 0; i < 7; i++) {
				let s = moment(this.myYear + "-" + date.month() + "-" + date.date()).format("YYYYMMDD"); 
				//console.log('futureDate <<>> currentDate <<>> isFutureDate', Number(s) + "<<>>" + Number(this.currentDate) + "<<>>" + (Number(this.currentDate) < Number(s)));
				let isFuture = (Number(this.currentDate) < Number(s));
				//console.log('isFuture1', isFuture);
				days.push({
					name: date.format("dd").substring(0, 1),
					number: date.date(),
					isCurrentMonth: date.month() === month.month(),
					isToday: date.isSame(new Date(), "day"),
					date: date,
					isFuture : isFuture, 
				});
				date = date.clone();
				date.add(1, "d");
			}
			return days;
		} catch(e){
			console.error("Error occure while build week days. Error is ", e);
		}		
	}

	//display next calender
	next() {
		try{
			var next = this.month.clone();
			this.removeTime(next.month(next.month() + 1).date(1));
			this.month.month(this.month.month() + 1);
			this.buildMonth(next, this.month);
		} catch(e){
			console.error("Error occure while display next calender. Error is ", e);
		}		
	};

	//display previous calender
	previous() {
		try{
			let previous = this.month.clone();
			this.removeTime(previous.month(previous.month() - 1).date(1));
			this.month.month(this.month.month() - 1);
			this.buildMonth(previous, this.month);
		} catch(e){
			console.error("Error occure while calander previous. Error is ", e);
		}		
	};

	//remove current selected date
	removeTime(date) {
		return date.day(0).hour(0).minute(0).second(0).millisecond(0);
	}

	//set selected date to model
	select = function(day) {
		try{
			//console.log('day', day);
			this.selected = day.date;
        	
		} catch(e){
			console.error("Error occure while select date. Error is ", e);	
		}
    };

    //get list of year starts from 1950 
    get_year(){
    	try{
    		let startYear = Number("1920");
    		let endYear = Number(new Date().getFullYear());
    		for (let i = startYear; i <= endYear; i++) {
    			let oYear = {
    				"year" : i
    			};

    			this.yearList.push(oYear);
    		}
    	} catch(e){
    		console.error("Error occure while generate year. Error is ", e);
    	}
    }

    //refresh calender on month / year change
    refresh_calander(){
    	try{
    		let searchDate = this.myYear + "-" + this.myMonth + "-" + moment(new Date()).format("DD");
			let date = moment.utc(searchDate).toDate().toString().replace(/ *\([^)]*\) */g, "");
			//this.selected = this.removeTime(moment(date));
			this.selected = searchDate;
			this.month = moment(searchDate);
			let start = moment(date);
			let end = moment(date);
			this.buildMonth(start, end);
			setTimeout(()=>{
				this.previous();
				this.next();
			},250);
    	} catch(e){
    		console.error("Error occure while refresh calender. Error is ", e);
    	}    	
    }

    //get_selected_month_year
    get_selected_month_year(value){
    	this.myMonth = moment(value).format("MM");
    	this.myYear = moment(value).format("YYYY");
    }

    //set_component_date
    set_component_date(){
    	this.myDate = (moment(this.dateValue).format('DD MMM YYYY'));
    	this.get_selected_month_year(this.dateValue);    	
    	setTimeout(()=>{
    		this.refresh_calander();
    		this.selected = this.myDate;
    	},100);
    }

    press_savedate_btn(){
    	try{
    		this.displayBox = false;
        	this.myDate = (moment(this.selected).format('DD MMM YYYY')); 
        	let return_date = (moment(this.selected).format('YYYY-MM-DD'));
        	this.getDate.emit(return_date);
    	} catch(e){
    		console.log("Error occure while save date. Error is ", e);
    	}
    }

    ngOnDestroy() {
  		this.displayBox = false;
	}

	focus_datepicker(){
		$('body').click();
		this.displayBox=true
	}
}
