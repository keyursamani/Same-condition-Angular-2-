import { Component,OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ILocalStorageServiceConfig } from 'angular-2-local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class AppComponent {
  public options = {
    position: ["bottom", "right"],
    lastOnBottom: true,
    timeOut: 2000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 1000,
    maxStack: 1
  };
  
  // Redirect to dashboard if use if alrady login
  public _localStorage: LocalStorageService;
  public _lconfig: ILocalStorageServiceConfig = {};
  constructor(public _router: Router) {
    this._localStorage = new LocalStorageService(this._lconfig);
    if (this._localStorage.get('profile') && this._localStorage.get('profile').hasOwnProperty('AuthToken')){
       if (this._localStorage.get('role') == 'patient')
        this._router.navigate(['/app/dashboard/timeline']);
      else 
        this._router.navigate(['/app/dashboard/researcher']);
    }
  }
}
