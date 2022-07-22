import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserAccountService} from '../shared/service/UserAccountService';
import {PersonalInformation} from '../shared/dto/PersonalInformation';
import {EnableDto} from '../shared/dto/EnableDto';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {UserAccessService} from '../shared/service/UserAccessService';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Operations} from '../shared/dto/Operations';
import {AddAccessDto} from '../shared/dto/AddAccessDto';
import {UserEntityService} from '../shared/service/UserEntityService';
import {ToastrService} from 'ngx-toastr';
import {TreeNode} from 'primeng/api';
import {ProfileSearchDto} from '../shared/dto/ProfileSearchDto';


@Component({
    selector: 'app-leader-list',
    templateUrl: './leader-list.component.html',
    styleUrls: ['./leader-list.component.scss']
})
export class LeaderListComponent implements OnInit {

    @ViewChild('ngbPagination', {static: false}) public ngbPagination: NgbPagination;
    totalRecords;
    totalLeadeGroupRecords;
    items: PersonalInformation[];
    operations: Operations[] = [];
    searchForm: FormGroup;
    selected: Operations[] = [];
    tempSelected: Operations [] = []
    resourceNodes: any;
    pagesize = 5;
    isEnbale = '';
    username = '';
    firstName = '';
    lastName = '';
    leaderGroupItems;
    code = '';
    searchEnabled: boolean = false;
    cancelEnabled: boolean = false;
    addaccessDto: AddAccessDto = {};
    deletedItems: number [] = [];
    showProgress: boolean;
    selectedUser: number;
    forgotPassowrdSelected: PersonalInformation;
    firstPanel: [] = [];
    glist: number[] = [];
    profileSearchDto: ProfileSearchDto[] = [];
    nodes: any;

    constructor(private personalInfoService: UserAccountService,
                private userAccessService: UserAccessService,
                private modalService: NgbModal,
                private toastr: ToastrService,
                private formBuilder: FormBuilder,
                private userEntityService: UserEntityService) {

    }

