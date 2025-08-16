import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStationMetric, Station, PricingProvenance, Score, Review } from '@transit/db';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private listingsRepo: Repository<Listing>,
    @InjectRepository(ListingStationMetric) private metricsRepo: Repository<ListingStationMetric>
  ) {}

  async search(q?: string): Promise<Listing[]> {
    const qb = this.listingsRepo
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.stationMetrics', 'metric')
      .leftJoinAndSelect('metric.station', 'station')
      .leftJoinAndSelect('listing.provenance', 'provenance')
      .leftJoinAndSelect('listing.scores', 'scores');
    if (q) {
      qb.andWhere('station.name ILIKE :q', { q: `%${q}%` });
    }
    return qb.getMany();
  }

  async findOne(id: number): Promise<Listing | null> {
    return this.listingsRepo.findOne({
      where: { id },
      relations: ['stationMetrics', 'stationMetrics.station', 'provenance', 'scores', 'reviews']
    });
  }
}
