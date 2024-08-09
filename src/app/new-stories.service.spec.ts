import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NewStoriesService } from './new-stories.service';
import { Story } from './story.model';
import { HttpErrorResponse } from '@angular/common/http';
import { BASE_URL } from './app.constants';

describe('NewStoriesService', () => {
  let service: NewStoriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NewStoriesService]
    });

    service = TestBed.inject(NewStoriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch new stories successfully', () => {
    const mockStories: Story[] = [
      { id: 1, title: 'Story 1', url: 'http://example.com/1' },
      { id: 2, title: 'Story 2', url: 'http://example.com/2' }
    ];

    service.fetchNewStories().subscribe(stories => {
      expect(stories.length).toBe(2);
      expect(stories).toEqual(mockStories);
    });

    const req = httpMock.expectOne(`${BASE_URL}NewStories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStories);
  });

  it('should handle 404 error', () => {
    const errorMessage = `Not Found: Http failure response for ${BASE_URL}NewStories: 404 Not Found`;

    service.fetchNewStories().subscribe({
      next: () => fail('expected an error, not stories'),
      error: (error: Error) => {
        expect(error.message).toContain(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${BASE_URL}NewStories`);
    req.flush('404 error', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 500 error', () => {
    const errorMessage = `Internal Server Error: Http failure response for ${BASE_URL}NewStories: 500 Internal Server Error`;

    service.fetchNewStories().subscribe({
      next: () => fail('expected an error, not stories'),
      error: (error: Error) => {
        expect(error.message).toContain(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${BASE_URL}NewStories`);
    req.flush('500 error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle unknown error', () => {
    const errorMessage = `Unknown Server Error: Http failure response for ${BASE_URL}NewStories: 0 Unknown Error`;

    service.fetchNewStories().subscribe({
      next: () => fail('expected an error, not stories'),
      error: (error: Error) => {
        expect(error.message).toContain(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${BASE_URL}NewStories`);
    req.flush('unknown error', { status: 0, statusText: 'Unknown Error' });
  });
});
