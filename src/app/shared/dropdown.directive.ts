import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open')isOpen=false;
  @HostListener('click') toggleOpen(){
    this.isOpen=!this.isOpen;
  }
  //to close the menu from any click on document
  // @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
  //   this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  // }
  constructor() { }

}
