import {Component, OnInit} from '@angular/core';
import {OperationService} from '../shared/service/OperationService';
import {Operations} from '../shared/dto/Operations';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserEntity} from '../shared/dto/UserEntity';
import {UserEntityService} from '../shared/service/UserEntityService';
import swal, {SweetAlertOptions} from 'sweetalert2';

@Component({
    selector: 'app-new-leader-group',
    templateUrl: './new-leader-group.component.html',
    styleUrls: ['./new-leader-group.component.scss']
})
export class NewLeaderGroupComponent implements OnInit {

    items: Operations[] = [];
    public leaderGroupForm: FormGroup;
    userEntity: UserEntity = {};


    constructor(private operationService: OperationService, private formBuilder: FormBuilder, private userEntityService: UserEntityService) {
    }

    ngOnInit() {
        this.leaderGroupForm = this.formBuilder.group({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', null)
        });
    }

    createNewGroup() {
        this.userEntity.userType = 'GROUP';
        this.userEntityService.saveUserEntity(this.userEntity).then(value => {
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = '!ایجاد شد';
            setting.animation = true;
            setting.text = '.گروه مورد نظر ایجاد شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
            this.leaderGroupForm.reset();
        }).catch(reason => {

        })
    }

}
