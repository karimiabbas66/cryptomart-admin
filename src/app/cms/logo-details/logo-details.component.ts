import {Component, OnInit} from '@angular/core';
import {FileManagerService} from '../../shared/file-manager.service';
import {ToastrService} from 'ngx-toastr';
import {Logo} from '../shared/dto/Logo';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AppSettings} from '../../pages/shared/AppSettings';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ContentService} from '../shared/service/content.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-logo-details',
    templateUrl: './logo-details.component.html',
    styleUrls: ['./logo-details.component.scss']
})
export class LogoDetailsComponent implements OnInit {
    public logoId: number;
    public logo: Logo = {};
    public logoDetailForm: FormGroup;
    imageToShow: any;
    public isImageLoading = false ;
    subs = new Subscription();
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';

    constructor(private contentService: ContentService,
                private toastr: ToastrService,
                private modalService: NgbModal,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private fileManagerService: FileManagerService) {
    }

    ngOnInit() {
        this.logoDetailForm = this.formBuilder.group({
            title: new FormControl('')
        })

        this.subs.add(this.route.queryParams.subscribe(params => {
            this.logoId = params['id'];
            if (this.logoId) {
                this.contentService.findLogoById(this.logoId).then(res => {
                    this.logo = res;
                    this.getImageFromService(this.logo.imageId);
                });
            }
        }))
    }

    setlogoimage(event: any) {
        this.fileManagerService.saveBASE64File(event).then(res => {
            this.logo.imageId = res;
        }).catch(err => {
            this.toastr.error(err.error.message)
        })
    }

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.imageToShow = reader.result;
            this.isImageLoading = true;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    getImageFromService(uuid) {
        this.contentService.getImage(uuid).subscribe(data => {
            this.createImageFromBlob(data);
        }, error => {
            console.log(error);
        });
    }

    openChangeImageDialog(content) {
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {

        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    edit() {
        if(!this.logo.imageId){
            this.toastr.error('عکسی به عنوان لوگو آپلود نشده است');
        } else {
            this.contentService.saveLogo(this.logo).then(res => {
                this.toastr.success('لوگو با موفقیت ثبت شد');
                this.logoDetailForm.reset();
            })
        }
    }
}
