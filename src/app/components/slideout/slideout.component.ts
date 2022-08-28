import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SlideoutService } from './slideout.service';

@Component({
  selector: 'app-slideout',
  templateUrl: './slideout.component.html',
  styleUrls: ['./slideout.component.css']
})
export class SlideoutComponent implements OnInit {
  @Input() slideoutId: string = "";
  @Input() title: string = "";
  @Input() buttonPrimary: string = "";
  @Input() buttonSecondary: string = "";
  @Output() primaryClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() secondaryClick: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('content')
  content: ElementRef = new ElementRef(ElementRef);

  constructor(private slideout: SlideoutService) { }

  ngOnInit(): void {
  }

  dismissPopup() {
    this.slideout.dismissPopup(this.slideoutId);
  }

  pClick() {
    this.primaryClick.emit();
  }

  sClick() {
    this.secondaryClick.emit()
  }

}
