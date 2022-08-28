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
    let name = "";
    apps.forEach(el => {
      appIDs.push({ id: el.id, name: el.name });
    })
    appIDs.forEach(el => {
      this.data.getAppReviews(el.id).subscribe(out => {
        out.feed.entry.forEach((ele: any) => {
          let data = {
            title: ele.title.label,
            author: ele.author.name.label,
            content: ele.content.label,
            rating: ele['im:rating'].label,
            date: ele.updated.label,
            app: el.name
          }
          let isPresent: boolean = false;

          this.apps.forEach(el => {
            if (el.title == data.title && el.content == data.content && el.author == data.author) {
              isPresent = true;
            }
          })
          if (!isPresent) {
            this.apps.push(data);
          }
        });
      })
    });
    this.backup = this.apps;
    this.cdr.detectChanges();
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
}
