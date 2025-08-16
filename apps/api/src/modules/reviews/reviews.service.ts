import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '@transit/db';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private reviewRepo: Repository<Review>) {}

  async list(listingId: number) {
    return this.reviewRepo.find({ where: { listing: { id: listingId } } });
  }
}
