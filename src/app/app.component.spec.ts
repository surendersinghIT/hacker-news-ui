import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { StoriesComponent } from './stories/stories.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, RouterOutlet } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NewStoriesService } from './new-stories.service';


describe('AppComponent', () => {
  const storiesComponentMock = jasmine.createSpyObj("StoriesComponent", ["ngOnInit"]);
  storiesComponentMock.constructor = jasmine.createSpy('constructor');
  const newStoriesServiceMock = jasmine.createSpyObj("NewStoriesService", ["fetchNewStories"]);
  const toastrServiceMock = jasmine.createSpyObj("ToastrService", ["error"]);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet], 
      providers: [{ provide: StoriesComponent, useValue: storiesComponentMock},
        { provide: NewStoriesService, useValue: newStoriesServiceMock},
        { provide: ActivatedRoute, useValue: {paramMap: of({})}},
        { provide: ToastrService, useValue: toastrServiceMock},
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Hacker News : New Stories' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Hacker News : New Stories');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hacker News : New Stories');
  });
});
