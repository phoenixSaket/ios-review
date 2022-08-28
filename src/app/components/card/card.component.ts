import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css', '../../bg-colors.css']
})
export class CardComponent implements OnInit {
  @Input() detail: any = {};
  public rating: any[] = [];
  public date: string = "";

  constructor() { }

  ngOnInit(): void {
    let rate = this.detail.rating;

    for (let i = 0; i < 5; i++) {
      if (i < rate) {
        this.rating.push({ isOn: true })
      } else {
        this.rating.push({ isOn: false })
      }
    }

    let date = new Date(this.detail.date);
    let day = date.getDate();
    let month = this.getMonthName(date.getMonth());
    let year = date.getFullYear();

    this.date = day + " " + month + " " + year;
  }

  getMonthName(monthNumber: number) {
    let month: string = "";
    switch (monthNumber) {
      case 0: month = "January"; break;
      case 1: month = "February"; break;
      case 2: month = "March"; break;
      case 3: month = "April"; break;
      case 4: month = "May"; break;
      case 5: month = "June"; break;
      case 6: month = "July"; break;
      case 7: month = "August"; break;
      case 8: month = "September"; break;
      case 9: month = "October"; break;
      case 10: month = "November"; break;
      case 11: month = "December"; break;

      default:
        break;
    }

    return month;
  }

}
