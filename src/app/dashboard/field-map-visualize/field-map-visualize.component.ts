import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {FieldMetaService} from '../field-meta/fieldMetaService';
import {PathsDto} from '../field-meta/model/PathsDto';

@Component({
    selector: 'app-tree-map',
    templateUrl: './field-map-visualize.component.html',
    styleUrls: ['./field-map-visualize.component.scss']
})
export class FieldMapVisualizeComponent implements OnInit {

    width = 100;
    height = 100;
    data: PathsDto;
    stack: PathsDto[] = [];
    selectedRelationName: string;
    relationNames: any[] = [];


    ngOnInit() {
        this.relationNames = [{key:'انتخاب کنید',value:''},{key:'مبانی',value:'مبانی'},{key:'درجه دوم',value:'درجه دوم'}
        ,{key:'مباحث عام',value:'مباحث عام'},{key:'مباحث تخصصی',value:'مباحث تخصصی'}
        ,{key:'حوزه ها و مصادیق',value:'حوزه ها و مصادیق'},{key:'میان رشته ای',value:'میان رشته ای'},{key:'سایر',value:'سایر'}]

        this.selectedRelationName = '';
        this.fieldMetaService.findRoot().then((value) => {
            this.data = value;
            this.fieldMetaService.findSecondDepthChildsByRelationName(this.data.id, this.selectedRelationName).then(value1 => {
                this.data = value;
                this.data.children=value1;
                this.stack.push(this.data);
                this.chart();
            })
        }).catch(reason => {
            console.log(reason);
        });
    }

    private chart() {

        let nodes = d3.hierarchy(this.data)
            .sum(function (d) {
                return d.id ? 1 : 0;
            });

        let x = d3.scaleLinear().domain([0, this.width]).range([0, this.width]);
        let y = d3.scaleLinear().domain([0, this.height]).range([0, this.height]);

        let treemap = d3.treemap()
            .size([this.width, this.height])
            .paddingInner(0)
            .round(false);

        let color = d3.scaleOrdinal()
            .range(d3.schemeDark2
                .map(function (c) {
                    c = d3.rgb(c);
                    return c;
                })
            );

        treemap(nodes);

        var chart = d3.select('#chart');
        var cells = chart
            .selectAll('.node')
            .data(nodes.descendants())
            .enter()
            .append('div')
            .attr('class', function (d) {
                return 'node level-' + d.depth;
            })
            .attr('title', function (d) {
                return d.data.name ? d.data.name : 'null';
            });

        cells
            .style('left', function (d) {
                return x(d.x0) + '%';
            })
            .style('top', function (d) {
                return y(d.y0) + '%';
            })
            .style('width', function (d) {
                return x(d.x1) - x(d.x0) + '%';
            })
            .style('height', function (d) {
                return y(d.y1) - y(d.y0) + '%';
            }).style('background-color', function (d) {
            while (d.depth > 2) {
                d = d.parent;
            }
            return color(d.data.name);
        })
            .on('click', d => {
                if (d.data.hasChild == true) {
                    this.loadChild(d);
                }
            })
            .append('p')
            .attr('class', 'label')
            .text(function (d) {
                return d.data.name ? d.data.name : '---';
            });

        var parent = d3.select('.up')
            .datum(nodes)
            .on('click', d => {

                this.back();
            });
    }

    constructor(private fieldMetaService: FieldMetaService) {

    }

    loadChild(selectedItem) {
        this.fieldMetaService.findSecondDepthChildsByRelationName(selectedItem.data.id, this.selectedRelationName).then(value => {
            console.log(value);
            var chart = d3.select('#chart');
            chart
                .selectAll('.node').remove();
            this.data = {};
            this.data.id = selectedItem.data.id;
            this.data.name = selectedItem.data.name;
            this.data.hasChild = selectedItem.data.hasChild;
            this.data.children = value;
            this.stack.push(this.data);
            this.chart();
        })
    }

    back() {
        if (this.stack.length > 1) {
            this.stack.pop();
            let deleted = this.stack[this.stack.length - 1]
            var chart = d3.select('#chart');
            chart
                .selectAll('.node').remove();
            this.data = {};
            this.data.id = deleted.id
            this.data.name = deleted.name
            this.data.hasChild = deleted.hasChild;
            this.data.children = deleted.children;
            this.chart();
        }
    }

    onSelectRelation() {
        console.log(this.selectedRelationName)
        this.stack = [];
        var chart = d3.select('#chart');
        chart
            .selectAll('.node').remove();
        this.data = {};
        this.fieldMetaService.findRoot().then((value: PathsDto) => {
            this.data = value;
            this.fieldMetaService.findSecondDepthChildsByRelationName(this.data.id, this.selectedRelationName).then(value1 => {
                console.log(value1)
                this.data.children = value1;
                this.stack.push(this.data);
                this.chart();
            })
        }).catch(reason => {
            console.log(reason);
        });
    }


}
