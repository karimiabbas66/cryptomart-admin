import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PublisherModel} from '../../sources/shared/dto/publisher.model';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {OrganizationModel} from '../shared/dto/organization.model';
import {OrganizationService} from '../shared/service/organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent implements OnInit {
    organizationList: OrganizationModel[];

    totalRecords: number;

    loading: boolean;

    filterName:string='';

    tableSize: number = 5;
    @Input() public modal: boolean;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    constructor(private organizationService: OrganizationService,
                private toastr: ToastrService,
                private change: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.organizationService.getAllOrganizationCount().then((value: number) => {
            this.totalRecords = value;
        });
        this.getPublisherList(1);
    }

    onchange(event) {
        this.filterName = event.target.value;
        this.getPublisherList(1);
    }

    getPublisherList(pageNumber) {
        this.loading = true;
        const page: number = +pageNumber;
        this.organizationService.getAllOrganization(page - 1, this.tableSize, null)
            .then((res: PublisherModel[]) => {
                this.loading = false;
                this.organizationList = res;
                this.change.detectChanges();
            }).catch(error => {
            this.loading = false;
            this.toastr.error(error.error.message);
        })

    }

    addForSources(organizationId: number) {
        if (this.modal == true) {
            let organizationModels = this.organizationList.filter(org => org.id == organizationId);
            this.passEntry.emit(organizationModels[0]);
        }
    }

    removeOrganization(organizationId: number) {
        swal.fire({
            title: 'آیا از حذف سازمان اطمینان دارید؟',
            text: "!شما قادر به برگرداندن مورد حذف شده نخواهید بود",
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله, حذف کن'
        }).then((result) => {
            if (result.value) {
                this.organizationService.removeOrganization(organizationId).then(res=>{
                    this.organizationService.getAllOrganizationCount().then((value:number) => {
                        this.totalRecords = value;
                        this.organizationService.getAllOrganization(0,  this.tableSize, null).then(res=>{
                            this.organizationList = res;
                            let setting:SweetAlertOptions={};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.سازمان انتخاب شده حذف شد';
                            setting.type = 'success';
                            swal.fire(
                                setting
                            )
                        })
                    })
                }).catch(err => {
                    if (err.error.responseCode === 90000002) {
                        this.toastr.error("از این سازمان در منابع استفاده شده است. لطفا ابتدا سازمان را در منابع عوض کنید");
                    } else {
                        this.toastr.error(err.error.message);
                    }
                });
            }
        })
    }

}
