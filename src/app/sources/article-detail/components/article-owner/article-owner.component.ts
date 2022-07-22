import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {OwnerService} from '../../../shared/service/owner.service';
import {OwnerModel} from '../../../shared/dto/owner.model';
import {ISubscription} from 'rxjs-compat/Subscription';
import {FileInfoModel} from '../../../../shared/model/file-info.model';
import {FileManagerService} from '../../../../shared/file-manager.service';
import {saveAs} from 'file-saver';
import {ArticleModel} from '../../../shared/dto/article.model';

@Component({
    selector: 'app-article-owner',
    templateUrl: './article-owner.component.html',
    styleUrls: ['./article-owner.component.scss']
})
export class ArticleOwnerComponent implements OnInit, OnDestroy {
    public ownerForm: FormGroup;

    editable: boolean = true;
    ownersCount: number;
    selectedOwner: OwnerModel[];
    owners: OwnerModel[] = [];
    loading: boolean = false;
    test: any;
    @Output()
    ownerInfoEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Input() public article: ArticleModel;
    private _unSubscription: ISubscription;
    _allOwners?: OwnerModel[] = [];
    private modalRef: NgbModalRef;
    confirmed: boolean;
    fileUuid: string;
    map: Map<number, string> = new Map();

    constructor(private formBuilder: FormBuilder,
                private modalService: NgbModal,
                public fileManagerService: FileManagerService,
                private ownerService: OwnerService,
                private toastr: ToastrService) {

    }

    ngOnInit() {
    }

    public stepEnter() {
        this.ownerForm = this.formBuilder.group({
            owners: this.formBuilder.array([this.createAuthorFormGroup()])
        });

        this.ownerService.getAllOwnerCount().then((value: number) => {
            this.ownersCount = value;
        });

        if (this.article != null && this.article.id != null) {
            this.ownerService.getAllArticleByArticleId(this.article.id).then((res: OwnerModel[]) => {
                this.confirmed = res[0].ownerConfirmed;
                const formArray = this.ownerForm.get('owners') as FormArray;
                for (let i = 0; i < res.length; i++) {
                    formArray.push(this.createEditOwnerFormGroup(res[i]));
                    this.map.set(i, res[i].fileUuid);
                }
                this.removeOrClearForm(0);
            });
        } else {
            const formArray = this.ownerForm.get('owners') as FormArray;
            this._allOwners.filter(own => own.ownerType);
            for (let owner of this._allOwners) {
                formArray.push(this.createEditOwnerFormGroup(owner));
            }
            this.removeOrClearForm(0);
        }

    }

    get formData(): FormArray {
        return this.ownerForm.get('owners') as FormArray;
    }

    private createAuthorFormGroup(): FormGroup {
        const formGroup = new FormGroup({
            owner: new FormControl({value: '', disabled: true}),
            ownerType: new FormControl({value: '', disabled: true}),
        });
        formGroup.reset();
        return formGroup;
    }

    addAuthors() {
        this.selectedOwner = [];
        const formArray = this.ownerForm.get('owners') as FormArray;
        for (let i = 0; i < formArray.getRawValue().length; i++) {
            let v = formArray.getRawValue()[i];
            v.owner.confirmed = this.confirmed;
            v.owner.fileUuid = this.map.get(i);
            this.selectedOwner.push(v.owner)
        }
        this.ownerInfoEmitter.emit(this.selectedOwner)
    }

    private createEditOwnerFormGroup(owner: OwnerModel): FormGroup {
        const formGroup = new FormGroup({
            owner: new FormControl({value: '', disabled: true}),
            ownerType: new FormControl({value: '', disabled: true}),
            // ownerFile: new FormControl(),
        });
        let type: string;
        if (owner.authorId) {
            type = 'نوبسنده';
        } else if (owner.organizationId) {
            type = 'سازمان';
        } else if (owner.profileId) {
            type = 'کاربر';
        } else if (owner.publisherId) {
            type = 'ناشر';
        }

        let formValue = {owner: owner, ownerType: type};
        formGroup.get('owners');
        formGroup.patchValue(formValue);
        return formGroup;
    }

    public removeOrClearForm(i: number) {
        const formArray = this.ownerForm.get('owners') as FormArray;
        if (formArray.length > 1) {
            formArray.removeAt(i)
        } else {
            formArray.reset()
        }
    }

    openModal(accessPage) {
        this.modalRef = this.modalService.open(accessPage, {size: 'lg', backdrop: 'static'});
        this.modalRef.result.then((receivedEntry) => {
            console.log('amad inja')
            this.modalRef.close();
        }, (reason) => {
            this.modalRef.close();
        })
    }

    getNewAuthor(receivedEntry) {
        let duplicateOwner: OwnerModel = this._allOwners.find(own => own.organizationId === receivedEntry.id && own.ownerType == 2);
        if (!duplicateOwner) {
            let selectedOrg: OwnerModel = {fullName: receivedEntry.name, ownerType: 2, organizationId: receivedEntry.id}
            this._allOwners = this._allOwners.concat(selectedOrg);
            const formArray = this.ownerForm.get('owners') as FormArray;
            formArray.push(this.createEditOwnerFormGroup(selectedOrg));
        }
        this.modalRef.close();
    }

    @Input() set allOwners(value: OwnerModel[]) {
        this._allOwners = value;
        this.stepEnter();
    }

    get allOwners(): OwnerModel[] {
        return this._allOwners;
    }

    getProfile(receivedEntry: any) {
        let duplicateOwner: OwnerModel = this._allOwners.find(own => own.profileId === receivedEntry.id && own.ownerType == 2);
        if (!duplicateOwner) {
            let selectedOrg: OwnerModel = {
                fullName: receivedEntry[0].firstName + ' ' + receivedEntry[0].lastName, ownerType: 2,
                profileId: receivedEntry[0].id
            };
            this._allOwners = this._allOwners.concat(selectedOrg);
            const formArray = this.ownerForm.get('owners') as FormArray;
            formArray.push(this.createEditOwnerFormGroup(selectedOrg));
        }
        this.modalRef.close();
    }

    afterUploadArticleFile(event, i: number) {
        this.map.set(i, event);
    }

    goForDownload(i: number) {
        let uuid: string = this.map.get(i);
        if (uuid) {
            let fileItem;
            this.fileManagerService.findByUUID(uuid).then((res: FileInfoModel) => {
                fileItem = res;
                if (res.uuid) {
                    this.fileManagerService.getImage(uuid).subscribe(res => {
                        saveAs(res, fileItem.fileName);
                    })
                } else {
                    this.toastr.error('فایل وجود ندارد');
                }
            });
        } else {
            this.toastr.error('فایل وجود ندارد');
        }
    }

    ngOnDestroy(): void {
        if (this._unSubscription) {
            this._unSubscription.unsubscribe();
        }
    }
}

