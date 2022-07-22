import {Component, OnInit, ViewChild} from '@angular/core';
import {ThesisModel} from '../shared/dto/thesis.model';
import {WizardComponent} from 'angular-archwizard';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ThesisService} from '../shared/service/thesis.service';

@Component({
    selector: 'app-thesis-detail',
    templateUrl: './thesis-detail.component.html',
    styleUrls: ['./thesis-detail.component.scss']
})
export class ThesisDetailComponent implements OnInit {

    public thesisId: number;
    showProgress: boolean;
    thesisModel: ThesisModel = {};
    step: number = 1;
    file: { fileType?: string; fileUuid?: string , fileConfirmed?: boolean} = {};
    @ViewChild(WizardComponent, {static: false})
    public wizard: WizardComponent;


    constructor(private route: ActivatedRoute,
                private thesisService: ThesisService,
                private router: Router,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.route.queryParams.subscribe(param => {
                this.thesisId = param['thesisId'];
                if (this.thesisId) {
                    this.thesisService.getThesisModel(this.thesisId).then((result: ThesisModel) => {
                        this.showProgress = false;
                        this.thesisModel = result;
                    }).catch(error => {
                        this.showProgress = false;
                    });
                }
            }
        );
    }

    onThesisInfo(data: any) {
        this.step = 2;
        this.thesisModel = data;
        this.wizard.model.navigationMode.goToNextStep();
    }

    onThesisInvolved(data: any) {
        this.step = 3;
        this.wizard.model.navigationMode.goToNextStep();
        this.thesisModel.thesisInvolvedList = data;
    }

    onThesisUniversity(data: any) {
        this.step = 4;
        this.thesisModel.thesisUniversityDto = data;
        this.wizard.model.navigationMode.goToNextStep();
    }


    onFileInfo(data: any) {
        this.thesisModel.fileUuid = data.fileUuid;
        this.thesisModel.fileType = data.fileType;
        this.thesisModel.fileConfirmed = data.fileConfirmed;
        this.thesisService.saveNewThesisModel(this.thesisModel).then(result => {
            this.toast.success('پایان نامه با موفقیت ذخیره شد');
            this.router.navigate(['/sources/thesis-list'], {relativeTo: this.route.parent});
        }).catch(error => {
            this.toast.error(error.error.message);
        });
    }
}
