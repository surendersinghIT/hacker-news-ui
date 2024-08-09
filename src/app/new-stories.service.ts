import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BASE_URL } from "./app.constants";
import { catchError, Observable, throwError } from "rxjs";
import { Story } from "./story.model";

@Injectable({
  providedIn: "root",
})
export class NewStoriesService {
  /** Stores list of ids of stories */
 stories: Array<Observable<Story>> = [];

  /** @ignore */
  constructor(private http: HttpClient) {}

  /**
   * This method is used to fetch stories from hacker news api
   *
   */
  fetchNewStories(): Observable<Array<Story>> {
    return this.http.get<Story[]>(`${BASE_URL}NewStories`)
    .pipe(catchError(error => {
      let errorMsg: string;
      if(error.error instanceof ErrorEvent) {
        errorMsg = `Error: ${error.error.message}`;
      } else {
        errorMsg = this.getServerErrorMessage(error);
      }
      return throwError(() => Error(errorMsg));
    }));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 404: {
            return `Not Found: ${error.message}`;
        }
        case 500: {
            return `Internal Server Error: ${error.message}`;
        }
        default: {
            return `Unknown Server Error: ${error.message}`;
        }

    }
}
}