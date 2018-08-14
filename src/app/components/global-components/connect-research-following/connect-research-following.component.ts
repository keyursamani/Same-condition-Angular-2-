import { Component, OnInit } from '@angular/core';
import { HeadersProvider } from './../../../../common/core/headers.providers';
import { SCApi } from './../../../../common/swagger-providers/sc-api.provider';
import { NotificationsService } from 'angular2-notifications-lite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { fstat } from 'fs';
declare var $: any;
declare var jQuery: any;


@Component({
  selector: 'app-connect-research-following',
  templateUrl: './connect-research-following.component.html',
  styleUrls: ['./connect-research-following.component.scss']
})
export class ConnectResearchFollowingComponent extends HeadersProvider implements OnInit {

  followingTab: boolean;
  followerTab: boolean;
  followinruserlist: any;
  followerUserList: any;
  followingPageCount: number;
  followingPageStillmoreFlag: boolean;

  followerPageCount: number;
  followerPageStillmoreFlag: boolean;
  constructor(private APIservices: SCApi, private NotificationService: NotificationsService) {
    super();
  }

  ngOnInit() {
    this.followingPageCount = 1;
    this.followingPageStillmoreFlag = true;
    this.followerPageStillmoreFlag = true;
    this.followingTab = true;
    this.followerTab = false;
    this.followinruserlist = [];
    this.followerUserList = [];
    this.loadfollowing();
  }
  onScrollDown() {
    if (this.followingTab) {
      this.loadMorefollowing();
    } else {
      this.loadMorefollower();
    }
  }
  loadfollower() {
    this.followerPageCount = 1;
    this.followerPageStillmoreFlag = true;
    let body_param = {
      "page": this.followerPageCount,
      "per_page": 10,
      "offset": 0,
    }
    this.APIservices.getUserfollowers(body_param, this.headers).subscribe(res => {
      if (res.body.status === 1 || res.body.status === "1") {
        if (res.body.data.length > 0) {
          this.followerUserList = res.body.data;
          for (var i = 0; i < this.followerUserList.length; i++) {
            if (this.followerUserList[i].my_conditions.length > 0) {
              let tempCondition = this.followerUserList[i].my_conditions;
              let tconditionVal = "";
              for (var j = 0; j < tempCondition.length; j++) {
                if ((j + 1) % 2 == 0) {
                  tconditionVal = tconditionVal + "," + tempCondition[j].name + "<br/>";
                } else {
                  tconditionVal = tconditionVal + tempCondition[j].name;
                }
              }
              this.followerUserList[i].my_conditions = tconditionVal;
            }
          }
        } else {
          this.followerPageStillmoreFlag = false;
        }
      } else {
        this.followerPageStillmoreFlag = false;
      }

    });
  }
  loadMorefollower() {
    if (this.followerPageStillmoreFlag) {
      this.followerPageCount++;
      let body_param = {
        "page": this.followerPageCount,
        "per_page": 10,
        "offset": 0,
      }
      this.APIservices.getUserfollowers(body_param, this.headers).subscribe(res => {
        if (res.body.status === 1 || res.body.status === "1") {
          if (res.body.data.length > 0) {
            for (var i = 0; i < res.body.data.length; i++) {
              if (res.body.data[i].my_conditions.length > 0) {
                let tempCondition = res.body.data[i].my_conditions;
                let tconditionVal = "";
                for (var j = 0; j < tempCondition.length; j++) {
                  if ((j + 1) % 2 == 0) {
                    tconditionVal = tconditionVal + "," + tempCondition[j].name + "<br/>";
                  } else {
                    tconditionVal = tconditionVal + tempCondition[j].name;
                  }
                }
                res.body.data[i].my_conditions = tconditionVal;
              }
            }
            this.followerUserList = this.followerUserList.concat(res.body.data);
          } else {
            this.followerPageStillmoreFlag = false;
          }
        } else {
          this.followerPageStillmoreFlag = false;
        }
      });
    }

  }
  loadMorefollowing() {
    if (this.followingPageStillmoreFlag) {
      this.followingPageCount++;
      let body_param = {
        "page": this.followingPageCount,
        "per_page": 10,
        "offset": 0,
      }
      this.APIservices.getUserFollowing(body_param, this.headers).subscribe(res => {
        if (res.body.status === 1 || res.body.status === "1") {
          if (res.body.data.length > 0) {
            for (var i = 0; i < res.body.data.length; i++) {
              if (res.body.data[i].my_conditions.length > 0) {
                let tempCondition = res.body.data[i].my_conditions;
                let tconditionVal = "";
                for (var j = 0; j < tempCondition.length; j++) {
                  if ((j + 1) % 2 == 0) {
                    tconditionVal = tconditionVal + "," + tempCondition[j].name + "<br/>";
                  } else {
                    tconditionVal = tconditionVal + tempCondition[j].name;
                  }
                }
                res.body.data[i].my_conditions = tconditionVal;
              }
            }
            this.followinruserlist = this.followinruserlist.concat(res.body.data);
          } else {
            this.followingPageStillmoreFlag = false;
          }

        } else {
          this.followingPageStillmoreFlag = false;
        }
      });
    }

  }
  loadfollowing() {
    this.followingPageCount = 1;
    this.followingPageStillmoreFlag = true;
    let body_param = {
      "page": this.followingPageCount,
      "per_page": 10,
      "offset": 0,
    }
    this.APIservices.getUserFollowing(body_param, this.headers).subscribe(res => {
      if (res.body.status === 1 || res.body.status === "1") {
        if (res.body.data.length > 0) {
          this.followinruserlist = res.body.data;
          for (var i = 0; i < this.followinruserlist.length; i++) {
            if (this.followinruserlist[i].my_conditions.length > 0) {
              let tempCondition = this.followinruserlist[i].my_conditions;
              let tconditionVal = "";
              for (var j = 0; j < tempCondition.length; j++) {
                if ((j + 1) % 2 == 0) {
                  tconditionVal = tconditionVal + "," + tempCondition[j].name + "<br/>";
                } else {
                  tconditionVal = tconditionVal + tempCondition[j].name;
                }
              }
              this.followinruserlist[i].my_conditions = tconditionVal;
            }
          }
        } else {
          this.followingPageStillmoreFlag = false;
        }
      }

    });
  }
  followingtabactive() {
    this.followingTab = true;
    this.followerTab = false;
    this.loadfollowing();
  }
  followtabactive() {
    this.followingTab = false;
    this.followerTab = true;
    this.loadfollower();
  }
}
