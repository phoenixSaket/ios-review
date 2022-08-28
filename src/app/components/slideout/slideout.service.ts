import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlideoutService {

  constructor() { }

  showPopup(id: string) {
    let x = document.getElementById(id);
    x?.classList.remove("hide-slideout");
    x?.classList.add("show-slideout");
    let y = document.getElementById("backdrop");
    if (!!y) {
      y.style.zIndex = "5";
      y.style.height = "100vh";
    }
  }

  dismissPopup(id:string) {
    let x = document.getElementById(id);
    x?.classList.remove("show-slideout");
    x?.classList.add("hide-slideout");
    let y = document.getElementById("backdrop");
    if (!!y) {
      y.style.zIndex = "-5";
      y.style.height = "0";
    }
  }
} 
