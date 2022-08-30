import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public apps: any[] = [];
  public shouldUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public years: number[] = [];
  public versions: number[] = [];
  public yearSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public versionSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  public initialize() {
    let string = localStorage.getItem("apps") ? localStorage.getItem("apps") : ""
    let appsFromLocalStorage = "";
    if (string != null) {
      appsFromLocalStorage = atob(string);
    }
    let apps = appsFromLocalStorage.split(",");
    let app: any = {};

    apps.forEach(el => {
      this.getDetails(el).subscribe(data => {
        app = {};
        const details = data.results[0];
        app.name = details.trackName;
        app.description = details.description;
        app.rating = details.averageUserRating;
        app.company = details.artistName;
        app.id = details.trackId;

        if (app?.id != "") {
          this.apps = this.addIfNotPresent(app, this.apps);
          this.shouldUpdate.next(true);
        }
      })
    });
  }

  public getDetails(id: string): Observable<any> {
    const url = "https://itunes.apple.com/lookup?id=" + id;
    return this.http.get(url);
  }

  public getAppReviews(id: string): Observable<any> {
    const url = "https://itunes.apple.com/rss/customerreviews/id=" + id + "/json";
    return this.http.get(url);
  }

  public getMoreReviews(id: string, page: number): Observable<any> {
    const url = "https://itunes.apple.com/us/rss/customerreviews/page=" + page + "/id=" + id + "/sortby=mostrecent/json?urlDesc=/customerreviews/id=" + id + "/json";
    return this.http.get(url);
  }

  public setYears(years: any[]) {
    this.years = years;
  }

  public getYears() {
    return this.years;
  }

  public setVersions(versions: number[]) {
    this.versions = versions;
  }

  public getVersions() {
    return this.versions;
  }

  public addYears(years: any[]) {
    years.forEach(year => {
      this.years.forEach(yr => {
        this.years = this.addIfNotPresent(year, this.years);
      })
    })
    this.years = this.sortArray(this.years);
  }

  public addVersions(versions: number[]) {
    versions.forEach(version => {
      this.versions.forEach(yr => {
        this.versions = this.addIfNotPresent(version, this.versions);
      })
    })
    this.versions = this.sortArray(this.versions);
  }

  sortArray(array: any[]) {
    return array.sort((a, b) => { return b - a })
  }

  addIfNotPresent(entry: any, array: any[]) {
    let isPresent: boolean = false;
    array.forEach(el => {
      if (el == entry) {
        isPresent = true;
      }
    })
    if (!isPresent) {
      array.push(entry);
    }
    return array;
  }
}
