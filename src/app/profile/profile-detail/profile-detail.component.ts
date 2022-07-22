import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-profile-detail',
    templateUrl: './profile-detail.component.html',
    styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {
    public id: number;
    public eduType= 1;
    public nav: number
    eduEvent: {nav?:number}={};

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.id = this.route.snapshot.queryParams.id;

        this.eduType = this.route.snapshot.queryParams.eduType;
        if (this.eduType && this.eduType == 1) {
            this.eduEvent = {nav: 2};
            // this.changeNavigationTab({nav: 3})
        } else if (this.eduType && this.eduType == 2) {
            this.eduEvent = {nav: 3};
            // this.changeNavigationTab({nav: 3})
        } else {
            this.eduEvent = {nav: 1};
        }
    }

    changeNavigationTab(event) {
        console.log(event)
        this.nav = event.nav;
    }
}
