import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing, Station, ListingStationMetric, PricingProvenance, Score, AttributeForeigner, Review, Moderation } from '@transit/db';
import { ListingsModule } from './modules/listings/listings.module';
import { StationsModule } from './modules/stations/stations.module';
import { HealthModule } from './modules/health/health.module';
import { CommuteModule } from './modules/commute/commute.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ProvenanceModule } from './modules/provenance/provenance.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Listing, Station, ListingStationMetric, PricingProvenance, Score, AttributeForeigner, Review, Moderation],
      synchronize: false
    }),
    ListingsModule,
    StationsModule,
    HealthModule,
    CommuteModule,
    ReviewsModule,
    ProvenanceModule,
    AuthModule
  ]
})
export class AppModule {}
