import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {FieldMetaService} from '../field-meta/fieldMetaService';
import {PathsDto} from '../field-meta/model/PathsDto';
import {ToastrService} from 'ngx-toastr';
import {FieldService} from '../field/FieldService';
import {ChildDto} from '../field-meta/model/ChildDto';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FieldData} from '../field-meta/model/FieldData';
import {FieldMeta} from '../field-meta/model/FieldMeta';
import {Field} from '../field/Field';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {FieldType} from '../field-meta/model/FieldType';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LayoutService} from '../../shared/services/layout.service';
import {Subscription} from 'rxjs';
import {RelationshipModel} from '../field-meta/RelationshipModel';
import {FieldRelationDto} from '../field-meta/model/FieldRelationDto';
import {DeleteLeaf} from '../field-meta/model/DeleteLeaf';
import {DeleteRelationship} from '../field-meta/model/DeleteRelationship';


@Component({
    selector: 'app-field-visualize',
    templateUrl: './field-visualize.component.html',
    styleUrls: ['./field-visualize.component.scss']
})
export class FieldVisualizeComponent implements OnInit {

    @ViewChild('content', {static: false}) public content: any;
    @ViewChild('edit', {static: false}) public edit: any;
    @ViewChild('link', {static: false}) public link: any;
    globalTrans: any = {};
    public fieldDetailForm: FormGroup;
    public newFieldForm: FormGroup;
    public historyForm: FormGroup;
    data: PathsDto;
    d3: d3.TreeLayout<any>;
    duration: number = 1;
    i: number = 0;
    fieldRelationDto: FieldRelationDto = {};
    closeResult: string;
    relationNames: any[] = [];
    firstRelationNames: any[] = [];
    linkRelationNames: any[] = [];
    secondRelationNames: any[] = [];
    selectedRelationName: any;
    firstSelectedRelationName: any;
    linkSelectedRelationName: any;
    secondSelectedRelationName: any;
    fields: FieldMeta[] = [];
    selectedFieldMeta: FieldMeta = {};
    searchInput: string;
    selectedField: Field = {};
    fieldsCount: number;
    loading: boolean = false;
    fieldMetaLen: number = 0
    numberOfItemsFromEndBeforeFetchingMore = 10;
    isOnInit = 0;
    searchId: number;
    newField: Field = new Field();
    fieldTypes: FieldType[];
    showInf = false;
    filterName = '';
    deleteLeaf:DeleteLeaf={};
    deleteRelationship:DeleteRelationship={};

    layoutSub: Subscription;
    headBg1 = '#422251';
    headBg2 = '#780206';

    childBg1 = '#3ba1e5';
    childBg2 = '#b474db';
    linkSelectedEditChild: any = {};
    linkSelectedEditParent: any = {};
    private linkEditRelName: string = '';
    currentSelectedParentName: any;

    constructor(private fieldMetaService: FieldMetaService,
                private fieldService: FieldService,
                private toastr: ToastrService,
                private modalService: NgbModal,
                private formBuilder: FormBuilder,
                private layoutService: LayoutService,
                private change: ChangeDetectorRef) {
        this.layoutSub = layoutService.customizerChangeEmitted$.subscribe(
            options => {
                if (options) {
                    // if (options.bgColor) {
                    //     // this.bgColor = options.bgColor;
                    //     console.log("trt", options.bgColor)
                    //     if(options.bgColor == 'man-of-steel'){
                    //         console.log('bii')
                    //         this.headBg1 = '#422251';
                    //         this.headBg2 = '#780206';
                    //         this.childBg1 = '#3ba1e5';
                    //         this.childBg2 = '#b474db';
                    //     }else if(options.bgColor == 'pomegranate'){
                    //         console.log('hii')
                    //         this.headBg1 = '#753493';
                    //         this.headBg2 = '#4c1545';
                    //         this.childBg1 = '#26465c';
                    //         this.childBg2 = '#8eba84';
                    //         this.content.reset()
                    //         this.ngOnInit()
                    //     }
                    //
                    // }
                }
            }
        );

    }

    onadd(event) {
        this.newField.keywords.push(event.value);
    }

    onRemove(event) {
        var idx = this.newField.keywords.indexOf(event.value);
        this.newField.keywords.splice(idx, 1);
    }

    onadd2(event) {
        this.editField.keywords.push(event.value);
    }

    onRemove2(event) {
        var idx = this.editField.keywords.indexOf(event.value);
        this.editField.keywords.splice(idx, 1);
    }

