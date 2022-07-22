import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThesisModel} from '../../../shared/dto/thesis.model';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProfileListService} from '../../../../profile/profile-list/profile-list.service';
import {Personal} from '../../../../profile/shared/dto/Personal';
import {ToastrService} from 'ngx-toastr';
import {ThesisInvolvedModel} from '../../../shared/dto/thesis-involved.model';
import {ThesisService} from '../../../shared/service/thesis.service';
import {AuthorService} from '../../../shared/service/author.service';
import {AuthorModel} from '../../../shared/dto/author.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OwnerModel} from '../../../shared/dto/owner.model';

@Component({
    selector: 'app-thesis-involved',
    templateUrl: './thesis-involved.component.html',
    styleUrls: ['./thesis-involved.component.scss']
})
export class ThesisInvolvedComponent implements OnInit {

    @Input() thesis: ThesisModel;
    @Output() involvedEmitter: EventEmitter<any> = new EventEmitter<any>();
    thesisInvolved: ThesisInvolvedModel;
    selectedInvolved: ThesisInvolvedModel[] = [];
    authorForm: FormGroup;
    professorForm: FormGroup;
    showProgress: boolean;
    authorsCount: number;
    authorsLen: number = 0;
    searchTerm: string;
    thesisInvolvedType: any;
    numberOfItemsFromEndBeforeFetchingMore = 2;
    loading: boolean = false;
    typeList: Array<number>;
    typeId: number;
    authors: AuthorModel[] = [];
    private modalRef: NgbModalRef;

    constructor(private formBuilder: FormBuilder,
                private profileListService: ProfileListService,
                private authorService: AuthorService,
                private change: ChangeDetectorRef,
                private thesisService: ThesisService,
                private modalService: NgbModal,
                private toast: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.authorService.getAllAuthorCount().then((result: number) => {
            this.authorsCount = result;
            this.showProgress = false;
        }).catch(error => {
            this.showProgress = false;
        });
        this.thesisInvolvedType = [{id: 1, name: 'استاد راهنما'}, {id: 2, name: 'استاد مشاور'}];
        this.searchAuthor(null);

        this.authorForm = this.formBuilder.group({
            authors: this.formBuilder.array([this.createAddAuthorForm()])
        });
        this.professorForm = this.formBuilder.group({
            professor: this.formBuilder.array([this.createAddProfessorForm()])
        });

        if (this.thesis.id) {
            this.thesisService.getInvolvedByThesisId(this.thesis.id).then((result: ThesisInvolvedModel[]) => {
                this.selectedInvolved = result;

                const authorFormArray = this.authorForm.get('authors') as FormArray;
                this.showProgress = false;
                for (let i of (this.selectedInvolved.filter(involve => involve.typeId === 0))) {
                    let involve: ThesisInvolvedModel = {
                        typeId: i.typeId, authorId: i.fullName
                    };
                    authorFormArray.push(this.createAuthorEditForm(involve));
                }
                this.removeOrClearAuthorForm(0);

                const professorFormArray = this.professorForm.get('professor') as FormArray;
                this.showProgress = false;
                for (let i of (this.selectedInvolved.filter(involve => involve.typeId === 1 || involve.typeId === 2))) {
                    let involve: ThesisInvolvedModel = {
                        typeId: i.typeId, profileId: i.profileId, fullName: i.fullName, degree: i.degree
                    };
                    professorFormArray.push(this.createProfessorEditForm(involve));
                }
                this.removeOrClearProfessorForm(0);

            }).catch(error => {
                this.showProgress = false;
            })
        }
    }

    searchAuthor(event) {
        if (event == null && this.authorsLen * 10 >= this.authorsCount) {
            return;
        }
        if (event != null) {
            this.searchTerm = event.term;
            this.authorsLen = 0;
        }
        this.authorService.getAllAuthor(this.authorsLen, 10, this.searchTerm != null ? this.searchTerm : null)
            .then((res: AuthorModel[]) => {
                let aut = res.map((i) => {
                    i.fullName = !i.profileId ? i.firstName + ' ' + i.lastName : i.firstName + ' ' + i.lastName + ' (کاربر کریپتومارت)';
                    return i;
                });
                if (event == null) {
                    this.authors = this.authors.concat(aut);
                } else {
                    this.authors = aut;
                }
                this.change.detectChanges();
                this.authorsLen += 1;
            }).catch(error => {
            this.toast.error(error.error.message);
        })
    }

    onScrollToEnd() {
        this.searchAuthor(null);
    }

