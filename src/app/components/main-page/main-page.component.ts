import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css', '../../bg-colors.css']
})
export class MainPageComponent implements OnInit {
  public apps: any[] = [];
  public backup: any[] = [];
  private pageCal: any[] = [];

  constructor(private data: DataService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getData();

    this.data.shouldUpdate.subscribe(data => {
      if (data) {
        this.getData();
      }
    })
  }

  getData() {
    const apps = this.data.apps;
    const appIDs: any[] = [];
    apps.forEach(el => {
      appIDs.push({ id: el.id, name: el.name });
    })
    
    appIDs.forEach(el => {
      this.data.getAppReviews(el.id).subscribe(out => {
        let years: number[] = [];
        out.feed.entry.forEach((ele: any) => {
          let year = new Date(ele.updated.label).getFullYear();
          years = this.data.addIfNotPresent(year, years);
          let data = {
            title: ele.title.label,
            author: ele.author.name.label,
            content: ele.content.label,
            rating: ele['im:rating'].label,
            date: ele.updated.label,
            version: ele['im:version'].label,
            app: el.name
          }

          this.apps = this.data.addIfNotPresent(data, this.apps);
        });

        this.data.setYears(years);
        this.data.yearSubject.next(years);

        this.pageCal = this.getTotalPages(out.feed.link, el);
        this.getDataForNextPages();
      })
    });
    this.backup = this.apps;
    this.cdr.detectChanges();
  }

  getTotalPages(links: any[], app: any) {
    let totalPages: any[] = [];
    links.forEach(link => {
      if (link.attributes.rel == "last") {
        const href = link.attributes.href;
        totalPages.push({ app: app, pages: parseInt(href.substring(href.indexOf("page=") + 5, href.indexOf("/", href.indexOf("page=")))) });
      }
    })

    return totalPages;
  }

  getDataForNextPages() {
    this.pageCal.forEach((entry: any) => {
      for (let i = 2; i <= entry.pages; i++) {
        this.data.getMoreReviews(entry.app.id, i).subscribe(out => {
          let years: number[] = [];
          out.feed.entry.forEach((ele: any) => {
            let year = new Date(ele.updated.label).getFullYear();
            years = this.data.addIfNotPresent(year, years);
            let data = {
              title: ele.title.label,
              author: ele.author.name.label,
              content: ele.content.label,
              rating: ele['im:rating'].label,
              date: ele.updated.label,
              version: ele['im:version'].label,
              app: entry.app.name
            }
            this.apps = this.data.addIfNotPresent(data, this.apps);
          });

          this.data.addYears(years);
        })
      }
    })
  }

  getSearch(data: any) {
    this.apps = [];
    this.backup.forEach(el => {
      if (el.title.includes(data) || el.content.includes(data)) {
        this.apps.push(el);
      }
    });
    this.cdr.detectChanges();
  }

  getDataForSelectedApp(event: any) {
    this.apps = [];
    event.forEach((app: string) => {
      this.backup.forEach(el => {
        if (el.app == app) {
          this.apps.push(el);
        }
      });
    });

    if (event.length == 0) {
      this.apps = this.backup;
    }
    this.cdr.detectChanges();
  }

  getDataForSelectedRating(event: any) {
    this.apps = [];
    event.forEach((rating: number) => {
      this.backup.forEach(el => {
        if (el.rating == rating) {
          this.apps.push(el);
        }
      })
    })
    if (event.length == 0) {
      this.apps = this.backup;
    }
    this.cdr.detectChanges();
  }

  sortByRating(event: boolean) {
    this.apps = this.backup.sort((a, b) => {
      return event ? a.rating - b.rating : b.rating - a.rating;
    })
  }

  sortByDate(event: boolean) {
    this.apps = this.backup.sort((a, b) => {
      let date1 = new Date(a.date).getTime();
      let date2 = new Date(b.date).getTime();
      return event ? date1 - date2 : date2 - date1;
    })
  }

  sortByYear(event: number) {
    this.apps = this.backup.filter((el) => {
      return new Date(el.date).getFullYear() == event;
    })

    if (event == -1) {
      this.apps = this.backup;
    }
  }

}
