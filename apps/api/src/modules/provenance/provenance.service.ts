import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingProvenance } from '@transit/db';

@Injectable()
export class ProvenanceService {
  constructor(@InjectRepository(PricingProvenance) private provRepo: Repository<PricingProvenance>) {}

  forListing(listingId: number) {
    return this.provRepo.find({ where: { listing: { id: listingId } } });
  }
}
