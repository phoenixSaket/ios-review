import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public apps: any[] = [];
  public shouldUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

        let isPresent: boolean = false;
        this.apps.forEach(el => {
          if (el.id == app.id) {
            isPresent = true;
          }
        });
        if (!isPresent && app?.id != "") {
          this.apps.push(app);
          app = {};
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
}
