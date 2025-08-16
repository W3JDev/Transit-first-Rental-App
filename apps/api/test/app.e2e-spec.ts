import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { ListingsModule } from '../src/modules/listings/listings.module';
import { StationsModule } from '../src/modules/stations/stations.module';
import { HealthModule } from '../src/modules/health/health.module';
import { CommuteModule } from '../src/modules/commute/commute.module';
import { ReviewsModule } from '../src/modules/reviews/reviews.module';
import { ProvenanceModule } from '../src/modules/provenance/provenance.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { Listing, Station, ListingStationMetric, PricingProvenance, Score, Review, AttributeForeigner, Moderation } from '@transit/db';
import { Repository } from 'typeorm';

describe('API e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Listing, Station, ListingStationMetric, PricingProvenance, Score, Review, AttributeForeigner, Moderation],
          synchronize: true
        }),
        ListingsModule,
        StationsModule,
        HealthModule,
        CommuteModule,
        ReviewsModule,
        ProvenanceModule,
        AuthModule
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const stationRepo = moduleRef.get<Repository<Station>>(getRepositoryToken(Station));
    const listingRepo = moduleRef.get<Repository<Listing>>(getRepositoryToken(Listing));
    const metricRepo = moduleRef.get<Repository<ListingStationMetric>>(getRepositoryToken(ListingStationMetric));
    const provRepo = moduleRef.get<Repository<PricingProvenance>>(getRepositoryToken(PricingProvenance));
    const scoreRepo = moduleRef.get<Repository<Score>>(getRepositoryToken(Score));
    const attrRepo = moduleRef.get<Repository<AttributeForeigner>>(getRepositoryToken(AttributeForeigner));

    const station = await stationRepo.save({ name: 'Test Station', line: 'Line', lat: 0, lon: 0 });
    const listing = await listingRepo.save({ title: 'Test Listing', price_rm: 1000, pets_ok: false });
    await metricRepo.save({ listing, station, distance_m: 500, walk_time_min_day: 6 });
    await provRepo.save({ listing, source_name: 'Demo', source_url: 'http://x', captured_at: new Date(), price_rm: 1000 });
    await scoreRepo.save({ listing, transit_score: 0.8, safety_score: 0.7, amenity_score: 0.6, trust_score: 0.9, livability: 0.75, price_confidence: 0.9 });
    await attrRepo.save({ listing, english_lease: true });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/search', () => {
    return request(app.getHttpServer())
      .get('/search')
      .expect(200)
      .then((res) => {
        expect(res.body.listings.length).toBeGreaterThan(0);
      });
  });

  it('/listing/:id', () => {
    return request(app.getHttpServer())
      .get('/listing/1')
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
      });
  });
});
