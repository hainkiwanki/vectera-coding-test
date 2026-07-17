import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MeetingService } from './meeting.service';

describe('MeetingService', () => {
    let service: MeetingService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });

        service = TestBed.inject(MeetingService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should perform a GET request for meetings', () => {
        service.getMeetings().subscribe((response) => {
            expect(response.results.length).toBe(0);
        });

        const req = httpMock.expectOne('/api/meetings');
        expect(req.request.method).toBe('GET');

        req.flush({
            count: 0,
            next: null,
            previous: null,
            results: [],
        });
    });
});
