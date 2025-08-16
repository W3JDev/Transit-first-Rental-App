import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '@transit/db';

@Injectable()
export class StationsService {
  constructor(@InjectRepository(Station) private stationRepo: Repository<Station>) {}

  async near(lat: number, lon: number): Promise<Station[]> {
    // simple: return all stations
    return this.stationRepo.find();
  }
}
