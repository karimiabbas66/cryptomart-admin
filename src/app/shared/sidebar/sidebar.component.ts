import {Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, Renderer2, AfterViewInit} from '@angular/core';

import {ROUTES} from './sidebar-routes.config';
import {RouteInfo} from './sidebar.metadata';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {customAnimations} from '../animations/custom-animations';
import {ConfigService} from '../services/config.service';
import {LayoutService} from '../services/layout.service';
import {Subscription} from 'rxjs';
import {UserAccessService} from '../../leader-management/shared/service/UserAccessService';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    animations: customAnimations
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('toggleIcon', {static: false}) toggleIcon: ElementRef;
    public menuItems: any[];
    depth: number;
    activeTitle: string;
    activeTitles: string[] = [];
    expanded: boolean;
    nav_collapsed_open = false;
    logoUrl = 'assets/img/logo.png';
    public config: any = {};
    layoutSub: Subscription;


    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private router: Router,
        private route: ActivatedRoute,
        private userAccessService: UserAccessService,
        public translate: TranslateService,
        private configService: ConfigService,
        private layoutService: LayoutService
    ) {
        if (this.depth === undefined) {
            this.depth = 0;
            this.expanded = true;
        }

        this.layoutSub = layoutService.customizerChangeEmitted$.subscribe(
            options => {
                if (options) {
                    if (options.bgColor) {
                        if (options.bgColor === 'white') {
                            this.logoUrl = 'assets/img/logo-dark.png';
                        } else {
                            this.logoUrl = 'assets/img/logo.png';
                        }
                    }

                    if (options.compactMenu === true) {
                        this.expanded = false;
                        this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
                        this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
                        this.nav_collapsed_open = true;
                    } else if (options.compactMenu === false) {
                        this.expanded = true;
                        this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
                        this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
                        this.nav_collapsed_open = false;
                    }

                }
            });

    }


    ngOnInit() {
        this.userAccessService.getAllPageAccessByUserId().then(value => {
            this.config = this.configService.templateConf;
            ROUTES.forEach(value1=>{
                if(value.indexOf(value1.id) !== -1){
                    value1.active=true;
                } else {
                    value1.active=false;
                }
            })
            this.menuItems = ROUTES;
            for (let i = 0; i < this.menuItems.length; i++) {
                this.menuItems[i].submenu.forEach(sub => {
                    var idx = value.indexOf(sub.id);
                    if (idx == -1) {
                        var jj = this.menuItems[i].submenu.indexOf(sub)
                        this.menuItems[i].submenu[jj].active=false;
                    } else {
                        var j = this.menuItems[i].submenu.indexOf(sub)
                        this.menuItems[i].submenu[j].active=true;
                    }

                })
            }
            this.menuItems.forEach(item=>{
                let x=0;
                item.submenu.forEach(sub=>{
                    if(sub.active){
                        x++;
                    }
                })
                item.badge=x.toString();
            });

            if (this.config.layout.sidebar.backgroundColor === 'white') {
                this.logoUrl = 'assets/img/logo-dark.png';
            } else {
                this.logoUrl = 'assets/img/logo.png';
            }
            setTimeout(() => {
                if (this.config.layout.sidebar.collapsed != undefined) {
                    if (this.config.layout.sidebar.collapsed === true) {
                        this.expanded = false;
                        this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
                        this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
                        this.nav_collapsed_open = true;
                    } else if (this.config.layout.sidebar.collapsed === false) {
                        this.expanded = true;
                        this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
                        this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
                        this.nav_collapsed_open = false;
                    }
                }
            }, 1);
        })


    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        if (this.layoutSub) {
            this.layoutSub.unsubscribe();
        }
    }

    toggleSlideInOut() {
        this.expanded = !this.expanded;
    }

    handleToggle(titles) {
        this.activeTitles = titles;
    }

    // NGX Wizard - skip url change
    ngxWizardFunction(path: string) {
        if (path.indexOf('forms/ngx') !== -1) {
            this.router.navigate(['forms/ngx/wizard'], {skipLocationChange: false});
        }
    }
}
