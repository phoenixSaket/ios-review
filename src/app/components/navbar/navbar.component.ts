import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { SlideoutService } from '../slideout/slideout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../../bg-colors.css']
})
export class NavbarComponent implements OnInit {
  public app: any;
  public error: string = "";
  public appId: string = "";
  private idForStorage: number[] = [];
  private selApps: string[] = [];
  private selRatings: number[] = [];
  public rating: any[] = [];
  public selectAllRatings: boolean = true;
  public selectAllApps: boolean = true;
  private sort: any = { rating: false, date: false };

  @Output() search: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedApps: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedRatings: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortByRating: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortByDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortByYear: EventEmitter<number> = new EventEmitter<number>();
  public years: number[] = [];

  constructor(private slideout: SlideoutService, public data: DataService) { }

  ngOnInit(): void {
    this.getYears()
    this.data.apps.map(el => {
      el = { ...el, selected: false };
    })

    for (let i = 1; i <= 5; i++) {
      this.rating.push({ rating: i, selected: false });
    }
  }

  addApp() {
    this.slideout.showPopup("add-app");
  }

  addAppID() {
    this.appLookup(this.appId);
  }

  idInput(event: any) {
    const id = event.target.value;
    this.appId = id;
  }

  appLookup(id: string) {
    this.data.getDetails(id).subscribe(data => {
      this.app = {};
      const details = data.results[0];
      this.app.name = details.trackName;
      this.app.description = details.description;
      this.app.rating = details.averageUserRating;
      this.app.company = details.artistName;
      this.app.id = details.trackId;
    })
  }

  addAppClick(event: any) {
    let isPresent: boolean = false;
    this.data.apps.forEach(el => {
      if (el.id == this.app.id) {
        isPresent = true;
      }
    });
    if (!isPresent && this.app?.id != "") {
      this.data.apps.push(this.app);
      this.data.shouldUpdate.next(true);
      this.app = {};
      this.addToLocal();
      this.slideout.dismissPopup("add-app");
    } else {
      this.error = "This App is already added. Try a different ID";
    }
  }

  dismiss(event: any) {
    this.app = {};
    this.slideout.dismissPopup("add-app")
  }

  searchInput(event: any) {
    const input = event.target.value;
    this.search.emit(input);
  }

  addToLocal() {
    this.data.apps.forEach(el => {
      if (!this.idForStorage.includes(el.id)) {
        this.idForStorage.push(el.id);
      }
    })
    let appsForLocalStorage = btoa(this.idForStorage.join(","));
    localStorage.setItem("apps", appsForLocalStorage);
  }

  selectApp(event: string) {
    let hasAppSelected: boolean = false;
    this.data.apps.forEach(el => {
      if (el.name == event) {
        el.selected = !el.selected;
      }
      if (el.selected) {
        hasAppSelected = true;
      }
    })
    if (!this.selApps.includes(event)) {
      this.selApps.push(event);
      this.selectedApps.emit(this.selApps);
    } else {
      this.selApps.splice(this.selApps.indexOf(event), 1);
      this.selectedApps.emit(this.selApps);
    }

    if (!hasAppSelected) {
      this.selectAllApps = true;
    } else {
      this.selectAllApps = false;
    }
  }

  selectRating(event: string) {
    let hasRatingSelected: boolean = false;
    this.rating.forEach(rate => {
      if (rate.rating == event) {
        rate.selected = !rate.selected;
      }
      if (rate.selected) {
        hasRatingSelected = true;
      }
    });
    if (!this.selRatings.includes(parseInt(event))) {
      this.selRatings.push(parseInt(event));
      this.selectedRatings.emit(this.selRatings);
    } else {
      this.selRatings.splice(this.selRatings.indexOf(parseInt(event)), 1);
      this.selectedRatings.emit(this.selRatings);
    }

    if (!hasRatingSelected) {
      this.selectAllRatings = true;
    } else {
      this.selectAllRatings = false;
    }
  }

  selectAllAppsClick() {
    this.selectAllApps = !this.selectAllApps;
    this.selApps = [];
    this.data.apps.forEach(el => {
      el.selected = false;
    })
    this.selectedApps.emit(this.selApps);
  }

  selectAllRatingsClick() {
    this.selectAllRatings = !this.selectAllRatings;
    this.selRatings = [];
    this.rating.forEach(rate => {
      rate.selected = false;
    });
    this.selectedRatings.emit(this.selRatings);
  }

  sortClicked(event: any) {
    switch (event) {
      case "rating":
        this.sort.rating = !this.sort.rating;
        this.sortByRating.emit(!this.sort.rating);
        break;
      case "date":
        this.sort.date = !this.sort.date;
        this.sortByDate.emit(this.sort.date);
        break;
    }
  }

  clearApps() {
    localStorage.clear();
    window.location.reload();
  }

  getYears() {
    this.data.yearSubject.subscribe(data=> {
      if(!!data) {
        this.years = data;
      }
    })
  }

  yearSelected(event:any) {
    console.log(event.target.value);
    this.sortByYear.emit(event.target.value)
  }
}
