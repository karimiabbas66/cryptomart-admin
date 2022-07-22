import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JournalService} from '../shared/service/journal.service';
import {JournalModel} from '../shared/dto/journal.model';
import {ToastrService} from 'ngx-toastr';
import {WizardComponent} from 'angular-archwizard';
import {OwnerModel} from '../shared/dto/owner.model';
import {Contact} from '../../profile/shared/dto/Contact';

@Component({
    selector: 'app-journal-detail',
    templateUrl: './journal-detail.component.html',
    styleUrls: ['./journal-detail.component.scss']
})
export class JournalDetailComponent implements OnInit {

    public journalId: number;
    showProgress: boolean;
    journal: JournalModel = {};
    owners: OwnerModel[] = [];
    step: number = 1;
    @ViewChild(WizardComponent, {static: false})
    public wizard: WizardComponent;

    constructor(private route: ActivatedRoute,
                private journalService: JournalService,
                private router: Router,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(param => {
            this.journalId = param['journalId'];
            if (this.journalId) {
                this.showProgress = true;
                this.journalService.getJournalModel(this.journalId).then((data: JournalModel) => {
                    this.showProgress = false;
                    this.journal = data;
                }).catch(error => {
                    this.showProgress = false;
                });
                this.journalService.getJournalContact(this.journalId).then((data: Contact[]) => {
                    this.journal.contactDtoList = data;
                }).catch(error => {
                    this.showProgress = false;
                });
            }
        });
    }

    onJournalInfo(data: any) {
        this.step = 2;
        this.journal = data;
        this.wizard.model.navigationMode.goToNextStep();
    }

    onJournalOwner(data: any) {
        this.step = 3;
        this.owners = data;
        this.wizard.model.navigationMode.goToNextStep();
        this.journal.owners = data;
    }

    onJournalScore(data: any) {
        this.step = 4;
        this.journal.journalScoreDto = data;
        console.log(this.journal);
        this.wizard.model.navigationMode.goToNextStep();
    }

    onJournalInvolved(data: any) {
        this.step = 5;
        this.journal.resourceInvolveDtoList = data;
        this.journal.journalInvolvedConfirmed = data[0].confirmed;
        this.journalService.saveNewJournalModel(this.journal).then(result => {
            this.toast.success('نشریه با موفقیت ذخیره شد');
            this.router.navigate(['/sources/journal-list'], {relativeTo: this.route.parent});
        }).catch(error => {
            this.toast.error(error.error.message);
        });
    }

}
