import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showItems=false;
  @Output()
  resultImage: EventEmitter<any> = new EventEmitter<any>();

  @Input() enableRatio: boolean=false;
  @Input() aspectRatio: number=1;
  @Input() shape: string='rect';
  @Input() resizeWidth: string='256';


  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  fileChangeEvent(event: any): void {
    this.showItems = true;
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
  }
  cropperReady() {
  }
  loadImageFailed() {
  }

  closeAll() {
    this.modalService.dismissAll();
  }

  saveAndClose() {
    this.resultImage.emit(this.croppedImage);
    this.closeAll();
  }
}
