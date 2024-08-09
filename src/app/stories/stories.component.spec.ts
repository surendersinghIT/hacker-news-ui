
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { StoriesComponent } from './stories.component';
import { NewStoriesService } from '../new-stories.service';
import { Story } from '../story.model';
import { By } from '@angular/platform-browser';

describe('StoriesComponent', () => {
  let component: StoriesComponent;
  let fixture: ComponentFixture<StoriesComponent>;
  let newStoriesService: jasmine.SpyObj<NewStoriesService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const newStoriesServiceSpy = jasmine.createSpyObj('NewStoriesService', ['fetchNewStories']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['error']);
    const routeSpy = { paramMap: of({ get: () => '1' }) };

    await TestBed.configureTestingModule({
      //declarations: [StoriesComponent],
      imports: [CommonModule, MatProgressBarModule, TableModule, StoriesComponent],
      providers: [
        { provide: NewStoriesService, useValue: newStoriesServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    newStoriesService = TestBed.inject(NewStoriesService) as jasmine.SpyObj<NewStoriesService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    route = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display progress bar when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const progressBar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(progressBar).toBeTruthy();
  });

  it('should hide progress bar when loading is false', () => {
    component.loading = false;
    fixture.detectChanges();
    const progressBar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(progressBar).toBeFalsy();
  });

  it('should fetch stories on init', () => {
    const mockStories: Story[] = [{ id: 1, title: 'Story 1', url: 'http://example.com/1' }];
    newStoriesService.fetchNewStories.and.returnValue(of(mockStories));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.storyList).toEqual(mockStories);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when fetching stories', () => {
    const errorResponse = { message: 'Server Error' };
    newStoriesService.fetchNewStories.and.returnValue(throwError(errorResponse));

    component.ngOnInit();
    fixture.detectChanges();

    expect(toastrService.error).toHaveBeenCalledWith(errorResponse.message, 'Server Error!', { timeOut: 3000 });
    expect(component.loading).toBeFalse();
  });

  it('should display "No Records Found" when storyList is empty', () => {
    component.storyList = [];
    fixture.detectChanges();
    const noRecordsMessage = fixture.debugElement.query(By.css('p-table tbody tr td'));
    expect(noRecordsMessage.nativeElement.textContent).toContain('No Records Found.');
  });
});
