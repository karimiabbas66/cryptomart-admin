import { Component, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import {Router} from '@angular/router';
import {InboxService} from '../../communication/shared/service/inbox.service';
import {InboxInfoSummary} from '../../communication/shared/dto/inbox.info.summary';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  currentLang = "fa";
  toggleClass = "ft-maximize";
  inboxMeta: InboxInfoSummary[]=[];
  placement = "bottom-right";
  public isCollapsed = true;
  layoutSub: Subscription;
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();

  bgColor = "white";
  public config: any = {};
  inboxCount: any;

  constructor(public translate: TranslateService, private inboxService: InboxService, private router: Router, private layoutService: LayoutService, private configService:ConfigService) {
    // const browserLang: string = translate.getBrowserLang();

    this.layoutSub = layoutService.customizerChangeEmitted$.subscribe(
        options => {
          if (options) {
            if (options.bgColor) {
              this.bgColor = options.bgColor;
            }
          }
        }
    );

    const browserLang: string = "fa";
    translate.use(browserLang.match(/fa|en|es|pt|de/) ? browserLang : "fa");

    this.layoutSub = layoutService.changeEmitted$.subscribe(
      direction => {
        const dir = direction.direction;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        } else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
      });
  }

  ngOnInit() {
    this.inboxCount=10;
    this.config = this.configService.templateConf;
    let x1:InboxInfoSummary={};
    x1.id=10;
    x1.title='تست دیتای سایت1';
    x1.typeId=1;

    let x2:InboxInfoSummary={};
    x2.id=120;
    x2.title='تست دیتای سایت1';
    x2.typeId=2;

    let x3:InboxInfoSummary={};
    x3.id=10;
    x3.title='تست دیتای سایت';
    x3.typeId=3;

    let x4:InboxInfoSummary={};
    x4.id=91;
    x4.title='تست دیتای سایت';
    x4.typeId=3;
    this.inboxMeta.push(x1)
    this.inboxMeta.push(x2)
    this.inboxMeta.push(x3)
    // this.inboxMeta.push(x4)
  }

  ngAfterViewInit() {
    if(this.config.layout.dir) {
      setTimeout(() => {
        const dir = this.config.layout.dir;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        } else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
      }, 0);
     
    }
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  ChangeLanguage(language: string) {
    this.translate.use(language);
  }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }

  toggleNotificationSidebar() {
    this.layoutService.emitNotiSidebarChange(true);
  }

  toggleSidebar() {
    const appSidebar = document.getElementsByClassName("app-sidebar")[0];
    if (appSidebar.classList.contains("hide-sidebar")) {
      this.toggleHideSidebar.emit(false);
    } else {
      this.toggleHideSidebar.emit(true);
    }
  }

    goOut() {
        localStorage.removeItem('JWT_TOKEN');
        this.router.navigate(['pages/login'])
    }
}
