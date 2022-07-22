import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserEntityService} from '../shared/service/UserEntityService';
import {UserEntity} from '../shared/dto/UserEntity';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {UserAccessService} from '../shared/service/UserAccessService';
import {Operations} from '../shared/dto/Operations';
import {TreeNode} from 'primeng/api';
import {AddAccessDto} from '../shared/dto/AddAccessDto';
import {UserMemberSerivce} from '../shared/service/UserMemberSerivce';


@Component({
    selector: 'app-leader-group',
    templateUrl: './leader-group.component.html',
    styleUrls: ['./leader-group.component.scss']
})

export class LeaderGroupComponent implements OnInit {

    @ViewChild('ngbPagination', {static: false}) public ngbPagination: NgbPagination;
    data: UserEntity[];
    pagesize = 5;
    totalRecords: number;
    operations: Operations[] = [];
    selected: Operations[] = [];
    tempSelected: Operations [] = []
    resourceNodes: any;
    addaccessDto: AddAccessDto = {};
    deletedItems = new Set();
    updateLeaderGroupForm: FormGroup;
    selectedItem: UserEntity = {};
    isEnabled: boolean = false;
    filterName: string = '';
    searching: boolean = false;
    showProgress: boolean = false;
    selectedUserEntityId;

    constructor(private userEntityService: UserEntityService,
                private modalService: NgbModal,
                private formBuilder: FormBuilder,
                private change: ChangeDetectorRef,
                private toast: ToastrService,
                private userAccessService: UserAccessService,
                private userMemberService: UserMemberSerivce) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.userEntityService.countAllGroupByName('GROUP', '').then(value1 => {
            this.totalRecords = value1;
            this.userEntityService.getAllGroupByName('GROUP', '', 0, this.pagesize).then(value => {
                this.data = value;
                this.showProgress = false;
            })
        }).catch(reason => {
            this.showProgress = false;
        });
        this.userAccessService.getAllOperations().then((value: Operations[]) => {
            this.operations = [...value];
            const idMapping = value.reduce((acc, el, i) => {
                acc[el.key] = i;
                return acc;
            }, {});
            let root;
            value.forEach(el => {
                if (el.parent == null) {
                    root = el;
                    return;
                }
                const parentEl = value[idMapping[el.parent.key]];
                parentEl.children = [...(parentEl.children || []), el];
            });
            this.resourceNodes = value.filter(value1 => value1.parent == null)
            this.expandall();
        }).catch(reason => {

        });
    }

    changePageSize() {
        this.userEntityService.getAllGroupByName('GROUP', '', 0, this.pagesize).then(value => {
            this.data = value;
            this.showProgress = false;
        }).catch(reason => {
            this.showProgress = false;
        });

    }

    lazyLoadUserEntity(pageNumber) {
        this.userEntityService.getAllGroupByName('GROUP', '', pageNumber - 1, this.pagesize).then(value => {
            this.data = value;
        })
    }

    open(content, item) {
        this.selectedItem.userEntityId = item.userEntityId;
        this.selectedItem.name = item.name;
        this.selectedItem.desciption = item.desciption;
        this.updateLeaderGroupForm = this.formBuilder.group({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', null),
        });
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {

        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    deleteGroup(id) {
        swal.fire({
            title: 'آیا از حذف گروه اطمینان دارید؟',
            text: '!شما قادر به برگرداندن مورد حذف شده نخواهید بود',
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله, حذف کن'
        }).then((result) => {
            this.userEntityService.deleteGroup(id).then(value => {
                this.showProgress = true;
                this.userEntityService.countAllGroupByName('GROUP', this.filterName).then(value1 => {
                    this.totalRecords = value1;
                    this.userEntityService.getAllGroupByName('GROUP', this.filterName, 0, this.pagesize).then(value => {
                        this.data = value;
                        this.ngbPagination.page = 1;
                        this.showProgress = false;
                    })
                    let setting: SweetAlertOptions = {};
                    setting.confirmButtonText = 'بستن';
                    setting.title = '!حذف شد';
                    setting.animation = true;
                    setting.text = '.گروه مورد نظر حذف شد';
                    setting.type = 'success';
                    swal.fire(
                        setting
                    )
                }).catch(reason => {
                    this.showProgress = false;
                    this.toast.error(reason.error.message);
                })
            }).catch(reason => {
                this.showProgress = false;
                this.toast.error(reason.error.message);
            })

        })
    }

    onchange() {
        let wordSearch = this.filterName;
        setTimeout(() => {
                if (wordSearch == this.filterName) {
                    this.searching = true;
                    this.showProgress = true;
                    this.userEntityService.countAllGroupByName('GROUP', this.filterName).then(value1 => {
                        this.totalRecords = value1;
                        this.userEntityService.getAllGroupByName('GROUP', this.filterName, 0, this.pagesize).then(value => {
                            this.data = value;
                            this.showProgress = false;
                        }).catch(reason => {
                            this.showProgress = false;
                        })
                    })
                }
            }
            ,
            500
        )
    }

    updateUserEntity() {
        this.showProgress = true;
        this.userEntityService.updateUserEntityById(this.selectedItem).then(value1 => {
            this.userEntityService.getAllGroupByName('GROUP', this.filterName, this.ngbPagination.page - 1, this.pagesize).then(value => {
                this.data = value;
                this.showProgress = false;
            }).catch(reason => {
                this.toast.error(reason.error.message);
                this.showProgress = false;
            })
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = '!ویرایش شد';
            setting.animation = true;
            setting.text = '.گروه مورد نظر ویرایش شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
            this.modalService.dismissAll();
        }).catch(reason => {
            this.toast.error(reason.error.message);
        });
    }

    openAccessPage(content, item) {
        this.selectedUserEntityId = item.userEntityId;
        this.userAccessService.getAllAccessByUserEntityId(item.userEntityId).then((value: Operations []) => {
            this.selected = value.filter(element => this.operations.map(value1 => value1.key).includes(element.key));
            this.tempSelected = [...this.selected]
            this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
            }, (reason) => {
                this.modalService.dismissAll();
            });
        })

    }

    openUserMemberPage(content, item) {
        this.selectedUserEntityId = item.userEntityId;
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    disableSaveAccess() {
        if (this.selected.length != this.tempSelected.length) {
            return false;
        }
        if (this.selected.map(value => value.key).filter(value => this.tempSelected.map(value1 => value1.key).indexOf(value) == -1).length > 0) {
            return false;
        }
        return true;
    }

    saveUserAccess() {
        this.addaccessDto.deletedOperationId = this.tempSelected.map(value => value.key).filter(value => this.selected.map(value1 => value1.key).indexOf(value) == -1)
        this.addaccessDto.addOperationId = this.selected.map(value => value.key).filter(value => this.tempSelected.map(value1 => value1.key).indexOf(value) == -1);
        this.addaccessDto.userEntityId = this.selectedUserEntityId;
        console.log(this.addaccessDto);
        this.userAccessService.addAccessToUser(this.addaccessDto).then(value => {
            this.modalService.dismissAll();
            this.selected = [];
            this.addaccessDto = {};
            this.tempSelected = [];
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = 'تغییر کرد';
            setting.animation = true;
            setting.text = '.دسترسی های مورد نظر اضافه شد';
            setting.type = 'success';
            swal.fire(
                setting
            )

        }).catch(reason => {

        });
    }


    closeModal() {
        this.modalService.dismissAll();
    }

    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

    expandall() {
        this.resourceNodes.forEach(node => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll() {
        this.resourceNodes.forEach(node => {
            this.expandRecursive(node, false);
        });
    }
}
