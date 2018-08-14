import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'global-structure',
  templateUrl: './global.html',
})

export class GlobalComponent implements OnInit {
  constructor() {
  	console.log('GlobalComponent')
  }

  ngOnInit() {}

}
