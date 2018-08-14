import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications-lite';
declare var $ : any;
declare var jQuery : any;

@Component({
  selector: 'aq-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent extends HeadersProvider implements OnInit {

  private userProfile: any;
  private addProfileModal : any ;
  private editProfileModal : any ;

  constructor(
    public _router:Router,
    public _APIservices:SCApi,
    private notificationService: NotificationsService
    ) {
    super();
    this.userProfile=[];
  }

  ngOnInit() {
    this.getLoginuserProfile();
    this.addProfileModal = document.getElementById('addProfileModal');
    this.editProfileModal = document.getElementById('editProfileModal');
  }

  getLoginuserProfile(){
    try{
      this._APIservices.get_patient_profile({}, this.headers).subscribe(suc =>{
        this.userProfile=suc.body.data;
      }, err=>{
        var err_res = JSON.parse(err._body);
        this.notificationService.error('Error',err_res.message, { 
          timeOut: 3000, 
          showProgressBar: false, 
          pauseOnHover: false, 
          clickToClose: false 
        })
      });
    }catch(err){
      console.log(err);
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

}
