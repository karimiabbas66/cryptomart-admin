import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthorTypeModel} from '../../../shared/dto/author-type.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AuthorService} from '../../../shared/service/author.service';
import {PublisherService} from '../../../shared/service/publisher.service';
import {ToastrService} from 'ngx-toastr';

import {PublisherModel} from '../../../shared/dto/publisher.model';
import {CityService} from '../../../shared/service/city.service';
import {CityModel} from '../../../shared/dto/city.model';
import {ISubscription} from 'rxjs-compat/Subscription';
import {BookModel} from '../../../shared/dto/book.model';
import {SourceTypeModel} from '../../../shared/dto/source-type.model';
import {SourceTypeService} from '../../../shared/service/source-type.service';

@Component({
    selector: 'app-book-publisher',
    templateUrl: './book-publisher.component.html',
    styleUrls: ['./book-publisher.component.scss']
})
export class BookPublisherComponent implements OnInit, OnDestroy {

    public publisherForm: FormGroup;

    showProgress: boolean = false;
    publishersCount: number;
    numberOfItemsFromEndBeforeFetchingMore = 10;
    selectedPublisher: PublisherModel;
    publishers: PublisherModel[] = [];
    loading: boolean = false;
    publishersLen: number = 0;
    publisherTypes: AuthorTypeModel[];
    test: any;
    @Output()
    publisherInfoEmitter: EventEmitter<any> = new EventEmitter<any>();
    provinces: CityModel[] = [];
    cities: CityModel[] = [];
    private _unSubscription: ISubscription;
    @Input() public book: BookModel;
    searchTerm: string;
    publishDatePlaceholder: string = 'تاریخ نشر';
    province: CityModel;
    selectedType: AuthorTypeModel;
    selectedCity: CityModel;
    publishDate: any;
    private ngbModalRef: NgbModalRef;
    isbn: number;
    publishedNumber: number;
    resourceTypeId: number;
    sourceTypes: SourceTypeModel[] = [];
    cityName: string;
    dateType: number = 0;
    confirmed: boolean = false;

    constructor(private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private sourceTypeService: SourceTypeService,
                private authorService: AuthorService,
                private cityService: CityService,
                private publisherService: PublisherService,
                private toastr: ToastrService,
                private change: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.publisherForm = this.formBuilder.group({
            publisherModel: new FormControl('', [Validators.required]),
            publisherType: new FormControl('', [Validators.required]),
            province: new FormControl(''),
            city: new FormControl(''),
            isbn: new FormControl('', [Validators.required]),
            dateType: new FormControl(''),
            confirmed: new FormControl(''),
            publishedNumber: new FormControl('', [Validators.required]),
            publishDate: new FormControl(''),
            resourceType: new FormControl('', [Validators.required]),
        });
        if (this.book != null) {
            this.showProgress = true;
            this.publisherService.getPublisherModel(this.book.publisher.publisherId).then((res: PublisherModel) => {
                this.selectedPublisher = this.book.publisher;
                this.confirmed = this.book.publisherConfirmed;
                this.setValues(res);
                this.cityService.getProvinceByCityId(this.selectedPublisher.cityId).then((res: CityModel) => {
                    this.showProgress = false;
                    this.province = res;
                    this.onSelectProvince();
                }).catch(error => {
                    this.showProgress = false;
                })
            }).catch(error => {
                this.showProgress = false;
            });
        }

        this.sourceTypeService.getAllSourceType(0,10).then(res => {
            this.showProgress=false;
            this.sourceTypes = res;
        });

        this.publisherService.getAllPublisherCount().then((value: number) => {
            this.publishersCount = value;
        });

        this.searchPublisher(null);
        this.getPublisherType();
        this.cityService.getAllProvince(0, 50).then(res => {
            this.provinces = res;
        });


    }

    private getPublisherType() {
        this.publisherService.getAllPublisherType(0, 10).then(res => {
            this.publisherTypes = res;
            if (this.selectedPublisher && this.selectedPublisher.publishTypeId) {
                this.selectedType = this.publisherTypes.find(type => type.id == this.selectedPublisher.publishTypeId);
            }
        })
    }

    onScrollToEnd() {
        this.searchPublisher(null);
    }

    onScroll({end}) {
        if (this.loading || this.publishers.length <= this.publishersCount) {
            return;
        }

        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.publishersCount) {
            this.searchPublisher(null);
        }
    }

    searchPublisher(event) {
        if (event == null && this.publishersLen * 10 >= this.publishersCount) {
            return;
        }
        if (event != null) {
            this.searchTerm = event.term;
            this.publishersLen = 0;
        }
        this.publisherService.getAllPublisher(this.publishersLen, 10, this.searchTerm != null ? this.searchTerm : null)
            .then((res: PublisherModel[]) => {
                if (event == null) {
                    this.publishers = this.publishers.concat(res);
                } else {
                    this.publishers = res;
                }
                this.change.detectChanges();
                this.publishersLen += 1;
            }).catch(error => {
            this.toastr.error(error.error.message);
        })
    }

    addPublishers() {
        let publisher: PublisherModel = {
            publisherId: this.selectedPublisher.publisherId,
            publisherName: this.selectedPublisher.publisherName,
            publishTypeId: this.selectedType.id,
            cityId: this.selectedCity.id,
            publishDate: this.publishDate,
            publishedNumber: this.publishedNumber,
            isbn: this.isbn,
            confirmed: this.confirmed,
            resourceTypeId: this.resourceTypeId
        };
        console.log("publisher::", publisher)
        this.publisherInfoEmitter.emit(publisher)
    }

    openModal(accessPage) {
        this.ngbModalRef = this.modalService.open(accessPage, {size: 'lg', backdrop: 'static'});
        this.ngbModalRef.result.then((receivedEntry) => {
        }, (reason) => {
            this.modalService.dismissAll();
        })
    }

    getNewAuthor(receivedEntry) {
        receivedEntry.fullName = receivedEntry.firstName + ' ' + receivedEntry.lastName;
        this.publishers = this.publishers.concat(receivedEntry);
        this.ngbModalRef.close();
    }

    onSelectProvince() {
        if (this.province) {
            this.cityService.getAllCityByProvinceId(this.province.id).then((res: CityModel[]) => {
                this.cities = res;
                if (this.selectedPublisher.cityId) {
                    this.selectedCity = this.cities.find(cit => cit.id == this.selectedPublisher.cityId);
                    // this.cityName = this.cities.find(cit => cit.id == this.selectedPublisher.cityId).title;
                }
            });
        } else {
            this.publisherForm.controls.city.patchValue(null);
        }
    }

    onSelectPublisher(event: any) {
        console.log('event:', event);
        if (event != undefined) {
            this.publisherForm.controls.province.patchValue({title: event.provinceName, id: event.provinceId})
            // this.publisherForm.controls.city.patchValue({title: event.cityName, id: event.cityId})
            this.cityName = event.cityName;
            this.selectedCity = {title: event.cityName, id: event.cityId}
        }
    }

    ngOnDestroy(): void {
        if (this._unSubscription) {
            this._unSubscription.unsubscribe();
        }
    }

    onDeathDateChange(data) {
        this.publishDate = data;
    }

    private setValues(res: any) {
        this.selectedPublisher.publisherName = res.publisherName;
        this.selectedPublisher.isbn = this.book.isbn;
        this.selectedPublisher.publishedNumber = this.book.publishedNumber;
        this.publishDate = this.selectedPublisher.publishDate;
        this.isbn = this.book.isbn;
        this.publishedNumber = this.book.publishedNumber;
        this.resourceTypeId = this.book.resourceTypeId;

    }
}

