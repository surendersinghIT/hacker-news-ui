import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ActivatedRoute } from "@angular/router";
import { TableModule } from "primeng/table"
import { ToastrService } from 'ngx-toastr';
import { Story } from "../story.model";
import { NewStoriesService } from "../new-stories.service";

@Component({
  selector: "app-stories",
  templateUrl: "./stories.component.html",
  styleUrls: ["./stories.component.css"],
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, TableModule],
})
export class StoriesComponent implements OnInit {
  /** True if stories are loading */
  loading: boolean = true;

  /** story list from the API */
  storyList: Array<Story> = [];

  /** List of headers to display on UI */
  tableColumnHeaders = [    
    { key: 'title', title: 'Title' },
    { key: 'url', title: 'URL' }
  ];

  constructor(private newStoriesService: NewStoriesService, private route: ActivatedRoute, private toastr: ToastrService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.loading = true;
      window.scrollTo({ top: 0 });
        this.newStoriesService.fetchNewStories().subscribe({
          next: (data) => {
            this.storyList = data;
            this.loading = false;
          },
          error: (e) => {
            this.toastr.error(e.message, "Server Error!", {timeOut: 3000,});
            this.loading = false;
          } 
        });
    });
  }
}