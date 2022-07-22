import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {TimelineElement} from '../../../pages/full-pages/timeline/horizontal/component/timeline-element';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar-profile',
  templateUrl: './navbar.profile.component.html',
  styleUrls: ['./navbar.profile.component.scss']
})
export class NavbarProfileComponent implements OnInit {

  @Input() profileId: number;
  @Output() changeTage = new EventEmitter<{nav : number}>()

  @ViewChild('first', {static: false})
  public first: ElementRef;

  @ViewChild('second', {static: false})
  public second: ElementRef;

  @ViewChild('third', {static: false})
  public third: ElementRef;

  @Input()
  set eduType(event) {
    setTimeout(()=>{
      this.navigation(event.nav);
    },1)
  }

  constructor(private router: Router) { }

  ngOnInit() {
    this.changeTage.emit({
      nav: 1,
    })
  }

  navigation(num: number) {
    if(num==2){
      this.first.nativeElement.classList.remove('nav-selected');
      this.second.nativeElement.classList.add('nav-selected');
      this.third.nativeElement.classList.remove('nav-selected');
    } else if(num==3){
      this.first.nativeElement.classList.remove('nav-selected');
      this.second.nativeElement.classList.remove('nav-selected');
      this.third.nativeElement.classList.add('nav-selected');
    } else {

      this.router.navigate(['/profile/profile-detail'],{queryParams: {id: this.profileId}});
      this.first.nativeElement.classList.add('nav-selected');
      this.second.nativeElement.classList.remove('nav-selected');
      this.third.nativeElement.classList.remove('nav-selected');
    }
    this.changeTage.emit({
      nav: num,
    })
  }

}
