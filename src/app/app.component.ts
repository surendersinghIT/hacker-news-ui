import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoriesComponent } from "./stories/stories.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, StoriesComponent, ToastrModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Hacker News : New Stories';
}
