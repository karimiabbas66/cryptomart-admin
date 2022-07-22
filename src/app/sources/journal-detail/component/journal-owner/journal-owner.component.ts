import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OwnerModel} from '../../../shared/dto/owner.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OwnerService} from '../../../shared/service/owner.service';
import {JournalModel} from '../../../shared/dto/journal.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-journal-owner',
    templateUrl: './journal-owner.component.html',
    styleUrls: ['./journal-owner.component.scss']
})
export class JournalOwnerComponent implements OnInit {

    @Input() public journal: JournalModel;
    ownerForm: FormGroup;
    personOwner?: OwnerModel = {};
    journalOwner?: OwnerModel[] = [];
    @Output() journalOwnerEmitter: EventEmitter<any> = new EventEmitter<any>();
    private modalRef: NgbModalRef;
    ownersType: string;
    ownersCount?: number;


    constructor(private formBuilder: FormBuilder,
                private ownerService: OwnerService,
                private modalService: NgbModal,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.ownerForm = this.formBuilder.group({
            ownerName: new FormControl('', [Validators.required]),
            ownerLastName: new FormControl('', [Validators.required]),
        });
        if (this.journal && this.journal.id) {
            this.ownerService.getByJournalId(this.journal.id).then((result: OwnerModel[]) => {
                this.journalOwner = result;
                if (this.journalOwner.length > 0) {
                    this.journalOwner.forEach(owner => {
                        if (owner.profileId) {
                            this.ownersType = 'کاربر';
                        } else if (owner.organizationId) {
                            this.ownersType = 'سازمان';
                        } else {
                            this.ownersType = 'عادی';
                        }
                    });
                }
            });
        }
    }

    private removeOwnerOrg(i: number) {
        this.journalOwner.forEach((owner, index) => {
            if (owner.organizationId === i) {
                this.journalOwner.splice(index, 1);
            }
        });
    }

    private removeOwnerProfile(i: string) {
        this.journalOwner.forEach((owner, index) => {
            if (owner.profileId === i) {
                this.journalOwner.splice(index, 1);
            }
        });
    }

    private removeOwnerPerson(i: string) {
        this.journalOwner.forEach((owner, index) => {
            if (owner.fullName === i) {
                this.journalOwner.splice(index, 1);
            }
        });
    }

    openModal(accessPage) {
        this.modalRef = this.modalService.open(accessPage, {size: 'lg', backdrop: 'static'});
        this.modalRef.result.then((receivedEntry) => {
            this.modalRef.close();
        }, (reason) => {
            this.modalRef.close();
        })
    }

    getOrganization(receivedEntry) {
        let selectedOrg: OwnerModel = {fullName: receivedEntry.name, ownerType: 1, organizationId: receivedEntry.id};

        let unique = this.journalOwner.find(own => own.organizationId === receivedEntry.id && own.ownerType == 1);
        if (!unique) {
            this.journalOwner.push(selectedOrg);
        } else {
            this.toast.error('صاحب امتیاز وارد شده تکراری است');
        }
        this.modalRef.close();
    }

    getProfile(receivedEntry: any) {
        let selectedUser: OwnerModel = {
            fullName: receivedEntry[0].firstName + ' ' + receivedEntry[0].lastName, ownerType: 2, profileId: receivedEntry[0].id
        };
        let unique = this.journalOwner.find(own => own.profileId === receivedEntry[0].id && own.ownerType == 2);
        if (!unique) {
            this.journalOwner.push(selectedUser);
        } else {
            this.toast.error('صاحب امتیاز وارد شده تکراری است');
        }

    }

    getPerson(receivedEntry: any) {
        let selector: OwnerModel = {
            fullName: this.personOwner.firstName + ' ' + this.personOwner.lastName, ownerType: 3
        };
        this.journalOwner.push(selector);
        this.modalRef.close();
        this.ownerForm.reset();
        // let unique = this.journalOwner.find(own => own.fullName === receivedEntry.firstName && own.ownerType == 3);
        // if (!unique) {
        // } else {
        //     this.toast.error('صاحب امتیاز وارد شده تکراری است');
        // }
    }

    openPersonModal(accessPage) {
        this.modalRef = this.modalService.open(accessPage, {size: 'lg', backdrop: 'static'});
        this.modalRef.result.then((receivedEntry) => {
            this.modalRef.close();
        }, (reason) => {
            this.modalRef.close();
        })
    }

    addOwners() {
        this.journalOwnerEmitter.emit(this.journalOwner)
    }

    findType(owner: OwnerModel): any {
        if (owner.profileId) {
            return 'کاربر';
        } else if (owner.organizationId) {
            return 'سازمان';
        } else {
            return 'عادی';
        }
    }
}


// openPersonModal(accessPage) {
//     this.modalRef = this.modalService.open(accessPage, {size: 'lg', backdrop: 'static'});
//     this.modalRef.result.then((res) => {
//         this.modalRef.close()
//     }).catch(reason => {
//         this.modalRef.close();
//     })
// }


// this.journalOwner = [];
// const formArray = this.ownerForm.get('owners') as FormArray;
// for (let i = 0; i < formArray.getRawValue().length; i++) {
//     let v = formArray.getRawValue()[i];
//     this.journalOwner.push(v.owner)
// }


// get formData(): FormArray {
//     return this.ownerForm.get('owners') as FormArray;
// }
// const formArray = this.ownerForm.get('owners') as FormArray;
// this.ownerForm = this.formBuilder.group({
//     owners: this.formBuilder.array([this.createOwnerFormGroup()])
// });

// for (let i = 0; i < result.length; i++) {
//     formArray.push(this.createEditOwnerFormGroup(result[i]));
// }
// this.removeForm(0);


// private createOwnerFormGroup(): FormGroup {
//     const formGroup = new FormGroup({
//         owner: new FormControl(''),
//         ownerType: new FormControl({value: '', disabled: true}),
//     });
//     formGroup.reset();
//     return formGroup;
// }


// private createEditOwnerFormGroup(owner: OwnerModel): FormGroup {
//     const formGroup = new FormGroup({
//         owner: new FormControl(''),
//         ownerType: new FormControl({value: '', disabled: true}),
//     });
//     let ownerType: string;
//     if (owner.organizationId) {
//         ownerType = 'سازمان';
//     } else if (owner.profileId) {
//         ownerType = 'کاربر';
//     }
//     let formValue = {owner: owner.fullName, ownerType: ownerType};
//     formGroup.get('owners');
//     formGroup.patchValue(formValue);
//     return formGroup;
// }
