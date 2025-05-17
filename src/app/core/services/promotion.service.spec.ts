import { TestBed } from "@angular/core/testing";
import {promotionService} from "./promotion.service";

describe('PromotionService', () => {
  let service: promotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(promotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

