import {Component, OnInit, ViewChild} from '@angular/core';
import {MagazineModel} from '../shared/dto/magazine.model';
import {Contact} from '../../profile/shared/dto/Contact';
import {ActivatedRoute, Router} from '@angular/router';
import {MagazineService} from '../shared/service/magazine.service';
import {WizardComponent} from 'angular-archwizard';
import {OwnerModel} from '../shared/dto/owner.model';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-magazine-detail',
    templateUrl: './magazine-detail.component.html',
    styleUrls: ['./magazine-detail.component.scss']
})
export class MagazineDetailComponent implements OnInit {

    public magazineId: number;
    step: number = 1;
    showProgress: boolean;
    magazineModel: MagazineModel = {};
    owners: OwnerModel[] = [];
    @ViewChild(WizardComponent, {static: false})
    public wizard: WizardComponent;

    constructor(private route: ActivatedRoute,
                private magazineService: MagazineService,
                private toast: ToastrService,
                private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(param => {
            this.magazineId = param['magazineId'];
            if (this.magazineId) {
                this.showProgress = true;
                this.magazineService.getMagazineModel(this.magazineId).then((data: MagazineModel) => {
                    this.showProgress = false;
                    this.magazineModel = data;
                }).catch(error => {
                    this.showProgress = false;
                });
                this.magazineService.getMagazineContact(this.magazineId).then((data: Contact[]) => {
                    this.magazineModel.contactDtoList = data;
                }).catch(error => {
                    this.showProgress = false;
                });
            }
        });

    }

    onMagazineInfo(data: any) {
        this.step = 2;
        this.magazineModel = data;
        this.wizard.model.navigationMode.goToNextStep();
    }


    onMagazineOwner(data) {
        this.step = 3;
        this.owners = data;
        this.wizard.model.navigationMode.goToNextStep();
        this.magazineModel.owners = data;

    }

    onMagazineInvolved(data) {
        this.step = 4;
        this.magazineModel.resourceInvolveDtoList = data;
        this.magazineModel.magazineInvolveConfirmed = data[0].confirmed;
        this.magazineService.saveNewMagazineModel(this.magazineModel).then(result => {
            this.toast.success('مجله با موفقیت ذخیره شد');
            this.router.navigate(['/sources/magazine-list'], {relativeTo: this.route.parent});
        }).catch(error => {
            this.toast.error(error.error.message);
        });

    }
}