    onScroll({end}) {
        if (this.loading || this.authors.length <= this.authorsCount) {
            return;
        }
        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.authorsCount) {
            this.searchAuthor(null);
        }
    }


    private createAddAuthorForm(): FormGroup {
        let formGroup = new FormGroup({
            typeId: new FormControl(''),
            authorId: new FormControl('', [Validators.required]),
        });
        formGroup.reset();
        return formGroup;
    }

    private createAddProfessorForm(): FormGroup {
        let formGroup = new FormGroup({
            typeId: new FormControl('', [Validators.required]),
            fullName: new FormControl('', [Validators.required]),
            degree: new FormControl(''),
            profileId: new FormControl(''),
        });
        formGroup.reset();
        return formGroup;
    }

    private createAuthorEditForm(involvedModel: ThesisInvolvedModel): FormGroup {
        let formGroup = new FormGroup({
            typeId: new FormControl(''),
            authorId: new FormControl('', [Validators.required]),
        });
        let formValue = {
            typeId: 'پدیدآور',
            authorId: involvedModel.authorId,
        };
        formGroup.get('authors');
        formGroup.patchValue(formValue);
        return formGroup;
    }

    private createProfessorEditForm(involvedModel: ThesisInvolvedModel): FormGroup {
        let formGroup = new FormGroup({
            typeId: new FormControl('', [Validators.required]),
            fullName: new FormControl('', [Validators.required]),
            degree: new FormControl(''),
            profileId: new FormControl(''),
        });
        let formValue = {
            typeId: involvedModel.typeId,
            profileId: involvedModel.profileId,
            fullName: involvedModel.fullName,
            degree: involvedModel.degree,
        };
        formGroup.get('professor');
        formGroup.patchValue(formValue);
        return formGroup;
    }

    public addAuthorFormGroup() {
        const formArray = this.authorForm.get('authors') as FormArray;
        formArray.push(this.createAddAuthorForm());
    }

    public addProfessorFormGroup() {
        const formArray = this.professorForm.get('professor') as FormArray;
        formArray.push(this.createAddProfessorForm());
    }

    get authorFormData(): FormArray {
        return this.authorForm.get('authors') as FormArray;
    }

    get professorFormData(): FormArray {
        return this.professorForm.get('professor') as FormArray;
    }

    removeOrClearAuthorForm(i: number) {
        const formArray = this.authorForm.get('authors') as FormArray;
        if (formArray.length > 1) {
            formArray.removeAt(i);
        } else {
            formArray.reset();
        }
    }

    removeOrClearProfessorForm(i: number) {
        const formArray = this.professorForm.get('professor') as FormArray;
        if (formArray.length > 1) {
            formArray.removeAt(i);
        } else {
            formArray.reset();
        }
    }

    getNewAuthor(receivedEntry) {
        receivedEntry.fullName = receivedEntry.firstName + ' ' + receivedEntry.lastName;
        this.authors = this.authors.concat(receivedEntry);
        this.modalRef.close();
    }

    openModal(accessPage) {
        this.modalRef = this.modalService.open(accessPage, {size: 'lg', backdrop: 'static'});
        this.modalRef.result.then((receivedEntry) => {
            this.modalRef.close();
        }, (reason) => {
            this.modalRef.close();
        })
    }

    getProfile(receivedEntry: any) {
        const professorFormArray = this.professorForm.get('professor') as FormArray;
        let selectedUser: ThesisInvolvedModel = {
            fullName: receivedEntry[0].firstName + ' ' + receivedEntry[0].lastName, profileId: receivedEntry[0].id
        };
        professorFormArray.push(this.createProfessorProfileForm(selectedUser));
    }

    private createProfessorProfileForm(involvedModel: ThesisInvolvedModel): FormGroup {
        const formGroup = new FormGroup({
            typeId: new FormControl('', [Validators.required]),
            fullName: new FormControl('', [Validators.required]),
            degree: new FormControl(''),
            profileId: new FormControl(''),
        });
        formGroup.reset();
        let formValue = {
            profileId: involvedModel.profileId,
            fullName: involvedModel.fullName,
        };
        formGroup.get('professor');
        formGroup.patchValue(formValue);
        return formGroup;
    }

    addInvolved() {
        this.selectedInvolved = [];
        const authorFormArray = this.authorForm.get('authors') as FormArray;
        for (let v of authorFormArray.getRawValue()) {
            this.selectedInvolved.push({
                typeId: 0, authorId: v.authorId.authorId, fullName: v.authorId.fullName
            });
        }
        const professorFormArray = this.professorForm.get('professor') as FormArray;
        for (let v of professorFormArray.getRawValue()) {
            this.selectedInvolved.push({
                typeId: v.typeId, degree: v.degree, fullName: v.fullName,
                profileId: v.profileId,
            });
        }
        this.typeList = this.selectedInvolved.map(involve => involve.typeId);

        if (this.typeList.includes(0) && this.typeList.includes(1)) {
            this.involvedEmitter.emit(this.selectedInvolved);
        } else {
            this.toast.warning('پدید آور و استاد راهنما را وارد کنید')
        }
    }

}
