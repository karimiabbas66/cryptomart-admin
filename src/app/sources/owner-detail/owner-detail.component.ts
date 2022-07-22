import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {OwnerModel} from '../shared/dto/owner.model';
import {OwnerService} from '../shared/service/owner.service';

@Component({
    selector: 'app-owner-detail',
    templateUrl: './owner-detail.component.html',
    styleUrls: ['./owner-detail.component.scss']
})
export class OwnerDetailComponent implements OnInit {

    public ownerDetailForm: FormGroup;
    public ownerId: number;
    public owner: OwnerModel = {};
    @Input() public modal: boolean;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    constructor(private formBuilder: FormBuilder,
                private toastr: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private ownerService: OwnerService) {

    }

    ngOnInit() {
        this.ownerDetailForm = this.formBuilder.group({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            mobileNumber: new FormControl('', [Validators.required]),
            phoneNumber: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
        });
        this.route.queryParams.subscribe(params => {
            this.ownerId = params['id'];
            if (this.ownerId) {
                this.ownerService.getOwnerModel(this.ownerId).then(res => {
                    this.owner = res;
                })
            }
        })
    }

    edit() {
        this.ownerService.saveNewOwner(this.owner).then(res => {
            if (this.modal == true) {
                this.passEntry.emit(res);
            } else {
                this.router.navigate(['/sources/owner-list'], {relativeTo: this.route.parent});
            }
            this.toastr.success('اطلاعات ناشر با موفقیت ثبت شد');
        }).catch(error => {
            this.toastr.error(error.error.message);
        })
    }

}
