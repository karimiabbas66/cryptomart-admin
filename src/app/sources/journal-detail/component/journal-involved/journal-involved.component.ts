import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JournalModel} from '../../../shared/dto/journal.model';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {JournalService} from '../../../shared/service/journal.service';
import {InvolvedTypeModel} from '../../../shared/dto/involved-type.model';
import {ToastrService} from 'ngx-toastr';
import {InvolvedModel} from '../../../shared/dto/involved.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {InvolvedService} from '../../../shared/service/involved.service';
import {AuthorModel} from '../../../shared/dto/author.model';
import {ISubscription} from 'rxjs-compat/Subscription';

@Component({
    selector: 'app-journal-involved',
    templateUrl: './journal-involved.component.html',
    styleUrls: ['./journal-involved.component.scss']
})
export class JournalInvolvedComponent implements OnInit {

    @Input() journal: JournalModel;
    @Output() journalInvolvedEmitter: EventEmitter<any> = new EventEmitter<any>();
    journalInvolvedForm: FormGroup;
    involves: InvolvedModel[] = [];
    showProgress: boolean;
    private ngbModalRef: NgbModalRef;
    involvedCount: number;
    selectedInvolves: InvolvedModel[] = [];
    confirmed: boolean;
    involvedType: InvolvedTypeModel[];
    loading: boolean = false;
    numberOfItemsFromEndBeforeFetchingMore = 2;
    involvesLen: number = 0;
    private _unSubscription: ISubscription;
    selectedTypeList: Array<number>;
    managerType: number = 0;
    editorType: number = 1;

    constructor(private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private journalService: JournalService,
                private involvedService: InvolvedService,
                private change: ChangeDetectorRef,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.involvedService.getInvolvedCount().then((value: number) => {
            this.involvedCount = value;
            this.showProgress = false;
        }).catch(error => {
            this.showProgress = false;
        });

        this.searchInvolves(null);
        this.getInvolvedType();

        this.journalInvolvedForm = this.formBuilder.group({
            involves: this.formBuilder.array([this.createInvolvedFormGroup()])
        });

        if (this.journal != null) {
            this.showProgress = true;
            this.involvedService.getAllByJournalId(this.journal.id).then((res: InvolvedModel[]) => {
                this.selectedInvolves = res;
                this.confirmed = res[0].confirmed;
                this.selectedInvolves = res.map((i) => {
                    i.fullName = !i.profileId ? i.firstName + ' ' + i.lastName : i.firstName + ' ' + i.lastName + ' (کاربر کریپتومارت)';
                    return i;
                });
                const formArray = this.journalInvolvedForm.get('involves') as FormArray;
                this.showProgress = false;
                for (let v of this.selectedInvolves) {
                    let involved: InvolvedModel = {
                        fullName: v.fullName, lastName: v.lastName, firstName: v.firstName,
                        involveId: v.involveId, involveTypeId: v.involveTypeId, involveTypeName: v.involveTypeName
                    };

                    let involvedType: InvolvedTypeModel = {id: v.involveTypeId, title: v.involveTypeName};
                    formArray.push(this.createEditInvolvedFormGroup(involved, involvedType));
                }
                this.removeOrClearForm(0);
            }).catch(error => {
                this.showProgress = false;
            })
        }

    }

    private createInvolvedFormGroup(): FormGroup {
        const formGroup = new FormGroup({
            involve: new FormControl('', [Validators.required]),
            involveType: new FormControl('', [Validators.required]),
        });
        formGroup.reset();
        return formGroup;
    }

    private createEditInvolvedFormGroup(involve: InvolvedModel, involveType: InvolvedTypeModel): FormGroup {
        const formGroup = new FormGroup({
            involve: new FormControl('', [Validators.required]),
            involveType: new FormControl('', [Validators.required]),
        });
        let formValue = {involve: involve, involveType: involveType};
        formGroup.get('involves');
        formGroup.patchValue(formValue);
        return formGroup;
    }

    public addFormGroup() {
        const formArray = this.journalInvolvedForm.get('involves') as FormArray;
        formArray.push(this.createInvolvedFormGroup())
    }

    public removeOrClearForm(i: number) {
        const formArray = this.journalInvolvedForm.get('involves') as FormArray;
        if (formArray.length > 1) {
            formArray.removeAt(i)
        } else {
            formArray.reset()
        }
    }

    get formData(): FormArray {
        return this.journalInvolvedForm.get('involves') as FormArray;
    }

    getNewInvolved(receivedEntry) {
        receivedEntry.fullName = receivedEntry.firstName + ' ' + receivedEntry.lastName;
        this.involves = this.involves.concat(receivedEntry);
        this.ngbModalRef.close();
    }

    // private createFormForModal(involve: InvolvedModel): FormGroup {
    //     const formGroup = new FormGroup({
    //         involve: new FormControl('', [Validators.required]),
    //         involveType: new FormControl('', [Validators.required]),
    //     });
    //     let formValue = {involve: involve};
    //     formGroup.get('involves');
    //     formGroup.patchValue(formValue);
    //     return formGroup;
    //     console.log('omad:::', formGroup);
    // }

    private getInvolvedType() {
        this.involvedService.getAllInvolvedType(0, 10).then(res => {
            this.involvedType = res;
        })
    }

    onScrollToEnd() {
        this.searchInvolves(null);
    }

    onScroll({end}) {
        if (this.loading || this.involves.length <= this.involvedCount) {
            return;
        }

        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.involvedCount) {
            this.searchInvolves(null);
        }
    }

    searchInvolves(event) {
        if (event == null && this.involvesLen * 10 >= this.involvedCount) {
            return;
        }
        this.involvedService.getAllInvolved(this.involvesLen, 10)
            .then((res: AuthorModel[]) => {
                let aut = res.map((i) => {
                    i.fullName = !i.profileId ? i.firstName + ' ' + i.lastName : i.firstName + ' ' + i.lastName + ' (کاربر کریپتومارت)';
                    return i;
                });
                if (event == null) {
                    this.involves = this.involves.concat(aut);
                } else {
                    this.involves = aut;
                }
                this.change.detectChanges();
                this.involvesLen += 1;
            }).catch(error => {
            this.toastr.error(error.error.message);
        })
    }

    addInvolves() {
        this.selectedInvolves = [];
        const formArray = this.journalInvolvedForm.get('involves') as FormArray;
        for (let v of formArray.getRawValue()) {
            this.selectedInvolves.push({
                involveId: v.involve.id, involveTypeId: v.involveType.id,
                fullName: v.involve.fullName, confirmed: this.confirmed
            })
        }
        if (this.selectedInvolves) {
            this.selectedTypeList = this.selectedInvolves.map(value => value.involveTypeId);
            if (this.selectedTypeList.includes(this.editorType) && this.selectedTypeList.includes(this.managerType)) {
                this.journalInvolvedEmitter.emit(this.selectedInvolves)
            } else {
                this.toastr.warning('مدیر مسئول و سردبیر را وارد کنید')
            }
        }
    }

    openModal(accessPage) {
        this.ngbModalRef = this.modalService.open(accessPage, {size: 'lg', backdrop: 'static'});
        this.ngbModalRef.result.then((receivedEntry) => {
            this.ngbModalRef.close();
        }, (reason) => {
            this.ngbModalRef.close();
        })
    }

    ngOnDestroy(): void {
        if (this._unSubscription) {
            this._unSubscription.unsubscribe();
        }
    }

}
