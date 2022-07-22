import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {findLast} from '@angular/compiler/src/directive_resolver';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.scss']
})
export class UniversityComponent implements OnInit,OnDestroy {
  showEducationRate=false;
  showField=false;
  showInstanceTypeDefine=true;
  showInstanceDefine=false;

  @ViewChild('first', {static: false})
  public first: ElementRef;

  @ViewChild('second', {static: false})
  public second: ElementRef;

  @ViewChild('third', {static: false})
  public third: ElementRef;

  @ViewChild('fourth', {static: false})
  public fourth: ElementRef;
  subs = new Subscription();
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.subs.add(this.route.queryParams.subscribe(params => {
      if(params['id'] == 'unit-list'){
        setTimeout(()=>{
          this.changeState(2);
        },1)
      }
    }))
  }

  changeState(num: number) {
    if(num==2){
      this.showEducationRate=false;
      this.showField=false;
      this.showInstanceTypeDefine=false;
      this.showInstanceDefine=true;
      this.first.nativeElement.classList.remove('nav-selected');
      this.second.nativeElement.classList.add('nav-selected');
      this.third.nativeElement.classList.remove('nav-selected');
      this.fourth.nativeElement.classList.remove('nav-selected');
    } else if(num==3){
      this.showEducationRate=true;
      this.showField=false;
      this.showInstanceTypeDefine=false;
      this.showInstanceDefine=false;
      this.first.nativeElement.classList.remove('nav-selected');
      this.second.nativeElement.classList.remove('nav-selected');
      this.third.nativeElement.classList.add('nav-selected');
      this.fourth.nativeElement.classList.remove('nav-selected');
    } else if(num==4){
      this.showEducationRate=false;
      this.showField=true;
      this.showInstanceTypeDefine=false;
      this.showInstanceDefine=false;
      this.first.nativeElement.classList.remove('nav-selected');
      this.second.nativeElement.classList.remove('nav-selected');
      this.third.nativeElement.classList.remove('nav-selected');
      this.fourth.nativeElement.classList.add('nav-selected');
    } else {
      this.showEducationRate=false;
      this.showField=false;
      this.showInstanceTypeDefine=true;
      this.showInstanceDefine=false;
      this.first.nativeElement.classList.add('nav-selected');
      this.second.nativeElement.classList.remove('nav-selected');
      this.third.nativeElement.classList.remove('nav-selected');
      this.fourth.nativeElement.classList.remove('nav-selected');
    }

  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
