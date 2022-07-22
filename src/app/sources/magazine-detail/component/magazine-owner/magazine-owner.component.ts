import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OwnerModel} from '../../../shared/dto/owner.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {MagazineModel} from '../../../shared/dto/magazine.model';
import {OwnerService} from '../../../shared/service/owner.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-magazine-owner',
    templateUrl: './magazine-owner.component.html',
    styleUrls: ['./magazine-owner.component.scss']
})
export class MagazineOwnerComponent implements OnInit {


    @Input() public magazine: MagazineModel;
    @Output() magazineOwnerEmitter: EventEmitter<any> = new EventEmitter<any>();
    ownerForm: FormGroup;
    personOwner?: OwnerModel = {};
    magazineOwner?: OwnerModel[] = [];
    private modalRef: NgbModalRef;
    ownersType: string;

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
        if (this.magazine && this.magazine.id) {
            this.ownerService.getByMagazineId(this.magazine.id).then((result: OwnerModel[]) => {
                this.magazineOwner = result;
                if (this.magazineOwner.length > 0) {
                    this.magazineOwner.forEach(owner => {
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
        this.magazineOwner.forEach((owner, index) => {
            if (owner.organizationId === i) {
                this.magazineOwner.splice(index, 1);
            }
        });
    }

    private removeOwnerProfile(i: string) {
        this.magazineOwner.forEach((owner, index) => {
            if (owner.profileId === i) {
                this.magazineOwner.splice(index, 1);
            }
        });
    }

    private removeOwnerPerson(i: string) {
        this.magazineOwner.forEach((owner, index) => {
            if (owner.fullName === i) {
                this.magazineOwner.splice(index, 1);
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

        let unique = this.magazineOwner.find(own => own.organizationId === receivedEntry.id && own.ownerType == 1);
        if (!unique) {
            this.magazineOwner.push(selectedOrg);
        } else {
            this.toast.error('صاحب امتیاز وارد شده تکراری است');
        }
        this.modalRef.close();
    }

    getProfile(receivedEntry: any) {
        let selectedUser: OwnerModel = {
            fullName: receivedEntry[0].firstName + ' ' + receivedEntry[0].lastName, ownerType: 2, profileId: receivedEntry[0].id
        };
        let unique = this.magazineOwner.find(own => own.profileId === receivedEntry[0].id && own.ownerType == 2);
        if (!unique) {
            this.magazineOwner.push(selectedUser);
        } else {
            this.toast.error('صاحب امتیاز وارد شده تکراری است');
        }

    }

    getPerson(receivedEntry: any) {
        let selector: OwnerModel = {
            fullName: this.personOwner.firstName + ' ' + this.personOwner.lastName, ownerType: 3
        };
        this.magazineOwner.push(selector);
        this.modalRef.close();
        this.ownerForm.reset();
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
        this.magazineOwnerEmitter.emit(this.magazineOwner)
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