    ngOnInit() {
        this.profileSearchDto.push({key: 'sortField', value: 'createDate'});
        this.profileSearchDto.push({key: 'sortType', value: -1});
        this.nodes = [
            {
                key: '0',
                label: 'Introduction',
                children: [
                    {key: '0-0', label: 'What is Angular', data: 'https://angular.io', type: 'url'},
                    {key: '0-1', label: 'Getting Started', data: 'https://angular.io/guide/setup-local', type: 'url'},
                    {key: '0-2', label: 'Learn and Explore', data: 'https://angular.io/guide/architecture', type: 'url'},
                    {key: '0-3', label: 'Take a Look', data: 'https://angular.io/start', type: 'url'}
                ]
            },
            {
                key: '1',
                label: 'Components In-Depth',
                children: [
                    {key: '1-0', label: 'Component Registration', data: 'https://angular.io/guide/component-interaction', type: 'url'},
                    {key: '1-1', label: 'User Input', data: 'https://angular.io/guide/user-input', type: 'url'},
                    {key: '1-2', label: 'Hooks', data: 'https://angular.io/guide/lifecycle-hooks', type: 'url'},
                    {key: '1-3', label: 'Attribute Directives', data: 'https://angular.io/guide/attribute-directives', type: 'url'}
                ]
            }
        ]

        this.showProgress = true;
        this.personalInfoService.countAllByItems(this.profileSearchDto).then(value => {
            this.totalRecords = value;
            this.personalInfoService.searchByItems(this.profileSearchDto, 0, this.pagesize).then((value1: PersonalInformation[]) => {
                this.items = value1;
                this.showProgress = false;
            }).catch(reason => {
                this.showProgress = false;
            });
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
        this.personalInfoService.searchByItems(this.profileSearchDto, 0, this.pagesize).then((value1: PersonalInformation[]) => {
            this.items = value1;
            this.ngbPagination.page = 1
            this.showProgress = false;
        }).catch(reason => {
            this.showProgress = false;
            this.toastr.error(reason.error.message)
        });

    }

    disableSearchButton() {
        this.searchEnabled = false;
        return false;
    }

    test(key, value) {
        var profile = this.profileSearchDto.filter(value => value.key == key);
        if (profile.length > 0) {
            profile[0].value = value;
        } else {
            this.profileSearchDto.push({key: key, value: value})
        }
    }

    onSearchItems() {
        this.personalInfoService.countAllByItems(this.profileSearchDto).then(value => {
            this.totalRecords = value;
            this.personalInfoService.searchByItems(this.profileSearchDto, 0, this.pagesize).then((value1: PersonalInformation[]) => {
                this.items = value1;
            });
        });

    }

    onRefreshTable() {
        this.cancelEnabled = false;
        this.firstPanel = [];
        this.personalInfoService.countAllLeaders().then(value => {
            this.totalRecords = value;
            this.personalInfoService.getAllLeaders(0, this.pagesize).then((value1: PersonalInformation[]) => {
                this.items = value1;
                this.showProgress = false;
            }).catch(reason => {
                this.showProgress = false;
            });
        }).catch(reason => {
            this.toastr.error(reason.error.message)
            this.showProgress = false;
        })
    }

    lazyLoadByItems(pageNumber) {
        this.showProgress = true;
        this.personalInfoService.searchByItems(this.profileSearchDto, pageNumber - 1, this.pagesize).then(value => {
            this.items = value;
            this.showProgress = false;
        }).catch(reason => {
            this.showProgress = false;
            this.toastr.error(reason.error.message)
        });

    }

    lazyLoadUserEntity(pageNumber) {
        this.userEntityService.findGroupUserEntityByUserId(this.selectedUser, pageNumber - 1, this.pagesize).then(value => {
            this.leaderGroupItems = value;
        })
    }

    activeOrInactivate(id, isEnable) {
        var text = 'فعال شد';
        if (isEnable) {
            text = 'غیرفعال شد'
        }
        var enableDto = new EnableDto();
        enableDto.id = id;
        enableDto.isEnable = !isEnable;
        this.personalInfoService.updateActivity(enableDto).then(value => {
            this.items.filter(value1 => value1.id == enableDto.id).forEach(value1 => {
                value1.isEnable = enableDto.isEnable;
            })
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = text;
            setting.animation = true;
            setting.text = 'وضعیت حساب راهبر مورد نظر تغییر کرد';
            setting.type = 'success';
            swal.fire(
                setting
            )
        }).catch(reason => {
            this.toastr.error(reason.error.message)
        });
    }

    openAccessPage(content, item) {
        this.userEntityService.findUserEntityByUserId(item.id).then(value => {
            this.selectedUser = value;
            this.userAccessService.getAllUserOperationAccessById(item.id).then((value: Operations []) => {
                this.userAccessService.getAllGroupOperationAccessById(item.id).then((groupId: Operations []) => {
                    this.selected = value.filter(element => this.operations.map(value1 => value1.key).includes(element.key));

                    groupId.forEach(item => {
                        this.glist.push(item.key);
                    })
                    this.checkForInherit(this.resourceNodes[0]);
                    this.tempSelected = [...this.selected]
                    this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
                    }, (reason) => {
                        this.modalService.dismissAll();
                    })
                })
            })
        })
    }

    openFieldAccessPage(content,item){
        this.selectedUser=item.id;
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {

        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    openLeaderGroupPage(content, item) {
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {

        }, (reason) => {
            this.modalService.dismissAll();
        });
        this.showProgress = true;
        this.userEntityService.countGroupUserEntityByUserId(item.id).then(value1 => {
            this.totalLeadeGroupRecords = value1;
            this.userEntityService.findGroupUserEntityByUserId(item.id, 0, this.pagesize).then(value => {
                this.leaderGroupItems = value;
                this.showProgress = false;
            })
        }).catch(reason => {
            this.showProgress = false;
            this.toastr.error(reason.error.message)
        });
    }


    openForgotPasswordPage(content, item) {
        this.forgotPassowrdSelected = item;
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
        this.addaccessDto.userEntityId = this.selectedUser;
        this.userAccessService.addAccessToUser(this.addaccessDto).then(value => {
            this.modalService.dismissAll();
            this.deletedItems = [];
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
            this.toastr.error(reason.error.message)
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


    private checkForInherit(resourceNode: any) {
        resourceNode.type = '';
        if (this.glist.indexOf(resourceNode.key) !== -1) {
            resourceNode.type = 'inherit';
            console.log(resourceNode.key);
        }
        if (resourceNode.children) {
            resourceNode.children.forEach(item => {
                this.checkForInherit(item);
            })
        }
    }
}