    ngOnInit() {
        this.hasAccess = true;
        this.fieldDetailForm = this.formBuilder.group({
            fieldName: new FormControl('', [Validators.required]),
            fieldTypes: new FormControl('', [Validators.required]),
            describe: new FormControl('',),
            description: new FormControl('',),
            parentName: '',
            relationName: '',
            keywords: ''
        });
        this.newFieldForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
            keyword: new FormControl(''),
            type: new FormControl('', [Validators.required]),
            description: new FormControl('',),
            describe: new FormControl('',),
            relType: new FormControl('', [Validators.required])

        });
        this.selectedValue = '1';
        this.fieldTypes = [{name: 'علمی', value: 1}, {name: 'پژوهشی', value: 2}];
        this.selectedRelationName = {
            value: '', type: 'همه روابط',
            avatar: '../../assets/img/color/white.png'
        }

        this.relationNames.push({
            value: '', type: 'همه روابط',
            avatar: '../../assets/img/color/white.png'
        })
        this.relationNames.push({
            value: 'مبانی', type: 'مبانی',
            avatar: '../../assets/img/color/black.png'
        })
        this.relationNames.push({
            value: 'درجه دوم', type: 'درجه دوم',
            avatar: '../../assets/img/color/FF8D60.png'
        })
        this.relationNames.push({
            value: 'مباحث عام', type: 'مباحث عام',
            avatar: '../../assets/img/color/007bff.png'
        })
        this.relationNames.push({
            value: 'مباحث تخصصی', type: 'مباحث تخصصی',
            avatar: '../../assets/img/color/e83e8c.png'
        })
        this.relationNames.push({
            value: 'حوزه ها و مصادیق', type: 'حوزه ها و مصادیق',
            avatar: '../../assets/img/color/6f42c1.png'
        })
        this.relationNames.push({
            value: 'میان رشته ای', type: 'میان رشته ای',
            avatar: '../../assets/img/color/20c997.png'
        })
        this.relationNames.push({
            value: 'سایر', type: 'سایر',
            avatar: '../../assets/img/color/ffc107.png'
        })


        this.firstSelectedRelationName = {
            value: 'مبانی', type: 'مبانی',
            avatar: '../../assets/img/color/black.png'
        }
        this.firstRelationNames.push({
            value: 'مبانی', type: 'مبانی',
            avatar: '../../assets/img/color/black.png'
        })
        this.firstRelationNames.push({
            value: 'درجه دوم', type: 'درجه دوم',
            avatar: '../../assets/img/color/FF8D60.png'
        })
        this.firstRelationNames.push({
            value: 'مباحث عام', type: 'مباحث عام',
            avatar: '../../assets/img/color/007bff.png'
        })
        this.firstRelationNames.push({
            value: 'مباحث تخصصی', type: 'مباحث تخصصی',
            avatar: '../../assets/img/color/e83e8c.png'
        })
        this.firstRelationNames.push({
            value: 'حوزه ها و مصادیق', type: 'حوزه ها و مصادیق',
            avatar: '../../assets/img/color/6f42c1.png'
        })
        this.firstRelationNames.push({
            value: 'میان رشته ای', type: 'میان رشته ای',
            avatar: '../../assets/img/color/20c997.png'
        })
        this.firstRelationNames.push({
            value: 'سایر', type: 'سایر',
            avatar: '../../assets/img/color/ffc107.png'
        })


        this.linkRelationNames.push({
            value: 'مبانی', type: 'مبانی',
            avatar: '../../assets/img/color/black.png'
        })
        this.linkRelationNames.push({
            value: 'درجه دوم', type: 'درجه دوم',
            avatar: '../../assets/img/color/FF8D60.png'
        })
        this.linkRelationNames.push({
            value: 'مباحث عام', type: 'مباحث عام',
            avatar: '../../assets/img/color/007bff.png'
        })
        this.linkRelationNames.push({
            value: 'مباحث تخصصی', type: 'مباحث تخصصی',
            avatar: '../../assets/img/color/e83e8c.png'
        })
        this.linkRelationNames.push({
            value: 'حوزه ها و مصادیق', type: 'حوزه ها و مصادیق',
            avatar: '../../assets/img/color/6f42c1.png'
        })
        this.linkRelationNames.push({
            value: 'میان رشته ای', type: 'میان رشته ای',
            avatar: '../../assets/img/color/20c997.png'
        })
        this.linkRelationNames.push({
            value: 'سایر', type: 'سایر',
            avatar: '../../assets/img/color/ffc107.png'
        })


        this.secondSelectedRelationName = {
            value: 'مبانی', type: 'مبانی',
            avatar: '../../assets/img/color/black.png'
        }
        this.secondRelationNames.push({
            value: 'مبانی', type: 'مبانی',
            avatar: '../../assets/img/color/black.png'
        })
        this.secondRelationNames.push({
            value: 'درجه دوم', type: 'درجه دوم',
            avatar: '../../assets/img/color/FF8D60.png'
        })
        this.secondRelationNames.push({
            value: 'مباحث عام', type: 'مباحث عام',
            avatar: '../../assets/img/color/007bff.png'
        })
        this.secondRelationNames.push({
            value: 'مباحث تخصصی', type: 'مباحث تخصصی',
            avatar: '../../assets/img/color/e83e8c.png'
        })
        this.secondRelationNames.push({
            value: 'حوزه ها و مصادیق', type: 'حوزه ها و مصادیق',
            avatar: '../../assets/img/color/6f42c1.png'
        })
        this.secondRelationNames.push({
            value: 'میان رشته ای', type: 'میان رشته ای',
            avatar: '../../assets/img/color/20c997.png'
        })
        this.secondRelationNames.push({
            value: 'سایر', type: 'سایر',
            avatar: '../../assets/img/color/ffc107.png'
        })

        this.fieldMetaService.countSearchSuggestion('').then(value => {
            this.fieldsCount = value;
            this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                this.fields = value;
            });
        });
        this.fieldMetaService.findRoot().then((value: PathsDto) => {
            this.data = value;
            this.fieldMetaService.findFirstDepthChildsByRelationName(this.data.id, this.selectedRelationName.value).then(value1 => {
                value.children = value1;
                this.generate();

            })
        }).catch(reason => {
        });
    }

    dd = 120;

    generate() {

        let draw = (source) => {
            let margin = {top: 25, right: 20, bottom: 30, left: 20};
            let width = 960 - margin.left - margin.right + 400;
            let height = 500 - margin.top - margin.bottom;
            let treemap = d3.tree().size([width + this.dd, height]);
            let treeData = treemap(root);
            let nodes = treeData.descendants();
            let links = treeData.descendants().slice(1);
            nodes.forEach(d => d.y = d.depth * 125);

            let node = g.selectAll('g.node')
                .data(nodes, d => d['id'] || (d['id'] = ++this.i));

            let node1 = g.selectAll('g.node1')
                .data(nodes, d => d['id'] || (d['id'] = ++this.i));

            let node2 = g.selectAll('g.node1')
                .data(nodes, d => d['id'] || (d['id'] = ++this.i));
            let node4 = g.selectAll('g.node1')
                .data(nodes, d => d['id'] || (d['id'] = ++this.i));

            let node3 = g.selectAll('g.node1')
                .data(nodes, d => d['id'] || (d['id'] = ++this.i));

            let nodeEnter = node
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('style', 'cursor: pointer')
                .on('mouseover', d => {

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:50ms')
                    //

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:340ms')


                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:540ms')
                })
                .on('mouseout', d => {
                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? d.parent.data.id.toString() + d.data.id.toString() : d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:340ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:180ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:50ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:40ms')

                })
                .attr('transform', d => {
                    if (source) {
                        'translate(' + source.x0 + ',' + source.y0 + ')'
                    }

                })
                .on('click', d => {
                    if (this.selectedRelationName) {
                        if (d.children == null && d.data.hasChild == true) {
                            this.dd = this.dd + 120;
                            var p = new PathsDto();
                            p.id = d.data.id;
                            p.name = d.data.name;
                            this.fieldMetaService.findFirstDepthChildsByRelationName(d.data.id, this.selectedRelationName.value).then(value => {
                                if (value.length > 0) {
                                    p.children = value;
                                    let tree = d3.hierarchy(p);
                                    tree.children.forEach(subtree => {
                                        subtree.depth = d.depth + 1;
                                        subtree.parent = d;
                                        subtree.parent.children = tree.children;
                                        d.children = tree.children;
                                    })
                                    draw(d);
                                } else {
                                    //TODO
                                }
                            });

                        } else {
                            this.dd = this.dd - 120;
                            d.children = d._children;
                            d._children = null;
                            if(d.parent == null){
                                this.dd=120
                            }
                            draw(d);
                        }

                    } else {
                        this.toastr.error('نوع رابطه را انتخاب کنید')
                    }
                });


            let x = node1
                .enter()
                .append('g')
                .attr('id', d => d.parent && d.parent.data && d.parent.data.id ? d.parent.data.id.toString() + d.data.id.toString() : d.data.id.toString())
                .attr('class', 'node')
                .attr('style', 'cursor: pointer;visibility:hidden')
                .on('mouseover', d => {

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:50ms')
                    //

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:340ms')


                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:540ms')
                })
                .on('mouseout', d => {
                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? d.parent.data.id.toString() + d.data.id.toString() : d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:340ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:180ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:50ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:40ms')

                })
                .attr('transform', d => {
                    if (source) {
                        'translate(' + source.x0 + ',' + source.y0 + ')'
                    }

                })
                .on('click', d => {
                    swal.fire({
                        title: 'آیا از حذف نمایه اطمینان دارید؟',
                        text: '!شما قادر به برگرداندن مورد حذف شده نخواهید بود',
                        type: 'warning',
                        showCancelButton: true,
                        animation: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        cancelButtonText: 'انصراف',
                        confirmButtonText: '!بله, حذف کن'
                    }).then((result) => {
                        if (result.value) {
                            this.deleteLeaf.nodeId=d.data.id;
                            this.fieldService.deleteLeaf(this.deleteLeaf).then(value => {
                                let setting: SweetAlertOptions = {};
                                setting.confirmButtonText = 'بستن';
                                setting.title = '!حدف شد';
                                setting.animation = true;
                                setting.text = '.نمایه انتخاب شده حذف شد';
                                setting.type = 'success';
                                swal.fire(
                                    setting
                                )
                                this.fieldMetaService.countSearchSuggestion('').then(value => {
                                    this.fieldsCount = value;
                                    this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                                        this.fields = value;
                                    });
                                });
                                if (d.parent.children.length == 1) {
                                    d.parent.children = null;
                                    d.depth = d.depth - 1;
                                    d.parent.data.hasChild = false;
                                    draw(d.parent);
                                } else {
                                    d.parent.children.forEach(x => {
                                        if (x.data.id == d.data.id) {
                                            var idx = d.parent.children.indexOf(x);
                                            d.parent.children.splice(idx, 1);
                                        }
                                    });
                                    draw(d.parent);
                                }
                            }).catch(reason => {
                                this.toastr.error(reason.error.message);
                            });
                        }
                    })
                })


            let y = node2
                .enter()
                .append('g')
                .attr('id', d => d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString())
                .attr('class', 'node')
                .attr('style', 'cursor: pointer;visibility: hidden')
                .on('mouseover', d => {

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:50ms')
                    //

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:340ms')


                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:540ms')
                })
                .on('mouseout', d => {
                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? d.parent.data.id.toString() + d.data.id.toString() : d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:340ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:180ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:50ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:40ms')

                })
                .attr('transform', d => {
                    if (source) {
                        'translate(' + source.x0 + ',' + source.y0 + ')'
                    }

                })
                .on('click', d => {
                    this.selectedValue = '1';
                    this.newField.describe = '';
                    this.newField.description = '';
                    this.newField.name = '';
                    this.newField.keywords = [];
                    this.keywords = [];
                    this.newField.fieldType = null;
                    this.newFieldForm.reset();
                    this.selectedHistoryId = null;
                    this.resetFirstSelect();
                    this.resetSecondSelect();
                    this.hasAccess = true;
                    this.currentSelectedParentName=d.data.name;
                    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static'}).result.then((result) => {
                        this.fieldMetaLen = 0;
                        if (this.selectedValue == '1') {
                            var childDto = new ChildDto();
                            childDto.childId = this.selectedHistoryId;
                            childDto.parentId = d.data.id;
                            childDto.relationName = this.firstSelectedRelationName.value;
                            this.fieldMetaService.addChildToParent(childDto).then((value: FieldData) => {
                                let setting: SweetAlertOptions = {};
                                setting.confirmButtonText = 'بستن';
                                setting.title = '!اضافه شد';
                                setting.animation = true;
                                setting.text = 'فرزند جدید اضافه شد';
                                setting.type = 'success';
                                swal.fire(
                                    setting
                                ).then(res => {
                                    if (d.children == null && d.data.hasChild == false) {
                                        d.data.hasChild = true;
                                        draw(d);
                                        this.selectedField = null;
                                        this.searchInput = null;
                                    }

                                    this.fieldMetaService.findFirstDepthChildsByRelationName(d.data.id, this.selectedRelationName.value).then(value => {
                                        if (value.length > 0) {
                                            var p = new PathsDto();
                                            p.id = d.data.id;
                                            p.name = d.data.name;
                                            p.children = value;
                                            let tree = d3.hierarchy(p);
                                            tree.children.forEach(subtree => {
                                                subtree.depth = d.depth + 1;
                                                subtree.parent = d;
                                                subtree.parent.children = tree.children;
                                                d.children = tree.children;
                                            })
                                            draw(d);
                                        } else {
                                            //TODO
                                        }
                                    });

                                })

                            }).catch(reason => {
                                this.toastr.error('');
                            });
                        } else {
                            this.newField.hasAccess = this.hasAccess;

                            for (let item of this.keywords) {
                                this.newField.keywords.push(item.value)
                            }
                            this.newField.parentId = d.data.id;
                            this.newField.relationName = this.secondSelectedRelationName.value;
                            this.fieldService.addNewField(this.newField).then(res => {

                                if (d.children == null && d.data.hasChild == false) {
                                    d.data.hasChild = true;
                                    draw(d);
                                    this.selectedField = null;
                                    this.searchInput = null;
                                }

                                this.fieldMetaService.findFirstDepthChildsByRelationName(d.data.id, this.selectedRelationName.value).then(value => {
                                    if (value.length > 0) {
                                        var p = new PathsDto();
                                        p.id = d.data.id;
                                        p.name = d.data.name;
                                        p.children = value;
                                        let tree = d3.hierarchy(p);
                                        tree.children.forEach(subtree => {
                                            subtree.depth = d.depth + 1;
                                            subtree.parent = d;
                                            subtree.parent.children = tree.children;
                                            d.children = tree.children;
                                        })
                                        let setting: SweetAlertOptions = {};
                                        setting.confirmButtonText = 'بستن';
                                        setting.title = '!اضافه شد';
                                        setting.animation = true;
                                        setting.text = 'فرزند جدید اضافه شد';
                                        setting.type = 'success';
                                        swal.fire(
                                            setting
                                        ).then(res => {
                                            draw(d);
                                        }).catch(er => {
                                            draw(d);
                                        })
                                    } else {
                                        //TODO
                                    }
                                });

                            }).catch(err=>{
                                this.toastr.error(err.error.message);
                            })
                        }
                    }, (reason) => {
                        this.fieldMetaLen = 0;
                    });
                })


            let w = node4
                .enter()
                .append('g')
                .attr('id', d => d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString())
                .attr('class', 'node')
                .attr('style', 'cursor: pointer;visibility: hidden')
                .on('mouseover', d => {

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:50ms')
                    //

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:340ms')


                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:540ms')
                })
                .on('mouseout', d => {
                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? d.parent.data.id.toString() + d.data.id.toString() : d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:340ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:180ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:50ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:40ms')

                })
                .attr('transform', d => {
                    if (source) {
                        'translate(' + source.x0 + ',' + source.y0 + ')'
                    }

                })
                .on('click', d => {
                    this.fieldMetaService.getFieldMetaById(d.data.id).then(res => {
                        this.editField.title = res.title;
                        this.editField.id = res.id;
                        this.editField.fieldType = res.fieldType;
                        this.editField.keywords = res.keywords;
                        this.editField.hasAccess = res.hasAccess;
                        this.editField.description = res.description;
                        this.editField.describe = res.describe;
                        this.hasAccessMeta = res.hasAccess;

                        this.modalService.open(this.edit, {ariaLabelledBy: 'modal-basic-title-edit', backdrop: 'static'}).result.then((result) => {
                            this.editField.hasAccess = this.hasAccessMeta;
                            this.fieldMetaService.editKeywordsAndTitle(this.editField).then(value => {
                                // let children = d.parent.children;
                                // d.parent.data.hasChild = true;
                                // d.parent.children = null;
                                // d.depth = d.depth - 1;
                                // draw(d.parent);
                                var p = new PathsDto();
                                p.id = d.parent.data.id;
                                p.name = d.parent.data.name;
                                this.fieldMetaService.findFirstDepthChildsByRelationName(d.parent.data.id, this.selectedRelationName.value).then(value => {
                                    if (value.length > 0) {
                                        p.children = value;
                                        let tree = d3.hierarchy(p);
                                        tree.children.forEach(subtree => {
                                            subtree.depth = d.depth;
                                            subtree.parent = d.parent;
                                            subtree.parent.children = tree.children;
                                            subtree.children = d.children;
                                            subtree.hasChild = true;
                                            d.parent.children = tree.children;
                                        })
                                        draw(d.parent);
                                    }
                                })

                                let setting: SweetAlertOptions = {};
                                setting.confirmButtonText = 'بستن';
                                setting.title = '!ایجاد شد';
                                setting.animation = true;
                                setting.text = '.نمایه ی مورد نظر ویرایش شد';
                                setting.type = 'success';
                                swal.fire(setting);
                            }).catch(reason => {
                                this.toastr.error('خظایی در ویرایش نمایه مورد نظر رخ داده است. لطفا مجددا تلاش نمایید')
                            });

                        }, (reason) => {
                            this.fieldMetaLen = 0;
                        });
                    })
                })


            let z = node3
                .enter()
                .append('g')
                .attr('id', d => d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString())
                .attr('class', 'node')
                .attr('style', 'cursor: pointer;visibility: hidden')
                .on('mouseover', d => {

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:50ms')
                    //

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:340ms')


                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: visible;transition-delay:540ms')
                })
                .on('mouseout', d => {
                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? d.parent.data.id.toString() + d.data.id.toString() : d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:450ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'add' + d.parent.data.id.toString() + d.data.id.toString() : 'add' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:340ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'edit' + d.parent.data.id.toString() + d.data.id.toString() : 'edit' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:180ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'cut' + d.parent.data.id.toString() + d.data.id.toString() : 'cut' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:50ms')

                    document.getElementById(d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString()).setAttribute('style', 'cursor:pointer; visibility: hidden;transition-delay:40ms')

                })
                .attr('transform', d => {
                    if (source) {
                        'translate(' + source.x0 + ',' + source.y0 + ')'
                    }

                })
                .on('click', d => {
                    this.fieldMetaService.countParents(d.data.id).then(res=>{
                        if(res > 1){

                            swal.fire({
                                title: 'آیا از حذف ارتباط اطمینان دارید؟',
                                text: '!شما قادر به برگرداندن مورد حذف شده نخواهید بود',
                                type: 'warning',
                                showCancelButton: true,
                                animation: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                cancelButtonText: 'انصراف',
                                confirmButtonText: '!بله, حذف کن'
                            }).then((result) => {
                                if (result.value) {
                                    if (d.parent) {
                                        this.deleteRelationship.childId=d.data.id;
                                        this.deleteRelationship.parentId=d.parent.data.id;
                                        this.fieldMetaService.deleteRelationShip(this.deleteRelationship).then(value => {
                                            let setting: SweetAlertOptions = {};
                                            setting.confirmButtonText = 'بستن';
                                            setting.title = '!حدف شد';
                                            setting.animation = true;
                                            setting.text = '.ارتباط انتخاب شده حذف شد';
                                            setting.type = 'success';
                                            swal.fire(
                                                setting
                                            )
                                            if (d.parent.children.length == 1) {
                                                d.parent.children = null;
                                                d.parent.data.hasChild = false;
                                                d.depth = d.depth - 1;
                                                draw(d.parent);
                                            } else {
                                                d.parent.children.forEach(x => {
                                                    if (x.data.id == d.data.id) {
                                                        var idx = d.parent.children.indexOf(x);
                                                        d.parent.children.splice(idx, 1);
                                                    }
                                                });
                                                draw(d.parent);
                                            }
                                        }).catch(reason => {
                                            this.toastr.error(reason.error.message);
                                        });
                                    }
                                }
                            })


                        } else {

                            swal.fire({
                                title: 'هشدار حدف کامل گره',
                                text: 'این گره پدر دیگری نخواهد داشت و کلا حدف خواهد شد',
                                type: 'warning',
                                showCancelButton: true,
                                animation: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                cancelButtonText: 'انصراف',
                                confirmButtonText: '!بله, حذف کن'
                            }).then((result) => {
                                if (result.value) {
                                    this.deleteLeaf.nodeId=d.data.id;
                                    this.fieldService.deleteLeaf(this.deleteLeaf).then(value => {
                                        let setting: SweetAlertOptions = {};
                                        setting.confirmButtonText = 'بستن';
                                        setting.title = '!حدف شد';
                                        setting.animation = true;
                                        setting.text = '.نمایه انتخاب شده حذف شد';
                                        setting.type = 'success';
                                        swal.fire(
                                            setting
                                        )
                                        this.fieldMetaService.countSearchSuggestion('').then(value => {
                                            this.fieldsCount = value;
                                            this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                                                this.fields = value;
                                            });
                                        });
                                        if (d.parent.children.length == 1) {
                                            d.parent.children = null;
                                            d.depth = d.depth - 1;
                                            d.parent.data.hasChild = false;
                                            draw(d.parent);
                                        } else {
                                            d.parent.children.forEach(x => {
                                                if (x.data.id == d.data.id) {
                                                    var idx = d.parent.children.indexOf(x);
                                                    d.parent.children.splice(idx, 1);
                                                }
                                            });
                                            draw(d.parent);
                                        }
                                    }).catch(reason => {
                                        this.toastr.error(reason.error.message);
                                    });
                                }
                            })


                        }














                    })
                })


            nodeEnter.append('path')
                .attr('fill', 'rgb(185,179,179,0.4)')
                .attr('id', d => d.parent && d.parent.data && d.parent.data.id ? 'hel' + d.parent.data.id.toString() + d.data.id.toString() : 'hel' + d.data.id.toString())
                .attr('d', 'M 0, 0m -50, 0a 50,50 0 1,0 100,0a 50,50 0 1,0 -100,0')
                .attr('style', 'cursor: pointer;visibility:hidden')
            nodeEnter.append('circle')
                .attr('class', 'node')
                .attr('stroke', d => d.data.hasChild ? '#615f65' : 'transparent')
                .attr('stroke-width', '0.5px')
                .attr('fill', d => d.data.hasChild ? 'url(#nodeLinear)' : 'url(#strokeLinear)')
                .attr('r', 1e-6);

            let t = nodeEnter.append('linearGradient')
                .attr('id', 'nodeLinear')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 1)
                .attr('y2', 1)
            let t2 = t;
            t.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', this.headBg1)

            t2.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', this.headBg2)

            let st = nodeEnter.append('linearGradient')
                .attr('id', 'strokeLinear')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 1)
                .attr('y2', 1)
            let st2 = st;
            st.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', this.childBg1)

            st2.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', this.childBg2)

            x.append('rect')
                .attr('fill', 'transparent')
                .attr('height', 30)
                .attr('width', 20)
                .attr('y', -5)
            x.append('svg:title').text('حذف گره')

            x.append('path')
                .attr('fill', '#e80817')
                .attr('d', 'M16.588,3.411h-4.466c0.042-0.116,0.074-0.236,0.074-0.366c0-0.606-0.492-1.098-1.099-1.098H8.901c-0.607,0-1.098,0.492-1.098,1.098c0,0.13,0.033,0.25,0.074,0.366H3.41c-0.606,0-1.098,0.492-1.098,1.098c0,0.607,0.492,1.098,1.098,1.098h0.366V16.59c0,0.808,0.655,1.464,1.464,1.464h9.517c0.809,0,1.466-0.656,1.466-1.464V5.607h0.364c0.607,0,1.1-0.491,1.1-1.098C17.688,3.903,17.195,3.411,16.588,3.411z M8.901,2.679h2.196c0.202,0,0.366,0.164,0.366,0.366S11.3,3.411,11.098,3.411H8.901c-0.203,0-0.366-0.164-0.366-0.366S8.699,2.679,8.901,2.679z M15.491,16.59c0,0.405-0.329,0.731-0.733,0.731H5.241c-0.404,0-0.732-0.326-0.732-0.731V5.607h10.983V16.59z M16.588,4.875H3.41c-0.203,0-0.366-0.164-0.366-0.366S3.208,4.143,3.41,4.143h13.178c0.202,0,0.367,0.164,0.367,0.366S16.79,4.875,16.588,4.875zM6.705,14.027h6.589c0.202,0,0.366-0.164,0.366-0.366s-0.164-0.367-0.366-0.367H6.705c-0.203,0-0.366,0.165-0.366,0.367S6.502,14.027,6.705,14.027z M6.705,11.83h6.589c0.202,0,0.366-0.164,0.366-0.365c0-0.203-0.164-0.367-0.366-0.367H6.705c-0.203,0-0.366,0.164-0.366,0.367C6.339,11.666,6.502,11.83,6.705,11.83z M6.705,9.634h6.589c0.202,0,0.366-0.164,0.366-0.366c0-0.202-0.164-0.366-0.366-0.366H6.705c-0.203,0-0.366,0.164-0.366,0.366C6.339,9.47,6.502,9.634,6.705,9.634z')


            y.append('rect')
                .attr('fill', 'transparent')
                .attr('height', 20)
                .attr('width', 30)
                .attr('x', -5)

            y.append('path')
                .attr('fill', '#28a745')
                .attr('style', 'opacity: 1')
                .attr('d', 'M13.68,9.448h-3.128V6.319c0-0.304-0.248-0.551-0.552-0.551S9.448,6.015,9.448,6.319v3.129H6.319c-0.304,0-0.551,0.247-0.551,0.551s0.247,0.551,0.551,0.551h3.129v3.129c0,0.305,0.248,0.551,0.552,0.551s0.552-0.246,0.552-0.551v-3.129h3.128c0.305,0,0.552-0.247,0.552-0.551S13.984,9.448,13.68,9.448z M10,0.968c-4.987,0-9.031,4.043-9.031,9.031c0,4.989,4.044,9.032,9.031,9.032c4.988,0,9.031-4.043,9.031-9.032C19.031,5.012,14.988,0.968,10,0.968z M10,17.902c-4.364,0-7.902-3.539-7.902-7.903c0-4.365,3.538-7.902,7.902-7.902S17.902,5.635,17.902,10C17.902,14.363,14.364,17.902,10,17.902z')
            y.append('svg:title').text('افزودن گره')


            w.append('rect')
                .attr('fill', 'transparent')
                .attr('height', 20)
                .attr('width', 30)
                .attr('x', -5)

            w.append('path')
                .attr('fill', '#FF8D60')
                .attr('style', 'opacity: 1')
                .attr('d', 'M19.404,6.65l-5.998-5.996c-0.292-0.292-0.765-0.292-1.056,0l-2.22,2.22l-8.311,8.313l-0.003,0.001v0.003l-0.161,0.161c-0.114,0.112-0.187,0.258-0.21,0.417l-1.059,7.051c-0.035,0.233,0.044,0.47,0.21,0.639c0.143,0.14,0.333,0.219,0.528,0.219c0.038,0,0.073-0.003,0.111-0.009l7.054-1.055c0.158-0.025,0.306-0.098,0.417-0.211l8.478-8.476l2.22-2.22C19.695,7.414,19.695,6.941,19.404,6.65z M8.341,16.656l-0.989-0.99l7.258-7.258l0.989,0.99L8.341,16.656z M2.332,15.919l0.411-2.748l4.143,4.143l-2.748,0.41L2.332,15.919z M13.554,7.351L6.296,14.61l-0.849-0.848l7.259-7.258l0.423,0.424L13.554,7.351zM10.658,4.457l0.992,0.99l-7.259,7.258L3.4,11.715L10.658,4.457z M16.656,8.342l-1.517-1.517V6.823h-0.003l-0.951-0.951l-2.471-2.471l1.164-1.164l4.942,4.94L16.656,8.342z')
            w.append('svg:title').text('ویرایش')


            z.append('rect')
                .attr('fill', 'transparent')
                .attr('height', 30)
                .attr('width', 20)
                .attr('y', -5)
            z.append('svg:title').text('حذف ارتباط')

            z.append('path')
                .attr('fill', '#dc3545')
                .attr('style', 'stroke:none;fill-rule:nonzero;fill-opacity:1;')
                .attr('d', 'M 6.589844 12.292969 C 6.589844 11.949219 6.535156 11.605469 6.425781 11.28125 C 6.398438 11.203125 6.371094 11.128906 6.339844 11.058594 C 6.285156 10.933594 6.226562 10.8125 6.15625 10.695312 C 6.113281 10.621094 6.070312 10.550781 6.019531 10.484375 C 5.996094 10.449219 5.972656 10.414062 5.945312 10.378906 L 6.648438 9.878906 L 11.488281 13.324219 C 12.773438 14.226562 14.519531 14.074219 15.628906 12.964844 C 15.695312 12.898438 15.726562 12.808594 15.71875 12.714844 C 15.710938 12.621094 15.664062 12.535156 15.589844 12.480469 L 9.28125 8 L 5.941406 5.625 C 5.941406 5.625 5.941406 5.621094 5.945312 5.617188 C 5.980469 5.574219 6.015625 5.523438 6.046875 5.476562 C 6.085938 5.417969 6.125 5.359375 6.160156 5.300781 C 6.226562 5.183594 6.289062 5.0625 6.339844 4.941406 C 6.371094 4.867188 6.402344 4.792969 6.425781 4.71875 C 6.535156 4.394531 6.589844 4.050781 6.589844 3.707031 C 6.59375 2.195312 5.519531 0.894531 4.03125 0.609375 C 2.542969 0.320312 1.0625 1.132812 0.503906 2.539062 C -0.0585938 3.945312 0.460938 5.550781 1.734375 6.367188 C 1.757812 6.390625 1.75 6.390625 1.875 6.480469 C 1.890625 6.492188 1.910156 6.507812 1.929688 6.519531 C 1.964844 6.546875 2.011719 6.582031 2.070312 6.621094 C 2.070312 6.621094 2.074219 6.621094 2.074219 6.625 C 2.109375 6.652344 2.148438 6.679688 2.199219 6.710938 C 2.199219 6.710938 2.203125 6.714844 2.203125 6.714844 C 2.515625 6.941406 3.050781 7.328125 3.976562 8 C 3.050781 8.671875 2.515625 9.058594 2.203125 9.285156 C 2.199219 9.285156 2.199219 9.289062 2.199219 9.289062 C 2.148438 9.320312 2.109375 9.347656 2.074219 9.375 C 1.882812 9.515625 1.808594 9.566406 1.773438 9.59375 C 1.769531 9.597656 1.765625 9.601562 1.757812 9.609375 C 1.75 9.617188 1.746094 9.625 1.734375 9.632812 C 0.460938 10.445312 -0.0585938 12.054688 0.503906 13.460938 C 1.0625 14.867188 2.542969 15.675781 4.03125 15.390625 C 5.515625 15.105469 6.589844 13.804688 6.589844 12.292969 Z M 1.714844 3.707031 C 1.714844 2.757812 2.484375 1.988281 3.433594 1.988281 C 4.382812 1.988281 5.152344 2.757812 5.152344 3.707031 C 5.152344 4.65625 4.382812 5.429688 3.433594 5.429688 C 2.484375 5.425781 1.714844 4.65625 1.714844 3.707031 Z M 1.714844 12.292969 C 1.714844 11.34375 2.484375 10.570312 3.433594 10.570312 C 4.382812 10.570312 5.152344 11.339844 5.152344 12.292969 C 5.152344 13.242188 4.382812 14.011719 3.433594 14.011719 C 2.484375 14.011719 1.714844 13.242188 1.714844 12.292969 Z M 1.714844 12.292969')
            z.append('path')
                .attr('fill', '#de5c04')
                .attr('style', 'stroke:none;fill-rule:nonzero;fill-opacity:1;')
                .attr('d', 'M 7.25 5.691406 L 9.933594 7.535156 L 15.589844 3.515625 C 15.664062 3.460938 15.710938 3.378906 15.71875 3.285156 C 15.726562 3.191406 15.695312 3.101562 15.628906 3.035156 C 14.519531 1.925781 12.773438 1.769531 11.488281 2.671875 Z M 7.25 5.691406')

            nodeEnter.append('text')
                .attr('dy', -25)
                .attr('fill', '#2d2a2a')
                .attr('style', 'font: 11px iransans')
                .attr('x', d => {
                    let size = d.data['name'].length;
                    if (d.depth == 0) {
                        return -30;
                    } else {
                        return size * 2.6;
                    }

                })
                .attr('text-anchor', d => d.children || d['_children']
                    ? 'end' : 'start')
                .text(d => d.data['name']);


            let nodeUpdate = nodeEnter.merge(<any>node);
            let nodeUpdate1 = x.merge(<any>node1);
            let nodeUpdate2 = y.merge(<any>node2);
            let nodeUpdate3 = z.merge(<any>node3);
            let nodeUpdate4 = w.merge(<any>node4);

            nodeUpdate.transition()
                .duration(this.duration)
                .attr('transform', d => 'translate(' + (d.x + 200) + ',' + (d.y + 50) + ')');

            nodeUpdate1.transition()
                .duration(this.duration)
                .attr('transform', d => 'translate(' + (d.x + 160) + ',' + (d.y + 45) + ')');

            nodeUpdate2.transition()
                .duration(this.duration)
                .attr('transform', d => 'translate(' + (d.x + 160) + ',' + (d.y + 45) + ')');

            nodeUpdate4.transition()
                .duration(this.duration)
                .attr('transform', d => 'translate(' + (d.x + 187) + ',' + (d.y + 70) + ')');

            nodeUpdate3.transition()
                .duration(this.duration)
                .attr('transform', d => 'translate(' + (d.x + 220) + ',' + (d.y + 46) + ')');

            nodeUpdate.select('circle')
                .attr('r', 20)
                .attr('fill', d => d.data.hasChild ? 'url(#nodeLinear)' : 'url(#strokeLinear)')
                .attr('cursor', 'pointer');


            nodeUpdate1.select('circle')
                .attr('r', 5)
                .attr('fill', 'red')
                .attr('cursor', 'pointer');

            nodeUpdate2.select('circle')
                .attr('r', 5)
                .attr('fill', 'green')
                .attr('cursor', 'pointer');

            nodeUpdate3.select('circle')
                .attr('r', 5)
                .attr('fill', 'yellow')
                .attr('cursor', 'pointer');


            let nodeExit = node.exit().transition()
                .duration(this.duration)
                .attr('transform', d => {
                    if (source) {
                        'translate(' + source.x0 + ',' + source.y0 + ')'
                    }

                })
                .remove();

            let nodeExit1 = node1.exit().transition()
                .duration(this.duration)
                .attr('transform', d => {
                    if (source) {
                        'translate(' + source.x0 + ',' + source.y0 + ')'
                    }

                })
                .remove();

            let nodeExit2 = node2.exit().transition()
                .duration(this.duration)
                .attr('transform', d => 'translate(' + source.x + ','
                    + source.y + ')')
                .remove();

            let nodeExit3 = node3.exit().transition()
                .duration(this.duration)
                .attr('transform', d => {
                    if (source) {
                        'translate(' + source.x0 + ',' + source.y0 + ')'
                    }

                })
                .remove();
            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6)
            nodeExit1.select('circle')
                .attr('r', 1e-6)

            nodeExit2.select('circle')
                .attr('r', 1e-6)

            nodeExit3.select('circle')
                .attr('r', 1e-6)
            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            nodeExit1.select('text')
                .style('fill-opacity', 1e-6);
            // Let's draw links
            let link = g.selectAll('path.link')
                .data(links, d => d['id']);
            // Work on enter links, draw straight lines
            let linkEnter = link.enter().insert('path', 'g')
                .attr('class', 'link shine')
                .attr('fill', 'none')
                .on('click', d => {
                    this.linkSelectedEditChild = d;
                    this.linkSelectedEditParent = d.parent;
                    let res: any = {};
                    d.parent.children.forEach(item => {
                        if (item.data.id == d.data.id) {
                            res = item;
                            return;
                        }
                    })
                    this.linkEditRelName = res.data.rels[0].propertyList[0].value;

                    this.resetLinkSelected();
                    this.modalService.open(this.link, {ariaLabelledBy: 'modal-basic-title-link', backdrop: 'static'}).result.then((result) => {
                        this.fieldRelationDto.childId = d.data.id;
                        this.fieldRelationDto.parentId = d.parent.data.id;
                        this.fieldRelationDto.relationName = this.linkSelectedRelationName.value;
                        this.fieldService.updateRelation(this.fieldRelationDto).then(value => {
                            let setting: SweetAlertOptions = {};
                            setting.confirmButtonText = 'بستن';
                            setting.title = 'ارتباط آپدیت شد';
                            setting.animation = true;
                            setting.type = 'success';
                            swal.fire(
                                setting
                            ).then(res=>{
                                var p = new PathsDto();
                                p.id = d.parent.data.id;
                                p.name = d.parent.data.name;
                                this.fieldMetaService.findFirstDepthChildsByRelationName(d.parent.data.id, this.selectedRelationName.value).then(value => {
                                    if (value.length > 0) {
                                        p.children = value;
                                        let tree = d3.hierarchy(p);
                                        tree.children.forEach(subtree => {
                                            subtree.depth = d.depth;
                                            subtree.parent = d.parent;
                                            subtree.parent.children = tree.children;
                                            d.parent.children = tree.children;
                                        })
                                        draw(d.parent);
                                    } else {
                                        //TODO
                                    }
                                });
                            })
                        }).catch(reason => {
                            this.toastr.error(reason.error.message);
                        })

                    }, (reason) => {
                        this.fieldMetaLen = 0;
                    });
                })
                .attr('stroke-dasharray', d => {
                    let t: RelationshipModel[] = d.data.rels;
                    let select: RelationshipModel = {};
                    let index: number = 0;
                    for (let k of t) {
                        if (k.startNode == d.parent.data.id) {
                            select = k;
                            index = t.indexOf(k);
                        }
                    }

                    if (select.propertyList[index].value == 'مبانی') {
                        return '8,1,8,1';
                    } else if (select.propertyList[index].value == 'درجه دوم') {
                        return '8,1,8,1';
                    } else if (select.propertyList[index].value == 'مباحث عام') {
                        return '8,1,8,1';
                    } else if (select.propertyList[index].value == 'مباحث تخصصی') {
                        return '8,1,8,1';
                    } else if (select.propertyList[index].value == 'حوزه ها و مصادیق') {
                        return '8,1,8,1';
                    } else if (select.propertyList[index].value == 'میان رشته ای') {
                        return '8,1,8,1';
                    } else if (select.propertyList[index].value == 'سایر') {
                        return '8,1,8,1';
                    }

                })
                .attr('style', 'opacity:0.6')
                .attr('stroke', d => {
                    let t: RelationshipModel[] = d.data.rels;
                    let select: RelationshipModel = {};
                    let index: number = 0;
                    for (let k of t) {
                        if (k.startNode == d.parent.data.id) {
                            select = k;
                            index = t.indexOf(k);
                        }
                    }

                    if (select.propertyList[index].value == 'مبانی') {
                        return 'black';
                    } else if (select.propertyList[index].value == 'درجه دوم') {
                        return '#FF8D60';
                    } else if (select.propertyList[index].value == 'مباحث عام') {
                        return '#007bff';
                    } else if (select.propertyList[index].value == 'مباحث تخصصی') {
                        return '#e83e8c';
                    } else if (select.propertyList[index].value == 'حوزه ها و مصادیق') {
                        return '#6f42c1';
                    } else if (select.propertyList[index].value == 'میان رشته ای') {
                        return '#20c997';
                    } else if (select.propertyList[index].value == 'سایر') {
                        return '#ffc107';
                    }

                })
                .attr('stroke-width', '3px')
                .attr('d', () => {
                    let o = {x: source.x0, y: source.y0};
                    return diagonal(o, o)
                });
            linkEnter.append('svg:title').text('ویرایش ارتباط')

            // UPDATE
            let linkUpdate = linkEnter.merge(<any>link);

            linkUpdate.transition()
                .duration(this.duration)
                .attr('transform', d => 'translate(' + 200 + ',' + 45 + ')')
                .attr('stroke-width', 3)
                .attr('style', 'cursor: pointer')
                .attr('d', d => {
                    return diagonal(d, d.parent)
                });

            // Remove any exiting links
            let linkExit = link.exit().transition()
                .duration(this.duration)
                .attr('d', d => {
                    let o = {x: source.x, y: source.y}
                    return diagonal(o, o)
                })
                .remove();

            // Store the old positions for transition.
            nodes.forEach(function (d) {
                d['x0'] = d.x;
                d['y0'] = d.y;
            });

        }

        let diagonal = (s, d) => {
            let path = `M ${s.x} ${s.y}
               L ${d.x} ${d.y}`;
            return path
        }

        let margin = {top: 20, right: 20, bottom: 30, left: 20};
        let width = 960 - margin.left - margin.right + 400;
        let height = 500 - margin.top - margin.bottom;


        let svg = d3.select('#container')
            .append('svg')
            .attr('style', 'margin-top:-70px')
            .attr('width', width + margin.right + margin.left)
            .attr('height', 5000)
            .call(<any>d3.zoom()
                .on('zoom', this.zoomed))

        let g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' +
                margin.top + ')');

        let root;
        root = this.data;
        root = d3.hierarchy(root);
        root.x0 = 0;
        root.y0 = width / 3;

        draw(root);
        draw(this.data.children);

    }


    public zoomed = () => {
        let transform = d3.event.transform;
        this.globalTrans = transform;
        let g = d3.select('g')
        return g.attr('transform', 'translate(' + transform.x + ',' +
            transform.y + ') scale(' + transform.k + ')')
    }
    name: any;
    selectedValue = '1';
    selectedHistoryId: any;
    keywords: any = [];
    showLegend = true;
    editField: FieldMeta = new FieldMeta();
    hasAccess: boolean = true;
    hasAccessMeta: boolean = true;

    open(content) {
        this.fieldMetaService.getFieldMetaById(this.selectedField.id).then((value: FieldMeta) => {
            this.selectedFieldMeta = value;
        });
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.fieldMetaLen = 0;
            this.modalService.dismissAll();
        });
    }

    onSelect(item) {
        this.modalService.dismissAll();
        this.selectedField.id = item;
    }

    onScrollToEnd() {
        this.searchChild(null);
    }

    onScroll({end}) {
        if (this.loading || this.fields.length <= this.fieldsCount) {
            return;
        }
        if (end + this.numberOfItemsFromEndBeforeFetchingMore < this.fieldsCount) {
            this.searchChild(null);
        }
    }

    onSearch(event) {
        this.fieldMetaLen = 0;
        this.filterName = event.term;
        let wordSearch = this.filterName;
        setTimeout(() => {
                if (wordSearch == this.filterName) {
                    this.loading = true;
                    this.fieldMetaService.countSearchSuggestion(event.term).then(value => {
                        this.fieldsCount = value;
                        this.fieldMetaService.searchSuggestion(event.term, this.fieldMetaLen, 10).then((value: FieldMeta[]) => {
                            this.fields = value;
                            this.change.detectChanges();
                            this.loading = false;
                        }).catch(reason => {
                            this.loading = false;
                            this.toastr.error(reason.error.message);
                        });
                    })
                }
            }
            ,
            500
        )

    }

    searchChild(event) {
        this.loading = true;
        this.fieldMetaLen += 1;
        this.fieldMetaService.searchSuggestion(this.filterName, this.fieldMetaLen, 10).then((value: FieldMeta[]) => {
            this.fields = [...this.fields, ...value];
            this.change.detectChanges();
            this.loading = false;
        });
    }

    onCancel() {
        this.selectedField.id = null;
        this.modalService.dismissAll();
        this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
            this.fields = value;
        });

    }

    onSubmit() {
        this.modalService.dismissAll();
    }

    close() {
        this.filterName = '';
        this.fieldMetaLen = 0;
        this.loading = true;
        this.fieldMetaService.countSearchSuggestion('').then(value => {
            this.fieldsCount = value;
            this.fieldMetaService.searchSuggestion('', 0, 10).then((value: FieldMeta[]) => {
                this.fields = value;
                this.loading = false;
                this.change.detectChanges();
            }).catch(reason => {
                this.loading = false;
                this.toastr.error(reason.error.message);
            });
        })
    }

    onSelectRelation() {
        var sa = d3.selectAll('svg');
        sa.remove();
        let s = this.selectedRelationName.value;
        this.fieldMetaService.findRoot().then((value: PathsDto) => {
            this.data = value;
            this.fieldMetaService.findFirstDepthChildsByRelationName(this.data.id, this.selectedRelationName.value).then(value1 => {
                value.children = value1;
                if (this.selectedRelationName.value && this.selectedRelationName.value.length > 3) {
                    this.showLegend = false;
                } else {
                    this.showLegend = true;
                }
                this.generate();
            })
        }).catch(reason => {
        });
    }

    onSearchInTree(event) {

        console.log(event)
        var sa = d3.selectAll('svg');
        sa.remove();
        let s = this.selectedRelationName.value;
        if (this.searchId == null) {
            this.onSelectRelation();
        } else {
            this.fieldMetaService.searchFieldById(this.searchId).then((value: PathsDto) => {
                this.data = value;
                this.fieldMetaService.findFirstDepthChildsByRelationName(this.searchId, this.selectedRelationName.value).then(value1 => {
                    value.children = value1;
                    if (this.selectedRelationName.value && this.selectedRelationName.value.length > 3) {
                        this.showLegend = false;
                    } else {
                        this.showLegend = true;
                    }
                    this.dd = 120;
                    this.generate();
                })
            }).catch(reason => {

            });
        }
    }


    showDetail() {
        this.fieldMetaService.getFieldMetaById(this.selectedHistoryId).then((value: FieldMeta) => {
            this.selectedFieldMeta = value;
            this.showInf = true;
        });
    }

    resetSelect() {
        this.selectedRelationName = {
            value: '', type: 'همه روابط',
            avatar: '../../assets/img/color/white.png'
        }
    }

    resetFirstSelect() {
        this.firstSelectedRelationName = {
            value: 'مبانی', type: 'مبانی',
            avatar: '../../assets/img/color/black.png'
        }
    }

    resetLinkSelected() {
        if (this.linkEditRelName == 'مبانی') {
            this.linkSelectedRelationName = {
                value: 'مبانی', type: 'مبانی',
                avatar: '../../assets/img/color/black.png'
            }
        } else if (this.linkEditRelName == 'درجه دوم') {
            this.linkSelectedRelationName = {
                value: 'درجه دوم', type: 'درجه دوم',
                avatar: '../../assets/img/color/FF8D60.png'
            }
        } else if (this.linkEditRelName == 'مباحث عام') {
            this.linkSelectedRelationName = {
                value: 'مباحث عام', type: 'مباحث عام',
                avatar: '../../assets/img/color/007bff.png'
            }
        } else if (this.linkEditRelName == 'مباحث تخصصی') {
            this.linkSelectedRelationName = {
                value: 'مباحث تخصصی', type: 'مباحث تخصصی',
                avatar: '../../assets/img/color/e83e8c.png'
            }
        } else if (this.linkEditRelName == 'حوزه ها و مصادیق') {
            this.linkSelectedRelationName = {
                value: 'حوزه ها و مصادیق', type: 'حوزه ها و مصادیق',
                avatar: '../../assets/img/color/6f42c1.png'
            }
        } else if (this.linkEditRelName == 'میان رشته ای') {
            this.linkSelectedRelationName = {
                value: 'میان رشته ای', type: 'میان رشته ای',
                avatar: '../../assets/img/color/20c997.png'
            }
        } else if (this.linkEditRelName == 'سایر') {
            this.linkSelectedRelationName = {
                value: 'سایر', type: 'سایر',
                avatar: '../../assets/img/color/ffc107.png'
            }
        }
    }


    resetSecondSelect() {
        this.secondSelectedRelationName = {
            value: 'مبانی', type: 'مبانی',
            avatar: '../../assets/img/color/black.png'
        }
    }
}
