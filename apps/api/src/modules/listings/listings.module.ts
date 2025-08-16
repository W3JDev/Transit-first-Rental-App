import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing, ListingStationMetric } from '@transit/db';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, ListingStationMetric])],
  controllers: [ListingsController],
  providers: [ListingsService]
})
export class ListingsModule {}
