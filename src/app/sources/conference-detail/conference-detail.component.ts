import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConferenceModel} from '../shared/dto/conference.model';
import {ConferenceService} from '../shared/service/conference.service';
import {AppSettings} from '../../pages/shared/AppSettings';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileManagerService} from '../../shared/file-manager.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {OrganizationModel} from '../../organization-management/shared/dto/organization.model';
import {OrganizationService} from '../../organization-management/shared/service/organization.service';
import {ConferenceOrganizationModel} from '../shared/dto/conference-organization.model';

@Component({
    selector: 'app-conference-detail',
    templateUrl: './conference-detail.component.html',
    styleUrls: ['./conference-detail.component.scss']
})
export class ConferenceDetailComponent implements OnInit {
    conferenceForm: FormGroup;
    organizationForm: FormGroup;
    organizations: OrganizationModel[] = [];
    numberOfItemsFromEndBeforeFetchingMore = 2;
    loading: boolean = false;
    organizationsCount: number;
    orgLen: number = 0;
    searchTerm: string;
    conference: ConferenceModel = {};
    selectedOrganizations: ConferenceOrganizationModel[] = [];
    showProgress: boolean;
    public conferenceId: number;
    conferenceSubjects: any[] = [];
    uploadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';

    constructor(private conferenceService: ConferenceService,
                private organizationService: OrganizationService,
                private router: Router,
                private route: ActivatedRoute,
                private ngbModal: NgbModal,
                private fileManagerService: FileManagerService,
                private formBuilder: FormBuilder,
                private change: ChangeDetectorRef,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.conferenceId = params['conferenceId'];
            this.organizationService.getAllOrganizationCount().then(result => {
                this.organizationsCount = result;
            }).catch(error => {
                this.showProgress = false;
            });
            this.searchOrganization(null);

            this.conferenceForm = this.formBuilder.group({
                title: new FormControl('', [Validators.required]),
                conferenceDate: new FormControl('', [Validators.required]),
                conferenceNumber: new FormControl(''),
                conferenceCityPlace: new FormControl(''),
                conferenceStatePlace: new FormControl(''),
                link: new FormControl(''),
                picture: new FormControl(''),
                conferenceSubjects: new FormControl(''),
            });
            this.organizationForm = this.formBuilder.group({
                organization: this.formBuilder.array([this.createOrganizationForm()])
            });
            if (this.conferenceId) {
                this.showProgress = true;
                this.conferenceService.getConferenceById(this.conferenceId).then((result: ConferenceModel) => {
                    this.conference = result;
                    this.selectedOrganizations = result.conferenceOrgDtoList;
                    this.showProgress = false;
                    const formArray = this.organizationForm.get('organization') as FormArray;
                    for (let v of this.selectedOrganizations) {
                        console.log('selected:::::::::', this.selectedOrganizations);
                        let org: OrganizationModel = {
                            id: v.organizationId, name: v.organizationName
                        };
                        formArray.push(this.createEditOrganizationFormGroup(org));
                    }
                    this.removeOrganizationForm(0);
                }).catch(error => {
                    this.showProgress = false;
                });
            }
        });
    }

    private createOrganizationForm(): FormGroup {
        const formGroup = new FormGroup({
            organizationId: new FormControl('')
        });
        formGroup.reset();
        return formGroup;
    }

    private createEditOrganizationFormGroup(organization: OrganizationModel): FormGroup {
        const formGroup = new FormGroup({
            organizationId: new FormControl('')
        });
        console.log('vorodi;;;;;;;;;;;', organization);
        let formValue = {organizationId: organization};
        console.log('formesh;;;;;;;;;;', formValue);
        formGroup.get('organization');
        formGroup.patchValue(formValue);
        console.log('groupesj;;;;;;;;;', formGroup);
        return formGroup;
    }

    public addOrganizationFormGroup() {
        const formArray = this.organizationForm.get('organization') as FormArray;
        formArray.push(this.createOrganizationForm())
    }

    get formData(): FormArray {
        return this.organizationForm.get('organization') as FormArray;
    }

    public removeOrganizationForm(i: number) {
        const formArray = this.organizationForm.get('organization') as FormArray;
        if (formArray.length > 1) {
            formArray.removeAt(i)
        } else {
            formArray.reset()
        }
    }

    searchOrganization(event) {
        if (event == null && this.orgLen * 10 >= this.organizationsCount) {
            return;
        }
        if (event != null) {
            this.searchTerm = event.term;
            this.orgLen = 0;
        }
        this.organizationService.getAllOrganization(this.orgLen, 10, this.searchTerm != null ? this.searchTerm : null)
            .then((result: OrganizationModel[]) => {
                if (event == null) {
                    this.organizations = this.organizations.concat(result);
                } else {
                    this.organizations = result;
                }
                this.change.detectChanges();
                this.orgLen += 1;
            }).catch(error => {
            this.toast.error(error.error.message);
        })
    }

    onScroll({end}) {
        if (this.loading || this.organizations.length <= this.organizationsCount) {
            return;
        }
        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.organizationsCount) {
            this.searchOrganization(null);
        }
    }

    onScrollToEnd() {
        this.searchOrganization(null);
    }

    setUpdateDate(event: any) {
        this.conference.conferenceDate = event
    }

    removeConferencePicture() {
        this.conference.picture = null;
    }

    openChangeImageDialog(content) {
        this.ngbModal.open(content, {size: 'lg', backdrop: 'static'}).result.then(res => {
        }, reason => {
            this.ngbModal.dismissAll();
        });
    }

    setConferencePicture(event: any) {
        this.fileManagerService.saveBASE64File(event).then(result => {
            this.conference.picture = result;
        }).catch(error => {
            this.toast.error(error.error.message);
        });
    }

    save() {
        this.conference.conferenceSubjects = this.conferenceSubjects.map(key => key.value);
        this.organizations = [];
        const formArray = this.organizationForm.get('organization') as FormArray;
        for (let v of formArray.getRawValue()) {
            this.selectedOrganizations.push({
                organizationId: v.organizationId.id, organizationName: v.organizationId.name
            });
        }
        this.conference.conferenceOrgDtoList = this.selectedOrganizations;
        this.conferenceService.saveNewConference(this.conference).then((result: ConferenceModel) => {
            this.toast.success('کنفرانس با موفقیت ذخیره شد');
            this.router.navigate(['/sources/conference-list'], {relativeTo: this.route.parent});
        }).catch(error => {
            this.toast.error(error.error.message);
        });
    }
}
